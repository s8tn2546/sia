from typing import Any

import requests

from config.settings import settings


def get_route_options(origin: str, destination: str, mode: str = "driving") -> list[dict[str, Any]]:
    if not settings.google_maps_api_key:
        # Deterministic fallback for local development without API key.
        return [
            {
                "label": "fastest",
                "summary": "Primary highway route",
                "durationMin": 92,
                "distanceKm": 110,
                "tolls": 8,
            },
            {
                "label": "shortest",
                "summary": "Urban arterial route",
                "durationMin": 118,
                "distanceKm": 97,
                "tolls": 2,
            },
        ]

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
