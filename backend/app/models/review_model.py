from pydantic import BaseModel
from typing import Optional

class Review(BaseModel):
    repo: str
    pr_number: int
    comment: str
    reviewer: Optional[str] = None
    file_path: Optional[str] = None
    code_snippet: Optional[str] = None
    url: Optional[str] = None
