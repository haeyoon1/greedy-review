# GithubMarkdown 컴포넌트 - 실전 사용 가이드

## 🎯 빠른 시작

### 1단계: 임포트

```tsx
import GithubMarkdown from "@/components/GithubMarkdown";
```

### 2단계: 사용

```tsx
<GithubMarkdown content="# 안녕하세요\n\n마크다운 **텍스트**입니다." />
```

### 3단계: Props 추가 (선택)

```tsx
<GithubMarkdown
  content={markdown}
  className="custom-style"
  highlightKeyword="keyword"
  maxHeight="400px"
/>
```

---

## 📖 실제 사용 사례

### Case 1: 간단한 댓글 렌더링

**파일:** `ReviewComment.tsx`

```tsx
import GithubMarkdown from "../GithubMarkdown";

export default function ReviewComment({ comment, keyword, isMain }) {
  return (
    <div className={`review-comment ${isMain ? "main" : "reply"}`}>
      <div className="comment-header">{/* ... */}</div>
      <div className="comment-content">
        <GithubMarkdown
          content={comment.comment}
          highlightKeyword={keyword}
        />
      </div>
    </div>
  );
}
```

**장점:**
- 한 줄의 간단한 컴포넌트
- 자동 문법 하이라이팅
- 키워드 하이라이트 포함

---

### Case 2: URL 자동 변환 + 마크다운

**파일:** `Detail.tsx`

```tsx
import GithubMarkdown from "../components/GithubMarkdown";

function MarkdownComment({ text, keyword }) {
  let content = text ?? "";

  // URL을 마크다운 링크로 변환
  const urlPattern = /(?<!\[)(?<!\()https?:\/\/[^\s\)]+/g;
  if (!content.includes("[") || !content.includes("](")) {
    content = content.replace(urlPattern, (url) => `[${url}](${url})`);
  }

  // GithubMarkdown이 개행을 자동 처리
  return (
    <div className="review-comment">
      <GithubMarkdown content={content} highlightKeyword={keyword} />
    </div>
  );
}
```

**흐름:**
1. URL 감지
2. URL을 마크다운 링크 `[url](url)` 형식으로 변환
3. GithubMarkdown에서 렌더링

---

### Case 3: 미리보기 래퍼

**파일:** `MarkdownPreview.tsx`

```tsx
import GithubMarkdown from "../GithubMarkdown";

export default function MarkdownPreview({
  content,
  className = "markdown-preview",
  highlightKeyword,
}) {
  return (
    <GithubMarkdown
      content={content}
      className={className}
      highlightKeyword={highlightKeyword}
    />
  );
}

// 사용
<MarkdownPreview
  content={userInput}
  className="comment-preview"
/>
```

**특징:**
- GithubMarkdown의 얇은 래퍼
- 기존 MarkdownPreview 인터페이스 유지
- 필요시 커스텀 로직 추가 가능

---

## 🎨 스타일 커스터마이징 예시

### 기본 스타일 오버라이드

```tsx
// ReviewComment.tsx
<GithubMarkdown
  content={content}
  className="comment-markdown"
/>

// ReviewComment.css
.comment-markdown {
  font-size: 14px;
  line-height: 1.8;
}

.comment-markdown h1,
.comment-markdown h2 {
  border-bottom: 2px solid #0969da;
  padding-bottom: 8px;
  margin-bottom: 16px;
}

.comment-markdown code {
  background-color: #f0f1f3;
  color: #e83e8c;
  padding: 2px 6px;
  border-radius: 3px;
}

.comment-markdown pre {
  background-color: #f6f8fa;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
}

.comment-markdown a {
  color: #0969da;
  text-decoration: none;
  border-bottom: 1px solid #0969da;
  transition: color 0.2s;
}

.comment-markdown a:hover {
  color: #0860ca;
  text-decoration: underline;
}

.comment-markdown table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

.comment-markdown th,
.comment-markdown td {
  border: 1px solid #d0d7de;
  padding: 12px;
  text-align: left;
}

.comment-markdown thead {
  background-color: #f6f8fa;
  font-weight: 600;
}

.comment-markdown tbody tr:nth-child(even) {
  background-color: #f6f8fa;
}

.comment-markdown blockquote {
  border-left: 4px solid #0969da;
  padding-left: 16px;
  color: #57606a;
  margin: 16px 0;
}

.comment-markdown mark.keyword-highlight {
  background-color: #fff3cd;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 600;
}
```

---

## 📝 마크다운 콘텐츠 예시

### 전체 기능을 보여주는 마크다운

```markdown
# 제목 1

## 제목 2

### 제목 3

텍스트 스타일:
- **굵은 텍스트**
- *기울임꼴*
- ***굵고 기울임***
- ~~삭제선~~
- `인라인 코드`

## 링크

[링크 텍스트](https://example.com)

## 이미지

![대체 텍스트](https://example.com/image.jpg)

## 코드 블록

### JavaScript

\`\`\`javascript
const greeting = (name) => {
  console.log(`Hello, ${name}!`);
  return true;
};

greeting("World");
\`\`\`

### Python

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))
\`\`\`

### HTML

\`\`\`html
<div class="container">
  <h1>Title</h1>
  <p>Content here</p>
</div>
\`\`\`

## 리스트

순서 없는 리스트:
- 항목 1
- 항목 2
  - 중첩 항목 2-1
  - 중첩 항목 2-2
- 항목 3

순서 있는 리스트:
1. 첫 번째
2. 두 번째
3. 세 번째

## 체크박스

- [x] 완료된 작업
- [ ] 미완료 작업
- [x] 다시 확인된 작업

## 테이블

| 이름 | 역할 | 경험 |
|------|------|------|
| Alice | 개발자 | 5년 |
| Bob | 디자이너 | 3년 |
| Carol | PM | 7년 |

## 인용문

> 훌륭한 코드는 자기 설명적이다.
> - 깨끗한 코드

> 첫 번째 규칙: 읽기 쉬워야 한다.
> 두 번째 규칙: 이해하기 쉬워야 한다.
> > 중첩된 인용문도 가능합니다.

## 구분선

---

## 혼합 예시

여기는 **중요한** `코드`를 포함하는 단락입니다.

다음은 코드와 설명:
\`\`\`javascript
// 이 함수는 배열의 합을 구합니다
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
\`\`\`

> **참고**: 위의 함수는 효율적이고 읽기 쉽습니다.

| 함수 | 시간복잡도 | 공간복잡도 |
|------|-----------|----------|
| `sum()` | O(n) | O(1) |
| `map()` | O(n) | O(n) |
```

**렌더링 결과:**

이 모든 요소가 GitHub 스타일로 자동 렌더링됩니다.

---

## ⚙️ Props 상세 설명

### content (필수)

마크다운 문자열입니다.

```tsx
// 기본
<GithubMarkdown content="# Hello" />

// 템플릿 리터럴
<GithubMarkdown
  content={`
# Title

\`\`\`js
code here
\`\`\`
`}
/>

// 변수
const markdown = "# Dynamic content";
<GithubMarkdown content={markdown} />
```

### className (선택)

CSS 클래스를 추가합니다.

```tsx
// 기본값
<GithubMarkdown content={text} />
// className = "github-markdown"

// 커스텀 클래스
<GithubMarkdown
  content={text}
  className="github-markdown custom-style"
/>

// CSS에서
.custom-style h1 {
  color: #0969da;
}
```

### highlightKeyword (선택)

특정 키워드를 하이라이트합니다. 코드블록과 인라인 코드는 제외됩니다.

```tsx
// 일반 텍스트에서 "test" 하이라이트
<GithubMarkdown
  content="This is a test. Test is important."
  highlightKeyword="test"
/>
// 결과: "test"와 "Test"가 노란색으로 표시됨

// 코드블록 내의 "test"는 하이라이트 안 됨
<GithubMarkdown
  content={`
Text with test.

\`\`\`js
const test = 1;  // 여기는 하이라이트 안 됨
\`\`\`
`}
  highlightKeyword="test"
/>

// 인라인 코드 내의 "test"는 하이라이트 안 됨
<GithubMarkdown
  content="Text and \`test\` code."
  highlightKeyword="test"
/>
```

### maxHeight (선택)

스크롤을 활성화할 최대 높이입니다.

```tsx
// 스크롤 없음
<GithubMarkdown content={text} />

// 400px로 제한 (스크롤 활성화)
<GithubMarkdown
  content={veryLongText}
  maxHeight="400px"
/>

// em 단위
<GithubMarkdown
  content={veryLongText}
  maxHeight="30em"
/>

// 숫자 (px로 변환)
<GithubMarkdown
  content={veryLongText}
  maxHeight={500}
/>
```

---

## 🔍 디버깅 팁

### 1. 렌더링 안 되는 마크다운

**문제:** 코드블록이 렌더링 안 됨

```tsx
// ❌ 잘못된 백틱
<GithubMarkdown content="```js\ncode\n```" />

// ✅ 올바른 백틱 (이스케이프 필요)
<GithubMarkdown content={`
\`\`\`js
code here
\`\`\`
`} />
```

### 2. 개행이 안 되는 경우

**문제:** 줄 바꿈이 안 됨

```tsx
// 자동 정규화되므로 모두 작동
<GithubMarkdown content="line1\nline2" />
<GithubMarkdown content="line1\\nline2" />
<GithubMarkdown content="line1\\r\\nline2" />
```

### 3. 키워드 하이라이트 안 됨

**문제:** 키워드가 하이라이트 안 됨

```tsx
// highlightKeyword가 빠진 경우
<GithubMarkdown content={text} />

// ✅ highlightKeyword 추가
<GithubMarkdown
  content={text}
  highlightKeyword="keyword"
/>

// undefined인 경우도 작동
<GithubMarkdown
  content={text}
  highlightKeyword={undefined}
/>
```

### 4. 스타일이 적용 안 됨

**문제:** CSS 클래스 스타일이 적용 안 됨

```tsx
// 클래스 확인
<GithubMarkdown
  content={text}
  className="my-style"
/>

// CSS에서 선택자 확인 (`.my-style code` 등)
.my-style code {
  color: red;
}
```

---

## 🚀 성능 최적화

### useMemo로 마크다운 메모이제이션

```tsx
import { useMemo } from 'react';
import GithubMarkdown from "@/components/GithubMarkdown";

export default function MyComponent({ data }) {
  // 복잡한 마크다운 생성을 메모이제이션
  const markdown = useMemo(() => {
    return `
# ${data.title}

${data.description}

\`\`\`json
${JSON.stringify(data.payload, null, 2)}
\`\`\`
    `;
  }, [data]);

  return <GithubMarkdown content={markdown} />;
}
```

### 조건부 렌더링

```tsx
export default function ReviewComment({ comment, showMarkdown }) {
  return (
    <div>
      {showMarkdown && (
        <GithubMarkdown content={comment.text} />
      )}
    </div>
  );
}
```

### 대용량 콘텐츠

```tsx
export default function LargeDocument({ content }) {
  return (
    <GithubMarkdown
      content={content}
      maxHeight="600px"  // 스크롤 활성화
    />
  );
}
```

---

## 🎬 실제 코드 예시

### 댓글 시스템 통합

```tsx
import GithubMarkdown from "@/components/GithubMarkdown";
import { useState } from "react";

export default function CommentThread() {
  const [comments] = useState([
    {
      id: 1,
      author: "Alice",
      text: "좋은 제안입니다.\n\n```js\nconst example = () => {};\n```",
      keyword: "제안"
    },
    {
      id: 2,
      author: "Bob",
      text: "동의합니다. 테이블로 비교해봅시다:\n\n| 방법 | 장점 |\n|------|------|\n| A | 빠름 |\n| B | 명확함 |",
      keyword: "테이블"
    }
  ]);

  return (
    <div className="comment-thread">
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <div className="comment-header">
            <strong>{comment.author}</strong>
          </div>
          <GithubMarkdown
            content={comment.text}
            className="comment-body"
            highlightKeyword={comment.keyword}
          />
        </div>
      ))}
    </div>
  );
}
```

---

## 📚 추가 자료

- **전체 마크다운 명세**: [GithubMarkdown.README.md](./GithubMarkdown.README.md)
- **마이그레이션 가이드**: [MARKDOWN_MIGRATION_GUIDE.md](../MARKDOWN_MIGRATION_GUIDE.md)
- **구현 요약**: [MARKDOWN_IMPLEMENTATION_SUMMARY.md](../MARKDOWN_IMPLEMENTATION_SUMMARY.md)

---

**마지막 업데이트:** 2024-11-23
**버전:** 1.0.0
