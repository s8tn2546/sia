from config.settings import BASE_DIR, settings
import pandas as pd

from ml.delay.delay_model import DelayModel


def run_training():
    dataset_path = BASE_DIR / "ml" / "delay" / "dataset.csv"
    model_path = BASE_DIR / settings.delay_model_path
    df = pd.read_csv(dataset_path)

    model = DelayModel(model_path=model_path)
    model.train(df)
    model.save()
    return str(model_path)


if __name__ == "__main__":
    print(run_training())
