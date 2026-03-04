from app.services.delay_classifier import DelayClassifierService
from app.models.schemas import DelayReasonEnum


class FakeMLClient:
    def __init__(self, response):
        self.response = response
    def predict(self, features):
        return self.response


def test_returns_valid_delay_reason():
    client = FakeMLClient(response={"reason": "Heavy traffic", "confidence": 0.8})
    service = DelayClassifierService(ml_client=client)
    result = service.classify(delay_minutes=15, is_rush_hour=True, route_id="r1")
    assert result.delay_reason in list(DelayReasonEnum)


def test_low_confidence_returns_unknown():
    client = FakeMLClient(response={"reason": "Heavy traffic", "confidence": 0.2})
    service = DelayClassifierService(ml_client=client)
    result = service.classify(delay_minutes=15, is_rush_hour=True, route_id="r1")
    assert result.delay_reason == DelayReasonEnum.UNKNOWN


def test_no_ml_client_returns_unknown():
    service = DelayClassifierService(ml_client=None)
    result = service.classify(delay_minutes=15, is_rush_hour=True, route_id="r1")
    assert result.delay_reason == DelayReasonEnum.UNKNOWN


def test_result_has_single_reason():
    client = FakeMLClient(response={"reason": "Late departure", "confidence": 0.75})
    service = DelayClassifierService(ml_client=client)
    result = service.classify(delay_minutes=10, is_rush_hour=False, route_id="r1")
    assert isinstance(result.delay_reason, DelayReasonEnum)
