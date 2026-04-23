from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier

from config.constants import DELAY_FEATURES


class DelayModel:
    def __init__(self, model_path: Path):
        self.model_path = model_path
        self.model = None

    def train(self, df: pd.DataFrame):
        x = df[DELAY_FEATURES]
        y = df["delayed"]
        clf = RandomForestClassifier(n_estimators=120, random_state=42)
        clf.fit(x, y)
        self.model = clf
        return clf

    def save(self):
        if self.model is None:
            raise ValueError("Model not trained")
        self.model_path.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.model, self.model_path)

    def load(self):
        self.model = joblib.load(self.model_path)
        return self.model

    def predict_probability(self, payload: dict):
        if self.model is None:
            self.load()

        features = {
            "distance_km": float(payload.get("distance_km", 0.0)),
            "traffic_level": float(payload.get("traffic_level", 0.0)),
            "temperature_c": float(payload.get("temperature_c", 25.0)),
            "rain_mm": float(payload.get("rain_mm", 0.0)),
            "wind_speed": float(payload.get("wind_speed", 0.0)),
        }

        frame = pd.DataFrame([features])
        proba = self.model.predict_proba(frame)[0][1]
        return float(proba)
