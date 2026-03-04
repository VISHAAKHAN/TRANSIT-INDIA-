"""Unit tests for the SMS message parser."""

from app.routers.sms import parse_sms


def test_parse_bus_with_stop():
    result = parse_sms("BUS 45A Adyar")
    assert result is not None
    assert result["bus_number"] == "45A"
    assert result["stop_name"] == "Adyar"


def test_parse_bus_without_stop():
    result = parse_sms("BUS 45A")
    assert result is not None
    assert result["bus_number"] == "45A"
    assert result["stop_name"] is None


def test_parse_case_insensitive():
    result = parse_sms("bus 45a adyar")
    assert result is not None
    assert result["bus_number"] == "45A"
    assert result["stop_name"] == "Adyar"


def test_parse_multiword_stop():
    result = parse_sms("BUS 21G T Nagar Bus Stand")
    assert result is not None
    assert result["bus_number"] == "21G"
    assert result["stop_name"] == "T Nagar Bus Stand"


def test_parse_invalid_message():
    result = parse_sms("hello world")
    assert result is None


def test_parse_empty_message():
    result = parse_sms("")
    assert result is None
