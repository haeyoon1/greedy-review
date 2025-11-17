import re
from collections import Counter
from app.models.review_model import Review
from app.utils.loader import load_reviews
from app.utils.loader import load_all_reviews

def normalize(text: str) -> str:
    text = text or ""
    return re.sub(r"\s+", "", text).lower()

TARGET_KEYWORDS = {
    # --- 객체지향 ---
    "객체지향": ["객체지향"],
    "캡슐화": ["캡슐화"],
    "상속": ["상속"],
    "다형성": ["다형성"],
    "추상화": ["추상화"],
    "인터페이스": ["인터페이스"],
    "구현체": ["구현체"],
    "의존성": ["의존성"],
    "의존 역전 원칙": ["의존 역전 원칙"],
    "개방 폐쇄 원칙": ["개방 폐쇄 원칙"],
    "단일 책임 원칙": ["단일 책임 원칙", "단일 책임", "srp", "책임"],

    # --- 구조/설계 패턴 ---
    "SOLID": ["SOLID"],
    "응집도": ["응집도"],
    "결합도": ["결합도"],
    "불변": ["불변"],
    "상태 관리": ["상태 관리"],

    # --- 아키텍처 ---
    "MVC": ["MVC"],
    "레이어드 아키텍처": ["레이어드 아키텍처"],
    "패키지 구조": ["패키지 구조"],
    "와일드카드": ["와일드카드"],

    # --- 디자인 패턴 ---
    "팩토리 패턴": ["팩토리 패턴"],
    "전략 패턴": ["전략 패턴"],
    "싱글톤 패턴": ["싱글톤 패턴"],
    "빌더 패턴": ["빌더 패턴"],

    # --- Spring / DI ---
    "DI": ["DI", "의존성 주입"],
    "IoC": ["IoC"],
    "Bean": ["Bean"],
    "Component": ["Component"],
    "Configuration": ["Configuration"],
    "AOP": ["AOP"],
    "프록시": ["프록시"],
    "인터셉터": ["인터셉터"],
    "필터": ["필터"],
    "트랜잭션": ["트랜잭션"],

    # --- 코드 품질/리팩터링 ---
    "리팩토링": ["리팩터링", "리팩토링"],
    "중복 제거": ["중복"],
    "가독성": ["가독성"],
    "네이밍": ["네이밍"],
    "일급 컬렉션": ["일급 컬렉션"],
    "원시값 포장": ["원시값 포장"],
    "상수화": ["상수화", "매직 넘버", "상수"],
    "유틸 클래스": ["유틸"],

    # --- Java 기본 문법 ---
    "enum": ["enum"],
    "static": ["static"],
    "final": ["final"],
    "함수형 인터페이스": ["함수형 인터페이스"],
    "람다": ["람다", "lambda"],
    "Stream": ["Stream", "스트림"],
    "Optional": ["Optional"],
    "Null": ["Null"],
    "정적 팩토리 메서드": ["정적 팩토리 메서드", "정팩메"],
    "래퍼 클래스": ["래퍼클래스", "Wrapper Class", "Wrapper"],

    # --- 예외 처리 ---
    "예외 처리": ["예외 처리", "예외"],
    "Checked Exception": ["Checked Exception"],
    "Unchecked Exception": ["Unchecked Exception"],

    # --- 테스트 ---
    "단위 테스트": ["단위 테스트"],
    "통합 테스트": ["통합 테스트"],
    "테스트 코드": ["테스트 코드"],
    "JUnit": ["JUnit"],
    "AssertJ": ["AssertJ"],
    "커버리지": ["커버리지"],
    "given-when-then": ["given-when-then"],
    "Mock 객체": ["Mock"],
    "BeforeEach": ["BeforeEach"],
    "AfterEach": ["AfterEach"],
    "ParameterizedTest": ["ParameterizedTest"],
    "테스트 더블": ["테스트 더블"],
    "인수 테스트": ["인수 테스트"],
    "fixture": ["fixture", "픽스쳐"],

    # --- 자료구조/컬렉션 ---
    "컬렉션": ["컬렉션", "collection"],
    "List": ["List"],
    "Map": ["Map"],
    "Set": ["Set"],
    "ArrayList": ["ArrayList"],
    "HashMap": ["HashMap"],
    "HashSet": ["HashSet"],
    "equals": ["equals"],
    "hashCode": ["hashCode"],
    "Comparable": ["Comparable"],
    "Comparator": ["Comparator"],
    "StringBuilder": ["StringBuilder"],
    "제네릭": ["제네릭", "generic"],

    # --- 자바 기타 ---
    "InputStream": ["InputStream"],
    "OutputStream": ["OutputStream"],
    "BufferedReader": ["BufferedReader"],
    "Scanner": ["Scanner"],
    "eof": ["eof"],

}


# ✅ 올바른 코드 (synonym까지 normalize)
NORMALIZED_KEYWORDS = {
    main_key: [normalize(syn) for syn in synonyms]
    for main_key, synonyms in TARGET_KEYWORDS.items()
}

MIN_COUNT = 2


# ==========================================================
#   ReviewService (normalize 기반 매칭)
# ==========================================================
class ReviewService:
    def __init__(self):
        self.reviews = [Review(**r) for r in load_all_reviews()]

    def get_keyword_stats(self, repo: str | None = None):
        matches: list[str] = []

        for r in self.reviews:
            if repo and repo not in r.repo:
                continue

            text = normalize(r.comment)

            # 그룹 기반 매칭
            for main_key, synonyms in NORMALIZED_KEYWORDS.items():
                for syn in synonyms:
                    if syn in text:
                        matches.append(main_key)
                        break

        counter = Counter(matches)

        filtered = {k: v for k, v in counter.items() if v >= MIN_COUNT}

        sorted_filtered = dict(
            sorted(filtered.items(), key=lambda x: x[1], reverse=True)[:15]
        )

        return sorted_filtered

    def get_reviews_by_keyword(self, keyword: str, repo: str | None = None):
        keyword = normalize(keyword)
        synonyms = None

        # keyword가 속한 그룹을 찾음
        for main_key, syn_list in NORMALIZED_KEYWORDS.items():
            if keyword == normalize(main_key) or keyword in syn_list:
                synonyms = syn_list
                break

        # 그룹이 없으면 keyword 자체만 사용
        if synonyms is None:
            synonyms = [keyword]

        result: list[Review] = []

        for r in self.reviews:
            if repo and repo not in r.repo:
                continue

            text = normalize(r.comment)

            if any(syn in text for syn in synonyms):
                result.append(r)

        return result
