from fastapi import APIRouter

from api.schemas.route_schema import RouteRequest
from integrations.maps import get_route_options

router = APIRouter()


@router.post("/routes")
def routes_endpoint(payload: RouteRequest):
    routes = get_route_options(payload.origin, payload.destination, payload.mode)
    return {"routes": routes}
