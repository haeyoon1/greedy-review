import { supabase } from "../lib/supabase";

// 전체 리뷰 가져오기
export async function fetchReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, repo, pr_number, comment, reviewer, file_path, code_snippet, url, submitted_at");

  if (error) {
    console.error("❌ fetchReviews 오류:", error);
    return [];
  }
  return data;
}

// 특정 키워드 리뷰 가져오기
export async function fetchReviewsByKeyword(keyword: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, repo, pr_number, comment, reviewer, file_path, code_snippet, url, submitted_at")
    .ilike("comment", `%${keyword}%`);

  if (error) {
    console.error("❌ fetchReviewsByKeyword 오류:", error);
    return [];
  }
  return data;
}

// 키워드 통계 (레포지토리별)
export async function fetchKeywordStats(repo?: string) {
  let reviews = await fetchReviews();

  // 레포지토리 필터링
  if (repo) {
    reviews = reviews.filter((r) => r.repo === repo);
  }

  const counts: Record<string, number> = {};

  const JAVA_KEYWORDS = [
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
    "컬렉션", "List", "Map", "Set", "ArrayList", "HashMap", "HashSet",
    "equals", "hashCode", "Comparable", "Comparator", "StringBuilder", "String.format",
    "Generic", "타입 추론", "오토박싱", "언박싱", "Wrapper Class",
    "예외", "Checked Exception", "Unchecked Exception",
    "try-with-resources", "InputStream", "OutputStream", "BufferedReader", "Scanner",
    "패키지 구조", "import", "와일드카드", "srp"
  ];

  // 🔍 리뷰의 comment에서만 키워드 카운트
  for (const r of reviews) {
    const text = r.comment?.toLowerCase() ?? "";
    JAVA_KEYWORDS.forEach((k) => {
      if (text.includes(k.toLowerCase())) {
        counts[k] = (counts[k] || 0) + 1;
      }
    });
  }

  // 🎯 상위 15개만 반환
  const sortedTop = Object.fromEntries(
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
  );

  return sortedTop;
}
  
