import re
from collections import Counter
from typing import List, Dict
from app.utils.loader import load_reviews
from app.models.review_model import Review

class ReviewService:
    def __init__(self):
        self.reviews = [Review(**r) for r in load_reviews()]

    def get_all_reviews(self) -> List[Review]:
        return self.reviews

    def search_by_keyword(self, keyword: str) -> List[Review]:
        return [
            r for r in self.reviews
            if keyword.lower() in r.comment.lower()
        ]

    def get_stats(self) -> Dict[str, int]:
        stats = {}
        for r in self.reviews:
            reviewer = r.reviewer or "unknown"
            stats[reviewer] = stats.get(reviewer, 0) + 1
        return stats

    def get_keyword_stats(self):
        words = []

        for r in self.reviews:
            text = r.comment.lower()
            tokens = re.findall(r"[a-zA-Z]+", text)
            tokens = [t for t in tokens if len(t) > 2]
            words.extend(tokens)

        return dict(Counter(words).most_common(50))
