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
    return [];
  }
  return data;
}

export async function fetchReviewsByKeyword(keyword: string): Promise<Review[]> {
  const decodedKeyword = decodeURIComponent(keyword);

  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, repo, pr_number, comment, reviewer, file_path, code_snippet, url, submitted_at, is_issue_comment, comment_id, thread_id"
    )
    .ilike("comment", `%${decodedKeyword}%`);

  if (error) {
    return [];
  }

  return (data ?? []) as Review[];
}

export async function fetchKeywordStats(repo: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select("comment")
    .like("repo", `%${repo}%`);

  if (error || !data) {
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
