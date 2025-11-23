import type { Review, ReviewThread, ThreadComment } from "../types/review";

/**
 * 1) 리뷰들을 thread_id 기준으로 그룹핑
 */
export function groupReviewsByThread(reviews: Review[]): ReviewThread[] {
  const threadMap = new Map<number, Review[]>();

  reviews.forEach((review) => {
    const threadId = review.thread_id;
    if (!threadMap.has(threadId)) threadMap.set(threadId, []);
    threadMap.get(threadId)!.push(review);
  });

  const threads: ReviewThread[] = [];

  threadMap.forEach((list, threadId) => {
    const sorted = list.sort(
      (a, b) => a.comment_id - b.comment_id
    );

    const mainReview = sorted[0];
    const repliesReviews = sorted.slice(1);

    const mainComment: ThreadComment = {
      ...mainReview,
      isMainComment: true,
    };

    const replies: ThreadComment[] = repliesReviews.map((r) => ({
      ...r,
      isMainComment: false,
    }));

    threads.push({
      thread_id: threadId,
      main_comment: mainComment,
      replies,
      reply_count: replies.length,
      is_expanded: false,
    });
  });

  return threads;
}

/**
 * 2) 페이지네이션
 */
export function paginateThreads(
  threads: ReviewThread[],
  page: number = 1,
  pageSize: number = 10
) {
  const totalCount = threads.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const validPage = Math.max(1, Math.min(page, totalPages));

  const startIdx = (validPage - 1) * pageSize;

  return {
    threads: threads.slice(startIdx, startIdx + pageSize),
    total_count: totalCount,
    current_page: validPage,
    total_pages: totalPages,
    page_size: pageSize,
  };
}

/**
 * 3) 특정 스레드 토글
 */
export function toggleThreadExpansion(
  threads: ReviewThread[],
  threadId: number
): ReviewThread[] {
  return threads.map((t) =>
    t.thread_id === threadId
      ? { ...t, is_expanded: !t.is_expanded }
      : t
  );
}

/**
 * 4) 전체 스레드 펼치기/접기
 */
export function setAllThreadsExpansion(
  threads: ReviewThread[],
  expandAll: boolean
): ReviewThread[] {
  return threads.map((t) => ({
    ...t,
    is_expanded: expandAll,
  }));
}

/**
 * 5) 특정 키워드로 스레드 필터링
 */
export function filterThreadsByKeyword(
  threads: ReviewThread[],
  keyword: string
): ReviewThread[] {
  if (!keyword.trim()) return threads;
  const lowerKeyword = keyword.toLowerCase();

  return threads.filter((thread) => {
    const all = [thread.main_comment, ...thread.replies];
    return all.some(
      (comment) =>
        comment.comment.toLowerCase().includes(lowerKeyword) ||
        comment.reviewer.toLowerCase().includes(lowerKeyword) ||
        comment.file_path.toLowerCase().includes(lowerKeyword)
    );
  });
}
