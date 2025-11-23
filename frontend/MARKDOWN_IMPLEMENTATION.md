# Markdown 렌더링 및 코드 하이라이팅 구현 가이드

GitHub PR 코멘트처럼 아름답게 마크다운을 렌더링하는 완전한 가이드입니다.

## 📋 목차

1. [설치 항목](#설치-항목)
2. [주요 기능](#주요-기능)
3. [구현 구조](#구현-구조)
4. [사용 방법](#사용-방법)
5. [보안 고려사항](#보안-고려사항)
6. [커스터마이징](#커스터마이징)

---

## 설치 항목

### 이미 설치된 패키지
```bash
npm list | grep -E "react-markdown|remark-gfm|react-syntax-highlighter"
```

다음 패키지들이 설치되어 있습니다:
- ✅ `react-markdown@10.1.0` - 마크다운 파서
- ✅ `remark-gfm@4.0.1` - GitHub Flavored Markdown 플러그인
- ✅ `react-syntax-highlighter@16.1.0` - 문법 하이라이팅
- ✅ `rehype-raw@7.0.0` - HTML 허용 (제한적)

### 새로 추가된 패키지
```bash
npm install rehype-sanitize --save
```

**설치된 패키지:**
- 🆕 `rehype-sanitize` - XSS 방지를 위한 HTML 새니타이징

---

## 주요 기능

### 1️⃣ GitHub 스타일 마크다운 렌더링
```markdown
# 제목 1
## 제목 2
### 제목 3

일반 텍스트는 여기에 올 수 있습니다.

**굵은 텍스트**, *이탤릭*, ***굵은 이탤릭***

- 불릿 리스트 항목 1
- 불릿 리스트 항목 2
  - 중첩된 항목

1. 번호 리스트 항목 1
2. 번호 리스트 항목 2
```

### 2️⃣ 문법 하이라이팅이 포함된 코드 블록
```java
public class Cars {
    private List<Car> cars;

    public void moveAll() {
        cars.forEach(Car::move);
    }
}
```

### 3️⃣ GitHub 스타일 테이블
```markdown
| 컬럼 1 | 컬럼 2 |
|--------|--------|
| 셀 1-1 | 셀 1-2 |
| 셀 2-1 | 셀 2-2 |
```

### 4️⃣ 인용문
```markdown
> 이것은 인용문입니다.
> 여러 줄로 지속될 수 있습니다.
```

### 5️⃣ 체크박스 (GFM 지원)
```markdown
- [x] 완료된 항목
- [ ] 완료되지 않은 항목
```

### 6️⃣ 자동 링크 변환
마크다운 형식의 링크 또는 순수 URL이 자동으로 클릭 가능한 링크로 변환됩니다.

### 7️⃣ XSS 방지
`rehypeSanitize`를 통해 위험한 HTML 태그가 자동으로 제거됩니다.

---

## 구현 구조

### 파일 구조
```
src/components/ThreadedReviewList/
├── ReviewComment.tsx          # 마크다운 렌더링 메인 컴포넌트
├── ReviewComment.css          # GitHub 스타일 CSS
└── ReviewComment.test.tsx     # (선택) 테스트
```

### ReviewComment.tsx의 주요 부분

#### 1. Import 영역
```typescript
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { github as githubStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
```

#### 2. ReactMarkdown 설정
```typescript
<ReactMarkdown
  remarkPlugins={[remarkGfm]}  // GitHub Flavored Markdown 지원
  rehypePlugins={[
    rehypeRaw,                   // HTML 허용
    [rehypeSanitize, { /* 설정 */ }]  // XSS 방지
  ]}
  components={{
    // 커스텀 컴포넌트 (아래 참고)
  }}
>
  {markdownContent}
</ReactMarkdown>
```

#### 3. 코드 블록 커스텀 렌더러
```typescript
code: ({ node, inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "text";
  const isInline = inline === true;

  // 인라인 코드: `코드`
  if (isInline) {
    return <code className="inline-code">{children}</code>;
  }

  // 코드 블록: ```java ... ```
  const codeString = String(children).replace(/\n$/, "");
  return (
    <div className="code-block-wrapper">
      <div className="code-block-lang">{language}</div>
      <SyntaxHighlighter
        language={language}
        style={githubStyle}
        className="code-block-highlighter"
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}
```

---

## 사용 방법

### 기본 사용
```typescript
import ReviewComment from '@/components/ThreadedReviewList/ReviewComment';

// 데이터 예시
const comment = {
  comment: `
# 제안: Cars 클래스 추가

현재 코드의 중심 데이터는 자동차 목록입니다.
이를 \`Cars\` 클래스로 관리하면 어떨까요?

\`\`\`java
public class Cars {
    private List<Car> cars;

    public List<Car> getWinner() {
        // 우승자 찾기
    }
}
\`\`\`

더 자세한 내용은 [여기](https://github.com/example)를 참고하세요.
  `,
  reviewer: "Alice",
  submitted_at: "2024-11-22T10:00:00Z",
  repo: "user/repository",
  file_path: "src/main/java/Cars.java",
  code_snippet: "-    List<Car> cars\n+    Car[] cars",
  url: "https://github.com/example/pulls/123",
  pr_number: 123,
};

export default function ReviewPage() {
  return (
    <ReviewComment
      comment={comment}
      isMain={true}
      keyword="Cars"  // 선택사항: 하이라이트할 키워드
    />
  );
}
```

### Props
```typescript
interface ReviewCommentProps {
  comment: ThreadComment;  // 댓글 데이터
  keyword?: string;        // 하이라이트할 키워드
  isMain: boolean;         // 메인 댓글인지 여부
}

interface ThreadComment {
  comment: string;         // 마크다운 형식의 텍스트
  reviewer: string;        // 리뷰어 이름
  submitted_at: string;    // ISO 날짜 형식
  repo?: string;           // 리포지토리 이름
  file_path?: string;      // 파일 경로
  code_snippet?: string;   // Diff 형식의 코드
  url?: string;            // PR 링크
  pr_number?: number;      // PR 번호
}
```

---

## 보안 고려사항

### 1. XSS (Cross-Site Scripting) 방지
```typescript
// rehypeSanitize 설정으로 위험한 태그 자동 제거
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
```

**안전한 태그만 허용:**
- ✅ 일반 텍스트, 제목, 단락
- ✅ 리스트, 테이블
- ✅ 링크, 이미지 (src, href 속성만 허용)
- ✅ 코드 블록
- ❌ script, iframe, onclick 등 위험한 태그는 제거됨

### 2. URL 링크 안전성
```typescript
// 링크 자동 렌더링 시 안전한 프로토콜만 사용
a: ({ href, children, ...props }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"  // 보안: window.opener 접근 방지
    className="markdown-link"
  >
    {children}
  </a>
)
```

### 3. 입력 검증
```typescript
// URL 패턴 검증 (마크다운 링크로 변환 전)
const urlPattern = /(?<!\[)(?<!\()https?:\/\/[^\s\)]+/g;
if (!content.includes("[") || !content.includes("](")) {
  content = content.replace(urlPattern, (url) => `[${url}](${url})`);
}
```

---

## 커스터마이징

### 색상 테마 변경
[ReviewComment.css](./ReviewComment.css)에서 다음 색상 변수를 수정하세요:

```css
/* 링크 색상 */
.markdown-link {
  color: #0969da;  /* 변경 */
}

/* 코드 블록 배경 */
.code-block-wrapper {
  background-color: #f6f8fa;  /* 변경 */
}

/* 테이블 헤더 배경 */
.markdown-table thead {
  background-color: #f6f8fa;  /* 변경 */
}
```

### 문법 하이라이팅 테마 변경
```typescript
import { github } from "react-syntax-highlighter/dist/esm/styles/prism";
// 다른 테마로 변경:
// import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

<SyntaxHighlighter
  style={github}  // 여기서 변경
  // ...
>
```

### 추가 커스텀 컴포넌트
```typescript
components={{
  // ... 기존 컴포넌트들

  // 새로운 커스텀 렌더러 추가
  hr: () => <hr className="custom-hr" />,

  strong: ({ children }) => (
    <strong className="bold-text">{children}</strong>
  ),
}}
```

---

## 지원하는 Markdown 문법

| 문법 | 예시 | 지원 |
|------|------|------|
| 제목 | `# Heading 1` | ✅ |
| 굵은 텍스트 | `**bold**` | ✅ |
| 이탤릭 | `*italic*` | ✅ |
| 링크 | `[text](url)` | ✅ |
| 이미지 | `![alt](url)` | ✅ |
| 코드 (인라인) | `` `code` `` | ✅ |
| 코드 블록 | ` ```java ... ``` ` | ✅ |
| 리스트 (불릿) | `- item` | ✅ |
| 리스트 (번호) | `1. item` | ✅ |
| 테이블 | `\| col \|` | ✅ (GFM) |
| 체크박스 | `- [ ] task` | ✅ (GFM) |
| 인용문 | `> quote` | ✅ |
| 수평선 | `---` | ✅ |
| 취소선 | `~~text~~` | ✅ (GFM) |
| 문법 하이라이팅 | 30+ 언어 | ✅ |

---

## 지원하는 프로그래밍 언어

react-syntax-highlighter의 Prism 스타일은 다음 언어를 지원합니다:

### 웹 개발
- JavaScript, TypeScript, HTML, CSS, SCSS, LESS, JSON
- React, Vue, Angular, Svelte
- GraphQL, YAML, TOML

### 백엔드
- Python, Java, C#, C++, C, Ruby, PHP, Go, Rust
- Kotlin, Swift, Objective-C

### 데이터
- SQL, MySQL, PostgreSQL, MongoDB
- XML, YAML, CSV

### 마크업
- Markdown, LaTeX, AsciiDoc

### 예시:
````markdown
```javascript
const hello = () => console.log('Hello World');
```

```python
def hello():
    print("Hello World")
```

```sql
SELECT * FROM users WHERE active = true;
```
````

---

## 성능 최적화

### 1. useMemo를 통한 처리 캐싱
```typescript
const processedComment = useMemo(() => {
  // URL 변환, 키워드 하이라이트 등
  // props 변경 시에만 재계산
}, [comment.comment, keyword]);
```

### 2. 큰 마크다운의 경우 virtual scrolling 고려
```bash
npm install react-window
```

### 3. 코드 블록 최적화
- 긴 코드는 라인 제한 설정 가능
- 자동 폴드 기능 추가 가능

---

## 문제 해결

### 코드 블록이 렌더링되지 않음
1. 마크다운에 ` ``` ` 형식 사용 확인
2. 언어 지정: ` ```java `
3. rehypeRaw 플러그인 확인

### 문법 하이라이팅 색상이 이상함
1. CSS 로드 순서 확인
2. `!important` 규칙 확인
3. 테마 변경 시도

### XSS 경고가 발생함
1. rehypeSanitize 설정 확인
2. 허용되는 태그/속성 리스트 확인
3. 사용자 입력 데이터 검증

### 성능이 느림
1. useMemo 사용 확인
2. 마크다운 문자열 길이 확인
3. 이미지 최적화 (lazy loading 추가 가능)

---

## 추가 리소스

- [react-markdown 문서](https://github.com/remarkjs/react-markdown)
- [remark-gfm 문서](https://github.com/remarkjs/remark-gfm)
- [react-syntax-highlighter 문서](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- [rehype-sanitize 문서](https://github.com/rehypejs/rehype-sanitize)
- [GitHub Flavored Markdown 명세](https://github.github.com/gfm/)

---

## 예제 데이터

완전한 예제는 다음과 같습니다:

```typescript
const exampleComment: ThreadComment = {
  comment: `
## 🎯 코드 개선 제안

여러 클래스가 메서드 파라미터로 \`Car[]\` 배열을 받고 있는 것을 보니,
지금 코드의 중심 데이터는 자동차들의 목록인 것 같습니다.
이 목록 자체를 \`Cars\`라는 클래스로 만들어 관리하면 어떨까요?

### 현재 코드의 문제점

- 자동차 배열을 직접 다루는 클래스들이 많음
- 배열 관리 로직이 산재되어 있음
- 캡슐화가 약함

### 제안하는 개선

\`Cars\` 클래스가 내부에 \`List<Car>\`를 가지고:
- 우승자를 찾거나
- 모든 자동차를 움직이는 등

자동차 목록에 관련된 모든 책임을 직접 처리한다면,
\`RaceManager\`나 \`Winner\` 같은 클래스가
자동차 목록을 직접 다루는 게 아니라
\`Cars\`라는 잘 만들어진 객체에게 요청만 보내면 됩니다.

이렇게 하면 좀 더 객체지향적인 코드가 될 수 있을 것 같아요!

### 예제 코드

\`\`\`java
public class Cars {
    private List<Car> cars;

    public void moveAll() {
        cars.forEach(Car::move);
    }

    public Car getWinner() {
        return cars.stream()
            .max(Comparator.comparingInt(Car::getDistance))
            .orElse(null);
    }
}
\`\`\`

### 참고

더 자세한 내용은 [여기](https://github.com/example)를 확인하세요.

| 장점 | 단점 |
|------|------|
| 캡슐화 증대 | 클래스 추가 |
| 책임 분리 | 초기 학습 비용 |
| 테스트 용이 | 약간의 복잡도 |

> **요점**: 객체지향 설계의 기본은 책임의 분리와 캡슐화입니다.
  `,
  reviewer: "Senior Developer",
  submitted_at: new Date().toISOString(),
  repo: "user/racing-game",
  file_path: "src/main/java/Car.java",
  code_snippet: "-    Car[] cars\n+    List<Car> cars",
  url: "https://github.com/example/pulls/123",
  pr_number: 123,
};
```

---

## 라이선스

MIT
