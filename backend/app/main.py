from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import reviews, stats

app = FastAPI(
    title="Greedy Review API",
    description="우테코 학습 데이터 리뷰 API",
    version="1.0.0"
)

# CORS 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reviews.router)
app.include_router(stats.router)

@app.get("/")
def home():
    return {"message": "Greedy Review API is running!"}
