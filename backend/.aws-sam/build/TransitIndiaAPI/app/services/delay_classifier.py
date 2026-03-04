from dataclasses import dataclass
from app.models.schemas import DelayReasonEnum

CONFIDENCE_THRESHOLD = 0.5

VALID_REASONS = {
    "Heavy traffic": DelayReasonEnum.HEAVY_TRAFFIC,
    "Late departure": DelayReasonEnum.LATE_DEPARTURE,
    "Road diversion": DelayReasonEnum.ROAD_DIVERSION,
    "Service disruption": DelayReasonEnum.SERVICE_DISRUPTION,
}


@dataclass
class DelayClassification:
    delay_reason: DelayReasonEnum
    confidence: float


class DelayClassifierService:
    def __init__(self, ml_client=None):
        self.ml_client = ml_client

    def classify(self, delay_minutes: int, is_rush_hour: bool, route_id: str) -> DelayClassification:
        if self.ml_client is None:
            return DelayClassification(delay_reason=DelayReasonEnum.UNKNOWN, confidence=0.0)

        try:
            features = {
                "delay_minutes": delay_minutes,
                "is_rush_hour": is_rush_hour,
                "route_id": route_id,
            }
            prediction = self.ml_client.predict(features)
            reason_str = prediction.get("reason", "")
            confidence = prediction.get("confidence", 0.0)

            if confidence < CONFIDENCE_THRESHOLD:
                return DelayClassification(delay_reason=DelayReasonEnum.UNKNOWN, confidence=confidence)

            reason = VALID_REASONS.get(reason_str, DelayReasonEnum.UNKNOWN)
            return DelayClassification(delay_reason=reason, confidence=confidence)

        except Exception:
            return DelayClassification(delay_reason=DelayReasonEnum.UNKNOWN, confidence=0.0)
