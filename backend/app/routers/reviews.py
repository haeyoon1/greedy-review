from fastapi import APIRouter
from app.services.review_service import ReviewService

router = APIRouter()
service = ReviewService()

@router.get("/reviews")
def get_reviews():
    return service.get_all_reviews()

@router.get("/reviews/search")
def search(keyword: str):
    return service.search_by_keyword(keyword)
