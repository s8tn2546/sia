from typing import Optional
from fastapi import APIRouter, Body

from llm.insights import generate_insights

router = APIRouter()


@router.post("/insights")
def insights_endpoint(snapshot: Optional[dict] = Body(default=None)):
    summary = generate_insights(snapshot)
    return {"recommendations": summary}
