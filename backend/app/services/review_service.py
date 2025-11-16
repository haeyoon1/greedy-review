import re
from collections import Counter
from app.models.review_model import Review
from app.utils.loader import load_reviews

TARGET_KEYWORDS = [
    "객체지향", "캡슐화", "상속", "다형성", "추상화", "인터페이스", "구현체", "의존성", "의존성 주입", 
    "의존 역전 원칙", "개방 폐쇄 원칙", "단일 책임 원칙", "리스코프 치환 원칙", "인터페이스 분리 원칙", 
    "SOLID", "책임 분리", "응집도", "결합도", "불변 객체", "상태 관리",
    "MVC 패턴", "레이어드 아키텍처", "서비스 레이어", "컨트롤러", "리포지토리", "팩토리 패턴", 
    "전략 패턴", "싱글톤 패턴", "빌더 패턴", "옵저버 패턴", "DI", "IoC", "Bean", "Component", 
    "Service", "Repository", "Configuration", "AOP", "프록시", "인터셉터", "필터", "트랜잭션",
    "리팩터링", "중복 제거", "가독성", "네이밍", "일급 컬렉션", "원시값 포장", "매직 넘버", "상수화", 
    "enum", "static", "final", "상수 클래스", "유틸 클래스", "단일 책임", "함수형 인터페이스", 
    "람다", "Stream", "Optional", "Null 처리", "예외 처리",
    "단위 테스트", "통합 테스트", "테스트 코드", "JUnit", "AssertJ", "커버리지", "given-when-then", 
    "Mock 객체", "BeforeEach", "AfterEach", "ParameterizedTest", "테스트 더블", "리그레션 테스트", 
    "인수 테스트", "테스트 픽스처",
    "컬렉션", "List", "Map", "Set", "ArrayList", "HashMap", "HashSet", "equals", "hashCode", 
    "Comparable", "Comparator", "StringBuilder", "String.format", "Generic", "타입 추론", 
    "오토박싱", "언박싱", "Wrapper Class", "예외", "Checked Exception", "Unchecked Exception", 
    "try-with-resources", "InputStream", "OutputStream", "BufferedReader", "Scanner", 
    "패키지 구조", "import", "와일드카드", "srp"
]


class ReviewService:
    def __init__(self):
        self.reviews = [Review(**r) for r in load_reviews()]

    def get_keyword_stats(self):
        matches = []

        for r in self.reviews:
            text = r.comment.lower()

            for keyword in TARGET_KEYWORDS:
                if keyword.lower() in text:
                    matches.append(keyword)

        counter = Counter(matches)

        # 🔥 count >= 4 인 키워드만 반환
        filtered = {k: v for k, v in counter.items() if v >= 4}

        # 🔥 기존처럼 상위 50개만
        sorted_filtered = dict(sorted(filtered.items(), key=lambda x: x[1], reverse=True)[:30])

        return sorted_filtered

    
    def get_reviews_by_keyword(self, keyword: str):
        keyword = keyword.lower()
        result = []

        for r in self.reviews:
            if keyword in r.comment.lower():
                result.append(r)

        return result
