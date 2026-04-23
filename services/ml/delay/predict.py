from config.settings import BASE_DIR, settings
from ml.delay.delay_model import DelayModel


def predict_delay(payload: dict):
    model_path = BASE_DIR / settings.delay_model_path
    model = DelayModel(model_path=model_path)
    probability = model.predict_probability(payload)
    return {
        "delay_probability": probability,
        "risk": "HIGH" if probability >= 0.7 else "MEDIUM" if probability >= 0.4 else "LOW",
    }
