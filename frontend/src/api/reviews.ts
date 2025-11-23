import { supabase } from "../lib/supabase";
import type { Review } from "../types/review";
import { KEYWORD_CATEGORIES } from "../constants/keywords";

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