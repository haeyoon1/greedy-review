# 📖 ThreadedReviewList 구현 가이드

## 🎯 개요

기존의 단순 리뷰 목록을 **스레드 기반 구조**로 변경합니다.

### 변경 전후

#### Before (기존)
```
Review 1
Review 2
Review 3
Review 4
Review 5
```

#### After (스레드 기반)
```
┌─ Thread #2484824804 (2개 댓글)
│  ├─ 메인 댓글 (comment_id: 2484824804)
│  └─ 댓글 1개 더 보기 ▼
│     └─ 답글 (comment_id: 2484825000)
│
├─ Thread #2484825907 (1개 댓글)
│  └─ 메인 댓글 (comment_id: 2484825907)
│
└─ Thread #2484829664 (3개 댓글)
   ├─ 메인 댓글 (comment_id: 2484829664)
   └─ 댓글 3개 더 보기 ▼
      ├─ 답글 (comment_id: 2484830000)
      ├─ 답글 (comment_id: 2484831000)
      └─ 답글 (comment_id: 2484832000)
```

---

## 📁 파일 구조

```
frontend/src/
├── types/
│   └── review.ts                  # 타입 정의
├── utils/
│   └── threadGrouping.ts          # 스레드 그룹핑 유틸
└── components/
    └── ThreadedReviewList/
        ├── ThreadedReviewList.tsx   # 메인 컴포넌트
        ├── ThreadItem.tsx            # 개별 스레드
        ├── ReviewComment.tsx         # 댓글 표시
        ├── ThreadPagination.tsx      # 페이지네이션
        ├── ThreadedReviewList.css    # 메인 스타일
        ├── ThreadItem.css            # 스레드 스타일
        ├── ReviewComment.css         # 댓글 스타일
        ├── ThreadPagination.css      # 페이지 스타일
        ├── PERFORMANCE_GUIDE.md      # 성능 최적화
        └── IMPLEMENTATION_GUIDE.md   # 이 파일
```

---

## 🚀 기본 사용법

### 1️⃣ 기존 Detail.tsx에서 새 컴포넌트로 마이그레이션

#### Before (기존 Detail.tsx)

```typescript
import Detail from "../pages/Detail";

// Router에서
<Route path="/keyword/:name" element={<Detail />} />
```

#### After (ThreadedReviewList 사용)

```typescript
import ThreadedReviewList from "../components/ThreadedReviewList/ThreadedReviewList";

// Router에서
<Route path="/keyword/:name" element={<ThreadedReviewList />} />
```

### 2️⃣ 독립적으로 임포트해서 사용

```typescript
import ThreadedReviewList from "@/components/ThreadedReviewList/ThreadedReviewList";

export default function MyPage() {
  return (
    <div>
      <h1>리뷰 분석</h1>
      <ThreadedReviewList />
    </div>
  );
}
```

---

## 🔧 고급 사용법

### 커스텀 로직 추가

#### 1. 특정 스레드 필터링

```typescript
import {
  groupReviewsByThread,
  filterThreadsByKeyword,
} from "@/utils/threadGrouping";

const reviews = await fetchReviewsByKeyword(keyword);
const threads = groupReviewsByThread(reviews);

// 특정 키워드만 필터링
const filtered = filterThreadsByKeyword(threads, "성능");

console.log(filtered);
// [
//   { thread_id: 123, main_comment: {...}, replies: [...] },
//   { thread_id: 456, main_comment: {...}, replies: [...] },
// ]
```

#### 2. 외부 상태 관리와 연동 (Zustand 예시)

```typescript
// store/reviewStore.ts
import { create } from "zustand";
import type { ReviewThread } from "@/types/review";

interface ReviewStore {
  threads: ReviewThread[];
  currentPage: number;
  setThreads: (threads: ReviewThread[]) => void;
  setPage: (page: number) => void;
  toggleThread: (threadId: number) => void;
}

export const useReviewStore = create<ReviewStore>((set) => ({
  threads: [],
  currentPage: 1,

  setThreads: (threads) => set({ threads }),
  setPage: (page) => set({ currentPage: page }),

  toggleThread: (threadId) =>
    set((state) => ({
      threads: state.threads.map((thread) =>
        thread.thread_id === threadId
          ? { ...thread, is_expanded: !thread.is_expanded }
          : thread
      ),
    })),
}));
```

#### 3. API 확장 (백엔드 페이지네이션)

```typescript
// api/reviews.ts
export const fetchReviewsByKeywordPaginated = async (
  keyword: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  reviews: Review[];
  total: number;
  hasMore: boolean;
}> => {
  const response = await fetch(
    `/api/reviews/search?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
};
```

그 후 ThreadedReviewList.tsx에서:

```typescript
useEffect(() => {
  if (!keyword) return;

  setLoading(true);
  setCurrentPage(1);

  fetchReviewsByKeywordPaginated(keyword, 1, ITEMS_PER_PAGE) // ← 변경
    .then((data) => {
      const threads = groupReviewsByThread(data.reviews);
      setAllThreads(threads);
    })
    .finally(() => setLoading(false));
}, [keyword]);
```

---

## 🎨 스타일 커스터마이징

### 색상 변경

```css
/* ThreadedReviewList.css 상단에 추가 */

:root {
  --color-primary: #10b981; /* 초록색 → 파란색으로 변경 */
  --color-primary: #3b82f6;
  --color-primary-dark: #1e40af;
  --color-primary-light: #93c5fd;
  --color-primary-pale: #dbeafe;
}
```

### 페이지 크기 변경

```typescript
// ThreadedReviewList.tsx
const ITEMS_PER_PAGE = 8; // ← 변경

// 예: 5개씩 표시
const ITEMS_PER_PAGE = 5;

// 예: 무제한 (스크롤로만 제한)
const ITEMS_PER_PAGE = 1000;
```

### 애니메이션 비활성화

```css
/* ThreadItem.css */

/* 기존 */
animation: slideDown 200ms ease-out;

/* 변경 */
animation: none;
```

---

## 📊 데이터 흐름

```
┌─────────────────────────────────────────┐
│ API: GET /reviews/search?keyword=xxx    │
│ Response: Review[] (정렬되지 않음)        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ groupReviewsByThread()                  │
│ - thread_id로 그룹화                     │
│ - comment_id로 정렬                      │
│ - ReviewThread[]로 변환                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ filterThreadsByKeyword()                │
│ (선택사항: 검색 필터)                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ paginateThreads()                       │
│ - 현재 페이지에 맞게 슬라이싱              │
│ - 페이지네이션 정보 제공                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│ ThreadedReviewList                      │
│ - ThreadItem 목록 렌더링                │
│ - 페이지네이션 컨트롤 표시                │
└─────────────────────────────────────────┘
```

---

## 🐛 트러블슈팅

### 문제 1: "댓글 X개 더 보기" 버튼이 안 보임

**원인:** `reply_count`가 0인 경우

**해결:**
```typescript
// ThreadItem.tsx
if (reply_count > 0 && replies.length > 0) {
  // 버튼 표시
}
```

### 문제 2: 페이지 변경 시 스크롤이 맨 아래로

**해결:**
```typescript
// ThreadedReviewList.tsx
useEffect(() => {
  // 페이지 변경 시 최상단으로 스크롤
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [currentPage]);
```

### 문제 3: 마크다운 링크가 인식되지 않음

**확인사항:**
1. `rehypeRaw` 플러그인 설치 확인
   ```bash
   npm install rehype-raw
   ```

2. `ReviewComment.tsx`에서 `rehypePlugins={[rehypeRaw]}` 설정 확인

### 문제 4: 성능이 느림 (데이터 1000+개)

**해결 방법:**
1. ITEMS_PER_PAGE 줄이기
   ```typescript
   const ITEMS_PER_PAGE = 5; // 8 → 5
   ```

2. 백엔드 페이지네이션 적용
   ```typescript
   // fetchReviewsByKeywordPaginated 사용
   ```

3. Virtual Scrolling 도입 (PERFORMANCE_GUIDE.md 참고)

---

## ✨ 예제: 완전한 마이그레이션

### Before (Detail.tsx)

```typescript
export default function Detail() {
  const { name } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    fetchReviewsByKeyword(name)
      .then(setReviews)
      .finally(() => setLoading(false));
  }, [name]);

  const currentReviews = reviews.slice(
    (currentPage - 1) * 5,
    currentPage * 5
  );

  return (
    <div>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
      {/* 페이지네이션 */}
    </div>
  );
}
```

### After (ThreadedReviewList.tsx 사용)

```typescript
import ThreadedReviewList from "@/components/ThreadedReviewList/ThreadedReviewList";

export default function Detail() {
  return <ThreadedReviewList />;
}

// 또는 라우트에서 직접 사용
<Route path="/keyword/:name" element={<ThreadedReviewList />} />
```

---

## 📋 체크리스트

마이그레이션 전 확인사항:

- [ ] 모든 타입 파일 복사 (`types/review.ts`)
- [ ] 유틸 파일 복사 (`utils/threadGrouping.ts`)
- [ ] 컴포넌트 파일들 모두 복사
- [ ] CSS 파일들 모두 복사
- [ ] 라우터 업데이트
- [ ] API 함수 호환성 확인
- [ ] CSS 변수 확인 (--color-primary 등)
- [ ] 테스트 실행

---

## 🎓 개념 이해

### thread_id vs comment_id

```javascript
{
  comment_id: 2484824804,    // 이 댓글의 고유 ID
  thread_id: 2484824804,     // 이 댓글이 속한 스레드 (같으면 최초 댓글)
}

{
  comment_id: 2484825000,    // 다른 댓글
  thread_id: 2484824804,     // 같은 스레드에 속함 (답글)
}
```

### 정규화 vs 그룹핑

```typescript
// 정규화: 데이터 구조 정리
const normalized = {
  threads: {
    2484824804: { id: 2484824804, ... },
  },
};

// 그룹핑: 배열로 정렬
const grouped = [
  { thread_id: 2484824804, comments: [...] },
];

// 이 구현은 그룹핑 방식 사용
```

---

## 📞 도움말

코드에 대한 질문이 있으시면:

1. **PERFORMANCE_GUIDE.md** - 성능 관련
2. **comments in code** - 각 함수의 주석
3. **TypeScript** - 타입 정의로 자동완성 지원

---

마지막 업데이트: 2025-11-18
