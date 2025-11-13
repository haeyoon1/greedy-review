import json
from pathlib import Path

DATA_PATH = Path(__file__).parent.parent / "data" / "reviews_with_code.json"

def load_reviews():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)
