from pathlib import Path

import pandas as pd

from config.settings import BASE_DIR, settings
from ml.demand.demand_model import DemandModel


def run_training():
    dataset_path = BASE_DIR / "ml" / "demand" / "dataset.csv"
    model_path = BASE_DIR / settings.demand_model_path
    df = pd.read_csv(dataset_path)

    model = DemandModel(model_path=model_path)
    model.train(df)
    model.save()
    return str(model_path)


if __name__ == "__main__":
    print(run_training())
