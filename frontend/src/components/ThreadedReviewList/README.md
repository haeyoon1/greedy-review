# 🧵 ThreadedReviewList 컴포넌트

스레드(댓글 그룹) 기반 리뷰 UI를 제공하는 React 컴포넌트입니다.

## 🎯 핵심 기능

| 기능 | 설명 |
|------|------|
| **스레드 그룹핑** | thread_id 기준으로 리뷰 자동 그룹화 |
| **접기/펼치기** | 메인 댓글 항상 표시, 답글은 토글 가능 |
| **페이지네이션** | 8개씩 페이지 분할 (커스터마이징 가능) |
| **검색 필터** | 스레드 내용으로 실시간 검색 |
| **마크다운 렌더링** | GitHub 댓글 스타일 지원 |
| **반응형** | 모바일/테블릿/PC 최적화 |

## 📊 구조도

```
ThreadedReviewList (메인 컨테이너)
├── ThreadItem (개별 스레드)
│   ├── ReviewComment (메인 댓글)
│   └── ReviewComment (답글 - 토글)
├── ThreadItem
├── ThreadItem
└── ThreadPagination (페이지 네비게이션)
```

## 🚀 빠른 시작

### 설치

파일들이 이미 생성되었으므로 임포트하기만 하면 됩니다:

```typescript
import ThreadedReviewList from "@/components/ThreadedReviewList/ThreadedReviewList";

function App() {
  return <ThreadedReviewList />;
}
```

### 라우터 설정

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThreadedReviewList from "@/components/ThreadedReviewList/ThreadedReviewList";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/keyword/:name" element={<ThreadedReviewList />} />
    </Routes>
  );
}
```

## 📁 파일 설명

### 타입 정의
- **`types/review.ts`** - TypeScript 인터페이스
  - `Review` - API 응답 형식
  - `ThreadComment` - 마크된 댓글
  - `ReviewThread` - 스레드 컨테이너
  - `PaginatedThreads` - 페이지네이션 결과

### 유틸리티
- **`utils/threadGrouping.ts`** - 데이터 처리 함수
  - `groupReviewsByThread()` - 리뷰를 스레드로 변환
  - `paginateThreads()` - 페이지네이션 처리
  - `toggleThreadExpansion()` - 스레드 토글
  - `filterThreadsByKeyword()` - 검색 필터

### 컴포넌트
- **`ThreadedReviewList.tsx`** - 메인 컴포넌트
  - 데이터 로딩
  - 스레드 그룹핑
  - 상태 관리
  - 페이지 렌더링

- **`ThreadItem.tsx`** - 개별 스레드
  - 메인 댓글 표시
  - 답글 개수 표시
  - 토글 버튼
  - 답글 렌더링

- **`ReviewComment.tsx`** - 댓글 표시
  - 작성자 정보
  - 마크다운 렌더링
  - 코드 스니펫
  - PR 링크

- **`ThreadPagination.tsx`** - 페이지 네비게이션
  - 이전/다음 버튼
  - 페이지 번호
  - 진행 상황 표시

### 스타일
- **`ThreadedReviewList.css`** - 메인 스타일
- **`ThreadItem.css`** - 스레드 스타일
- **`ReviewComment.css`** - 댓글 스타일 (마크다운, 코드 블록)
- **`ThreadPagination.css`** - 페이지네이션 스타일

### 문서
- **`IMPLEMENTATION_GUIDE.md`** - 마이그레이션 및 고급 사용법
- **`PERFORMANCE_GUIDE.md`** - 성능 최적화 전략
- **`README.md`** - 이 파일

## 💡 핵심 알고리즘

### 1️⃣ 스레드 그룹핑

```javascript
// 입력
[
  { comment_id: 100, thread_id: 100, comment: "메인" },
  { comment_id: 101, thread_id: 100, comment: "답글" },
  { comment_id: 200, thread_id: 200, comment: "메인" },
]

// 출력
[
  {
    thread_id: 100,
    main_comment: { comment_id: 100, ... },
    replies: [{ comment_id: 101, ... }],
    reply_count: 1,
    is_expanded: false
  },
  {
    thread_id: 200,
    main_comment: { comment_id: 200, ... },
    replies: [],
    reply_count: 0,
    is_expanded: false
  }
]
```

### 2️⃣ 상태 관리 (React Hooks)

```javascript
// 스레드 목록
const [allThreads, setAllThreads] = useState<ReviewThread[]>([]);

// 현재 페이지
const [currentPage, setCurrentPage] = useState(1);

// 로딩 상태
const [loading, setLoading] = useState(true);

// 검색 필터
const [searchKeyword, setSearchKeyword] = useState("");

// 필터링 + 페이지네이션
const filteredThreads = searchKeyword
  ? filterThreadsByKeyword(allThreads, searchKeyword)
  : allThreads;

const paginated = paginateThreads(filteredThreads, currentPage, ITEMS_PER_PAGE);
```

### 3️⃣ 토글 로직

```javascript
// 토글 클릭
const handleToggleThread = (threadId: number) => {
  setAllThreads((prev) => toggleThreadExpansion(prev, threadId));
};

// toggleThreadExpansion 유틸
threads.map((thread) =>
  thread.thread_id === threadId
    ? { ...thread, is_expanded: !thread.is_expanded }
    : thread
);
```

## 🎨 커스터마이징

### 페이지 크기 변경

```typescript
// ThreadedReviewList.tsx
const ITEMS_PER_PAGE = 8; // 이 값을 변경

// 예: 5개씩 표시
const ITEMS_PER_PAGE = 5;
```

### 색상 변경

```css
/* 전역 CSS 변수 (예: variables.css) */
:root {
  --color-primary: #10b981;       /* 초록색 */
  --color-primary-dark: #059669;
  --color-primary-light: #34d399;
  --color-primary-pale: #d1fae5;
}
```

### 애니메이션 속도

```css
/* ThreadItem.css */
animation: slideDown 200ms ease-out; /* 200ms → 300ms로 변경 */
```

## 🔄 데이터 흐름

```
User URL: /keyword/테스트
  ↓
useParams() → keyword = "테스트"
  ↓
fetchReviewsByKeyword(keyword)
  ↓
API Response: Review[]
  ↓
groupReviewsByThread() → ReviewThread[]
  ↓
filterThreadsByKeyword() (검색 적용)
  ↓
paginateThreads() (현재 페이지 처리)
  ↓
렌더링: ThreadItem[] + ThreadPagination
```

## 📈 성능 특성

| 메트릭 | 값 |
|--------|-----|
| 초기 로딩 | ~500ms (데이터 200개 기준) |
| 스레드 토글 | ~50ms |
| 페이지 변경 | ~100ms |
| 검색 필터 | ~150ms (200개 데이터) |

**권장사항:**
- 데이터 < 500개: 기본 구현 (권장)
- 데이터 500~5000개: Lazy Loading
- 데이터 > 5000개: Virtual Scrolling

자세한 최적화는 [PERFORMANCE_GUIDE.md](./PERFORMANCE_GUIDE.md) 참고.

## 🐛 일반적인 문제

### Q: "댓글 더 보기" 버튼이 안 보여요
**A:** 답글이 없는 스레드에는 버튼이 표시되지 않습니다.

### Q: 마크다운 링크가 안 클릭돼요
**A:** `rehype-raw` 패키지가 설치되었는지 확인하세요.
```bash
npm install rehype-raw
```

### Q: 성능이 느려요
**A:** 데이터 수에 따라 최적화 전략을 확인하세요.
- ITEMS_PER_PAGE 줄이기
- 백엔드 페이지네이션 도입
- Virtual Scrolling (PERFORMANCE_GUIDE.md 참고)

### Q: 스타일이 깨져요
**A:** CSS 변수 존재 확인:
```css
/* 전역 styles에 있어야 함 */
:root {
  --color-primary: #10b981;
  --color-white: #ffffff;
  --color-border: #e5e7eb;
  /* ... 기타 변수 */
}
```

## 📚 추가 자료

- [마이그레이션 가이드](./IMPLEMENTATION_GUIDE.md)
- [성능 최적화](./PERFORMANCE_GUIDE.md)
- [React 문서](https://react.dev)
- [TypeScript 가이드](https://www.typescriptlang.org/docs/)

## 📝 업데이트 로그

### v1.0.0 (2025-11-18)
- ✅ 초기 구현
- ✅ 스레드 그룹핑
- ✅ 접기/펼치기
- ✅ 페이지네이션
- ✅ 검색 필터
- ✅ 마크다운 렌더링
- ✅ 반응형 디자인

## 🤝 기여

버그 리포트나 기능 제안은 이슈로 등록해주세요.

## 📄 라이선스

MIT

---

**마지막 업데이트:** 2025-11-18
**메인테이너:** Greedy Review Team
