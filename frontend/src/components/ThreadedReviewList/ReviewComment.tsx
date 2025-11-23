import { useState } from "react";
import type { ThreadComment } from "../../types/review";
import GithubMarkdown from "../GithubMarkdown";
import Button from "../Button";
import "./ReviewComment.css";

interface ReviewCommentProps {
  comment: ThreadComment;
  keyword?: string;
  isMain: boolean;
}

export default function ReviewComment({
  comment,
  keyword,
  isMain,
}: ReviewCommentProps) {
  const content = comment.comment ?? "";

  const formattedDate = new Date(comment.submitted_at).toLocaleDateString(
    "ko-KR",
    { year: "numeric", month: "short", day: "numeric" }
  );

  return (
    <div className={`review-comment ${isMain ? "main" : "reply"}`}>
      {/* 댓글 헤더 - 작성자 정보 + PR 링크 */}
      <div className="comment-header">
        <div className="author-info">
          <div className="author-avatar">
            {comment.reviewer?.charAt(0).toUpperCase() || "?"}
          </div>
          <div className="author-details">
            <div className="author-name">{comment.reviewer}</div>
            <div className="comment-date">{formattedDate}</div>
          </div>
        </div>

        <div className="comment-header-right">
          <div className="comment-badges">
            {comment.repo && (
              <span className="repo-badge">{comment.repo.split("/")[1]}</span>
            )}
            {comment.file_path && (
              <span className="file-badge">
                {comment.file_path.split("/").pop()}
              </span>
            )}
          </div>

          {/* PR 링크 - 헤더 우측에 배치 */}
          {comment.url && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(comment.url, "_blank")}
            >
              PR #{comment.pr_number} 보기
            </Button>
          )}
        </div>
      </div>

      {/* 코드 스니펫 - 메인 댓글에만 표시 */}
      {isMain && comment.code_snippet && (
        <div className="code-snippet">
          <DiffCodeBlock code={comment.code_snippet} maxLines={20} />
        </div>
      )}

      {/* 마크다운 렌더링 */}
      <div className="comment-content">
        <GithubMarkdown content={content} highlightKeyword={keyword} />
      </div>
    </div>
  );
}

/** Diff 스타일 코드 블록 */
interface DiffCodeBlockProps {
  code: string;
  maxLines?: number;
}

function DiffCodeBlock({ code, maxLines = 20 }: DiffCodeBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = code.replace(/\\n/g, "\n").split("\n");

  const displayLines = isExpanded ? lines : lines.slice(0, maxLines);
  const hasMoreLines = lines.length > maxLines;

  return (
    <div>
      <pre className="diff-code-block">
        {displayLines.map((line, idx) => {
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
      {hasMoreLines && (
        <button
          className="code-expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "▲ 접기" : `▼ ${lines.length - maxLines}줄 더보기`}
        </button>
      )}
    </div>
  );
}
