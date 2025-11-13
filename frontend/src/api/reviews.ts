import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export async function fetchReviews() {
  const res = await api.get("/reviews");
  return res.data;
}

export async function fetchStats() {
    const res = await api.get("/stats/keywords");
    return res.data;
  }
  