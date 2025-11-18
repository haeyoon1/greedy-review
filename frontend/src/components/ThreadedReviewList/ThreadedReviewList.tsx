import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchReviewsByKeyword } from "../../api/reviews";
import type { Review, ReviewThread } from "../../types/review";
import {
  groupReviewsByThread,
  paginateThreads,
  toggleThreadExpansion,
  setAllThreadsExpansion,
  filterThreadsByKeyword,
} from "../../utils/threadGrouping";
import ThreadItem from "./ThreadItem";
import ThreadPagination from "./ThreadPagination";
import "./ThreadedReviewList.css";

const ITEMS_PER_PAGE = 8; // 한 페이지에 표시할 스레드 수

/**
 * 📌 ThreadedReviewList 컴포넌트
 *
 * 역할:
 * - API에서 리뷰 데이터 fetch
 * - 리뷰를 스레드별로 그룹핑
 * - 스레드 목록 표시 및 페이지네이션
 * - 각 스레드의 전개/접기 상태 관리
 *
 * Props: 없음 (useParams로 keyword를 받음)
 *
 * 상태 관리:
 * - threads: 그룹핑된 스레드 배열
 * - currentPage: 현재 페이지
 * - loading: 데이터 로딩 중 여부
 * - searchKeyword: 검색 필터
 */
export default function ThreadedReviewList() {
  const { name: keyword } = useParams<{ name: string }>();
  const [allThreads, setAllThreads] = useState<ReviewThread[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  // 검색으로 필터링된 스레드
  const filteredThreads = searchKeyword
    ? filterThreadsByKeyword(allThreads, searchKeyword)
    : allThreads;

  // 페이지네이션 적용
  const paginated = paginateThreads(filteredThreads, currentPage, ITEMS_PER_PAGE);

  // ═══════════════════════════════════════════
  // 1️⃣ 데이터 로딩 & 그룹핑
  // ═══════════════════════════════════════════
  useEffect(() => {
    if (!keyword) return;

    setLoading(true);
    setCurrentPage(1);

    fetchReviewsByKeyword(keyword)
      .then((reviews: Review[]) => {
        // 스레드별로 그룹핑
        const threads = groupReviewsByThread(reviews);
        setAllThreads(threads);
      })
      .catch((error) => {
        console.error("리뷰 로딩 실패:", error);
        setAllThreads([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [keyword]);

  // ═══════════════════════════════════════════
  // 2️⃣ 스레드 전개/접기 토글
  // ═══════════════════════════════════════════
  const handleToggleThread = (threadId: number) => {
    setAllThreads((prev) => toggleThreadExpansion(prev, threadId));
  };

  // ═══════════════════════════════════════════
  // 3️⃣ 모든 스레드 전개/접기
  // ═══════════════════════════════════════════
  const handleExpandAll = () => {
    setAllThreads((prev) => setAllThreadsExpansion(prev, true));
  };

  const handleCollapseAll = () => {
    setAllThreads((prev) => setAllThreadsExpansion(prev, false));
  };

  // ═══════════════════════════════════════════
  // UI 렌더링
  // ═══════════════════════════════════════════
  if (loading) {
    return (
      <div className="threaded-review-loading">
        <div className="spinner"></div>
        <p>리뷰를 불러오는 중...</p>
      </div>
    );
  }

  if (allThreads.length === 0) {
    return (
      <div className="threaded-review-empty">
        <p>관련 리뷰가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="threaded-review-list">
      {/* 헤더: 총 스레드 수, 전개/접기 버튼, 검색 */}
      <div className="review-header">
        <div className="header-info">
          <h3 className="review-title">
            스레드 {filteredThreads.length}개 ({allThreads.length}개 전체)
          </h3>
          <div className="expand-controls">
            <button
              className="expand-btn"
              onClick={handleExpandAll}
              title="모든 스레드 펼치기"
            >
              ▼ 모두 펼치기
            </button>
            <button
              className="collapse-btn"
              onClick={handleCollapseAll}
              title="모든 스레드 접기"
            >
              ▲ 모두 접기
            </button>
          </div>
        </div>

        {/* 검색 필터 */}
        <div className="search-box">
          <input
            type="text"
            placeholder="스레드 검색..."
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>
      </div>

      {/* 스레드 목록 */}
      <div className="threads-container">
        {paginated.threads.map((thread) => (
          <ThreadItem
            key={thread.thread_id}
            thread={thread}
            onToggle={handleToggleThread}
            keyword={keyword}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      {paginated.total_pages > 1 && (
        <ThreadPagination
          currentPage={paginated.current_page}
          totalPages={paginated.total_pages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
