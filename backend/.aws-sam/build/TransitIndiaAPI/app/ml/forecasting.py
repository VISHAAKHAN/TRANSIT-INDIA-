import json
import random
import boto3


class SageMakerForecastingClient:
    def __init__(self, endpoint_name: str, client=None):
        self.endpoint_name = endpoint_name
        self.client = client or boto3.client("sagemaker-runtime")

    def predict(self, route_id: str, stop_name: str, scheduled_time: str, day_of_week: int) -> dict:
        payload = json.dumps({
            "route_id": route_id,
            "stop_name": stop_name,
            "scheduled_time": scheduled_time,
            "day_of_week": day_of_week,
        })
        response = self.client.invoke_endpoint(
            EndpointName=self.endpoint_name,
            ContentType="application/json",
            Body=payload,
        )
        result = json.loads(response["Body"].read())
        return {"predicted_minutes": result["predicted_minutes"], "variance": result["variance"]}


class FallbackForecaster:
    """Simple heuristic-based forecaster when SageMaker is unavailable."""

    def predict(self, route_id: str, stop_name: str, scheduled_time: str, day_of_week: int) -> dict:
        hour = int(scheduled_time.split(":")[0]) if ":" in scheduled_time else 12
        is_rush = hour in [7, 8, 9, 17, 18, 19]
        is_weekend = day_of_week >= 6

        if is_rush and not is_weekend:
            base = random.randint(15, 25)
            variance = 8.0
        elif is_rush:
            base = random.randint(10, 18)
            variance = 6.0
        else:
            base = random.randint(5, 15)
            variance = 4.0

        return {"predicted_minutes": base, "variance": variance}
