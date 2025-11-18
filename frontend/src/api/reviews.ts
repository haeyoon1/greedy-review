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
    const query = repo ? `?repo=${repo}` : "";
    const res = await fetch(`http://localhost:8000/stats/keywords${query}`);
  
    if (!res.ok) {
      console.error("❌ Failed to fetch keyword stats");
      return {};
    }
  
    return await res.json();
  }  
