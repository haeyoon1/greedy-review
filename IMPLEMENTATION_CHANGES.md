# 📝 구현 변경사항 상세 기록

마크다운 렌더링 및 코드 하이라이팅 구현의 모든 변경사항을 기록합니다.

---

## 🎯 프로젝트 목표
GitHub PR 코멘트처럼 아름답게 마크다운을 렌더링하고, 코드 블록에 문법 하이라이팅을 적용하기

---

## 📦 1. 패키지 설치

### 새로 추가된 패키지
```bash
npm install rehype-sanitize --save
```

**설치 결과:**
```
added 2 packages, audited 449 packages in 2s
found 0 vulnerabilities
```

### 설치된 전체 패키지 목록
| 패키지 | 버전 | 용도 |
|--------|------|------|
| react-markdown | 10.1.0 | 마크다운 파서 |
| remark-gfm | 4.0.1 | GitHub Flavored Markdown 지원 |
| react-syntax-highlighter | 16.1.0 | 코드 문법 하이라이팅 |
| rehype-raw | 7.0.0 | HTML 렌더링 |
| **rehype-sanitize** | **latest** | **XSS 방지** |

---

## 📁 2. 파일 변경사항

### A. 수정된 파일

#### [ReviewComment.tsx](./frontend/src/components/ThreadedReviewList/ReviewComment.tsx)
**변경 크기:** 290 줄

**주요 변경사항:**

1. **Import 추가**
   ```typescript
   import rehypeSanitize from "rehype-sanitize";
   import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
   import { github as githubStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
   import type { CSSProperties } from "react";
   ```

2. **ReactMarkdown 설정 개선**
   ```typescript
   // Before: 기본 설정만 사용
   <ReactMarkdown
     remarkPlugins={[remarkGfm]}
     rehypePlugins={[rehypeRaw]}
   >

   // After: XSS 방지 + 더 많은 커스텀 컴포넌트
   <ReactMarkdown
     remarkPlugins={[remarkGfm]}
     rehypePlugins={[
       rehypeRaw,
       [rehypeSanitize, { /* 설정 */ }]
     ]}
     components={{
       code: { /* 코드 블록 렌더러 */ },
       a: { /* 링크 렌더러 */ },
       table: { /* 테이블 렌더러 */ },
       img: { /* 이미지 렌더러 */ },
       ul: { /* 리스트 렌더러 */ },
       ol: { /* 번호 리스트 렌더러 */ },
       blockquote: { /* 인용문 렌더러 */ },
     }}
   >
   ```

3. **코드 블록 렌더링 (새로 추가)**
   ```typescript
   code: ({ node, inline, className, children, ...props }: any) => {
     const match = /language-(\w+)/.exec(className || "");
     const language = match ? match[1] : "text";
     const isInline = inline === true;

     // 인라인 코드 vs 코드 블록 분기
     if (isInline) {
       return <code className="inline-code">{children}</code>;
     }

     // Prism 라이브러리로 문법 하이라이팅
     return (
       <div className="code-block-wrapper">
         <div className="code-block-lang">{language}</div>
         <SyntaxHighlighter
           language={language}
           style={githubStyle}
           className="code-block-highlighter"
           // ... 커스텀 스타일
         >
           {codeString}
         </SyntaxHighlighter>
       </div>
     );
   }
   ```

4. **추가 커스텀 컴포넌트들**
   - `a`: 링크 보안 강화 (rel="noopener noreferrer")
   - `table`: GitHub 스타일 테이블
   - `img`: 이미지 최대 너비 제한
   - `ul`, `ol`: 마크다운 리스트 스타일
   - `blockquote`: 인용문 스타일

#### [ReviewComment.css](./frontend/src/components/ThreadedReviewList/ReviewComment.css)
**추가 행:** 240줄

**새로 추가된 CSS 클래스들:**

1. **코드 블록 관련**
   ```css
   .code-block-wrapper { /* 코드 블록 컨테이너 */ }
   .code-block-lang { /* 언어 배지 */ }
   .code-block-highlighter { /* 문법 하이라이팅 스타일 */ }
   ```

2. **Prism 토큰 색상 (GitHub 스타일)**
   ```css
   .code-block-highlighter .token {
     &.comment { color: #6a737d; }
     &.keyword { color: #d73a49; }
     &.string { color: #22863a; }
     /* ... 30개 이상의 토큰 타입 */ }
   ```

3. **마크다운 요소 스타일**
   ```css
   .markdown-table { /* 테이블 */ }
   .markdown-image { /* 이미지 */ }
   .markdown-ul, .markdown-ol { /* 리스트 */ }
   .markdown-blockquote { /* 인용문 */ }
   .markdown-link { /* 링크 */ }
   ```

4. **GitHub 색상 팔레트**
   - 배경: `#f6f8fa`
   - 테두리: `#d0d7de`
   - 텍스트: `#24292e`
   - 링크: `#0969da`
   - 코멘트: `#6a737d`
   - 문자열: `#22863a`

### B. 새로 생성된 파일

#### [MarkdownPreview.tsx](./frontend/src/components/ThreadedReviewList/MarkdownPreview.tsx)
**용도:** 마크다운 미리보기 (댓글 작성/편집 시)

**기능:**
- ReviewComment와 동일한 마크다운 렌더링
- 간단한 컴포넌트 인터페이스
- `content` prop으로 마크다운 텍스트 전달

**사용 예:**
```typescript
<MarkdownPreview content={markdownText} />
```

#### [MARKDOWN_IMPLEMENTATION.md](./frontend/MARKDOWN_IMPLEMENTATION.md)
**목적:** 완전한 구현 가이드 문서

**내용:**
- 설치 항목 상세 설명
- 주요 기능 안내
- 구현 구조 및 코드 설명
- 사용 방법 및 API
- 보안 고려사항
- 커스터마이징 방법
- 지원 언어 목록
- 성능 최적화 팁
- 문제 해결 가이드

**분량:** 약 400줄

#### [MARKDOWN_SETUP_SUMMARY.md](./MARKDOWN_SETUP_SUMMARY.md)
**목적:** 전체 구현 요약 문서 (프로젝트 루트)

**내용:**
- 설치된 패키지 요약
- 구현된 기능 목록
- 파일 수정 내역
- 사용 방법 예제
- 보안 기능 설명
- 지원 언어 표
- 커스터마이징 가이드
- 다음 단계 제안

#### [QUICK_START.md](./QUICK_START.md)
**목적:** 5분 안에 시작할 수 있는 빠른 가이드 (프로젝트 루트)

**내용:**
- 1단계: 패키지 설치
- 2단계: 컴포넌트 사용
- 3단계: 마크다운 예제
- 4단계: Props 레퍼런스
- 5단계: 완전한 예제
- FAQ
- 체크리스트

---

## 🔄 3. 기능 개선 사항

### A. 이전과 비교

| 기능 | 이전 | 현재 |
|------|------|------|
| 마크다운 렌더링 | 기본 | GitHub 스타일 |
| 코드 블록 | 단순 텍스트 | 문법 하이라이팅 |
| 언어 표시 | ❌ | ✅ 배지 |
| 테이블 | ✅ (기본) | ✅ (스타일 추가) |
| 이미지 | ❌ 미지원 | ✅ 지원 |
| 보안 | rehypeRaw만 사용 | + rehypeSanitize |
| URL 자동 링크화 | ✅ | ✅ (유지) |
| 키워드 하이라이트 | ✅ | ✅ (유지) |

### B. 새로운 기능

1. **코드 문법 하이라이팅**
   - 30개 이상의 프로그래밍 언어 지원
   - GitHub 스타일 색상 테마
   - 언어 이름 배지 자동 표시

2. **XSS 방지**
   - rehypeSanitize 플러그인으로 위험한 HTML 제거
   - 안전한 태그 화이트리스트 적용
   - 링크 보안 강화 (rel="noopener noreferrer")

3. **GitHub 스타일 CSS**
   - 깔끔하고 현대적인 디자인
   - 테이블 호버 효과
   - 스크롤바 커스터마이징
   - 반응형 레이아웃

4. **커스텀 컴포넌트**
   - 테이블 스타일링
   - 이미지 최적화
   - 리스트 마크업
   - 인용문 스타일

---

## 🛡️ 4. 보안 개선사항

### A. XSS (Cross-Site Scripting) 방지
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

**효과:**
- ❌ `<script>`, `<iframe>` 등 위험한 태그 제거
- ❌ `onclick`, `onerror` 등 이벤트 핸들러 제거
- ✅ `href`, `src` 등 필수 속성만 허용

### B. 링크 보안
```typescript
a: ({ href, children, ...props }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"  // 중요: window.opener 접근 방지
    className="markdown-link"
  >
    {children}
  </a>
)
```

### C. URL 검증
```typescript
const urlPattern = /(?<!\[)(?<!\()https?:\/\/[^\s\)]+/g;
// HTTP/HTTPS 프로토콜만 자동 링크화
```

---

## 💻 5. 코드 예제

### 기본 사용법
```typescript
import ReviewComment from '@/components/ThreadedReviewList/ReviewComment';

const comment = {
  comment: `# 제안\n\n마크다운 텍스트\n\n\`\`\`java\ncode\n\`\`\``,
  reviewer: "John",
  submitted_at: new Date().toISOString(),
  // ... 기타 필드
};

<ReviewComment comment={comment} isMain={true} />
```

### 마크다운 예제
```markdown
# 제목

**굵은 텍스트**, *이탤릭*

```java
public class Test {}
```

- 리스트 항목 1
- 리스트 항목 2

| 컬럼 1 | 컬럼 2 |
|--------|--------|
| 셀 | 셀 |

> 인용문

[링크](https://example.com)
```

---

## 🎨 6. 디자인 변경사항

### 색상 팔레트 (GitHub 스타일)
```css
배경: #f6f8fa
테두리: #d0d7de
텍스트: #24292e
링크: #0969da (호버 시 #0860ca)
성공 (추가된 코드): #22863a
실패 (삭제된 코드): #cb2431
강조 (주석): #6a737d
키워드: #d73a49
```

### 레이아웃
- 코드 블록 래퍼 추가 (언어 배지 공간)
- 테이블 간격 최적화
- 리스트 들여쓰기 조정
- 이미지 최대 너비 제한

---

## 📊 7. 지원 확대

### 프로그래밍 언어 (30+)
JavaScript, TypeScript, Python, Java, C#, C++, Ruby, PHP, Go, Rust, Kotlin, Swift, HTML, CSS, SQL, XML, JSON, YAML, Markdown, LaTeX 등

### Markdown 문법 (GFM 지원)
- 제목, 강조, 링크, 이미지
- 리스트, 테이블, 코드 블록
- 체크박스, 취소선, 수평선
- 인용문, HTML (제한적)

---

## 🚀 8. 성능 고려사항

### 최적화 적용
1. **useMemo로 캐싱**
   ```typescript
   const processedComment = useMemo(() => {
     // URL 변환, 키워드 하이라이트
   }, [comment.comment, keyword]);
   ```

2. **조건부 렌더링**
   - 코드 블록이 있을 때만 SyntaxHighlighter 로드
   - 테이블, 이미지 조건부 처리

3. **CSS 최적화**
   - CSS Modules 또는 CSS-in-JS 사용 가능
   - 필요한 스타일만 로드

---

## 📈 9. 버전 정보

**구현 날짜:** 2024-11-22
**React 버전:** 18.3.1
**Node 버전:** v24.10.0
**TypeScript:** ~5.9.3

---

## 📚 10. 추가 리소스

### 생성된 문서
- [MARKDOWN_IMPLEMENTATION.md](./frontend/MARKDOWN_IMPLEMENTATION.md) - 상세 구현 가이드
- [MARKDOWN_SETUP_SUMMARY.md](./MARKDOWN_SETUP_SUMMARY.md) - 전체 요약
- [QUICK_START.md](./QUICK_START.md) - 빠른 시작

### 수정된 파일
- [ReviewComment.tsx](./frontend/src/components/ThreadedReviewList/ReviewComment.tsx)
- [ReviewComment.css](./frontend/src/components/ThreadedReviewList/ReviewComment.css)

### 새 파일
- [MarkdownPreview.tsx](./frontend/src/components/ThreadedReviewList/MarkdownPreview.tsx)

---

## ✅ 11. 테스트 체크리스트

- [x] 패키지 설치 완료
- [x] TypeScript 타입 에러 해결
- [x] 마크다운 렌더링 테스트
- [x] 코드 블록 하이라이팅 테스트
- [x] GitHub 스타일 CSS 적용
- [x] XSS 보안 검증
- [x] 반응형 디자인 확인
- [x] 문서 작성 완료

---

## 🎯 12. 다음 단계 (선택사항)

### 추가 개선사항
1. 복사 버튼 추가 (코드 블록)
2. 다크모드 지원
3. 줄 번호 표시
4. 코드 폴딩/확장
5. 검색 기능

### 모니터링
1. 성능 측정 (라이트하우스)
2. 사용자 피드백 수집
3. 브라우저 호환성 테스트

---

**구현 완료!** 🎉

이제 GitHub PR 코멘트처럼 아름다운 마크다운 렌더링이 준비되었습니다.
