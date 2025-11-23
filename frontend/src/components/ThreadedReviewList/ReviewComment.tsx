import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { github as githubStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { ThreadComment } from "../../types/review";
import Button from "../Button";
import "./ReviewComment.css";

interface ReviewCommentProps {
  comment: ThreadComment;
  keyword?: string;
  isMain: boolean;
}

/** 🔥 코드블록 / 인라인코드 제외 텍스트 노드 하이라이트 함수 */
function highlightKeyword(markdown: string, keyword?: string) {
  if (!keyword) return markdown;

  // 정규식 escape
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");

  // 코드블록 먼저 보존
  const parts = markdown.split(/(```[\s\S]*?```)/g);

  return parts
    .map((part) => {
      if (part.startsWith("```")) return part; // 코드블록은 그대로
      // 인라인코드 보존
      const segments = part.split(/(`[^`]*`)/g);
      return segments
        .map((seg) => {
          if (seg.startsWith("`") && seg.endsWith("`")) return seg;
          return seg.replace(
            regex,
            `<mark class="keyword-highlight">$1</mark>`
          );
        })
        .join("");
    })
    .join("");
}

/** 🔥 ReactMarkdown의 노드를 후처리해서 하이라이트 적용 */
function renderWithHighlight(children: any, keyword?: string) {
  return children.map((child: any, i: number) => {
    if (typeof child === "string") {
      return (
        <span
          key={i}
          dangerouslySetInnerHTML={{
            __html: highlightKeyword(child, keyword || ""),
          }}
        />
      );
    }
    if (child?.props?.children) {
      return (
        <child.type key={i} {...child.props}>
          {renderWithHighlight(child.props.children, keyword)}
        </child.type>
      );
    }
    return child;
  });
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
      {/* 댓글 헤더 */}
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
      </div>

      {/* 코드 스니펫 */}
      {comment.code_snippet && (
        <div className="code-snippet">
          <DiffCodeBlock code={comment.code_snippet} />
        </div>
      )}

      {/* 🔥 마크다운 + 코드블록 + 하이라이트 */}
      <div className="comment-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeRaw,
            [
              rehypeSanitize,
              {
                tagNames: [
                  "h1",
                  "h2",
                  "h3",
                  "h4",
                  "h5",
                  "h6",
                  "p",
                  "br",
                  "em",
                  "strong",
                  "a",
                  "ul",
                  "ol",
                  "li",
                  "blockquote",
                  "code",
                  "pre",
                  "hr",
                  "img",
                  "table",
                  "thead",
                  "tbody",
                  "tr",
                  "th",
                  "td",
                  "del",
                  "span",
                  "div",
                  "mark",
                ],
                attributes: {
                  a: ["href", "title"],
                  code: ["className"],
                  mark: ["class"],
                  img: ["src", "alt"],
                },
              },
            ],
          ]}
          components={{
            code: ({ inline, className, children, ...props }: any) => {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "text";

              if (inline)
                return (
                  <code className="inline-code" {...props}>
                    {children}
                  </code>
                );

              const codeString = String(children).replace(/\n$/, "");
              return (
                <SyntaxHighlighter
                  language={language}
                  style={githubStyle}
                  PreTag="div"
                  customStyle={{
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "#f6f8fa",
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>

        {/* 🔥 하이라이트 후처리 */}
        <div className="highlight-wrapper">
          {renderWithHighlight(
            [
              <ReactMarkdown
                key="preview"
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {content}
              </ReactMarkdown>,
            ],
            keyword
          )}
        </div>
      </div>

      {/* PR 링크 */}
      {comment.url && (
        <div className="comment-footer">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(comment.url, "_blank")}
          >
            PR #{comment.pr_number} 보기
          </Button>
        </div>
      )}
    </div>
  );
}

/** Diff 스타일 코드 블록 그대로 유지 */
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
