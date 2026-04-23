from typing import Optional
from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None


class ChatResponse(BaseModel):
    answer: str
