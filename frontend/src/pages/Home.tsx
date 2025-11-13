import { useEffect, useState } from "react";
import { fetchStats } from "../api/reviews";
import WordCloud from "../components/WordCloud";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [words, setWords] = useState<{ text: string; value: number }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats().then((data) => {
      const formatted = Object.entries(data).map(([key, value]) => ({
        text: key,
        value: value as number,
      }));
      setWords(formatted);
    });
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>리뷰 키워드</h1>
  
      <div style={{ border: "1px solid red", width: 600, height: 400 }}>
        <WordCloud
          words={words}
          onWordClick={(text) => navigate(`/keyword/${text}`)}
        />
      </div>
    </div>
  );
  
}
