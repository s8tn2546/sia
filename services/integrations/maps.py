import logging
from typing import Any

import requests

from config.settings import settings

logger = logging.getLogger(__name__)


def get_route_options(origin: str, destination: str, mode: str = "driving") -> list[dict[str, Any]]:
    if not settings.google_maps_api_key:
        logger.debug("No Google Maps API key. Using fallback routes.")
        return _get_fallback_routes(origin, destination)

    try:
        url = "https://maps.googleapis.com/maps/api/directions/json"
        params = {
            "origin": origin,
            "destination": destination,
            "mode": mode,
            "alternatives": "true",
            "key": settings.google_maps_api_key,
        }
        response = requests.get(url, params=params, timeout=12)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.Timeout:
        logger.error("Google Maps API timeout (12s). Using fallback.")
        return _get_fallback_routes(origin, destination)
    except requests.exceptions.ConnectionError as e:
        logger.error(f"Google Maps connection error: {e}. Using fallback.")
        return _get_fallback_routes(origin, destination)
    except requests.exceptions.HTTPError as e:
        logger.error(f"Google Maps HTTP error: {e}. Using fallback.")
        return _get_fallback_routes(origin, destination)
    except Exception as e:
        logger.error(f"Unexpected error calling Google Maps: {e}. Using fallback.")
        return _get_fallback_routes(origin, destination)

    routes = []
    for route in data.get("routes", []):
        leg = route.get("legs", [{}])[0]
        routes.append(
            {
                "label": "alternative",
                "summary": route.get("summary", "Route"),
                "durationMin": round(leg.get("duration", {}).get("value", 0) / 60, 2),
                "distanceKm": round(leg.get("distance", {}).get("value", 0) / 1000, 2),
                "tolls": 0,
            }
        )

    if routes:
        routes = sorted(routes, key=lambda r: r["durationMin"])
        routes[0]["label"] = "fastest"
        shortest = min(routes, key=lambda r: r["distanceKm"])
        shortest["label"] = "shortest"

    if routes:
        return routes

    return _get_fallback_routes(origin, destination)


def _get_fallback_routes(origin: str, destination: str) -> list[dict[str, Any]]:
    """Return fallback routes when API fails."""
    return [
        {
            "label": "fastest",
            "summary": f"Fallback route from {origin} to {destination}",
            "durationMin": 90,
            "distanceKm": 100,
            "tolls": 5,
        },
        {
            "label": "shortest",
            "summary": f"Alternate route from {origin} to {destination}",
            "durationMin": 110,
            "distanceKm": 85,
            "tolls": 2,
        },
    ]
