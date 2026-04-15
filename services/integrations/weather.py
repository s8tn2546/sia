import requests

from config.settings import settings


def get_weather(lat: float, lon: float) -> dict:
    if not settings.openweather_api_key:
        return {
            "temperature_c": 28.0,
            "rain_mm": 0.0,
            "wind_speed": 5.5,
            "description": "clear sky",
        }

    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "lat": lat,
        "lon": lon,
        "units": "metric",
        "appid": settings.openweather_api_key,
    }
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    data = response.json()

    rain_mm = float(data.get("rain", {}).get("1h", 0.0))

    return {
        "temperature_c": float(data.get("main", {}).get("temp", 0.0)),
        "rain_mm": rain_mm,
        "wind_speed": float(data.get("wind", {}).get("speed", 0.0)),
        "description": data.get("weather", [{}])[0].get("description", ""),
    }
