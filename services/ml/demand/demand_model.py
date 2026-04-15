from pathlib import Path

import joblib
import pandas as pd
from prophet import Prophet

from config.constants import FORECAST_DAYS


class DemandModel:
    def __init__(self, model_path: Path):
        self.model_path = model_path
        self.model = None

    def train(self, df: pd.DataFrame):
        train_df = df.rename(columns={"date": "ds", "demand": "y"})
        model = Prophet(daily_seasonality=True, weekly_seasonality=True)
        model.fit(train_df)
        self.model = model
        return model

    def save(self):
        if self.model is None:
            raise ValueError("Model not trained")
        self.model_path.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.model, self.model_path)

    def load(self):
        self.model = joblib.load(self.model_path)
        return self.model

    def predict_next_days(self, periods: int = FORECAST_DAYS):
        if self.model is None:
            self.load()
        future = self.model.make_future_dataframe(periods=periods)
        forecast = self.model.predict(future)
        output = forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].tail(periods)
        output["ds"] = output["ds"].astype(str)
        return output.to_dict(orient="records")
