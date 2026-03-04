import os
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import xgboost as xgb
import joblib

DELAY_CLASSES = {0: "Heavy traffic", 1: "Late departure", 2: "Road diversion", 3: "Service disruption"}


def assign_label(row):
    delay = row["delay_minutes"]
    hour = pd.to_datetime(row["scheduled_time"]).hour
    if hour in [7, 8, 9, 17, 18, 19] and delay > 5:
        return 0
    elif delay > 0 and delay <= 10:
        return 1
    elif row.get("season") == "monsoon" and delay > 10:
        return 2
    elif delay > 20:
        return 3
    return 1


def train():
    data_path = os.environ.get("SM_CHANNEL_TRAIN", "/opt/ml/input/data/train")
    model_dir = os.environ.get("SM_MODEL_DIR", "/opt/ml/model")

    df = pd.read_csv(f"{data_path}/historical_performance.csv")
    df["hour"] = pd.to_datetime(df["scheduled_time"]).dt.hour
    df["is_rush_hour"] = df["hour"].isin([7, 8, 9, 17, 18, 19]).astype(int)
    df["is_weekend"] = (df["day_of_week"] >= 6).astype(int)
    df["season_monsoon"] = (df["season"] == "monsoon").astype(int)
    df["season_summer"] = (df["season"] == "summer").astype(int)
    df["label"] = df.apply(assign_label, axis=1)

    features = ["delay_minutes", "hour", "is_rush_hour", "is_weekend", "day_of_week", "season_monsoon", "season_summer"]
    X = df[features]
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = xgb.XGBClassifier(
        n_estimators=100, max_depth=6, learning_rate=0.1,
        objective="multi:softprob", num_class=4, random_state=42,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print(classification_report(y_test, y_pred, target_names=list(DELAY_CLASSES.values())))

    joblib.dump(model, f"{model_dir}/delay_classifier.joblib")
    with open(f"{model_dir}/metadata.json", "w") as f:
        json.dump({"features": features, "classes": DELAY_CLASSES, "accuracy": float((y_pred == y_test).mean())}, f)


if __name__ == "__main__":
    train()
