from fastapi import APIRouter, Query
from app.services.review_service import ReviewService

router = APIRouter(prefix="/stats")

service = ReviewService()

@router.get("/keywords")
def keyword_stats(repo: str | None = Query(None)):
    return service.get_keyword_stats(repo)


@router.get("/keyword/{keyword}")
def keyword_reviews(keyword: str, repo: str | None = Query(None)):
    return service.get_reviews_by_keyword(keyword, repo)
