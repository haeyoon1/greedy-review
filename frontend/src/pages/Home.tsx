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

export default function Home() {
  const [selectedRepo, setSelectedRepo] = useState<Repository>("java-lotto");
  const [words, setWords] = useState<{ text: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchKeywordStats(selectedRepo)
      .then((stats) => {
        console.log(`📊 ${selectedRepo} stats:`, stats);
        const formatted = Object.entries(stats).map(([k, v]) => ({
          text: k,
          value: v,
        }));
        setWords(formatted);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedRepo]);

  const currentRepo = REPOSITORIES.find((r) => r.id === selectedRepo)!;

  return (
    <div className="home-page">
      <Header title="Greedy Review" />

      <Container maxWidth="xl">
        <div className="home-hero">
          <h2 className="home-subtitle">코드 리뷰 키워드 분석</h2>
          <p className="home-description">
            넥스트 스텝 Java 미션 코드 리뷰에서 자주 언급되는 키워드를 시각화합니다.
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

        {/* 통계 카드 */}
        <div className="stats-grid">
          <Card variant="outlined" padding="md" className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{words.length}</div>
            <div className="stat-label">총 키워드 수</div>
          </Card>

          <Card variant="outlined" padding="md" className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-value">
              {words.length > 0 ? Math.max(...words.map((w) => w.value)) : 0}
            </div>
            <div className="stat-label">최다 언급</div>
          </Card>

          <Card variant="outlined" padding="md" className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-value">
              {words.reduce((sum, w) => sum + w.value, 0)}
            </div>
            <div className="stat-label">전체 언급 횟수</div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
