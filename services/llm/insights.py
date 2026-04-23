from typing import Optional
from llm.chatbot import ask_llm
from llm.prompts import INSIGHTS_PROMPT


def generate_insights(snapshot: Optional[dict] = None) -> str:
    payload = snapshot or {
        "demand_trend": "upward",
        "delay_risk": "medium",
        "inventory": "some SKUs below reorder level",
    }
    return ask_llm(INSIGHTS_PROMPT, payload)
