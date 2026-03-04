from app.ml.confidence import ConfidenceCalculator


def test_high_confidence_narrow_window():
    calc = ConfidenceCalculator()
    window = calc.confidence_to_window(0.85, predicted_minutes=15)
    assert window["max"] - window["min"] == 5


def test_medium_confidence_medium_window():
    calc = ConfidenceCalculator()
    window = calc.confidence_to_window(0.65, predicted_minutes=15)
    assert window["max"] - window["min"] == 10


def test_low_confidence_wide_window():
    calc = ConfidenceCalculator()
    window = calc.confidence_to_window(0.40, predicted_minutes=15)
    assert window["max"] - window["min"] == 15


def test_very_low_confidence_returns_unconfirmed():
    calc = ConfidenceCalculator()
    window = calc.confidence_to_window(0.20, predicted_minutes=15)
    assert window is None


def test_never_returns_exact_eta():
    calc = ConfidenceCalculator()
    window = calc.confidence_to_window(0.95, predicted_minutes=15)
    assert window["min"] != window["max"]


def test_confidence_calculation_bounded():
    calc = ConfidenceCalculator()
    score = calc.calculate(data_recency_minutes=5, has_gps=True, historical_accuracy=0.85, prediction_variance=2.0)
    assert 0.0 <= score <= 1.0
    assert score > 0.7


def test_old_data_low_confidence():
    calc = ConfidenceCalculator()
    score = calc.calculate(data_recency_minutes=120, has_gps=False, historical_accuracy=0.5, prediction_variance=20.0)
    assert score < 0.4
