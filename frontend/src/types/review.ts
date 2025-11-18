/**
 * API에서 받는 개별 리뷰 데이터
 */
export interface Review {
  id?: string;
  repo: string;
  pr_number: number;
  file_path: string;
  reviewer: string;
  submitted_at: string;
  comment: string;
  code_snippet: string;
  url: string;
  is_issue_comment: boolean;
  comment_id: number;
  thread_id: number;
}

/**
 * 스레드 내 단일 댓글
 */
export interface ThreadComment extends Review {
  isMainComment: boolean; // 스레드의 첫 번째 댓글인가?
}

/**
 * 스레드 그룹 (동일 thread_id를 가진 리뷰들)
 */
export interface ReviewThread {
  thread_id: number;
  main_comment: ThreadComment; // 가장 오래된 댓글 (comment_id 가 가장 작은 것)
  replies: ThreadComment[]; // 나머지 댓글들
  reply_count: number; // 답글 수
  is_expanded: boolean; // UI 상태: 펼쳐져 있는가?
}

/**
 * 페이지네이션된 스레드 목록
 */
export interface PaginatedThreads {
  threads: ReviewThread[];
  total_count: number;
  current_page: number;
  total_pages: number;
  page_size: number;
}
