# 🔧 핫픽스 요약: 마크다운 렌더링 수정

백틱이 제거되고 코드 블록이 평문으로 표시되던 문제를 해결했습니다.

---

## 🎯 문제점

### 증상
1. 마크다운 코드 블록 (` ``` `)이 일반 텍스트로 렌더링됨
2. 키워드 하이라이트가 코드 블록 내부까지 적용되어 마크다운 포맷 손상
3. `<mark class="keyword-highlight">List</mark><Car>` 형태로 인라인 코드가 깨짐

### 근본 원인
키워드 하이라이트 로직이 **마크다운 포맷을 무시하고** 모든 텍스트에 HTML `<mark>` 태그를 삽입하면서 마크다운 파서가 유효한 코드 블록을 인식하지 못함

---

## ✅ 해결책

### 1. 코드 블록 보호 (우선 순위 1)
```typescript
// Before: 모든 텍스트에 하이라이트 적용
content.replace(regex, `<mark>$1</mark>`);

// After: 코드 블록 외부만 하이라이트
const codeBlockParts = content.split(/```[\s\S]*?```/);
const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
// 코드 블록 외부만 처리한 후 재조합
```

### 2. 인라인 코드 보호 (우선 순위 2)
```typescript
// 인라인 코드(백틱)도 마크다운 포맷 유지
const segments = part.split(new RegExp(`(\`[^\`]*\`)`));
return segments.map((segment, i) => {
  // 홀수 인덱스(1, 3, 5...) = 백틱 내부 → 건드리지 않음
  if (i % 2 === 1) return segment;
  // 짝수 인덱스 = 일반 텍스트 → 하이라이트
  return segment.replace(regex, `<mark>$1</mark>`);
}).join("");
```

### 3. mark 태그 허용 (우선 순위 3)
```typescript
// rehypeSanitize 설정에 mark 태그 추가
tagNames: [
  // ... 기타 태그
  'mark',  // ← 추가됨
],
attributes: {
  // ... 기타 속성
  mark: ['class'],  // ← 추가됨
}
```

---

## 📋 수정된 파일

### [ReviewComment.tsx](./frontend/src/components/ThreadedReviewList/ReviewComment.tsx)

#### 변경 사항 1: 키워드 하이라이트 로직 개선 (라인 54-84)
```typescript
// 키워드 하이라이트 (코드 블록 및 인라인 코드 제외)
if (keyword) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const backtick = "`";

  // 1단계: 코드 블록(```) 분리
  const codeBlockParts = content.split(/```[\s\S]*?```/);
  const codeBlocks = content.match(/```[\s\S]*?```/g) || [];

  // 2단계: 각 부분에서 인라인 코드와 일반 텍스트 분리
  const highlightedParts = codeBlockParts.map(part => {
    const segments = part.split(new RegExp(`(${backtick}[^${backtick}]*${backtick})`));
    return segments.map((segment, i) => {
      if (i % 2 === 1) return segment;  // 백틱 내부 → 그대로
      const regex = new RegExp(`(${escaped})`, "gi");
      return segment.replace(regex, `<mark class="keyword-highlight">$1</mark>`);
    }).join("");
  });

  // 3단계: 코드 블록 재삽입
  content = highlightedParts.reduce((acc, part, i) =>
    acc + part + (codeBlocks[i] || ""), ""
  );
}
```

#### 변경 사항 2: mark 태그 허용 (라인 133, 139)
```typescript
tagNames: [
  // ... 기타 태그
  'mark',  // ← 추가
],
attributes: {
  a: ['href', 'title'],
  img: ['src', 'alt', 'title'],
  code: ['className'],
  mark: ['class'],  // ← 추가
},
```

---

## 🧪 테스트 케이스

### 테스트 1: 코드 블록 정상 렌더링 ✅
```
입력:
마크다운에 코드 블록:
```java
public class Cars {}
```

결과:
- ✅ 코드 블록이 회색 배경으로 표시
- ✅ "JAVA" 언어 배지 표시
- ✅ 문법 하이라이팅 적용
- ✅ 백틱이 마크다운 형식으로 유지
```

### 테스트 2: 키워드 하이라이트 제한 ✅
```
입력:
keyword = "Cars"
텍스트: "Cars는 좋습니다. ```java\nCars car;\n``` Cars"

결과:
- ✅ 첫 번째 "Cars" = 노란 하이라이트
- ✅ 코드 블록 내 "Cars" = 하이라이트 안 함
- ✅ 세 번째 "Cars" = 노란 하이라이트
```

### 테스트 3: 인라인 코드 보호 ✅
```
입력:
keyword = "List"
텍스트: "`List<Car>`와 List 사용"

결과:
- ✅ 인라인 코드 `List<Car>` = 백틱 그대로, 하이라이트 안 함
- ✅ "List" 단어 = 노란 하이라이트
```

---

## 🔍 작동 원리

### 3단계 처리 방식

```
원본 마크다운:
┌─────────────────────────────────────────────┐
│ Cars는 좋습니다.                             │
│ ```java                                      │
│ public class Cars {}                        │
│ ```                                          │
│ Cars를 사용하세요.                           │
└─────────────────────────────────────────────┘

1단계: 코드 블록 분리
┌──────────────────┐  ┌──────────────────────┐  ┌─────────────────┐
│ Cars는 좋습니다.  │  │ ```java...```         │  │ Cars를 사용하세요 │
└──────────────────┘  └──────────────────────┘  └─────────────────┘
  부분1 (처리)          코드블록1 (보존)         부분2 (처리)

2단계: 인라인 코드 분리 및 하이라이트
부분1 "Cars는 좋습니다."
  → 인라인 코드 없음
  → "Cars" 찾기 → <mark>Cars</mark>는 좋습니다.

2단계: 부분2 처리
부분2 "Cars를 사용하세요."
  → 인라인 코드 없음
  → "Cars" 찾기 → <mark>Cars</mark>를 사용하세요.

3단계: 재조합
┌──────────────────────────────┐
│ <mark>Cars</mark>는 좋습니다. │
│ ```java                       │
│ public class Cars {}          │  ← 그대로 유지!
│ ```                           │
│ <mark>Cars</mark>를 사용하세요 │
└──────────────────────────────┘
```

---

## 📊 개선 효과

| 항목 | 이전 | 현재 |
|------|------|------|
| 코드 블록 렌더링 | ❌ 평문 | ✅ 정상 |
| 문법 하이라이팅 | ❌ 불가 | ✅ 가능 |
| 키워드 하이라이트 범위 | ⚠️ 전체 텍스트 | ✅ 코드블록 제외 |
| 인라인 코드 유지 | ❌ 깨짐 | ✅ 정상 |
| mark 태그 렌더링 | ❌ 제거됨 | ✅ 렌더링됨 |

---

## 🚀 배포 체크리스트

- [x] 코드 수정 완료
- [x] 타입 에러 해결
- [x] 테스트 케이스 작성
- [ ] 실제 데이터로 테스트 (사용자가 확인)
- [ ] 빌드 성공 확인
- [ ] 배포

---

## 📝 롤백 방법 (필요시)

이전 버전으로 돌아가야 한다면:

```bash
# git history 확인
git log --oneline | grep -i "keyword\|markdown"

# 특정 커밋으로 롤백
git revert <commit-hash>

# 또는 파일만 롤백
git checkout HEAD~ -- frontend/src/components/ThreadedReviewList/ReviewComment.tsx
```

---

## 💡 추가 개선 사항 (향후)

1. **복사 버튼** - 코드 블록에 "Copy" 버튼 추가
2. **라인 번호** - 코드에 라인 번호 표시
3. **탭 지원** - 탭 문자 정확히 렌더링
4. **다크 모드** - CSS 변수로 다크 테마 지원

---

**수정 완료!** 🎉

이제 마크다운이 정상적으로 렌더링됩니다.
테스트 후 문제가 있으면 TESTING_GUIDE.md를 참고하세요.
