# Markdown 렌더링 & 코드 하이라이팅 구현 완료 🎉

GitHub PR 코멘트처럼 아름다운 마크다운 렌더링을 성공적으로 구현했습니다!

---

## 📦 설치된 패키지

```bash
npm install rehype-sanitize --save
```

**총 설치 패키지:**
- ✅ `react-markdown@10.1.0` - 마크다운 파서
- ✅ `remark-gfm@4.0.1` - GitHub Flavored Markdown 지원
- ✅ `react-syntax-highlighter@16.1.0` - 코드 문법 하이라이팅
- ✅ `rehype-raw@7.0.0` - HTML 렌더링
- ✅ `rehype-sanitize` - XSS 방지 (새로 추가)

---

## 🎨 구현된 기능

### 1. 완전한 Markdown 지원
- ✅ 제목 (H1 ~ H6)
- ✅ 강조 (굵은 텍스트, 이탤릭, 취소선)
- ✅ 리스트 (불릿, 번호)
- ✅ 링크 & 이미지
- ✅ 인용문
- ✅ 테이블
- ✅ 체크박스

### 2. 코드 블록 with 문법 하이라이팅
```java
public class Cars {
    private List<Car> cars;

    public void moveAll() {
        cars.forEach(Car::move);
    }
}
```
- ✅ 30개 이상의 프로그래밍 언어 지원
- ✅ GitHub 스타일 색상 테마
- ✅ 언어 이름 배지 표시
- ✅ 코드 복사 기능 (확장 가능)

### 3. GitHub 스타일 CSS
- ✅ 현대적인 디자인
- ✅ 다크모드 대응 가능
- ✅ 반응형 레이아웃
- ✅ 스크롤바 커스터마이징

### 4. 보안 (XSS 방지)
- ✅ `rehypeSanitize`로 위험한 HTML 제거
- ✅ 안전한 태그만 허용
- ✅ 링크 보안 (`rel="noopener noreferrer"`)
- ✅ URL 검증

---

## 📁 수정/생성된 파일

### 1. [ReviewComment.tsx](./frontend/src/components/ThreadedReviewList/ReviewComment.tsx) (수정)
**주요 변경 사항:**
- Markdown 렌더링 강화
- 코드 블록 문법 하이라이팅 추가
- XSS 보안 강화
- GitHub 스타일 커스텀 컴포넌트 추가

**코드 양:** 290 줄

### 2. [ReviewComment.css](./frontend/src/components/ThreadedReviewList/ReviewComment.css) (수정)
**추가된 스타일:**
- `.code-block-wrapper` - 코드 블록 컨테이너
- `.code-block-lang` - 언어 배지
- `.code-block-highlighter` - 문법 하이라이팅 스타일
- `.markdown-table` - 테이블 스타일
- `.markdown-image` - 이미지 스타일
- `.markdown-ul`, `.markdown-ol` - 리스트 스타일
- `.markdown-blockquote` - 인용문 스타일
- Prism 토큰 색상 정의

**스타일 줄:** 240줄 추가

### 3. [MarkdownPreview.tsx](./frontend/src/components/ThreadedReviewList/MarkdownPreview.tsx) (새로 생성)
**용도:** 댓글 작성/편집 시 마크다운 미리보기

**기능:**
- ReviewComment와 동일한 렌더링 로직 재사용
- 간단한 프리뷰 용도

### 4. [MARKDOWN_IMPLEMENTATION.md](./frontend/MARKDOWN_IMPLEMENTATION.md) (새로 생성)
**내용:** 완전한 구현 가이드 문서
- 설치 방법
- 주요 기능 설명
- 사용 예제
- 보안 고려사항
- 커스터마이징 방법
- 문제 해결

---

## 🚀 사용 방법

### 기본 사용
```typescript
import ReviewComment from '@/components/ThreadedReviewList/ReviewComment';

export default function App() {
  const comment = {
    comment: `# 제안사항\n\n마크다운 형식의 텍스트\n\n\`\`\`java\ncode here\n\`\`\``,
    reviewer: "John Doe",
    submitted_at: "2024-11-22T10:00:00Z",
    repo: "user/repo",
    file_path: "src/main.java",
    url: "https://github.com/example/pulls/123",
    pr_number: 123,
  };

  return <ReviewComment comment={comment} isMain={true} />;
}
```

### Props
```typescript
interface ReviewCommentProps {
  comment: ThreadComment;  // 댓글 데이터
  keyword?: string;        // 하이라이트할 키워드
  isMain: boolean;         // 메인/답글 여부
}
```

### 마크다운 미리보기
```typescript
import MarkdownPreview from '@/components/ThreadedReviewList/MarkdownPreview';

<MarkdownPreview content={markdownText} />
```

---

## 📋 지원하는 Markdown 문법

| 문법 | 예시 | 지원 |
|------|------|------|
| 제목 | `# Heading` | ✅ |
| 굵은 텍스트 | `**bold**` | ✅ |
| 이탤릭 | `*italic*` | ✅ |
| 링크 | `[text](url)` | ✅ |
| 이미지 | `![alt](url)` | ✅ |
| 인라인 코드 | `` `code` `` | ✅ |
| 코드 블록 | ` ```java ... ``` ` | ✅ |
| 불릿 리스트 | `- item` | ✅ |
| 번호 리스트 | `1. item` | ✅ |
| 테이블 | `\| col \|` | ✅ (GFM) |
| 체크박스 | `- [ ] task` | ✅ (GFM) |
| 인용문 | `> quote` | ✅ |
| 수평선 | `---` | ✅ |
| 취소선 | `~~text~~` | ✅ (GFM) |
| 문법 하이라이팅 | 30+ 언어 | ✅ |

---

## 🛡️ 보안 기능

### XSS 방지
```typescript
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

**안전한 구조:**
- ❌ 위험한 태그 (script, iframe, onclick) 제거
- ✅ 안전한 마크다운 태그만 허용
- ✅ 링크: `target="_blank"` + `rel="noopener noreferrer"`

---

## 💻 지원하는 프로그래밍 언어

**웹 개발:** JavaScript, TypeScript, HTML, CSS, SCSS, LESS, JSON, React, Vue, Angular

**백엔드:** Python, Java, C#, C++, C, Ruby, PHP, Go, Rust, Kotlin, Swift

**데이터:** SQL, MySQL, PostgreSQL, MongoDB, XML, YAML

**마크업:** Markdown, LaTeX, AsciiDoc

---

## 🎯 코드 예제

### 완전한 예제
```typescript
import ReviewComment from '@/components/ThreadedReviewList/ReviewComment';

const exampleComment = {
  comment: `
## 🎯 코드 개선 제안

여러 클래스가 메서드 파라미터로 \`Car[]\` 배열을 받고 있습니다.
이를 \`Cars\` 클래스로 관리하면 더 객체지향적이 될 것 같습니다.

### 제안 코드

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

### 장점

- ✅ 캡슐화 증대
- ✅ 책임 분리
- ✅ 테스트 용이

자세한 내용은 [여기](https://github.com/example)를 확인하세요.

> **중요**: 객체지향 설계의 핵심은 책임의 분리입니다.
  `,
  reviewer: "Senior Developer",
  submitted_at: new Date().toISOString(),
  repo: "user/racing-game",
  file_path: "src/main/java/Cars.java",
  code_snippet: "-    Car[] cars\n+    List<Car> cars",
  url: "https://github.com/example/pulls/123",
  pr_number: 123,
};

export default function ReviewPage() {
  return (
    <ReviewComment
      comment={exampleComment}
      isMain={true}
      keyword="Cars"
    />
  );
}
```

---

## 🔧 커스터마이징

### 색상 테마 변경
[ReviewComment.css](./frontend/src/components/ThreadedReviewList/ReviewComment.css)에서:

```css
/* 링크 색상 변경 */
.markdown-link {
  color: #0969da;  /* 다른 색상으로 변경 */
}

/* 코드 블록 배경 변경 */
.code-block-wrapper {
  background-color: #f6f8fa;  /* 다른 색상으로 변경 */
}
```

### 문법 하이라이팅 테마 변경
```typescript
// 다른 테마 사용:
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

<SyntaxHighlighter
  style={atomDark}  // 테마 변경
>
```

### 추가 커스텀 컴포넌트
```typescript
components={{
  // 새로운 렌더러 추가
  hr: () => <hr className="custom-hr" />,
  strong: ({ children }) => (
    <strong className="bold">{children}</strong>
  ),
}}
```

---

## ⚡ 성능 최적화

### 1. useMemo로 URL 처리 캐싱
```typescript
const processedComment = useMemo(() => {
  // URL 변환, 키워드 하이라이트
}, [comment.comment, keyword]);
```

### 2. 큰 마크다운의 경우
```bash
npm install react-window
```

### 3. 코드 블록 최적화
- 자동 라인 제한
- 폴드 기능 추가 가능
- 복사 버튼 추가 가능

---

## 📚 문서

- **[MARKDOWN_IMPLEMENTATION.md](./frontend/MARKDOWN_IMPLEMENTATION.md)** - 완전한 구현 가이드
- **[ReviewComment.tsx](./frontend/src/components/ThreadedReviewList/ReviewComment.tsx)** - 구현 코드
- **[MarkdownPreview.tsx](./frontend/src/components/ThreadedReviewList/MarkdownPreview.tsx)** - 미리보기 컴포넌트

---

## 🔗 참고 링크

- [react-markdown 공식 문서](https://github.com/remarkjs/react-markdown)
- [remark-gfm 공식 문서](https://github.com/remarkjs/remark-gfm)
- [react-syntax-highlighter 공식 문서](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- [GitHub Flavored Markdown 명세](https://github.github.com/gfm/)

---

## ✨ 주요 특징 요약

| 기능 | 설명 | 상태 |
|------|------|------|
| 마크다운 렌더링 | GitHub 스타일 | ✅ 완료 |
| 코드 문법 하이라이팅 | 30+ 언어 지원 | ✅ 완료 |
| XSS 보안 | rehypeSanitize | ✅ 완료 |
| GitHub 스타일 CSS | 테이블, 리스트, 이미지 등 | ✅ 완료 |
| 반응형 디자인 | 모바일 지원 | ✅ 완료 |
| 자동 URL 링크화 | 순수 URL 감지 | ✅ 완료 |
| 키워드 하이라이트 | 검색 기능 지원 | ✅ 기존 기능 |

---

## 🚦 다음 단계 (선택사항)

### 추가 개선 사항:
1. **복사 버튼** - 코드 블록에 copy-to-clipboard 추가
2. **다크모드** - CSS 변수로 다크 테마 지원
3. **줄 번호** - 코드 블록에 라인 번호 표시
4. **서치 기능** - Ctrl+F로 코드 검색
5. **테마 전환** - 사용자 선택 가능한 테마

---

## 📞 문제 해결

### 코드 블록이 렌더링되지 않음
✅ 마크다운에 ` ``` ` 백틱 사용 확인 (스페이스 아님)
✅ 언어 지정: ` ```java `

### 문법 하이라이팅이 안 보임
✅ CSS 로드 순서 확인
✅ `!important` 규칙 확인
✅ 브라우저 개발자 도구에서 CSS 확인

### XSS 경고가 발생함
✅ rehypeSanitize 설정 확인
✅ 허용되는 태그 리스트 확인

---

**완성된 날짜:** 2024-11-22
**상태:** 🟢 Ready for Production
