import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchReviews } from "../api/reviews";

export default function Detail() {
  const { name } = useParams();
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetchReviews().then((data) => {
      const filtered = data.filter((r: any) =>
        r.comment.toLowerCase().includes(name!.toLowerCase())
      );
      setReviews(filtered);
    });
  }, [name]);

  return (
    <div style={{ padding: 24 }}>
      <h1>키워드: {name}</h1>

      {reviews.map((r, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: 16,
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        >
          <div style={{ marginBottom: 8 }}>{r.comment}</div>
          {r.url && (
            <a href={r.url} target="_blank" rel="noreferrer">
              PR 링크 보기
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
