# 🦒 Greedy Review 
### 코드 리뷰 키워드 분석 서비스
https://greedy-review.vercel.app/

**Greedy Review**는 공개된 Java 미션의 PR 리뷰 데이터를 기반으로  
리뷰에서 반복적으로 등장하는 **키워드**, **학습 난점**을 데이터 기반으로 분석, 시각화하는 학습 플랫폼입니다.

“어떤 개념이 많이 언급되는가?”,  
“어떤 주제에서 여러 학습자가 어려움을 겪는가?”를  
한눈에 파악할 수 있도록 설계되었습니다.

---

## 🔍 주요 기능

### 1. 키워드 기반 리뷰 분석
- PR 리뷰에서 반복적으로 등장하는 핵심 단어 추출
- 워드클라우드로 전체 리뷰 경향을 직관적으로 확인

### 2. 키워드 필터링 + 상세 리뷰 조회
- 특정 키워드 클릭 → 해당 키워드가 포함된 리뷰만 필터링  
- 코드 diff와 함께 리뷰 내용을 한 화면에서 확인 가능

### 3. 리뷰 스레드 흐름 조회
- comment_id / thread_id 기준으로 리뷰 자동 그룹화  
- 리뷰어–리뷰이 간 피드백 흐름을 하나의 스레드로 재구성하여 확인 가능

---

## 🧩 아키텍처 구성

- Frontend   : React + Vite
- Backend    : Supabase (PostgreSQL)
- Data Source: GitHub Public API (PR/리뷰 수집)

---

## 🛠 기술 스택

### **Frontend**
- React / TypeScript
- React Router
- Supabase JS Client
- d3 + d3-cloud (Word Cloud)
- CSS Modules

### **Backend & Data**
- Supabase PostgreSQL
- Supabase REST API 
- GitHub REST API 

### **Infra / Dev**
- Vercel
- pnpm
- ESLint / Prettier

