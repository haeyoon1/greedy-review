import { useEffect, useState } from "react";
import { fetchKeywordStats } from "../api/reviews";
import WordCloud from "../components/WordCloud";
import Container from "../components/Container";
import Header from "../components/Header";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import "./Home.css";

type Repository = "java-racingcar" | "java-lotto" | "java-ladder";

const REPOSITORIES: {
  id: Repository;
  name: string;
  emoji: string;
  description: string;
  githubUrl: string;
}[] = [
  {
    id: "java-racingcar",
    name: "자동차 경주",
    emoji: "🏎️",
    description: "원시값과 일급 컬렉션을 활용한 자동차 경주 게임",
    githubUrl: "https://github.com/next-step/java-racingcar",
  },
  {
    id: "java-lotto",
    name: "로또",
    emoji: "🎰",
    description: "TDD와 OOP를 적용한 로또 번호 생성기",
    githubUrl: "https://github.com/next-step/java-lotto",
  },
  {
    id: "java-ladder",
    name: "사다리 타기",
    emoji: "🪜",
    description: "함수형 프로그래밍을 활용한 사다리 게임",
    githubUrl: "https://github.com/next-step/java-ladder-func-playground",
  },
];

// ✅ 키워드 카테고리 정의
const KEYWORD_CATEGORIES = {
  oop: {
    name: "객체지향 및 설계 원칙",
    emoji: "🎯",
    keywords: [
      "객체지향",
      "캡슐화",
      "상속",
      "다형성",
      "추상화",
      "인터페이스",
      "구현체",
      "의존성",
      "의존 역전 원칙",
      "개방 폐쇄 원칙",
      "단일 책임 원칙",
      "단일 책임",
      "srp",
      "책임",
      "SOLID",
      "응집도",
      "결합도",
      "불변",
      "상태 관리",
    ],
  },
  architecture: {
    name: "아키텍처 및 디자인 패턴",
    emoji: "🏗️",
    keywords: [
      "MVC",
      "레이어드 아키텍처",
      "패키지 구조",
      "와일드카드",
      "팩토리 패턴",
      "전략 패턴",
      "싱글톤 패턴",
      "빌더 패턴",
      "정적 팩토리 메서드",
      "정팩메",
      "래퍼클래스",
      "Wrapper Class",
      "Wrapper",
    ],
  },
  codeQuality: {
    name: "코드 품질 및 Java 기본",
    emoji: "✨",
    keywords: [
      "리팩터링",
      "리팩토링",
      "중복",
      "가독성",
      "네이밍",
      "일급 컬렉션",
      "원시값 포장",
      "상수화",
      "매직 넘버",
      "상수",
      "유틸",
      "enum",
      "static",
      "final",
      "함수형 인터페이스",
      "람다",
      "lambda",
      "Stream",
      "스트림",
      "Optional",
      "Null",
      "컬렉션",
      "collection",
      "List",
      "Map",
      "Set",
      "ArrayList",
      "HashMap",
      "HashSet",
      "equals",
      "hashCode",
      "Comparable",
      "Comparator",
      "StringBuilder",
      "제네릭",
      "generic",
      "예외 처리",
      "예외",
      "Checked Exception",
      "Unchecked Exception",
    ],
  },
  testing: {
    name: "테스트",
    emoji: "🧪",
    keywords: [
      "단위 테스트",
      "통합 테스트",
      "JUnit",
      "AssertJ",
      "커버리지",
      "given-when-then",
      "Mock 객체",
      "BeforeEach",
      "AfterEach",
      "ParameterizedTest",
      "테스트 더블",
      "인수 테스트",
      "fixture",
      "픽스쳐",
      "test",
    ],
  },
};

export default function Home() {
  const [selectedRepo, setSelectedRepo] = useState<Repository>("java-lotto");
  const [words, setWords] = useState<{ text: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    fetchKeywordStats(selectedRepo)
      .then((stats) => {
        const safeStats = stats ?? {};
        console.log(`📊 ${selectedRepo} stats:`, safeStats);

        const formatted = Object.entries(safeStats).map(([k, v]) => ({
          text: k,
          value: v as number,
        }));

        // 🔥 여기서 5회 이상만 필터링
        const filtered = formatted.filter((item) => item.value >= 5);

        setWords(filtered);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedRepo]);

  const currentRepo = REPOSITORIES.find((r) => r.id === selectedRepo)!;

  // 문자열을 정규화 (대소문자, 띄어쓰기 무시)
  const normalizeString = (str: string) => {
    return str.toLowerCase().replace(/\s+/g, "");
  };

  // 카테고리별 Top 키워드 계산
  const getCategoryTopKeyword = (
    categoryKey: keyof typeof KEYWORD_CATEGORIES
  ) => {
    const category = KEYWORD_CATEGORIES[categoryKey];
    const categoryWords = words.filter((w) => {
      const wordNormalized = normalizeString(w.text);
      return category.keywords.some((kw) => {
        const kwNormalized = normalizeString(kw);
        // 정규화된 단어로 비교: 정확한 매칭 또는 포함 관계 체크
        return (
          wordNormalized === kwNormalized ||
          wordNormalized.includes(kwNormalized) ||
          kwNormalized.includes(wordNormalized)
        );
      });
    });

    if (categoryWords.length === 0) return null;

    // 가장 높은 빈도의 키워드 찾기
    const topWord = categoryWords.reduce((max, word) =>
      word.value > max.value ? word : max
    );

    return topWord;
  };

  return (
    <div className="home-page">
      <Header title="Greedy Review" />

      <Container maxWidth="xl">
        <div className="home-hero">
          <h2 className="home-subtitle">코드 리뷰 키워드 분석</h2>
          <p className="home-description">
            넥스트 스텝 Java 미션 코드 리뷰에서 자주 언급되는 키워드를
            시각화합니다.
            <br />
            미션을 선택하고 키워드를 클릭하면 관련 리뷰를 확인할 수 있습니다.
          </p>
        </div>

        {/* 레포지토리 탭 */}
        <div className="repo-tabs">
          {REPOSITORIES.map((repo) => (
            <button
              key={repo.id}
              className={`repo-tab ${selectedRepo === repo.id ? "active" : ""}`}
              onClick={() => setSelectedRepo(repo.id)}
            >
              <span className="repo-emoji">{repo.emoji}</span>
              <div className="repo-info">
                <div className="repo-name">{repo.name}</div>
                <div className="repo-description">{repo.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* 현재 선택된 레포지토리 정보 */}
        <Card variant="outlined" padding="md" className="current-repo-card">
          <div className="current-repo-header">
            <span className="current-repo-emoji">{currentRepo.emoji}</span>
            <div>
              <h3 className="current-repo-name">{currentRepo.name} 미션</h3>
              <p className="current-repo-desc">{currentRepo.description}</p>
            </div>
          </div>
          <a
            href={currentRepo.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="github-link"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            GitHub에서 보기
          </a>
        </Card>

        {/* 워드 클라우드 */}
        <Card variant="elevated" padding="lg" className="word-cloud-card">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>키워드를 불러오는 중...</p>
            </div>
          ) : words.length === 0 ? (
            <div className="empty-state">
              <p>아직 분석된 키워드가 없습니다.</p>
            </div>
          ) : (
            <div className="word-cloud-wrapper">
              <WordCloud
                words={words}
                onWordClick={(text) => navigate(`/keyword/${text}`)}
              />
            </div>
          )}
        </Card>

        {/* 카테고리별 Top 키워드 */}
        <div className="category-stats">
          <h3 className="category-stats-title">카테고리별 주요 키워드</h3>
          <div className="category-grid">
            {Object.entries(KEYWORD_CATEGORIES).map(([key, category]) => {
              const topKeyword = getCategoryTopKeyword(
                key as keyof typeof KEYWORD_CATEGORIES
              );

              return (
                <Card
                  key={key}
                  variant="outlined"
                  padding="md"
                  className="category-card"
                  onClick={
                    topKeyword
                      ? () => navigate(`/keyword/${topKeyword.text}`)
                      : undefined
                  }
                >
                  <div className="category-header">
                    <span className="category-emoji">{category.emoji}</span>
                    <div className="category-name">{category.name}</div>
                  </div>

                  {topKeyword ? (
                    <div className="category-top-keyword">
                      <div className="top-keyword-text">{topKeyword.text}</div>
                      <div className="top-keyword-count">
                        {topKeyword.value}회 언급
                      </div>
                    </div>
                  ) : (
                    <div className="category-no-data">
                      <span className="no-data-text">데이터 없음</span>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
