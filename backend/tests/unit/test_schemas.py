import pytest
from datetime import datetime
from app.models.schemas import (
    TripStatusEnum, DelayReasonEnum, ChannelEnum,
    IncidentCategoryEnum, FeedbackTypeEnum,
    QueryRequest, ArrivalPrediction, SafetyEscalation,
    EscalationStatusEnum, Feedback,
)


def test_trip_status_enum_has_four_values():
    assert len(TripStatusEnum) == 4


def test_delay_reason_enum_has_five_values():
    assert len(DelayReasonEnum) == 5


def test_query_request_valid():
    req = QueryRequest(
        request_id="req-001",
        channel=ChannelEnum.SMS,
        bus_number="45A",
        language="en",
        timestamp=datetime.now(),
    )
    assert req.bus_number == "45A"
    assert req.phone_number is None


def test_arrival_prediction_confidence_bounds():
    pred = ArrivalPrediction(
        trip_id="trip-001", stop_id="stop-001",
        query_time=datetime.now(),
        predicted_arrival_min=10, predicted_arrival_max=15,
        confidence_level=0.85,
        data_sources_used=["ETM"], prediction_id="pred-001",
    )
    assert 0.0 <= pred.confidence_level <= 1.0


def test_arrival_prediction_rejects_invalid_confidence():
    with pytest.raises(Exception):
        ArrivalPrediction(
            trip_id="trip-001", stop_id="stop-001",
            query_time=datetime.now(),
            predicted_arrival_min=10, predicted_arrival_max=15,
            confidence_level=1.5,
            data_sources_used=["ETM"], prediction_id="pred-001",
        )


def test_safety_escalation_valid_categories():
    esc = SafetyEscalation(
        escalation_id="esc-001", phone_hash="abc",
        bus_number="45A",
        incident_category=IncidentCategoryEnum.HARASSMENT,
        timestamp=datetime.now(),
        control_room_status=EscalationStatusEnum.PENDING,
    )
    assert esc.incident_category == IncidentCategoryEnum.HARASSMENT


def test_feedback_valid_types():
    fb = Feedback(
        feedback_id="fb-001", route_id="r1",
        time_period=datetime.now(),
        feedback_type=FeedbackTypeEnum.SATISFACTORY,
        channel=ChannelEnum.WEB,
        timestamp=datetime.now(),
    )
    assert fb.feedback_type == FeedbackTypeEnum.SATISFACTORY
