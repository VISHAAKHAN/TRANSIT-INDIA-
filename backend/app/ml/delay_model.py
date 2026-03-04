import json
import random
import boto3


class SageMakerDelayClient:
    def __init__(self, endpoint_name: str, client=None):
        self.endpoint_name = endpoint_name
        self.client = client or boto3.client("sagemaker-runtime")

    def predict(self, features: dict) -> dict:
        response = self.client.invoke_endpoint(
            EndpointName=self.endpoint_name,
            ContentType="application/json",
            Body=json.dumps(features),
        )
        return json.loads(response["Body"].read())


class FallbackDelayClassifier:
    """Rule-based delay classifier when SageMaker is unavailable."""

    def predict(self, features: dict) -> dict:
        delay = features.get("delay_minutes", 0)
        is_rush = features.get("is_rush_hour", False)

        if is_rush and delay > 5:
            return {"reason": "Heavy traffic", "confidence": 0.7}
        elif delay > 0 and delay <= 10:
            return {"reason": "Late departure", "confidence": 0.65}
        elif delay > 20:
            return {"reason": "Service disruption", "confidence": 0.6}
        else:
            return {"reason": "Status unknown", "confidence": 0.3}
