import { useEffect, useState } from "react";
import { fetchKeywordStats } from "../api/reviews";
import WordCloud from "../components/WordCloud";
import Container from "../components/Container";
import Header from "../components/Header";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
  KEYWORD_CATEGORIES,
  REPOSITORIES,
  type RepositoryId,
} from "../constants/keywords";

export default function Home() {
  const [selectedRepo, setSelectedRepo] = useState<RepositoryId>(
    "next-step/java-racingcar-simple-playground"
  );
  const [words, setWords] = useState<{ text: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);

    fetchKeywordStats(selectedRepo)
      .then((stats) => {
        const safeStats = stats ?? {};
        const formatted = Object.entries(safeStats).map(([k, v]) => ({
          text: k,
          value: v as number,
        }));

        // 빈도 기준으로 정렬 후 상위 20개만 선택
        const sorted = formatted.sort((a, b) => b.value - a.value);
        const topWords = sorted.slice(0, 20);
        setWords(topWords);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedRepo]);

  const currentRepo = REPOSITORIES.find((r) => r.id === selectedRepo)!;

  // 카테고리별 Top 키워드 계산
  const getCategoryTopKeyword = (
    categoryKey: keyof typeof KEYWORD_CATEGORIES
  ) => {
    const category = KEYWORD_CATEGORIES[categoryKey];
    const categoryWords = words.filter((w) =>
      category.keywords.some((kw) =>
        w.text.toLowerCase().includes(kw.toLowerCase())
      )
    );

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
