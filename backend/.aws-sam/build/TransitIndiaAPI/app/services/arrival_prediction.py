import uuid
from typing import Optional
from datetime import datetime
from app.ml.confidence import ConfidenceCalculator
from app.models.schemas import ArrivalPrediction


class ArrivalPredictionService:
    def __init__(self, forecasting_client=None):
        self.confidence_calc = ConfidenceCalculator()
        self.forecasting_client = forecasting_client

    def predict(
        self,
        trip_id: str,
        stop_id: str,
        data_recency_minutes: float,
        has_gps: bool,
        historical_accuracy: float,
        ml_predicted_minutes: Optional[int] = None,
        ml_variance: Optional[float] = None,
    ) -> dict:
        if ml_predicted_minutes is None:
            return {
                "arrival_window": "Status Not Confirmed",
                "confidence": 0.0,
                "prediction": None,
            }

        confidence = self.confidence_calc.calculate(
            data_recency_minutes=data_recency_minutes,
            has_gps=has_gps,
            historical_accuracy=historical_accuracy,
            prediction_variance=ml_variance or 15.0,
        )

        window = self.confidence_calc.confidence_to_window(confidence, ml_predicted_minutes)

        if window is None:
            return {
                "arrival_window": "Status Not Confirmed",
                "confidence": confidence,
                "prediction": None,
            }

        prediction = ArrivalPrediction(
            trip_id=trip_id,
            stop_id=stop_id,
            query_time=datetime.now(),
            predicted_arrival_min=window["min"],
            predicted_arrival_max=window["max"],
            confidence_level=round(confidence, 2),
            data_sources_used=["ETM", "Historical"] + (["GPS"] if has_gps else []),
            prediction_id=f"pred-{uuid.uuid4().hex[:8]}",
        )

        return {
            "arrival_window": f"{window['min']}-{window['max']} minutes",
            "confidence": round(confidence, 2),
            "prediction": prediction,
        }
