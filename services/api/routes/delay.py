from pathlib import Path

from fastapi import APIRouter

from api.schemas.delay_schema import DelayRequest, DelayResponse
from config.settings import BASE_DIR, settings
from integrations.weather import get_weather
from ml.delay.predict import predict_delay
from ml.delay.train import run_training

router = APIRouter()


@router.post("/predict-delay", response_model=DelayResponse)
def predict_delay_endpoint(payload: DelayRequest):
    model_path = (BASE_DIR / settings.delay_model_path).resolve()
    if not Path(model_path).exists():
        run_training()

    body = payload.model_dump()

    if body.get("temperature_c") is None or body.get("rain_mm") is None or body.get("wind_speed") is None:
        weather = get_weather(24.7136, 46.6753)
        body["temperature_c"] = body.get("temperature_c") if body.get("temperature_c") is not None else weather["temperature_c"]
        body["rain_mm"] = body.get("rain_mm") if body.get("rain_mm") is not None else weather["rain_mm"]
        body["wind_speed"] = body.get("wind_speed") if body.get("wind_speed") is not None else weather["wind_speed"]

    return predict_delay(body)
