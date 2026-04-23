from config.settings import BASE_DIR, settings
from ml.demand.demand_model import DemandModel


def predict_demand(periods: int = 7):
    model_path = BASE_DIR / settings.demand_model_path
    model = DemandModel(model_path=model_path)
    return model.predict_next_days(periods=periods)
