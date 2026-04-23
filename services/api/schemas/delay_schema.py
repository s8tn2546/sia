from typing import Optional
from pydantic import BaseModel, Field


class DelayRequest(BaseModel):
    distance_km: float = Field(..., gt=0)
    traffic_level: float = Field(..., ge=0, le=1)
    temperature_c: Optional[float] = None
    rain_mm: Optional[float] = None
    wind_speed: Optional[float] = None


class DelayResponse(BaseModel):
    delay_probability: float
    risk: str
