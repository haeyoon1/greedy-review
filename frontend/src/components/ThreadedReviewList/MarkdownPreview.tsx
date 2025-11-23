/**
 * MarkdownPreview 컴포넌트
 *
 * 마크다운 텍스트를 미리보기로 렌더링하는 독립 컴포넌트
 * (댓글 작성, 편집 시 유용)
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { github as githubStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./ReviewComment.css";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export default function MarkdownPreview({
  content,
  className = "markdown-preview",
}: MarkdownPreviewProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          [rehypeSanitize, {
            tagNames: [
              'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
              'p', 'br', 'em', 'strong', 'a', 'ul', 'ol', 'li',
              'blockquote', 'code', 'pre', 'hr', 'img',
              'table', 'thead', 'tbody', 'tr', 'th', 'td',
              'del', 'input', 'span', 'div',
            ],
            attributes: {
              a: ['href', 'title'],
              img: ['src', 'alt', 'title'],
              code: ['className'],
            },
          }]
        ]}
        components={{
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "text";
            const isInline = inline === true;

            if (isInline) {
              return (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              );
            }

            const codeString = String(children).replace(/\n$/, "");
            return (
              <div className="code-block-wrapper">
                <div className="code-block-lang">{language}</div>
                <SyntaxHighlighter
                  language={language}
                  style={githubStyle}
                  className="code-block-highlighter"
                  customStyle={{
                    margin: 0,
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "#f6f8fa",
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
                    },
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          },

          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="markdown-link"
              {...props}
            >
              {children}
            </a>
          ),

          table: ({ children, ...props }) => (
            <table className="markdown-table" {...props}>
              {children}
            </table>
          ),

          img: ({ src, alt, ...props }) => (
            <img
              src={src}
              alt={alt || ""}
              className="markdown-image"
              {...props}
            />
          ),

          ul: ({ children, ...props }) => (
            <ul className="markdown-ul" {...props}>
              {children}
            </ul>
          ),

          ol: ({ children, ...props }) => (
            <ol className="markdown-ol" {...props}>
              {children}
            </ol>
          ),

          blockquote: ({ children, ...props }) => (
            <blockquote className="markdown-blockquote" {...props}>
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
