import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import type { ThreadComment } from "../../types/review";
import Button from "../Button";
import "./ReviewComment.css";

interface ReviewCommentProps {
  comment: ThreadComment;
  keyword?: string;
  isMain: boolean;
}

/**
 * 📌 ReviewComment 컴포넌트
 *
 * 단일 댓글을 표시합니다. (메인 댓글 또는 답글)
 * - 작성자 정보 (아바타, 이름, 날짜)
 * - 리포지토리/파일 정보
 * - 코드 스니펫
 * - 마크다운 렌더링된 댓글
 * - PR 링크
 *
 * Props:
 * - comment: 댓글 데이터
 * - keyword: 하이라이트할 키워드
 * - isMain: 메인 댓글인가? (스타일 차이)
 */
export default function ReviewComment({
  comment,
  keyword,
  isMain,
}: ReviewCommentProps) {
  // 마크다운 처리 (URL 자동 변환)
  const processedComment = useMemo(() => {
    let content = comment.comment ?? "";

    // 순수 URL을 마크다운 링크로 변환
    const urlPattern = /(?<!\[)(?<!\()https?:\/\/[^\s\)]+/g;
    if (!content.includes("[") || !content.includes("](")) {
      content = content.replace((url) => `[${url}](${url})`);
    }

    // 키워드 하이라이트
    if (keyword) {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "gi");
      content = content.replace(
        regex,
        `<mark class="keyword-highlight">$1</mark>`
      );
    }

    return content;
  }, [comment.comment, keyword]);

  const formattedDate = new Date(comment.submitted_at).toLocaleDateString(
    "ko-KR",
    { year: "numeric", month: "short", day: "numeric" }
  );

  return (
    <div className={`review-comment ${isMain ? "main" : "reply"}`}>
      {/* 댓글 헤더: 작성자 정보 */}
      <div className="comment-header">
        <div className="author-info">
          <div className="author-avatar">
            {comment.reviewer?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="author-details">
            <div className="author-name">{comment.reviewer || "익명"}</div>
            <div className="comment-date">{formattedDate}</div>
          </div>
        </div>

        {/* 파일/리포 배지 */}
        <div className="comment-badges">
          {comment.repo && (
            <span className="repo-badge" title={comment.repo}>
              {comment.repo.split("/")[1] || comment.repo}
            </span>
          )}
          {comment.file_path && (
            <span className="file-badge" title={comment.file_path}>
              {comment.file_path.split("/").pop()}
            </span>
          )}
        </div>
      </div>

      {/* 코드 스니펫 (있으면) */}
      {comment.code_snippet && (
        <div className="code-snippet">
          <DiffCodeBlock code={comment.code_snippet} />
        </div>
      )}

      {/* 마크다운 댓글 */}
      <div className="comment-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            // 커스텀 링크 스타일
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="markdown-link"
              >
                {children}
              </a>
            ),
          }}
        >
          {processedComment}
        </ReactMarkdown>
      </div>

      {/* 푸터: PR 링크 */}
      {comment.url && (
        <div className="comment-footer">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(comment.url, "_blank")}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.75 2A1.75 1.75 0 002 3.75v8.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 12.25v-3.5a.75.75 0 00-1.5 0v3.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-8.5a.25.25 0 01.25-.25h3.5a.75.75 0 000-1.5h-3.5z" />
              <path d="M9.75 2.75a.75.75 0 000 1.5h1.69L8.22 7.47a.75.75 0 101.06 1.06l3.22-3.22v1.69a.75.75 0 001.5 0V2.75h-4.25z" />
            </svg>
            PR #{comment.pr_number} 보기
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * GitHub Diff 스타일 코드 블록
 */
function DiffCodeBlock({ code }: { code: string }) {
  const lines = code.replace(/\\n/g, "\n").split("\n");

  return (
    <pre className="diff-code-block">
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
