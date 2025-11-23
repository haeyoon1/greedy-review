import { supabase } from "../lib/supabase";
import type { Review } from "../types/review";

// ✅ 키워드 카테고리 정의
const KEYWORD_CATEGORIES = {
  oop: {
    name: "객체지향 및 설계 원칙",
    emoji: "🎯",
    keywords: [
      "객체지향",
      "캡슐화",
      "상속",
      "다형성",
      "추상화",
      "인터페이스",
      "구현체",
      "의존성",
      "의존 역전 원칙",
      "개방 폐쇄 원칙",
      "단일 책임 원칙",
      "단일 책임",
      "srp",
      "책임",
      "SOLID",
      "응집도",
      "결합도",
      "불변",
      "상태 관리",
    ],
  },
  architecture: {
    name: "아키텍처 및 디자인 패턴",
    emoji: "🏗️",
    keywords: [
      "MVC",
      "레이어드 아키텍처",
      "패키지 구조",
      "와일드카드",
      "팩토리 패턴",
      "전략 패턴",
      "싱글톤 패턴",
      "빌더 패턴",
      "정적 팩토리 메서드",
      "정팩메",
      "래퍼클래스",
      "Wrapper Class",
      "Wrapper",
    ],
  },
  codeQuality: {
    name: "코드 품질 및 Java 기본",
    emoji: "✨",
    keywords: [
      "리팩터링",
      "리팩토링",
      "중복",
      "가독성",
      "네이밍",
      "일급 컬렉션",
      "원시값 포장",
      "상수화",
      "매직 넘버",
      "상수",
      "유틸",
      "enum",
      "static",
      "final",
      "함수형 인터페이스",
      "람다",
      "lambda",
      "Stream",
      "스트림",
      "Optional",
      "Null",
      "컬렉션",
      "collection",
      "List",
      "Map",
      "Set",
      "ArrayList",
      "HashMap",
      "HashSet",
      "equals",
      "hashCode",
      "Comparable",
      "Comparator",
      "StringBuilder",
      "제네릭",
      "generic",
      "예외 처리",
      "예외",
      "Checked Exception",
      "Unchecked Exception",
    ],
  },
  testing: {
    name: "테스트",
    emoji: "🧪",
    keywords: [
      "단위 테스트",
      "통합 테스트",
      "JUnit",
      "AssertJ",
      "커버리지",
      "given-when-then",
      "Mock",
      "BeforeEach",
      "AfterEach",
      "ParameterizedTest",
      "인수 테스트",
      "fixture",
      "픽스쳐",
      "test",
    ],
  },
};

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
/*
export async function fetchReviewsByKeyword(keyword: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, repo, pr_number, comment, reviewer, file_path, code_snippet, url, submitted_at")
    .ilike("comment", `%${keyword}%`);

    console.log(data);
  if (error) {
    console.error("❌ fetchReviewsByKeyword 오류:", error);
    return [];
  }
  return data;
}
*/
export async function fetchReviewsByKeyword(keyword: string): Promise<Review[]> {
  const decodedKeyword = decodeURIComponent(keyword);

  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, repo, pr_number, comment, reviewer, file_path, code_snippet, url, submitted_at, is_issue_comment, comment_id, thread_id"
    )
    .ilike("comment", `%${decodedKeyword}%`);

  if (error) {
    console.error("❌ fetchReviewsByKeyword 오류:", error);
    return [];
  }

  return (data ?? []) as Review[];
}

// 키워드 통계 (레포지토리별)
export async function fetchKeywordStats(repo: string) {
  // 1) Supabase에서 해당 repo 리뷰 불러오기
  const { data, error } = await supabase
    .from("reviews")
    .select("comment")
    .eq("repo", repo);

  if (error || !data) {
    console.error("❌ fetchKeywordStats 오류:", error);
    return {};
  }

  // 2) 키워드 카운팅을 위한 기본 객체
  const keywordCounts: Record<string, number> = {};

  // 3) 모든 댓글에서 키워드 검사
  data.forEach(({ comment }) => {
    if (!comment) return;

    // 모든 키워드를 한번에 처리
    Object.values(KEYWORD_CATEGORIES).forEach((category) => {
      category.keywords.forEach((keyword) => {
        const regex = new RegExp(keyword, "gi");
        const matches = comment.match(regex);
        if (matches) {
          keywordCounts[keyword] = (keywordCounts[keyword] || 0) + matches.length;
        }
      });
    });
  });

  return keywordCounts;
}