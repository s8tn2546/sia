from pathlib import Path

from fastapi import APIRouter

from api.schemas.demand_schema import DemandResponse
from ml.demand.predict import predict_demand
from ml.demand.train import run_training
from config.settings import BASE_DIR, settings

router = APIRouter()


@router.get("/predict-demand", response_model=DemandResponse)
def predict_demand_endpoint():
    model_path = (BASE_DIR / settings.demand_model_path).resolve()
    if not Path(model_path).exists():
        run_training()
    forecast = predict_demand(periods=7)
    return {"forecast": forecast}
