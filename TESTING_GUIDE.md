# 🧪 마크다운 렌더링 테스트 가이드

수정된 마크다운 렌더링이 제대로 작동하는지 확인하기 위한 테스트 가이드입니다.

---

## 📋 테스트 케이스

### 테스트 1: 코드 블록 렌더링 (키워드 없음)
**입력:**
```
# 코드 예제

다음은 Java 코드입니다:

```java
public class Cars {
    private List<Car> cars;
}
```

끝입니다.
```

**예상 결과:**
- ✅ 제목 "코드 예제" 표시
- ✅ 코드 블록이 ```java ... ``` 형태로 정상 렌더링
- ✅ 문법 하이라이팅 적용 (public, class 등 색깔 표시)
- ✅ 언어 배지 "JAVA" 표시
- ✅ 백틱이 그대로 보이지 않음

---

### 테스트 2: 키워드 하이라이트 (코드 블록 제외)
**입력:**
```
# Cars 클래스 제안

Cars는 좋은 클래스입니다.

```java
public class Cars {
    private List<Car> cars;
}
```

Cars가 다시 나왔어요.
```

**Props:**
```typescript
keyword="Cars"
```

**예상 결과:**
- ✅ "Cars" 단어 첫 번째 (제목 아래) = **노란 하이라이트** 표시
- ✅ 코드 블록 내의 "Cars" = **하이라이트 안 함** (그대로 표시)
- ✅ 마지막 "Cars" = **노란 하이라이트** 표시
- ✅ 코드 블록 형식 완벽하게 유지

---

### 테스트 3: 인라인 코드와 키워드 하이라이트
**입력:**
```
# List<Car> 제안

`List<Car>` 클래스를 사용하세요.

List가 좋습니다.

```java
public class Cars {
    List<Car> cars;
}
```
```

**Props:**
```typescript
keyword="List"
```

**예상 결과:**
- ✅ 인라인 코드 `List<Car>` = **백틱 그대로 유지**, 내부 텍스트는 하이라이트 안 함
- ✅ "List가 좋습니다" = **노란 하이라이트** 표시
- ✅ 코드 블록 내 `List<Car>` = **하이라이트 안 함**

---

### 테스트 4: mark 태그 렌더링
**입력:**
```
이것은 Cars입니다.
```

**Props:**
```typescript
keyword="Cars"
```

**예상 결과:**
```html
<!-- HTML이 다음과 같이 생성됨 -->
이것은 <mark class="keyword-highlight">Cars</mark>입니다.
```

**시각적 결과:**
- ✅ "Cars"가 노란색 배경으로 표시됨
- ✅ CSS 클래스 `keyword-highlight` 스타일 적용 (#fff59d 배경색)

---

### 테스트 5: 링크는 건드리지 않기
**입력:**
```
[Cars 문서](https://github.com/cars)

그리고 Cars를 사용하세요.
```

**Props:**
```typescript
keyword="Cars"
```

**예상 결과:**
- ✅ 링크 "[Cars 문서]" = **파란색 링크로 표시**, 클릭 가능
- ✅ 링크 내의 "Cars"는 키워드 하이라이트 안 함
- ✅ 링크 밖의 "Cars" = **노란 하이라이트** 표시

---

## 🧐 시각적 검증 체크리스트

### 코드 블록 검증
- [ ] 코드 블록이 회색 배경으로 표시되는가? (#f6f8fa)
- [ ] 우측 상단에 언어 배지("JAVA", "PYTHON" 등)가 보이는가?
- [ ] 코드 문법이 색깔별로 표시되는가? (키워드는 빨강, 문자열은 초록 등)
- [ ] 스크롤바가 있으면 스타일이 예쁜가?

### 키워드 하이라이트 검증
- [ ] 키워드가 노란색 배경으로 표시되는가? (#fff59d)
- [ ] 코드 블록 내의 같은 단어는 하이라이트 안 되는가?
- [ ] 인라인 코드(백틱) 내의 단어는 하이라이트 안 되는가?
- [ ] 링크 내의 단어는 하이라이트 안 되는가?

### 마크다운 요소 검증
- [ ] 제목이 큰 텍스트로 표시되는가?
- [ ] 굵은 텍스트(**bold**)가 굵게 표시되는가?
- [ ] 이탤릭(*italic*)이 기울어지는가?
- [ ] 테이블이 격자 형태로 표시되는가?
- [ ] 리스트가 들여쓰기와 함께 표시되는가?

---

## 🐛 문제 발생 시 체크 사항

### 문제 1: 코드 블록이 평문으로 표시됨
**확인 항목:**
```
1. 마크다운에 ``` 백틱이 있는가? (스페이스 X)
2. 언어 지정이 있는가? (```java, ```python 등)
3. 백틱이 마크다운 형식 ```code``` 형태인가?
```

**해결책:**
```markdown
# 정상
```java
public class Test {}
```

# 틀림
` `java
public class Test {}
` `
```

---

### 문제 2: mark 태그가 렌더링 안 됨
**확인 항목:**
```
1. mark 태그가 rehypeSanitize에 포함되었는가?
   - tagNames에 'mark' 있는지 확인
2. mark['class'] 속성이 허용되어 있는가?
```

**코드 확인:**
```typescript
tagNames: [
  // ... 기타 태그
  'mark',  // ← 있는지 확인
],
attributes: {
  // ...
  mark: ['class'],  // ← 있는지 확인
}
```

---

### 문제 3: 키워드 하이라이트가 코드 블록 내에서도 적용됨
**원인:**
키워드 하이라이트가 코드 블록 내부도 처리 중

**확인 코드:**
```typescript
// 1단계: 코드 블록 분리
const codeBlockParts = content.split(/```[\s\S]*?```/);
const codeBlocks = content.match(/```[\s\S]*?```/g) || [];

// 이 부분이 코드 블록 외부만 처리하는가?
const highlightedParts = codeBlockParts.map(part => { ... });
```

---

### 문제 4: 인라인 코드 내의 단어가 하이라이트됨
**원인:**
인라인 코드(백틱) 분리가 제대로 안 됨

**확인 코드:**
```typescript
// 홀수 인덱스 = 백틱 내부 (건드리지 않아야 함)
if (i % 2 === 1) return segment;
// 짝수 인덱스 = 백틱 외부 (하이라이트)
```

---

## 🧬 단위 테스트 코드 예제

```typescript
// ReviewComment.test.tsx
import { render, screen } from '@testing-library/react';
import ReviewComment from './ReviewComment';

describe('ReviewComment - Keyword Highlight', () => {
  it('should highlight keyword outside code block', () => {
    const comment = {
      comment: 'Cars is good. ```java\npublic class Cars {}\n``` Cars again.',
      reviewer: 'John',
      submitted_at: new Date().toISOString(),
      repo: 'test/repo',
      // ... 기타 필드
    };

    render(<ReviewComment comment={comment} isMain keyword="Cars" />);

    // "Cars is good"의 Cars는 하이라이트되어야 함
    const marks = screen.getAllByText(/Cars/);
    expect(marks.length).toBeGreaterThan(0);
    // 코드 블록 내의 Cars는 mark 태그가 아니어야 함
  });

  it('should not highlight inline code', () => {
    const comment = {
      comment: '`List<Car>` and List are different.',
      keyword: 'List',
      // ...
    };

    render(<ReviewComment comment={comment} isMain={true} />);

    // 인라인 코드 내의 List는 하이라이트 안 됨
    // 텍스트의 "List"는 하이라이트됨
  });
});
```

---

## 📸 실제 테스트 데이터

### 테스트 댓글 1: 완전한 예제
```typescript
const testComment = {
  comment: `
# Cars 클래스 제안

현재 여러 클래스에서 \`Car[]\` 배열을 받고 있네요.
이를 \`Cars\` 클래스로 관리하면 어떨까요?

## 문제점

- 배열 관리가 분산됨
- \`Cars\`의 책임이 불명확

## 해결책

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

더 자세한 내용은 [여기](https://github.com/example)를 참고하세요.

> **중요**: \`Cars\` 클래스가 핵심입니다.
  `,
  reviewer: "Senior Developer",
  submitted_at: new Date().toISOString(),
  repo: "team/racing-game",
  file_path: "src/main/java/Car.java",
  code_snippet: "- Car[] cars\n+ List<Car> cars",
  url: "https://github.com/example/pulls/123",
  pr_number: 123,
};

// 테스트
<ReviewComment comment={testComment} isMain={true} keyword="Cars" />
```

**예상 결과:**
- ✅ 제목들이 큰 텍스트로 표시
- ✅ 인라인 코드 (`` `Car[]` ``, `` `Cars` ``) 백틱 유지
- ✅ 코드 블록이 회색 배경 + 문법 하이라이팅
- ✅ "Cars" 키워드만 노란 하이라이트 (코드 블록 제외)
- ✅ 링크가 파란색 및 클릭 가능
- ✅ 인용문이 회색 글씨 + 왼쪽 보더

---

## ✅ 최종 체크리스트

테스트 완료 후 다음을 확인하세요:

- [ ] 코드 블록이 정상 렌더링되는가?
- [ ] 문법 하이라이팅이 적용되는가?
- [ ] 언어 배지가 표시되는가?
- [ ] 키워드가 코드 블록 외부에서만 하이라이트되는가?
- [ ] 인라인 코드가 손상되지 않는가?
- [ ] mark 태그가 노란색으로 표시되는가?
- [ ] 링크가 정상 작동하는가?
- [ ] CSS 스타일이 GitHub처럼 보이는가?

---

## 📝 테스트 결과 기록

테스트 날짜: _______________
테스트자: _______________

| 테스트 항목 | 결과 | 비고 |
|-----------|------|------|
| 코드 블록 렌더링 | ✅/❌ | |
| 문법 하이라이팅 | ✅/❌ | |
| 언어 배지 | ✅/❌ | |
| 키워드 하이라이트 | ✅/❌ | |
| 인라인 코드 | ✅/❌ | |
| mark 태그 | ✅/❌ | |
| 링크 | ✅/❌ | |
| CSS 스타일 | ✅/❌ | |

---

**테스트 완료!** 🎉
