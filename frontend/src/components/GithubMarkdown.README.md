# GithubMarkdown 컴포넌트

GitHub 스타일의 마크다운을 렌더링하는 통합 컴포넌트입니다.

## 설치 및 임포트

```tsx
import GithubMarkdown from "@/components/GithubMarkdown";
```

## 기본 사용

### 1. 단순 마크다운 렌더링

```tsx
<GithubMarkdown content="# 안녕하세요\n\n이것은 **마크다운**입니다." />
```

### 2. 코드블록 포함

```tsx
const markdown = `
# JavaScript 예제

\`\`\`javascript
const greeting = () => {
  console.log('Hello, World!');
};
\`\`\`
`;

<GithubMarkdown content={markdown} />
```

### 3. 키워드 하이라이트

```tsx
const content = "이것은 테스트입니다. 테스트는 중요합니다.";

// "테스트"가 노란색으로 하이라이트됨 (코드블록 제외)
<GithubMarkdown
  content={content}
  highlightKeyword="테스트"
/>
```

### 4. 커스텀 CSS 클래스

```tsx
<GithubMarkdown
  content={content}
  className="custom-markdown"
/>
```

CSS:
```css
.custom-markdown h1 {
  color: #0969da;
  border-bottom: 2px solid #0969da;
}

.custom-markdown code {
  background: #f0f1f3;
}
```

### 5. 최대 높이 설정 (스크롤 활성화)

```tsx
<GithubMarkdown
  content={veryLongContent}
  maxHeight="400px"
/>
```

## 지원되는 마크다운 문법

### 제목

```markdown
# H1 제목
## H2 제목
### H3 제목
#### H4 제목
##### H5 제목
###### H6 제목
```

### 텍스트 스타일

```markdown
**굵은 텍스트**
*기울임꼴*
***굵은 기울임꼴***
~~삭제선~~
```

### 링크

```markdown
[텍스트](https://example.com)
[제목 포함 링크](https://example.com "제목")
```

### 이미지

```markdown
![대체 텍스트](https://example.com/image.jpg)
![제목 포함](https://example.com/image.jpg "이미지 제목")
```

### 코드

```markdown
인라인 코드: `const x = 1;`

코드 블록:
\`\`\`javascript
const greeting = () => {
  console.log('Hello!');
};
\`\`\`
```

### 리스트

```markdown
순서 없는 리스트:
- 항목 1
- 항목 2
  - 중첩 항목
- 항목 3

순서 있는 리스트:
1. 첫 번째
2. 두 번째
3. 세 번째
```

### 체크박스

```markdown
- [x] 완료된 항목
- [ ] 미완료 항목
```

### 테이블

```markdown
| 헤더 1 | 헤더 2 | 헤더 3 |
|--------|--------|--------|
| 셀 1-1 | 셀 1-2 | 셀 1-3 |
| 셀 2-1 | 셀 2-2 | 셀 2-3 |
```

### 인용문

```markdown
> 이것은 인용문입니다.
> 여러 줄이 가능합니다.
>
> > 중첩된 인용문도 가능합니다.
```

### 구분선

```markdown
---
***
___
```

## 실제 사용 예시

### ReviewComment.tsx

```tsx
import GithubMarkdown from "../GithubMarkdown";

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

  return (
    <div className={`review-comment ${isMain ? "main" : "reply"}`}>
      {/* 헤더 및 코드 스니펫 */}

      {/* 마크다운 렌더링 */}
      <div className="comment-content">
        <GithubMarkdown
          content={content}
          highlightKeyword={keyword}
        />
      </div>
    </div>
  );
}
```

### Detail.tsx

```tsx
import GithubMarkdown from "../components/GithubMarkdown";

function MarkdownComment({ text, keyword }: { text: string; keyword?: string }) {
  let content = text ?? "";

  // URL 자동 마크다운 변환
  const urlPattern = /(?<!\[)(?<!\()https?:\/\/[^\s\)]+/g;
  if (!content.includes("[") || !content.includes("](")) {
    content = content.replace(urlPattern, (url) => `[${url}](${url})`);
  }

  return (
    <div className="review-comment">
      <GithubMarkdown
        content={content}
        highlightKeyword={keyword}
      />
    </div>
  );
}
```

### MarkdownPreview.tsx

```tsx
import GithubMarkdown from "../GithubMarkdown";

export default function MarkdownPreview({
  content,
  className = "markdown-preview",
  highlightKeyword,
}: {
  content: string;
  className?: string;
  highlightKeyword?: string;
}) {
  return (
    <GithubMarkdown
      content={content}
      className={className}
      highlightKeyword={highlightKeyword}
    />
  );
}
```

## Props 명세

```typescript
interface GithubMarkdownProps {
  /**
   * 렌더링할 마크다운 콘텐츠
   * @example "# Hello\n\n코드: `test`"
   */
  content: string;

  /**
   * 추가 CSS 클래스
   * @default "github-markdown"
   * @example "comment-content custom-markdown"
   */
  className?: string;

  /**
   * 하이라이트할 키워드
   * - 코드블록 내 키워드는 제외
   * - 인라인 코드 내 키워드도 제외
   * @example "테스트"
   */
  highlightKeyword?: string;

  /**
   * 최대 높이 설정 (스크롤 활성화)
   * @example "400px" | "30em"
   */
  maxHeight?: string | number;
}
```

## 스타일 커스터마이징

### 기본 클래스

컴포넌트는 `github-markdown` 클래스로 래핑됩니다.

```css
.github-markdown {
  font-size: 16px;
  line-height: 1.6;
  color: #24292e;
}
```

### 요소별 스타일링

```css
/* 제목 */
.github-markdown h1,
.github-markdown h2 {
  border-bottom: 1px solid #d0d7de;
  padding-bottom: 0.3em;
}

/* 링크 */
.github-markdown a {
  color: #0969da;
  text-decoration: none;
}

.github-markdown a:hover {
  text-decoration: underline;
}

/* 코드 */
.github-markdown code {
  background-color: #f6f8fa;
  border: 1px solid #d0d7de;
  padding: 2px 6px;
  border-radius: 6px;
}

/* 코드 블록 */
.github-markdown pre {
  background-color: #f6f8fa;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
}

/* 테이블 */
.github-markdown table {
  border-collapse: collapse;
  width: 100%;
}

.github-markdown th,
.github-markdown td {
  border: 1px solid #d0d7de;
  padding: 12px 13px;
  text-align: left;
}

.github-markdown thead {
  background-color: #f6f8fa;
}

/* 인용문 */
.github-markdown blockquote {
  border-left: 4px solid #d0d7de;
  color: #57606a;
  padding: 0 1em;
  margin: 0 0 16px 0;
}

/* 키워드 하이라이트 */
.github-markdown mark.keyword-highlight {
  background-color: #fff59d;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 600;
}
```

## 주의사항

### 개행 처리

자동으로 다음 문자들이 처리됩니다:
- `\\r\\n` → `\n`
- `\\n` → `\n`

```tsx
// 모두 동일하게 렌더링됨
<GithubMarkdown content="첫 줄\n두 번째 줄" />
<GithubMarkdown content="첫 줄\\n두 번째 줄" />
<GithubMarkdown content="첫 줄\\r\\n두 번째 줄" />
```

### 키워드 하이라이트 제외

다음 영역은 키워드 하이라이트에서 제외됩니다:
- ` ```...``` ` 코드블록
- `` `...` `` 인라인 코드

### 보안

- HTML injection은 자동으로 방지됩니다
- 외부 스크립트 실행은 불가능합니다
- 마크다운 문법만 지원됩니다

## 지원되는 코드 언어

highlight.js를 사용하여 자동 감지됩니다:

- **웹:** JavaScript, TypeScript, HTML, CSS, SASS, Less
- **백엔드:** Python, Java, PHP, Ruby, Go, Rust, C, C++, C#, Kotlin
- **SQL:** SQL, MySQL, PostgreSQL
- **스크립트:** Bash, Shell, PowerShell
- **데이터:** JSON, YAML, XML
- **기타:** Markdown, Plaintext 등 200+ 언어

## 성능 최적화

### useMemo로 최적화

```tsx
import { useMemo } from 'react';

export default function MyComponent() {
  const memoizedContent = useMemo(() => {
    // 복잡한 마크다운 생성 로직
    return generateMarkdown(data);
  }, [data]);

  return <GithubMarkdown content={memoizedContent} />;
}
```

### 대용량 콘텐츠

```tsx
// maxHeight로 스크롤 활성화
<GithubMarkdown
  content={veryLongMarkdown}
  maxHeight="500px"
/>
```

## 트러블슈팅

### 코드블록이 렌더링되지 않음

백틱 문자열 확인:

```tsx
// ✅ 올바름
<GithubMarkdown content={`
\`\`\`javascript
code here
\`\`\`
`} />

// ❌ 잘못됨 (이스케이프 부족)
<GithubMarkdown content="```javascript\ncode\n```" />
```

### 스타일이 적용되지 않음

className 확인:

```tsx
// ✅ 올바름
<GithubMarkdown
  content={content}
  className="github-markdown custom-class"
/>

// CSS
.custom-class code {
  /* 스타일 */
}
```

### 개행이 안 되는 경우

GithubMarkdown이 자동 처리합니다:

```tsx
// 모두 정상 작동
<GithubMarkdown content="줄1\n줄2" />
<GithubMarkdown content="줄1\\n줄2" />
<GithubMarkdown content="줄1\\r\\n줄2" />
```

## 라이선스

MIT

---

**마지막 업데이트:** 2024-11-23
**버전:** 1.0.0
