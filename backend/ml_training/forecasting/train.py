import os
import json
import pandas as pd
from prophet import Prophet
import joblib


def train():
    data_path = os.environ.get("SM_CHANNEL_TRAIN", "/opt/ml/input/data/train")
    model_dir = os.environ.get("SM_MODEL_DIR", "/opt/ml/model")

    df = pd.read_csv(f"{data_path}/historical_performance.csv")
    df["ds"] = pd.to_datetime(df["scheduled_time"])
    df["y"] = df["delay_minutes"]

    models = {}
    for route_id in df["route_id"].unique()[:20]:
        route_df = df[df["route_id"] == route_id][["ds", "y"]].copy()
        if len(route_df) < 30:
            continue
        model = Prophet(
            daily_seasonality=True,
            weekly_seasonality=True,
            yearly_seasonality=True,
            changepoint_prior_scale=0.05,
        )
        model.fit(route_df)
        models[route_id] = model

    joblib.dump(models, f"{model_dir}/prophet_models.joblib")
    with open(f"{model_dir}/metadata.json", "w") as f:
        json.dump({"num_routes": len(models), "route_ids": list(models.keys())}, f)
    print(f"Trained {len(models)} route models")


if __name__ == "__main__":
    train()
