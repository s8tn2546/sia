from fastapi import HTTPException, status


def ensure_coordinates(lat: float, lon: float) -> None:
    if lat < -90 or lat > 90:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid latitude")
    if lon < -180 or lon > 180:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid longitude")
