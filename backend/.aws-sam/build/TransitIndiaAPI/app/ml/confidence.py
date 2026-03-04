from typing import Optional


class ConfidenceCalculator:
    def calculate(
        self,
        data_recency_minutes: float,
        has_gps: bool,
        historical_accuracy: float,
        prediction_variance: float,
    ) -> float:
        recency_score = max(0, 1 - (data_recency_minutes / 120))
        gps_score = 0.2 if has_gps else 0.0
        accuracy_score = historical_accuracy
        variance_score = max(0, 1 - (prediction_variance / 30))

        confidence = (
            recency_score * 0.35
            + gps_score
            + accuracy_score * 0.25
            + variance_score * 0.20
        )
        return max(0.0, min(1.0, confidence))

    def confidence_to_window(self, confidence: float, predicted_minutes: int) -> Optional[dict]:
        if confidence < 0.30:
            return None

        if confidence >= 0.80:
            width = 5
        elif confidence >= 0.50:
            width = 10
        else:
            width = 15

        half = width // 2
        min_val = max(1, predicted_minutes - half)
        max_val = predicted_minutes + (width - half)
        return {"min": min_val, "max": max_val}
