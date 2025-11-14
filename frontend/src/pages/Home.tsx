import { useEffect, useState } from "react";
import { fetchKeywordStats } from "../api/reviews";
import WordCloud from "../components/WordCloud";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [words, setWords] = useState<{ text: string; value: number }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchKeywordStats().then((stats) => {
      console.log("📊 stats:", stats);
      const formatted = Object.entries(stats).map(([k, v]) => ({
        text: k,
        value: v
      }));
      setWords(formatted);
    });
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>리뷰 키워드</h1>
      <WordCloud words={words} onWordClick={(text) => navigate(`/keyword/${text}`)} />
    </div>
  );
}
