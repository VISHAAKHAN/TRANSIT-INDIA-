from hypothesis import given, strategies as st
from app.ml.confidence import ConfidenceCalculator

calc = ConfidenceCalculator()


@given(confidence=st.floats(min_value=0.30, max_value=1.0), minutes=st.integers(min_value=5, max_value=120))
def test_property4_window_never_exact(confidence, minutes):
    window = calc.confidence_to_window(confidence, minutes)
    if window is not None:
        assert window["min"] != window["max"]


@given(minutes=st.integers(min_value=10, max_value=60))
def test_property5_confidence_monotonic(minutes):
    high = calc.confidence_to_window(0.85, minutes)
    low = calc.confidence_to_window(0.40, minutes)
    if high and low:
        assert (high["max"] - high["min"]) <= (low["max"] - low["min"])


@given(confidence=st.floats(min_value=0.0, max_value=0.29), minutes=st.integers(min_value=1, max_value=120))
def test_property6_low_confidence_returns_none(confidence, minutes):
    result = calc.confidence_to_window(confidence, minutes)
    assert result is None


@given(
    recency=st.floats(min_value=0, max_value=300),
    has_gps=st.booleans(),
    accuracy=st.floats(min_value=0, max_value=1),
    variance=st.floats(min_value=0, max_value=50),
)
def test_property8_confidence_bounded(recency, has_gps, accuracy, variance):
    score = calc.calculate(recency, has_gps, accuracy, variance)
    assert 0.0 <= score <= 1.0
