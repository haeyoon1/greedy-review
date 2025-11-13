from fastapi import APIRouter
from app.services.review_service import ReviewService

router = APIRouter(prefix="/stats")
service = ReviewService()

@router.get("/keywords")
def keyword_stats():
    return service.get_keyword_stats()
