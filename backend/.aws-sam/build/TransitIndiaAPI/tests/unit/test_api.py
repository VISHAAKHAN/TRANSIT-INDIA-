"""Unit tests for Transit India API endpoints."""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "transit-india"


def test_query_bus_returns_valid_response():
    response = client.post(
        "/api/v1/query",
        json={"bus_number": "45A", "stop_name": "Adyar", "language": "en"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "request_id" in data
    assert "trip_status" in data
    assert "arrival_window" in data


def test_query_bus_without_stop():
    response = client.post(
        "/api/v1/query",
        json={"bus_number": "45A", "language": "en"},
    )
    assert response.status_code == 200


def test_emergency_info():
    response = client.get("/api/v1/emergency/45A")
    assert response.status_code == 200
    data = response.json()
    assert data["bus_number"] == "45A"
    assert "helpline_numbers" in data
    assert data["helpline_numbers"]["police"] == "112"


def test_feedback_submit():
    response = client.post(
        "/api/v1/feedback",
        json={"route_id": "CHN-MAD-1", "feedback_type": "Satisfactory", "channel": "Web"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "feedback_id" in data
    assert data["message"] == "Thank you for your feedback."


def test_feedback_invalid_type():
    response = client.post(
        "/api/v1/feedback",
        json={"route_id": "CHN-MAD-1", "feedback_type": "Amazing", "channel": "Web"},
    )
    assert response.status_code == 422


def test_safety_escalation():
    response = client.post(
        "/api/v1/safety/escalate",
        json={
            "phone_number": "9876543210",
            "bus_number": "45A",
            "incident_category": "Harassment",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "escalation_id" in data
    assert data["status"] == "Pending"
