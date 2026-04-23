from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.chatbot import router as chatbot_router
from api.routes.delay import router as delay_router
from api.routes.demand import router as demand_router
from api.routes.insights import router as insights_router
from api.routes.maps import router as maps_router
from api.routes.weather import router as weather_router

app = FastAPI(title="Smart Supply Chain Services", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def healthcheck():
    return {"status": "ok"}


app.include_router(demand_router)
app.include_router(delay_router)
app.include_router(chatbot_router)
app.include_router(insights_router)
app.include_router(maps_router)
app.include_router(weather_router)
