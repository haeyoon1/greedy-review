import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchReviewsByKeyword } from "../api/reviews";
import Container from "../components/Container";
import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";
import "./Detail.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface Review {
  id: string;
  repo: string;
  pr_number: number;
  comment: string;
  reviewer: string;
  file_path: string;
  code_snippet: string;
  url: string;
  submitted_at: string;
}

const ITEMS_PER_PAGE = 5;

export default function Detail() {
  const { name } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!name) return;

    setLoading(true);
    fetchReviewsByKeyword(name)
      .then((data) => {
        setReviews(data);
        setCurrentPage(1); // 리셋
      })
      .finally(() => {
        setLoading(false);
      });
  }, [name]);

  // 페이지네이션 계산
  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const currentReviews = reviews.slice(startIdx, endIdx);

  if (loading) {
    return (
      <div className="detail-page">
        <Header showBackButton />
        <Container maxWidth="lg">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>리뷰를 불러오는 중...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <Header showBackButton />

      <Container maxWidth="lg">
        <div className="detail-header">
          <div className="keyword-badge">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {name}
          </div>

          <div className="review-count">
            총 <span className="count-number">{reviews.length}</span>개의 리뷰
          </div>
        </div>

        {reviews.length === 0 ? (
          <Card variant="outlined" padding="lg" className="empty-reviews">
            <div className="empty-icon">🔍</div>
            <h3>해당 키워드 관련 리뷰가 없습니다</h3>
            <p className="text-secondary">다른 키워드를 검색해보세요.</p>
          </Card>
        ) : (
          <>
            <div className="reviews-list">
              {currentReviews.map((review, idx) => (
                <Card
                  key={idx}
                  variant="default"
                  padding="lg"
                  className="review-card"
                >
                  <ReviewCard review={review} keyword={name} />
                </Card>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </Container>
    </div>
  );
}

/* -------------------------------------------------------------- */
/* 리뷰 카드 */
/* -------------------------------------------------------------- */
function ReviewCard({ review, keyword }: { review: Review; keyword?: string }) {
  return (
    <>
      <div className="review-header">
        <ReviewerInfo review={review} />
        {review.repo && <RepoBadge repo={review.repo} />}
      </div>

      <div className="review-content">
        {/* 1️⃣ 코드 스니펫을 먼저 표시 */}
        {review.file_path && (
          <div className="file-path">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M1 3.5A1.5 1.5 0 012.5 2h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 01.44 1.061V11.5A1.5 1.5 0 0111.5 13h-9A1.5 1.5 0 011 11.5v-8z" />
            </svg>
            {review.file_path}
          </div>
        )}

        {review.code_snippet && <DiffCodeBlock code={review.code_snippet} />}

        {/* 2️⃣ 코멘트를 나중에 표시 */}
        <MarkdownComment text={review.comment} keyword={keyword} />
      </div>

      {review.url && (
        <div className="review-footer">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(review.url, "_blank")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.75 2A1.75 1.75 0 002 3.75v8.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 12.25v-3.5a.75.75 0 00-1.5 0v3.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-8.5a.25.25 0 01.25-.25h3.5a.75.75 0 000-1.5h-3.5z" />
              <path d="M9.75 2.75a.75.75 0 000 1.5h1.69L8.22 7.47a.75.75 0 101.06 1.06l3.22-3.22v1.69a.75.75 0 001.5 0V2.75h-4.25z" />
            </svg>
            PR #{review.pr_number} 보기
          </Button>
        </div>
      )}
    </>
  );
}

/* -------------------------------------------------------------- */
/* 서브 컴포넌트 */
/* -------------------------------------------------------------- */
function ReviewerInfo({ review }: { review: Review }) {
  return (
    <div className="reviewer-info">
      <div className="reviewer-avatar">
        {review.reviewer?.charAt(0).toUpperCase() || "?"}
      </div>
      <div className="reviewer-details">
        <div className="reviewer-name">{review.reviewer || "익명"}</div>
        {review.submitted_at && (
          <div className="review-date">
            {new Date(review.submitted_at).toLocaleDateString("ko-KR")}
          </div>
        )}
      </div>
    </div>
  );
}

function RepoBadge({ repo }: { repo: string }) {
  return (
    <div className="repo-badge">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z" />
      </svg>
      {repo}
    </div>
  );
}

/* -------------------------------------------------------------- */
/* Markdown Comment (Keyword Highlight) */
/* -------------------------------------------------------------- */
function MarkdownComment({
  text,
  keyword,
}: {
  text: string;
  keyword?: string;
}) {
  let content = text ?? "";

  if (keyword) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "gi");

    content = content.replace(
      regex,
      `<mark class="keyword-highlight">$1</mark>`
    );
  }

  return (
    <div className="review-comment">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n")}
      </ReactMarkdown>
    </div>
  );
}

/* -------------------------------------------------------------- */
/* GitHub Diff 스타일 구현 */
/* -------------------------------------------------------------- */
function DiffCodeBlock({ code }: { code: string }) {
  const lines = code.replace(/\\n/g, "\n").split("\n");

  return (
    <pre
      style={{
        backgroundColor: "#f6f8fa",
        padding: "16px",
        borderRadius: "6px",
        overflowX: "auto",
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: "14px",
        lineHeight: "1.5",
      }}
    >
      {lines.map((line, idx) => {
        const t = line.trim();
        let bg = "transparent";
        let color = "#24292e";

        if (t.startsWith("@@")) {
          bg = "#f2f8fc";
          color = "#0366d6";
        } else if (t.startsWith("+") && !t.startsWith("+++")) {
          bg = "#e6ffed";
          color = "#22863a";
        } else if (t.startsWith("-") && !t.startsWith("---")) {
          bg = "#ffeef0";
          color = "#cb2431";
        }

        return (
          <div
            key={idx}
            style={{
              whiteSpace: "pre",
              backgroundColor: bg,
              color,
              padding: "2px 6px",
            }}
          >
            {line}
          </div>
        );
      })}
    </pre>
  );
}

/* -------------------------------------------------------------- */
/* Pagination */
/* -------------------------------------------------------------- */
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages: (number | string)[] = [];

  // 페이지 번호 계산
  if (totalPages <= 7) {
    // 7페이지 이하면 모두 표시
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // 7페이지 초과시 ... 포함
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
  }

  return (
    <div className="pagination">
      <button
        className="pagination-arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      <div className="pagination-numbers">
        {pages.map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`pagination-number ${currentPage === page ? "active" : ""}`}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        className="pagination-arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
