/**
 * MarkdownPreview 컴포넌트
 *
 * GitHub 스타일 마크다운을 렌더링하는 컴포넌트
 * @uiw/react-markdown-preview 기반
 *
 * 사용 예시:
 * <MarkdownPreview content="# Hello\n\n코드: `test`" />
 */

import GithubMarkdown from "../GithubMarkdown";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
  highlightKeyword?: string;
}

export default function MarkdownPreview({
  content,
  className = "markdown-preview",
  highlightKeyword,
}: MarkdownPreviewProps) {
  return (
    <GithubMarkdown
      content={content}
      className={className}
      highlightKeyword={highlightKeyword}
    />
  );
}
