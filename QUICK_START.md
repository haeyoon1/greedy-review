# 🚀 빠른 시작 가이드

GitHub PR 코멘트 스타일의 마크다운 렌더링을 5분 안에 설정하기

---

## 1️⃣ 패키지 설치

```bash
cd frontend
npm install rehype-sanitize --save
```

✅ 완료! 이제 모든 필요한 패키지가 설치되었습니다.

---

## 2️⃣ 컴포넌트 사용

### 방법 1: ReviewComment 컴포넌트 (권장)
```typescript
import ReviewComment from '@/components/ThreadedReviewList/ReviewComment';

export default function MyComponent() {
  const comment = {
    comment: `# 제안\n\n마크다운 텍스트\n\n\`\`\`java\npublic class Test {}\n\`\`\``,
    reviewer: "John",
    submitted_at: new Date().toISOString(),
    repo: "user/repo",
    file_path: "src/main.java",
    code_snippet: "- old\n+ new",
    url: "https://github.com/...",
    pr_number: 123,
  };

  return <ReviewComment comment={comment} isMain={true} />;
}
```

### 방법 2: MarkdownPreview 컴포넌트
```typescript
import MarkdownPreview from '@/components/ThreadedReviewList/MarkdownPreview';

<MarkdownPreview content={markdownText} />
```

---

## 3️⃣ 마크다운 문법 예제

### 기본 텍스트
```markdown
# 제목 1
## 제목 2

일반 텍스트는 여기에 올 수 있습니다.

**굵은 텍스트**, *이탤릭*, ***둘 다***
```

### 코드 블록 (문법 하이라이팅)
````markdown
```java
public class Cars {
    private List<Car> cars;

    public void moveAll() {
        cars.forEach(Car::move);
    }
}
```

```python
def hello():
    print("Hello, World!")
```

```javascript
const greet = () => console.log("Hello");
```
````

### 리스트
```markdown
- 항목 1
- 항목 2
  - 중첩 항목

1. 첫 번째
2. 두 번째
```

### 테이블
```markdown
| 컬럼 1 | 컬럼 2 |
|--------|--------|
| 셀 1-1 | 셀 1-2 |
| 셀 2-1 | 셀 2-2 |
```

### 링크 & 이미지
```markdown
[링크 텍스트](https://github.com)

![대체 텍스트](https://example.com/image.png)
```

### 인용문
```markdown
> 이것은 인용문입니다.
> 여러 줄로 지속될 수 있습니다.
```

### 체크박스 (GitHub Flavored Markdown)
```markdown
- [x] 완료된 항목
- [ ] 미완료 항목
```

---

## 4️⃣ Props 레퍼런스

```typescript
interface ReviewCommentProps {
  comment: ThreadComment;  // 필수: 댓글 데이터
  keyword?: string;        // 선택: 하이라이트할 키워드
  isMain: boolean;         // 필수: 메인 댓글 여부
}

interface ThreadComment {
  comment: string;         // 마크다운 텍스트
  reviewer: string;        // 리뷰어 이름
  submitted_at: string;    // ISO 날짜 (예: "2024-11-22T10:00:00Z")
  repo?: string;           // 리포지토리 (예: "user/repo")
  file_path?: string;      // 파일 경로 (예: "src/main.java")
  code_snippet?: string;   // Diff 형식 코드
  url?: string;            // PR 링크
  pr_number?: number;      // PR 번호
}
```

---

## 5️⃣ 완전한 예제

```typescript
import ReviewComment from '@/components/ThreadedReviewList/ReviewComment';

const comment = {
  comment: `
## 제안: Cars 클래스 추가하기

현재 코드에서 여러 클래스가 \`Car[]\` 배열을 받고 있습니다.
이를 \`Cars\` 클래스로 감싸서 관리하면 더 나을 것 같습니다.

### 문제점

- 배열 관리 로직이 여러 클래스에 산재됨
- 캡슐화가 약함
- 테스트하기 어려움

### 해결책

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

- ✅ 더 나은 캡슐화
- ✅ 명확한 책임 분리
- ✅ 테스트 용이

더 자세한 내용은 [이 문서](https://github.com)를 참고하세요.

> **중요**: 객체지향의 핵심은 책임의 분리입니다.
  `,
  reviewer: "Alice",
  submitted_at: "2024-11-22T10:00:00Z",
  repo: "team/racing-game",
  file_path: "src/main/java/Car.java",
  code_snippet: "-    Car[] cars\n+    List<Car> cars",
  url: "https://github.com/team/racing-game/pull/123",
  pr_number: 123,
};

export default function ReviewPage() {
  return (
    <ReviewComment
      comment={comment}
      isMain={true}
      keyword="Cars"
    />
  );
}
```

---

## 6️⃣ 지원하는 언어 (코드 하이라이팅)

### 웹
JavaScript, TypeScript, HTML, CSS, SCSS, JSON, React, Vue, Angular

### 백엔드
Python, Java, C#, C++, Ruby, PHP, Go, Rust, Kotlin, Swift

### 데이터
SQL, MySQL, PostgreSQL, MongoDB, XML, YAML

### 마크업
Markdown, LaTeX, AsciiDoc

---

## 7️⃣ 보안

자동으로 처리됩니다! ✅

- ❌ 위험한 HTML 태그 (script, iframe) 제거
- ✅ 안전한 마크다운만 렌더링
- ✅ 링크는 새 탭에서 열림 + origin 보호
- ✅ XSS 공격 방지

---

## 8️⃣ 색상 커스터마이징

[ReviewComment.css](./frontend/src/components/ThreadedReviewList/ReviewComment.css)에서:

```css
/* 링크 색상 */
.markdown-link {
  color: #0969da;  /* ← 여기를 변경 */
}

/* 코드 블록 배경 */
.code-block-wrapper {
  background-color: #f6f8fa;  /* ← 여기를 변경 */
}

/* 테이블 헤더 */
.markdown-table thead {
  background-color: #f6f8fa;  /* ← 여기를 변경 */
}
```

---

## ❓ FAQ

### Q: 마크다운 형식이 맞지 않으면?
A: `rehypeSanitize`가 자동으로 안전하게 처리합니다. 걱정하지 않으셔도 됩니다.

### Q: 새로운 프로그래밍 언어 추가는?
A: react-syntax-highlighter가 이미 30개 이상 지원합니다. 추가 언어는 별도 설정이 필요합니다.

### Q: 다크모드 지원은?
A: CSS 변수를 수정하면 쉽게 다크모드를 지원할 수 있습니다.

### Q: 성능은 괜찮은가?
A: useMemo로 최적화되어 있으며, 일반적인 댓글 크기에서는 문제가 없습니다.

### Q: 추가 기능 (복사 버튼 등)은?
A: [MarkdownPreview.tsx](./frontend/src/components/ThreadedReviewList/MarkdownPreview.tsx)를 확장하여 추가할 수 있습니다.

---

## 📚 상세 문서

더 자세한 내용은 다음 문서를 참고하세요:
- [MARKDOWN_IMPLEMENTATION.md](./frontend/MARKDOWN_IMPLEMENTATION.md) - 완전한 구현 가이드
- [MARKDOWN_SETUP_SUMMARY.md](./MARKDOWN_SETUP_SUMMARY.md) - 전체 요약

---

## ✅ 체크리스트

- [ ] `npm install rehype-sanitize` 실행
- [ ] ReviewComment.tsx 파일 확인
- [ ] ReviewComment.css 파일 확인
- [ ] 마크다운 데이터로 테스트
- [ ] 색상/스타일 커스터마이징 (필요시)
- [ ] 배포

---

**준비 완료!** 🎉
