import logging

import requests

from config.settings import settings

logger = logging.getLogger(__name__)


def get_weather(lat: float, lon: float) -> dict:
    if not settings.openweather_api_key:
        logger.debug("No OpenWeather API key. Using fallback weather data.")
        return _get_fallback_weather()

    try:
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
    except requests.exceptions.Timeout:
        logger.error("OpenWeather API timeout (10s). Using fallback.")
        return _get_fallback_weather()
    except requests.exceptions.ConnectionError as e:
        logger.error(f"OpenWeather connection error: {e}. Using fallback.")
        return _get_fallback_weather()
    except requests.exceptions.HTTPError as e:
        logger.error(f"OpenWeather HTTP error: {e}. Using fallback.")
        return _get_fallback_weather()
    except Exception as e:
        logger.error(f"Unexpected error calling OpenWeather: {e}. Using fallback.")
        return _get_fallback_weather()

    try:
        rain_mm = float(data.get("rain", {}).get("1h", 0.0))
        return {
            "temperature_c": float(data.get("main", {}).get("temp", 0.0)),
            "rain_mm": rain_mm,
            "wind_speed": float(data.get("wind", {}).get("speed", 0.0)),
            "description": data.get("weather", [{}])[0].get("description", ""),
        }
    except (KeyError, ValueError, IndexError) as e:
        logger.error(f"Error parsing OpenWeather response: {e}. Using fallback.")
        return _get_fallback_weather()


def _get_fallback_weather() -> dict:
    """Return fallback weather data when API fails or is unavailable."""
    return {
        "temperature_c": 28.0,
        "rain_mm": 0.0,
        "wind_speed": 5.5,
        "description": "clear sky",
    }
