from pydantic import BaseModel, Field


class DelayRequest(BaseModel):
    distance_km: float = Field(..., gt=0)
    traffic_level: float = Field(..., ge=0, le=1)
    temperature_c: float | None = None
    rain_mm: float | None = None
    wind_speed: float | None = None


class DelayResponse(BaseModel):
    delay_probability: float
    risk: str
