import type { Review, ReviewThread, ThreadComment } from "../types/review";

/**
 * 1️⃣ 리뷰 배열을 스레드별로 그룹핑
 *
 * @param reviews - API에서 받은 리뷰 배열
 * @returns thread_id별로 그룹핑된 ReviewThread 배열
 *
 * @example
 * const reviews = [...] // API 응답
 * const threads = groupReviewsByThread(reviews);
 * // [
 * //   {
 * //     thread_id: 2484824804,
 * //     main_comment: { comment_id: 2484824804, ... },
 * //     replies: [{ comment_id: 2484825000, ... }, ...],
 * //     reply_count: 2,
 * //     is_expanded: false
 * //   },
 * //   ...
 * // ]
 */
export function groupReviewsByThread(reviews: Review[]): ReviewThread[] {
  // 1. thread_id로 Map 생성 (thread_id -> Review[])
  const threadMap = new Map<number, Review[]>();

  reviews.forEach((review) => {
    const threadId = review.thread_id;
    if (!threadMap.has(threadId)) {
      threadMap.set(threadId, []);
    }
    threadMap.get(threadId)!.push(review);
  });

  // 2. 각 스레드를 정렬 및 변환 (comment_id 기준 오름차순)
  const threads: ReviewThread[] = [];

  threadMap.forEach((reviews, threadId) => {
    // comment_id 기준 오름차순 정렬 (첫 댓글이 가장 작은 comment_id)
    const sorted = reviews.sort(
      (a, b) => a.comment_id - b.comment_id
    );

    const mainReview = sorted[0];
    const repliesReviews = sorted.slice(1);

    // ThreadComment 타입으로 변환
    const mainComment: ThreadComment = {
      ...mainReview,
      isMainComment: true,
    };

    const replies: ThreadComment[] = repliesReviews.map((review) => ({
      ...review,
      isMainComment: false,
    }));

    threads.push({
      thread_id: threadId,
      main_comment: mainComment,
      replies,
      reply_count: repliesReviews.length,
      is_expanded: false, // 초기 상태: 접혀있음
    });
  });

  // 3. thread_id 기준으로 정렬 (안정적인 순서 보장)
  return threads.sort((a, b) => a.thread_id - b.thread_id);
}

/**
 * 2️⃣ 스레드를 페이지네이션 처리
 *
 * @param threads - 그룹핑된 스레드 배열
 * @param page - 현재 페이지 (1부터 시작)
 * @param pageSize - 한 페이지당 표시할 스레드 수
 * @returns 페이지네이션된 결과
 *
 * @example
 * const result = paginateThreads(threads, 1, 10);
 * console.log(result.threads.length); // 최대 10개
 * console.log(result.total_pages); // 전체 페이지 수
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
  const endIdx = startIdx + pageSize;
  const paginatedThreads = threads.slice(startIdx, endIdx);

  return {
    threads: paginatedThreads,
    total_count: totalCount,
    current_page: validPage,
    total_pages: totalPages,
    page_size: pageSize,
  };
}

/**
 * 3️⃣ 특정 스레드의 전개 상태 토글
 *
 * @param threads - 스레드 배열
 * @param threadId - 토글할 스레드 ID
 * @returns 업데이트된 스레드 배열 (새로운 배열)
 *
 * @example
 * const updated = toggleThreadExpansion(threads, 2484824804);
 */
export function toggleThreadExpansion(
  threads: ReviewThread[],
  threadId: number
): ReviewThread[] {
  return threads.map((thread) =>
    thread.thread_id === threadId
      ? { ...thread, is_expanded: !thread.is_expanded }
      : thread
  );
}

/**
 * 4️⃣ 모든 스레드 전개/접기
 *
 * @param threads - 스레드 배열
 * @param expandAll - true면 모두 펼치기, false면 모두 접기
 * @returns 업데이트된 스레드 배열
 */
export function setAllThreadsExpansion(
  threads: ReviewThread[],
  expandAll: boolean
): ReviewThread[] {
  return threads.map((thread) => ({
    ...thread,
    is_expanded: expandAll,
  }));
}

/**
 * 5️⃣ 특정 키워드로 스레드 필터링
 * (검색 기능이 필요할 때 사용)
 *
 * @param threads - 스레드 배열
 * @param keyword - 검색 키워드
 * @returns 필터링된 스레드
 */
export function filterThreadsByKeyword(
  threads: ReviewThread[],
  keyword: string
): ReviewThread[] {
  if (!keyword.trim()) return threads;

  const lowerKeyword = keyword.toLowerCase();

  return threads.filter((thread) => {
    const mainComment = thread.main_comment;
    const allComments = [mainComment, ...thread.replies];

    return allComments.some(
      (comment) =>
        comment.comment.toLowerCase().includes(lowerKeyword) ||
        comment.reviewer.toLowerCase().includes(lowerKeyword) ||
        comment.file_path.toLowerCase().includes(lowerKeyword)
    );
  });
}

/**
 * 6️⃣ 스레드의 총 댓글 개수 계산
 * (스레드 내 모든 댓글)
 */
export function getThreadTotalComments(thread: ReviewThread): number {
  return 1 + thread.replies.length; // main + replies
}
