import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchReviewsByKeyword } from "../api/reviews";

export default function Detail() {
  const { name } = useParams();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;

    fetchReviewsByKeyword(name).then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, [name]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>키워드: {name}</h1>

      {reviews.length === 0 && <p>해당 키워드 관련 리뷰가 없습니다.</p>}

      {reviews.map((r, idx) => (
        <div key={idx} style={{ marginBottom: 16, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
          <div style={{ marginBottom: 8, whiteSpace: "pre-line" }}>{r.comment}</div>
          {r.url && <a href={r.url} target="_blank" rel="noreferrer">PR 링크 보기</a>}
        </div>
      ))}
    </div>
  );
}
