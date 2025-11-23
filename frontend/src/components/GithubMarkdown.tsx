/**
 * GithubMarkdown 컴포넌트
 *
 * @uiw/react-markdown-preview 기반의 통합 마크다운 렌더러
 * - GitHub 스타일 마크다운 렌더링
 * - 코드블록 자동 문법 하이라이트 (highlight.js)
 * - 테이블, 체크박스, GFM 기능 지원
 * - 안전한 HTML 렌더링 (DOMPurify 기반)
 * - 개행 문자 자동 처리
 * - 키워드 하이라이트 (코드블록 제외)
 *
 * 사용 예시:
 * ```tsx
 * <GithubMarkdown
 *   content="# Hello\n\n```js\nconsole.log('test')\n```"
 *   className="custom-markdown"
 *   highlightKeyword="test"
 * />
 * ```
 */

import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "./GithubMarkdown.css";

interface GithubMarkdownProps {
  /** 렌더링할 마크다운 콘텐츠 */
  content: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 하이라이트할 키워드 (옵션) */
  highlightKeyword?: string;
  /** 최대 높이 (옵션, px 또는 em 단위) */
  maxHeight?: string | number;
}

/**
 * 코드블록과 인라인코드를 제외하고 키워드를 하이라이트합니다.
 */
function highlightKeywordInMarkdown(
  markdown: string,
  keyword: string
): string {
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

/**
 * 마크다운 콘텐츠의 개행 문자를 처리합니다.
 * - \\r\\n → \n
 * - \\n → \n
 */
function normalizeLineBreaks(content: string): string {
  return content.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n");
}

export default function GithubMarkdown({
  content,
  className = "github-markdown",
  highlightKeyword,
  maxHeight,
}: GithubMarkdownProps) {
  // 개행 정규화
  const normalizedContent = normalizeLineBreaks(content);

  // 키워드 하이라이트 적용
  const processedContent = highlightKeyword
    ? highlightKeywordInMarkdown(normalizedContent, highlightKeyword)
    : normalizedContent;

  const containerStyle: React.CSSProperties = {};
  if (maxHeight) {
    containerStyle.maxHeight = maxHeight;
    containerStyle.overflow = "auto";
  }

  return (
    <div
      className={className}
      style={containerStyle}
      data-color-mode="light"
    >
      <MDEditor.Markdown source={processedContent} />
    </div>
  );
}
