from fastapi import APIRouter

from llm.insights import generate_insights

router = APIRouter()


@router.get("/insights")
def insights_endpoint():
    summary = generate_insights()
    return {"recommendations": summary}
