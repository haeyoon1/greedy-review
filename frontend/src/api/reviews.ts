import { supabase } from "../lib/supabase";
import type { Review } from "../types/review";
import { KEYWORD_CATEGORIES } from "../constants/keywords";

export async function fetchReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, repo, pr_number, comment, reviewer, file_path, code_snippet, url, submitted_at"
    );

  if (error) {
    console.error("❌ fetchReviews 오류:", error);
    return [];
  }
  return data;
}

/**
 * 기존 키워드 검색 (스레드 처리 없음)
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

/**
 * thread_id 목록으로 전체 댓글 가져오기
 */
export async function fetchReviewsByThreadIds(
  threadIds: number[]
): Promise<Review[]> {
  console.log("📌 fetchReviewsByThreadIds() 호출 threadIds:", threadIds);

  if (!threadIds.length) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, repo, pr_number, comment, reviewer, file_path, code_snippet, url, submitted_at, is_issue_comment, comment_id, thread_id"
    )
    .in("thread_id", threadIds)
    .order("submitted_at", { ascending: true });

  if (error) {
    console.error("❌ fetchReviewsByThreadIds 오류:", error);
    return [];
  }

  console.log("📌 fetchReviewsByThreadIds 결과:", data);
  return data ?? [];
}

/**
 * keyword 포함된 코멘트 → 해당 thread 전체 가져오기
 */
export async function fetchThreadsByKeyword(keyword: string): Promise<Review[]> {
  const decodedKeyword = decodeURIComponent(keyword);

  // 1) keyword 포함된 댓글 검색
  const { data: matched, error: keywordError } = await supabase
    .from("reviews")
    .select(
      "comment_id, thread_id, comment, reviewer, file_path, submitted_at"
    )
    .ilike("comment", `%${decodedKeyword}%`);

  if (keywordError) {
    console.error("❌ fetchThreadsByKeyword keyword 검색 오류:", keywordError);
    return [];
  }

  if (!matched?.length) {
    console.log("⚠️ keyword 매칭된 댓글 없음:", decodedKeyword);
    return [];
  }

  // 2) 해당 댓글들의 thread_id 추출
  const threadIds = [...new Set(matched.map((r) => r.thread_id))];
  console.log("📌 추출된 threadIds:", threadIds);

  // 3) thread_id 전체 댓글 가져오기
  const fullThreadComments = await fetchReviewsByThreadIds(threadIds);

  console.log("📌 최종 thread full comments:", fullThreadComments);

  return fullThreadComments;
}

/**
 * repo 기반 키워드 통계
 */
export async function fetchKeywordStats(repo: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("comment")
    .like("repo", `%${repo}%`);

  if (error || !data) {
    console.error("❌ fetchKeywordStats 오류:", error);
    return {};
  }

  const keywordCounts: Record<string, number> = {};

  data.forEach(({ comment }) => {
    if (!comment) return;

    Object.values(KEYWORD_CATEGORIES).forEach((category) => {
      category.keywords.forEach((keyword) => {
        const regex = new RegExp(keyword, "gi");
        const matches = comment.match(regex);
        if (matches) {
          keywordCounts[keyword] =
            (keywordCounts[keyword] || 0) + matches.length;
        }
      });
    });
  });

  return keywordCounts;
}
