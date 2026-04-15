from pydantic import BaseModel


class DemandResponse(BaseModel):
    forecast: list[dict]
