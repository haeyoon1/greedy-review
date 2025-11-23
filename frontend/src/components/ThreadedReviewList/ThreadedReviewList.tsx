import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchThreadsByKeyword } from "../../api/reviews";
import type { ReviewThread } from "../../types/review";
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

const ITEMS_PER_PAGE = 8;

export default function ThreadedReviewList() {
  const { name: keyword } = useParams<{ name: string }>();
  const [allThreads, setAllThreads] = useState<ReviewThread[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredThreads = searchKeyword
    ? filterThreadsByKeyword(allThreads, searchKeyword)
    : allThreads;

  const paginated = paginateThreads(
    filteredThreads,
    currentPage,
    ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (!keyword) return;

    setLoading(true);
    setCurrentPage(1);

    console.log("🔥 [Thread] keyword:", keyword);

    fetchThreadsByKeyword(keyword)
      .then((reviews) => {
        console.log("📌 fetchThreadsByKeyword 결과:", reviews);
        const threads = groupReviewsByThread(reviews);
        console.log("📌 groupReviewsByThread:", threads);
        setAllThreads(threads);
      })
      .finally(() => setLoading(false));
  }, [keyword]);

  const handleToggleThread = (threadId: number) => {
    setAllThreads((prev) => toggleThreadExpansion(prev, threadId));
  };

  const handleExpandAll = () => {
    setAllThreads((prev) => setAllThreadsExpansion(prev, true));
  };

  const handleCollapseAll = () => {
    setAllThreads((prev) => setAllThreadsExpansion(prev, false));
  };

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
      <div className="review-header">
        <div className="header-info">
          <h3 className="review-title">
            스레드 {filteredThreads.length}개 ({allThreads.length}개 전체)
          </h3>
          <div className="expand-controls">
            <button className="expand-btn" onClick={handleExpandAll}>
              ▼ 모두 펼치기
            </button>
            <button className="collapse-btn" onClick={handleCollapseAll}>
              ▲ 모두 접기
            </button>
          </div>
        </div>

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
