import json
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"

def load_all_reviews():
    all_reviews = []
    for file in DATA_DIR.glob("reviews_*.json"):
        with open(file, encoding="utf-8") as f:
            all_reviews.extend(json.load(f))
    return all_reviews

def load_reviews(category: str):
    file = DATA_DIR / f"reviews_{category}_1_2_3.json"
    if not file.exists():
        raise ValueError("No such category: " + category)
    with open(file, encoding="utf-8") as f:
        return json.load(f)
