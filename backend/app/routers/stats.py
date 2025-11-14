from fastapi import APIRouter
from app.services.review_service import ReviewService

router = APIRouter(prefix="/stats")
service = ReviewService()

@router.get("/keywords")
def get_keyword_stats():
    return service.get_keyword_stats()

@router.get("/keyword/{keyword}")
def get_reviews_by_keyword(keyword: str):
    return service.search_by_keyword(keyword)
