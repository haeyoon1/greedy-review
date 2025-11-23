import "./ThreadPagination.css";

interface ThreadPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * 📌 ThreadPagination 컴포넌트
 *
 * 페이지네이션 컨트롤을 표시합니다.
 * - 이전/다음 버튼
 * - 페이지 번호 버튼 (현재 페이지 주변 일부만 표시)
 * - 더 보기 표시 (...)
 *
 * Props:
 * - currentPage: 현재 페이지
 * - totalPages: 전체 페이지 수
 * - onPageChange: 페이지 변경 콜백
 */
export default function ThreadPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ThreadPaginationProps) {
  // 표시할 페이지 번호 계산
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // 7페이지 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 7페이지 초과면 현재 페이지 주변만 표시
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="thread-pagination">
      {/* 이전 버튼 */}
      <button
        className="pagination-arrow prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <span>❮</span>
      </button>

      {/* 페이지 번호 */}
      <div className="page-numbers">
        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="ellipsis">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`page-button ${currentPage === page ? "active" : ""}`}
              onClick={() => onPageChange(page as number)}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* 다음 버튼 */}
      <button
        className="pagination-arrow next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        <span>❯</span>
      </button>

      {/* 페이지 정보 */}
      <div className="page-info">
        {currentPage} / {totalPages}
      </div>
    </div>
  );
}
