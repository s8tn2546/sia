from pathlib import Path

import pandas as pd
from fastapi import APIRouter

from api.schemas.demand_schema import DemandResponse
from ml.demand.predict import predict_demand
from ml.demand.train import run_training
from config.settings import BASE_DIR, settings

router = APIRouter()


def build_fallback_forecast(periods: int = 7):
    dataset_path = BASE_DIR / "ml" / "demand" / "dataset.csv"
    df = pd.read_csv(dataset_path)
    df["date"] = pd.to_datetime(df["date"])

    recent_window = df["demand"].tail(min(7, len(df)))
    recent_mean = float(recent_window.mean()) if not recent_window.empty else 100.0
    trend = 0.0
    if len(recent_window) > 1:
        trend = (float(recent_window.iloc[-1]) - float(recent_window.iloc[0])) / (len(recent_window) - 1)

    last_date = df["date"].max()
    forecast = []
    for day_index in range(1, periods + 1):
        predicted = max(0, round(recent_mean + trend * day_index))
        forecast.append(
            {
                "ds": (last_date + pd.Timedelta(days=day_index)).date().isoformat(),
                "yhat": predicted,
                "yhat_lower": max(0, round(predicted * 0.9)),
                "yhat_upper": round(predicted * 1.1),
            }
        )

    return forecast


@router.get("/predict-demand", response_model=DemandResponse)
def predict_demand_endpoint():
    try:
        model_path = (BASE_DIR / settings.demand_model_path).resolve()
        if not Path(model_path).exists():
                        run_training()
        forecast = predict_demand(periods=7)
        return {"forecast": forecast}
    except Exception:
        return {"forecast": build_fallback_forecast(periods=7)}
