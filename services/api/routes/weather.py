from fastapi import APIRouter, Query

from integrations.weather import get_weather
from utils.validators import ensure_coordinates

router = APIRouter()


@router.get("/weather")
def weather_endpoint(lat: float = Query(...), lon: float = Query(...)):
    ensure_coordinates(lat, lon)
    return get_weather(lat, lon)
