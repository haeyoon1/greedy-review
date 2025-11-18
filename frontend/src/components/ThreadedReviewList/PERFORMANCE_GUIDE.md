# 🚀 ThreadedReviewList 성능 최적화 가이드

## 📊 성능 고려사항

### 1️⃣ **현재 구현의 한계**

기본 구현(`ThreadedReviewList.tsx`)은 다음과 같은 상황에서 성능 문제가 발생할 수 있습니다:

- **리뷰 수가 매우 많음** (1000+)
  - 모든 스레드를 메모리에 로드
  - DOM 노드가 많아져 렌더링 느려짐

- **페이지 크기가 큼** (한 페이지에 50+개 스레드)
  - 보이지 않는 아이템도 렌더링
  - 불필요한 리플로우/리페인트

- **스레드 내 댓글이 많음** (답글 100+개)
  - 펼칠 때 한 번에 많은 DOM 노드 추가
  - 마크다운 파싱 오버헤드

---

## 🎯 성능 최적화 전략

### **Strategy A: Pagination 기반 (추천 ⭐)**

#### 언제 사용?
- **데이터 수: 100 ~ 5000개**
- **응답 속도가 중요할 때**
- **구현 복잡도: 낮음**

#### 장점
✅ 구현 간단
✅ 백엔드 부하 감소
✅ 메모리 사용량 낮음

#### 단점
❌ 페이지 이동 시 약간의 대기 시간
❌ 사용자가 페이지 번호를 눌러야 함

#### 구현 예시 (현재 코드 기반)

```typescript
// 이미 구현됨 (ThreadedReviewList.tsx의 paginateThreads 사용)
const ITEMS_PER_PAGE = 8; // 한 페이지당 8개 스레드

const paginated = paginateThreads(filteredThreads, currentPage, ITEMS_PER_PAGE);
// filteredThreads는 현재 페이지에 필요한 것만 포함
```

**최적화 팁:**
```typescript
// 1. 백엔드에서 페이지네이션 처리 (권장)
// GET /reviews/search?keyword=xxx&page=1&limit=10

const fetchReviewsByKeywordPaginated = async (
  keyword: string,
  page: number = 1,
  limit: number = 10
) => {
  const response = await fetch(
    `/api/reviews/search?keyword=${keyword}&page=${page}&limit=${limit}`
  );
  return response.json();
};

// 2. useEffect에서 페이지 변경 시 자동 페치
useEffect(() => {
  fetchReviewsByKeywordPaginated(keyword, currentPage).then((data) => {
    const threads = groupReviewsByThread(data.reviews);
    setAllThreads(threads);
    // 페이지네이션 정보도 함께 처리
  });
}, [currentPage, keyword]);
```

---

### **Strategy B: Virtual Scrolling (고급 ⭐⭐⭐)**

#### 언제 사용?
- **데이터 수: 5000+개**
- **매우 부드러운 스크롤이 중요할 때**
- **구현 복잡도: 중간**

#### 장점
✅ 매우 많은 데이터도 부드럽게 처리
✅ 메모리 효율적
✅ 무한 스크롤 효과

#### 단점
❌ 구현이 복잡
❌ 디버깅이 어려움
❌ 외부 라이브러리 필요

#### 구현 예시 (react-window 사용)

```bash
npm install react-window react-window-infinite-loader
```

```typescript
import { FixedSizeList as List } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import ThreadItem from "./ThreadItem";

interface VirtualListProps {
  threads: ReviewThread[];
  isLoading: boolean;
  hasMoreItems: boolean;
  onLoadMore: (startIndex: number, stopIndex: number) => Promise<void>;
}

export default function ThreadedReviewListVirtual({
  threads,
  isLoading,
  hasMoreItems,
  onLoadMore,
}: VirtualListProps) {
  const itemCount = hasMoreItems ? threads.length + 1 : threads.length;
  const isItemLoaded = (index: number) => !hasMoreItems || index < threads.length;

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    if (!isItemLoaded(index)) {
      return (
        <div style={style} className="virtual-loader">
          <div className="spinner"></div>
        </div>
      );
    }

    const thread = threads[index];
    return (
      <div style={style}>
        <ThreadItem
          thread={thread}
          onToggle={(threadId) => {
            // 상태 업데이트
          }}
          keyword="keyword"
        />
      </div>
    );
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={onLoadMore}
      minimumBatchSize={10}
      threshold={5}
    >
      {({ onItemsRendered, ref }) => (
        <List
          ref={ref}
          className="threads-virtual-list"
          height={800}
          itemCount={itemCount}
          itemSize={250} // 스레드 높이 추정값
          onItemsRendered={onItemsRendered}
          width="100%"
        >
          {Row}
        </List>
      )}
    </InfiniteLoader>
  );
}
```

**백엔드 연동:**

```typescript
useEffect(() => {
  if (!keyword) return;

  const handleLoadMore = async (startIndex: number, stopIndex: number) => {
    const page = Math.floor(startIndex / ITEMS_PER_PAGE) + 1;
    const response = await fetchReviewsByKeywordPaginated(keyword, page, ITEMS_PER_PAGE);
    const threads = groupReviewsByThread(response.reviews);
    setAllThreads((prev) => [...prev, ...threads]);
  };

  return () => {};
}, [keyword]);
```

---

### **Strategy C: Lazy Loading + Intersection Observer (중간 ⭐⭐)**

#### 언제 사용?
- **데이터 수: 1000 ~ 10000개**
- **무한 스크롤을 원할 때**
- **구현 복잡도: 낮음 ~ 중간**

#### 예시 코드

```typescript
import { useEffect, useRef, useCallback } from "react";

export default function ThreadedReviewListLazy() {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [allThreads, setAllThreads] = useState<ReviewThread[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loading]);

  useEffect(() => {
    if (!keyword) return;

    fetchReviewsByKeywordPaginated(keyword, currentPage).then((data) => {
      const threads = groupReviewsByThread(data.reviews);

      if (currentPage === 1) {
        setAllThreads(threads);
      } else {
        setAllThreads((prev) => [...prev, ...threads]);
      }

      setHasMore(data.hasMore);
    });
  }, [currentPage, keyword]);

  return (
    <div className="threaded-review-list-lazy">
      <div className="threads-container">
        {allThreads.map((thread) => (
          <ThreadItem
            key={thread.thread_id}
            thread={thread}
            onToggle={handleToggleThread}
            keyword={keyword}
          />
        ))}
      </div>

      {/* 무한 스크롤 트리거 */}
      <div ref={loadMoreRef} className="load-more-trigger">
        {loading && <div className="spinner"></div>}
        {!hasMore && <p>모든 리뷰를 불러왔습니다.</p>}
      </div>
    </div>
  );
}
```

---

## 🔍 성능 측정 방법

### Lighthouse를 사용한 측정

```bash
# 프로덕션 빌드
npm run build

# 성능 검사
lighthouse https://yoursite.com --view
```

### 성능 메트릭

```typescript
// 성능 측정 유틸
export const measurePerformance = {
  mark: (name: string) => performance.mark(name),
  measure: (name: string, startMark: string, endMark: string) => {
    performance.measure(name, startMark, endMark);
    const measure = performance.getEntriesByName(name)[0];
    console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
  },
};

// 사용 예
useEffect(() => {
  measurePerformance.mark("render-start");

  // ... 렌더링 로직

  measurePerformance.mark("render-end");
  measurePerformance.measure("render", "render-start", "render-end");
}, []);
```

---

## 💡 최적화 체크리스트

- [ ] **메모리**: 불필요한 객체 참조 제거
  ```typescript
  // ❌ 나쁜 예
  const processedComments = comments.map(c => processComment(c));

  // ✅ 좋은 예 (useMemo 사용)
  const processedComments = useMemo(
    () => comments.map(c => processComment(c)),
    [comments]
  );
  ```

- [ ] **렌더링**: React.memo로 불필요한 재렌더링 방지
  ```typescript
  export default React.memo(ThreadItem, (prevProps, nextProps) => {
    return prevProps.thread.thread_id === nextProps.thread.thread_id &&
           prevProps.thread.is_expanded === nextProps.thread.is_expanded;
  });
  ```

- [ ] **번들**: 코드 스플릿팅
  ```typescript
  const ThreadedReviewList = lazy(() =>
    import("./components/ThreadedReviewList/ThreadedReviewList")
  );
  ```

- [ ] **네트워크**: GraphQL 쿼리 최적화
  ```graphql
  # 필요한 필드만 요청
  query GetReviews($keyword: String!, $page: Int!) {
    reviews(keyword: $keyword, page: $page, limit: 10) {
      thread_id
      main_comment { comment_id comment }
      replies { comment_id comment }
    }
  }
  ```

---

## 🎬 단계별 최적화 로드맵

### Phase 1: 기본 (현재 상태)
- ✅ Pagination (8개/페이지)
- ✅ 기본 필터링

### Phase 2: 중기 (데이터 500+)
- 🔄 Lazy Loading + Intersection Observer
- 🔄 React.memo 적용
- 🔄 useMemo/useCallback 최적화

### Phase 3: 장기 (데이터 5000+)
- 🔄 Virtual Scrolling (react-window)
- 🔄 GraphQL로 마이그레이션
- 🔄 Service Worker 캐싱

---

## 📚 참고 자료

- [React 최적화 문서](https://react.dev/reference/react/useMemo)
- [react-window 문서](https://react-window.vercel.app/)
- [Web Performance APIs](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
