import { useEffect, useState } from "react";
import { fetchKeywordStats } from "../api/reviews";
import WordCloud from "../components/WordCloud";
import Container from "../components/Container";
import Header from "../components/Header";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [words, setWords] = useState<{ text: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetchKeywordStats()
      .then((stats) => {
        console.log("📊 stats:", stats);
        const formatted = Object.entries(stats).map(([k, v]) => ({
          text: k,
          value: v,
        }));
        setWords(formatted);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-page">
      <Header title="Greedy Review" />

      <Container maxWidth="xl">
        <div className="home-hero">
          <h2 className="home-subtitle">코드 리뷰 키워드 분석</h2>
          <p className="home-description">
            동아리 팀원들의 코드 리뷰에서 가장 자주 언급되는 키워드를 시각화합니다.
            <br />
            키워드를 클릭하면 관련된 리뷰 코멘트를 확인할 수 있습니다.
          </p>
        </div>

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

        <div className="stats-grid">
          <Card variant="outlined" padding="md" className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{words.length}</div>
            <div className="stat-label">총 키워드 수</div>
          </Card>

          <Card variant="outlined" padding="md" className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-value">
              {words.length > 0 ? Math.max(...words.map(w => w.value)) : 0}
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
