from fastapi import APIRouter

from api.schemas.chat_schema import ChatRequest, ChatResponse
from llm.chatbot import ask_llm

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chatbot_endpoint(payload: ChatRequest):
    answer = ask_llm(payload.message, payload.context)
    return {"answer": answer}
