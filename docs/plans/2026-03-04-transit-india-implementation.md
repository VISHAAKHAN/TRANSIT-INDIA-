# Transit India AWS Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a functional MVP of Transit India — a national bus information platform on AWS serverless infrastructure with real AI/ML predictions, SMS channel, and government-grade web UI.

**Architecture:** Serverless-First on AWS — Lambda (FastAPI via Mangum) for all APIs, RDS PostgreSQL for relational data, Amazon Timestream for time-series, ElastiCache Redis for caching/rate-limiting, SageMaker for ML models, Kinesis for streaming, S3+CloudFront for frontend hosting, SNS for SMS.

**Tech Stack:** Python 3.11, FastAPI, SQLAlchemy, Pydantic, Prophet, XGBoost, AWS SAM, React (Vite), Tailwind CSS, pytest, hypothesis

**Existing Codebase:** React frontend at `src/` with mock data. Components: Login, OTP, Profile, TrackingDashboard, RouteDetails, EmergencyDashboard, ServiceReporting, Hero, Footer. All data is currently hardcoded in `src/data/districtStops.js` and mock route generation in TrackingDashboard. Translations in `src/translations.js` (English/Hindi/Tamil).

**AWS Account:** 862558960576, region ap-south-1

---

## Phase 1: Backend Foundation

### Task 1: Initialize Backend Project Structure

**Files:**
- Create: `backend/app/__init__.py`
- Create: `backend/app/main.py`
- Create: `backend/app/config.py`
- Create: `backend/requirements.txt`
- Create: `backend/tests/__init__.py`

**Step 1: Create backend directory structure**

```bash
mkdir -p backend/app/routers backend/app/services backend/app/ml backend/app/models backend/app/data
mkdir -p backend/tests/unit backend/tests/property backend/tests/integration
mkdir -p backend/ml_training/forecasting backend/ml_training/delay_classifier
mkdir -p backend/infrastructure
touch backend/app/__init__.py backend/app/routers/__init__.py backend/app/services/__init__.py
touch backend/app/ml/__init__.py backend/app/models/__init__.py backend/app/data/__init__.py
touch backend/tests/__init__.py backend/tests/unit/__init__.py backend/tests/property/__init__.py
```

**Step 2: Write requirements.txt**

```
# backend/requirements.txt
fastapi==0.109.2
mangum==0.17.0
uvicorn==0.27.1
sqlalchemy==2.0.27
psycopg2-binary==2.9.9
pydantic==2.6.1
pydantic-settings==2.1.0
redis==5.0.1
boto3==1.34.44
hypothesis==6.98.1
pytest==8.0.1
pytest-asyncio==0.23.5
httpx==0.26.0
python-dateutil==2.8.2
```

**Step 3: Write config.py**

```python
# backend/app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql://transit:transit@localhost:5432/transitindia"
    redis_url: str = "redis://localhost:6379"
    aws_region: str = "ap-south-1"
    sagemaker_forecasting_endpoint: str = "transit-forecasting"
    sagemaker_delay_endpoint: str = "transit-delay-classifier"
    audit_bucket: str = "transit-india-audit-logs"
    ml_bucket: str = "transit-india-ml-data"
    timestream_database: str = "transit_india"
    sms_rate_limit: int = 10
    ivr_rate_limit: int = 5
    safety_rate_limit: int = 3

    class Config:
        env_prefix = "TRANSIT_"

settings = Settings()
```

**Step 4: Write main.py with FastAPI + Mangum**

```python
# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

app = FastAPI(
    title="Transit India API",
    description="National bus information platform API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "transit-india"}

handler = Mangum(app, lifespan="off")
```

**Step 5: Verify local run**

```bash
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# Visit http://localhost:8000/health → {"status": "healthy", "service": "transit-india"}
```

**Step 6: Commit**

```bash
git add backend/
git commit -m "feat: initialize backend project with FastAPI + Mangum"
```

---

### Task 2: Define Pydantic Schemas (All Data Models)

**Files:**
- Create: `backend/app/models/schemas.py`
- Create: `backend/tests/unit/test_schemas.py`

**Step 1: Write the failing tests**

```python
# backend/tests/unit/test_schemas.py
import pytest
from datetime import datetime
from app.models.schemas import (
    TripStatusEnum, DelayReasonEnum, ChannelEnum,
    IncidentCategoryEnum, FeedbackTypeEnum, EscalationStatusEnum,
    QueryRequest, QueryResponse, TripStatus, ArrivalPrediction,
    DelayInformation, SafetyEscalation, Feedback, ETMEvent
)

def test_trip_status_enum_has_four_values():
    assert len(TripStatusEnum) == 4
    assert "Running Today" in [e.value for e in TripStatusEnum]
    assert "Not Running" in [e.value for e in TripStatusEnum]
    assert "Status Not Confirmed" in [e.value for e in TripStatusEnum]
    assert "Service Discontinued" in [e.value for e in TripStatusEnum]

def test_delay_reason_enum_has_five_values():
    assert len(DelayReasonEnum) == 5
    assert "Status unknown" in [e.value for e in DelayReasonEnum]

def test_query_request_valid():
    req = QueryRequest(
        request_id="req-001",
        channel=ChannelEnum.SMS,
        bus_number="45A",
        language="en",
        timestamp=datetime.now()
    )
    assert req.bus_number == "45A"
    assert req.phone_number is None
    assert req.stop_name is None

def test_arrival_prediction_confidence_bounds():
    pred = ArrivalPrediction(
        trip_id="trip-001",
        stop_id="stop-001",
        query_time=datetime.now(),
        predicted_arrival_min=10,
        predicted_arrival_max=15,
        confidence_level=0.85,
        data_sources_used=["ETM", "Historical"],
        prediction_id="pred-001"
    )
    assert 0.0 <= pred.confidence_level <= 1.0

def test_arrival_prediction_rejects_invalid_confidence():
    with pytest.raises(Exception):
        ArrivalPrediction(
            trip_id="trip-001",
            stop_id="stop-001",
            query_time=datetime.now(),
            predicted_arrival_min=10,
            predicted_arrival_max=15,
            confidence_level=1.5,
            data_sources_used=["ETM"],
            prediction_id="pred-001"
        )

def test_safety_escalation_valid_categories():
    esc = SafetyEscalation(
        escalation_id="esc-001",
        phone_hash="abc123",
        bus_number="45A",
        incident_category=IncidentCategoryEnum.HARASSMENT,
        timestamp=datetime.now(),
        control_room_status=EscalationStatusEnum.PENDING
    )
    assert esc.incident_category == IncidentCategoryEnum.HARASSMENT

def test_feedback_valid_types():
    fb = Feedback(
        feedback_id="fb-001",
        route_id="route-001",
        time_period=datetime.now(),
        feedback_type=FeedbackTypeEnum.SATISFACTORY,
        channel=ChannelEnum.WEB,
        timestamp=datetime.now()
    )
    assert fb.feedback_type == FeedbackTypeEnum.SATISFACTORY
```

**Step 2: Run tests to verify they fail**

```bash
cd backend && python -m pytest tests/unit/test_schemas.py -v
# Expected: FAIL - ModuleNotFoundError
```

**Step 3: Implement schemas**

```python
# backend/app/models/schemas.py
from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field, field_validator

class TripStatusEnum(str, Enum):
    RUNNING = "Running Today"
    NOT_RUNNING = "Not Running"
    UNCONFIRMED = "Status Not Confirmed"
    DISCONTINUED = "Service Discontinued"

class DelayReasonEnum(str, Enum):
    HEAVY_TRAFFIC = "Heavy traffic"
    LATE_DEPARTURE = "Late departure"
    ROAD_DIVERSION = "Road diversion"
    SERVICE_DISRUPTION = "Service disruption"
    UNKNOWN = "Status unknown"

class ChannelEnum(str, Enum):
    SMS = "SMS"
    IVR = "IVR"
    WEB = "Web"

class IncidentCategoryEnum(str, Enum):
    HARASSMENT = "Harassment"
    FIGHT = "Fight"
    MEDICAL = "Medical"
    THREAT = "Threat"

class FeedbackTypeEnum(str, Enum):
    SATISFACTORY = "Satisfactory"
    NEEDS_IMPROVEMENT = "Needs Improvement"

class EscalationStatusEnum(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"

class EventTypeEnum(str, Enum):
    TRIP_START = "TripStart"
    TICKET_SALE = "TicketSale"
    TRIP_END = "TripEnd"

class QueryRequest(BaseModel):
    request_id: str
    channel: ChannelEnum
    phone_number: Optional[str] = None
    bus_number: str
    stop_name: Optional[str] = None
    language: str = "en"
    timestamp: datetime

class QueryResponse(BaseModel):
    request_id: str
    trip_status: str
    arrival_window: str
    delay_reason: Optional[str] = None
    response_timestamp: datetime
    language: str

class TripStatus(BaseModel):
    trip_id: str
    route_id: str
    bus_number: str
    scheduled_departure: datetime
    status: TripStatusEnum
    last_updated: datetime
    etm_login_time: Optional[datetime] = None
    administrative_note: Optional[str] = None

class ArrivalPrediction(BaseModel):
    trip_id: str
    stop_id: str
    query_time: datetime
    predicted_arrival_min: int
    predicted_arrival_max: int
    confidence_level: float = Field(ge=0.0, le=1.0)
    data_sources_used: list[str]
    prediction_id: str

class DelayInformation(BaseModel):
    trip_id: str
    current_delay_minutes: int
    delay_reason: DelayReasonEnum
    classification_confidence: float = Field(ge=0.0, le=1.0)
    timestamp: datetime

class SafetyEscalation(BaseModel):
    escalation_id: str
    phone_hash: str
    bus_number: str
    trip_id: Optional[str] = None
    incident_category: IncidentCategoryEnum
    timestamp: datetime
    control_room_status: EscalationStatusEnum
    resolution_notes: Optional[str] = None
    operator_id: Optional[str] = None

class Feedback(BaseModel):
    feedback_id: str
    route_id: str
    time_period: datetime
    feedback_type: FeedbackTypeEnum
    channel: ChannelEnum
    timestamp: datetime

class ETMEvent(BaseModel):
    event_id: str
    event_type: EventTypeEnum
    trip_id: str
    bus_number: str
    stop_id: Optional[str] = None
    timestamp: datetime
    etm_device_id: str
```

**Step 4: Run tests to verify they pass**

```bash
cd backend && python -m pytest tests/unit/test_schemas.py -v
# Expected: All PASS
```

**Step 5: Commit**

```bash
git add backend/app/models/schemas.py backend/tests/unit/test_schemas.py
git commit -m "feat: add Pydantic schemas for all data models"
```

---

### Task 3: Define SQLAlchemy Database Models

**Files:**
- Create: `backend/app/models/database.py`
- Create: `backend/tests/unit/test_database_models.py`

**Step 1: Write failing test**

```python
# backend/tests/unit/test_database_models.py
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import Session
from app.models.database import Base, Route, Stop, Trip, SafetyEscalationRecord, FeedbackRecord

def test_all_tables_created():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    assert "routes" in tables
    assert "stops" in tables
    assert "trips" in tables
    assert "safety_escalations" in tables
    assert "feedback" in tables

def test_route_has_required_columns():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    inspector = inspect(engine)
    columns = [c["name"] for c in inspector.get_columns("routes")]
    assert "id" in columns
    assert "name" in columns
    assert "stops_sequence" in columns
    assert "status" in columns

def test_trip_has_status_column():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    inspector = inspect(engine)
    columns = [c["name"] for c in inspector.get_columns("trips")]
    assert "status" in columns
    assert "bus_number" in columns
    assert "scheduled_departure" in columns
    assert "etm_login_time" in columns
```

**Step 2: Run test to verify it fails**

```bash
cd backend && python -m pytest tests/unit/test_database_models.py -v
# Expected: FAIL
```

**Step 3: Implement database models**

```python
# backend/app/models/database.py
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Integer, JSON, Enum, ForeignKey, create_engine
from sqlalchemy.orm import DeclarativeBase, relationship, sessionmaker
from app.config import settings

class Base(DeclarativeBase):
    pass

class Route(Base):
    __tablename__ = "routes"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    stops_sequence = Column(JSON, nullable=False)  # list of stop_ids in order
    status = Column(String, nullable=False, default="active")  # active, discontinued
    created_at = Column(DateTime, default=datetime.utcnow)
    trips = relationship("Trip", back_populates="route")

class Stop(Base):
    __tablename__ = "stops"
    id = Column(String, primary_key=True)
    name_en = Column(String, nullable=False)
    name_ta = Column(String, nullable=True)
    name_hi = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Trip(Base):
    __tablename__ = "trips"
    id = Column(String, primary_key=True)
    route_id = Column(String, ForeignKey("routes.id"), nullable=False)
    bus_number = Column(String, nullable=False)
    scheduled_departure = Column(DateTime, nullable=False)
    status = Column(String, nullable=False, default="Status Not Confirmed")
    last_updated = Column(DateTime, default=datetime.utcnow)
    etm_login_time = Column(DateTime, nullable=True)
    administrative_note = Column(String, nullable=True)
    route = relationship("Route", back_populates="trips")

class SafetyEscalationRecord(Base):
    __tablename__ = "safety_escalations"
    id = Column(String, primary_key=True)
    phone_hash = Column(String, nullable=False)
    bus_number = Column(String, nullable=False)
    trip_id = Column(String, nullable=True)
    incident_category = Column(String, nullable=False)
    control_room_status = Column(String, nullable=False, default="Pending")
    resolution_notes = Column(String, nullable=True)
    operator_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class FeedbackRecord(Base):
    __tablename__ = "feedback"
    id = Column(String, primary_key=True)
    route_id = Column(String, nullable=False)
    time_period = Column(DateTime, nullable=False)
    feedback_type = Column(String, nullable=False)
    channel = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

def get_engine():
    return create_engine(settings.database_url)

def get_session():
    engine = get_engine()
    SessionLocal = sessionmaker(bind=engine)
    return SessionLocal()
```

**Step 4: Run tests**

```bash
cd backend && python -m pytest tests/unit/test_database_models.py -v
# Expected: All PASS
```

**Step 5: Commit**

```bash
git add backend/app/models/database.py backend/tests/unit/test_database_models.py
git commit -m "feat: add SQLAlchemy models for routes, stops, trips, escalations, feedback"
```

---

### Task 4: Implement Trip Status Service

**Files:**
- Create: `backend/app/services/trip_status.py`
- Create: `backend/tests/unit/test_trip_status.py`
- Create: `backend/tests/property/test_trip_status_properties.py`

**Step 1: Write failing unit tests**

```python
# backend/tests/unit/test_trip_status.py
import pytest
from datetime import datetime, timedelta
from app.services.trip_status import TripStatusService
from app.models.schemas import TripStatusEnum

class FakeCache:
    def __init__(self):
        self.store = {}
    def get(self, key):
        return self.store.get(key)
    def set(self, key, value, ex=None):
        self.store[key] = value

class FakeDB:
    def __init__(self, trips=None):
        self.trips = trips or {}
    def get_trip(self, bus_number):
        return self.trips.get(bus_number)

def test_etm_login_sets_running_status():
    cache = FakeCache()
    service = TripStatusService(cache=cache, db=None)
    result = service.process_etm_login("trip-001", "45A", datetime.now())
    assert result == TripStatusEnum.RUNNING

def test_no_login_past_threshold_returns_unconfirmed():
    cache = FakeCache()
    service = TripStatusService(cache=cache, db=None)
    scheduled = datetime.now() - timedelta(minutes=31)
    result = service.check_status("trip-001", scheduled_departure=scheduled, etm_login_time=None)
    assert result == TripStatusEnum.UNCONFIRMED

def test_admin_cancellation_returns_not_running():
    cache = FakeCache()
    service = TripStatusService(cache=cache, db=None)
    result = service.admin_cancel("trip-001")
    assert result == TripStatusEnum.NOT_RUNNING

def test_discontinued_returns_discontinued():
    cache = FakeCache()
    service = TripStatusService(cache=cache, db=None)
    result = service.discontinue("trip-001")
    assert result == TripStatusEnum.DISCONTINUED

def test_recent_trip_within_threshold_returns_unconfirmed():
    cache = FakeCache()
    service = TripStatusService(cache=cache, db=None)
    scheduled = datetime.now() - timedelta(minutes=10)
    result = service.check_status("trip-001", scheduled_departure=scheduled, etm_login_time=None)
    assert result == TripStatusEnum.UNCONFIRMED

def test_etm_login_caches_status():
    cache = FakeCache()
    service = TripStatusService(cache=cache, db=None)
    service.process_etm_login("trip-001", "45A", datetime.now())
    assert cache.store.get("trip:trip-001") is not None
```

**Step 2: Run tests to verify they fail**

```bash
cd backend && python -m pytest tests/unit/test_trip_status.py -v
# Expected: FAIL
```

**Step 3: Implement Trip Status Service**

```python
# backend/app/services/trip_status.py
import json
from datetime import datetime, timedelta
from app.models.schemas import TripStatusEnum

TIMEOUT_MINUTES = 30
CACHE_TTL_SECONDS = 86400  # 24 hours

class TripStatusService:
    def __init__(self, cache, db):
        self.cache = cache
        self.db = db

    def process_etm_login(self, trip_id: str, bus_number: str, login_time: datetime) -> TripStatusEnum:
        status = TripStatusEnum.RUNNING
        self._cache_status(trip_id, status, bus_number, login_time)
        return status

    def check_status(self, trip_id: str, scheduled_departure: datetime, etm_login_time: datetime | None) -> TripStatusEnum:
        cached = self._get_cached(trip_id)
        if cached:
            return TripStatusEnum(cached["status"])

        if etm_login_time:
            return TripStatusEnum.RUNNING

        now = datetime.now()
        if now > scheduled_departure + timedelta(minutes=TIMEOUT_MINUTES):
            return TripStatusEnum.UNCONFIRMED

        return TripStatusEnum.UNCONFIRMED

    def admin_cancel(self, trip_id: str) -> TripStatusEnum:
        status = TripStatusEnum.NOT_RUNNING
        self._cache_status(trip_id, status)
        return status

    def discontinue(self, trip_id: str) -> TripStatusEnum:
        status = TripStatusEnum.DISCONTINUED
        self._cache_status(trip_id, status)
        return status

    def _cache_status(self, trip_id: str, status: TripStatusEnum, bus_number: str = None, login_time: datetime = None):
        data = {
            "status": status.value,
            "bus_number": bus_number,
            "login_time": login_time.isoformat() if login_time else None,
            "updated_at": datetime.now().isoformat(),
        }
        self.cache.set(f"trip:{trip_id}", json.dumps(data), ex=CACHE_TTL_SECONDS)

    def _get_cached(self, trip_id: str) -> dict | None:
        raw = self.cache.get(f"trip:{trip_id}")
        if raw:
            return json.loads(raw) if isinstance(raw, str) else json.loads(raw.decode())
        return None
```

**Step 4: Write property-based tests**

```python
# backend/tests/property/test_trip_status_properties.py
from hypothesis import given, strategies as st
from datetime import datetime, timedelta
from app.services.trip_status import TripStatusService
from app.models.schemas import TripStatusEnum

class FakeCache:
    def __init__(self):
        self.store = {}
    def get(self, key):
        return self.store.get(key)
    def set(self, key, value, ex=None):
        self.store[key] = value

# Property 1: Trip Status Validity
@given(st.text(min_size=1, max_size=20))
def test_property1_status_always_valid(trip_id):
    cache = FakeCache()
    service = TripStatusService(cache=cache, db=None)
    scheduled = datetime.now() - timedelta(minutes=60)
    result = service.check_status(trip_id, scheduled_departure=scheduled, etm_login_time=None)
    assert result in list(TripStatusEnum)

# Property 2: ETM Login Triggers Running
@given(st.text(min_size=1, max_size=20), st.text(min_size=1, max_size=10))
def test_property2_etm_login_sets_running(trip_id, bus_number):
    cache = FakeCache()
    service = TripStatusService(cache=cache, db=None)
    result = service.process_etm_login(trip_id, bus_number, datetime.now())
    assert result == TripStatusEnum.RUNNING
```

**Step 5: Run all tests**

```bash
cd backend && python -m pytest tests/unit/test_trip_status.py tests/property/test_trip_status_properties.py -v
# Expected: All PASS
```

**Step 6: Commit**

```bash
git add backend/app/services/trip_status.py backend/tests/
git commit -m "feat: implement Trip Status Service with 4-state logic"
```

---

### Task 5: Implement Confidence Calculator and Arrival Prediction Service

**Files:**
- Create: `backend/app/ml/confidence.py`
- Create: `backend/app/services/arrival_prediction.py`
- Create: `backend/tests/unit/test_arrival_prediction.py`
- Create: `backend/tests/property/test_arrival_properties.py`

**Step 1: Write failing tests**

```python
# backend/tests/unit/test_arrival_prediction.py
import pytest
from datetime import datetime
from app.ml.confidence import ConfidenceCalculator
from app.services.arrival_prediction import ArrivalPredictionService

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

def test_confidence_calculation():
    calc = ConfidenceCalculator()
    score = calc.calculate(
        data_recency_minutes=5,
        has_gps=True,
        historical_accuracy=0.85,
        prediction_variance=2.0
    )
    assert 0.0 <= score <= 1.0
    assert score > 0.7  # recent data + GPS → high confidence

def test_old_data_low_confidence():
    calc = ConfidenceCalculator()
    score = calc.calculate(
        data_recency_minutes=120,
        has_gps=False,
        historical_accuracy=0.5,
        prediction_variance=20.0
    )
    assert score < 0.4
```

**Step 2: Run tests to verify they fail**

```bash
cd backend && python -m pytest tests/unit/test_arrival_prediction.py -v
```

**Step 3: Implement Confidence Calculator**

```python
# backend/app/ml/confidence.py

class ConfidenceCalculator:
    WINDOW_THRESHOLDS = {
        "high": {"min_confidence": 0.80, "window_width": 5},
        "medium": {"min_confidence": 0.50, "window_width": 10},
        "low": {"min_confidence": 0.30, "window_width": 15},
    }

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

    def confidence_to_window(self, confidence: float, predicted_minutes: int) -> dict | None:
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
```

**Step 4: Implement Arrival Prediction Service**

```python
# backend/app/services/arrival_prediction.py
import uuid
from datetime import datetime
from app.ml.confidence import ConfidenceCalculator
from app.models.schemas import ArrivalPrediction

class ArrivalPredictionService:
    def __init__(self, forecasting_client=None):
        self.confidence_calc = ConfidenceCalculator()
        self.forecasting_client = forecasting_client

    def predict(
        self,
        trip_id: str,
        stop_id: str,
        data_recency_minutes: float,
        has_gps: bool,
        historical_accuracy: float,
        ml_predicted_minutes: int | None = None,
        ml_variance: float | None = None,
    ) -> dict:
        if ml_predicted_minutes is None:
            return {
                "arrival_window": "Status Not Confirmed",
                "confidence": 0.0,
                "prediction": None,
            }

        confidence = self.confidence_calc.calculate(
            data_recency_minutes=data_recency_minutes,
            has_gps=has_gps,
            historical_accuracy=historical_accuracy,
            prediction_variance=ml_variance or 15.0,
        )

        window = self.confidence_calc.confidence_to_window(confidence, ml_predicted_minutes)

        if window is None:
            return {
                "arrival_window": "Status Not Confirmed",
                "confidence": confidence,
                "prediction": None,
            }

        prediction = ArrivalPrediction(
            trip_id=trip_id,
            stop_id=stop_id,
            query_time=datetime.now(),
            predicted_arrival_min=window["min"],
            predicted_arrival_max=window["max"],
            confidence_level=round(confidence, 2),
            data_sources_used=["ETM", "Historical"] + (["GPS"] if has_gps else []),
            prediction_id=f"pred-{uuid.uuid4().hex[:8]}",
        )

        return {
            "arrival_window": f"{window['min']}-{window['max']} minutes",
            "confidence": round(confidence, 2),
            "prediction": prediction,
        }
```

**Step 5: Write property tests**

```python
# backend/tests/property/test_arrival_properties.py
from hypothesis import given, strategies as st
from app.ml.confidence import ConfidenceCalculator

calc = ConfidenceCalculator()

# Property 4: Arrival Window Format (never exact ETA)
@given(
    confidence=st.floats(min_value=0.30, max_value=1.0),
    minutes=st.integers(min_value=5, max_value=120)
)
def test_property4_window_never_exact(confidence, minutes):
    window = calc.confidence_to_window(confidence, minutes)
    if window is not None:
        assert window["min"] != window["max"]

# Property 5: Higher confidence → narrower window
@given(minutes=st.integers(min_value=10, max_value=60))
def test_property5_confidence_monotonic(minutes):
    high = calc.confidence_to_window(0.85, minutes)
    low = calc.confidence_to_window(0.40, minutes)
    if high and low:
        assert (high["max"] - high["min"]) <= (low["max"] - low["min"])

# Property 6: Low confidence returns None
@given(
    confidence=st.floats(min_value=0.0, max_value=0.29),
    minutes=st.integers(min_value=1, max_value=120)
)
def test_property6_low_confidence_returns_none(confidence, minutes):
    result = calc.confidence_to_window(confidence, minutes)
    assert result is None

# Property 8: Confidence always between 0 and 1
@given(
    recency=st.floats(min_value=0, max_value=300),
    has_gps=st.booleans(),
    accuracy=st.floats(min_value=0, max_value=1),
    variance=st.floats(min_value=0, max_value=50)
)
def test_property8_confidence_bounded(recency, has_gps, accuracy, variance):
    score = calc.calculate(recency, has_gps, accuracy, variance)
    assert 0.0 <= score <= 1.0
```

**Step 6: Run all tests**

```bash
cd backend && python -m pytest tests/unit/test_arrival_prediction.py tests/property/test_arrival_properties.py -v
```

**Step 7: Commit**

```bash
git add backend/app/ml/confidence.py backend/app/services/arrival_prediction.py backend/tests/
git commit -m "feat: implement Confidence Calculator and Arrival Prediction Service"
```

---

### Task 6: Implement Delay Classifier Service

**Files:**
- Create: `backend/app/services/delay_classifier.py`
- Create: `backend/tests/unit/test_delay_classifier.py`

**Step 1: Write failing tests**

```python
# backend/tests/unit/test_delay_classifier.py
from app.services.delay_classifier import DelayClassifierService
from app.models.schemas import DelayReasonEnum

class FakeSageMakerClient:
    def __init__(self, response=None):
        self.response = response
    def predict(self, features):
        return self.response

def test_returns_valid_delay_reason():
    client = FakeSageMakerClient(response={"reason": "Heavy traffic", "confidence": 0.8})
    service = DelayClassifierService(ml_client=client)
    result = service.classify(delay_minutes=15, is_rush_hour=True, route_id="r1")
    assert result.delay_reason in list(DelayReasonEnum)

def test_low_confidence_returns_unknown():
    client = FakeSageMakerClient(response={"reason": "Heavy traffic", "confidence": 0.2})
    service = DelayClassifierService(ml_client=client)
    result = service.classify(delay_minutes=15, is_rush_hour=True, route_id="r1")
    assert result.delay_reason == DelayReasonEnum.UNKNOWN

def test_no_ml_client_returns_unknown():
    service = DelayClassifierService(ml_client=None)
    result = service.classify(delay_minutes=15, is_rush_hour=True, route_id="r1")
    assert result.delay_reason == DelayReasonEnum.UNKNOWN

def test_result_has_single_reason():
    client = FakeSageMakerClient(response={"reason": "Late departure", "confidence": 0.75})
    service = DelayClassifierService(ml_client=client)
    result = service.classify(delay_minutes=10, is_rush_hour=False, route_id="r1")
    assert isinstance(result.delay_reason, DelayReasonEnum)
```

**Step 2: Run tests → FAIL**

**Step 3: Implement**

```python
# backend/app/services/delay_classifier.py
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
            return DelayClassification(
                delay_reason=DelayReasonEnum.UNKNOWN, confidence=0.0
            )

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
                return DelayClassification(
                    delay_reason=DelayReasonEnum.UNKNOWN, confidence=confidence
                )

            reason = VALID_REASONS.get(reason_str, DelayReasonEnum.UNKNOWN)
            return DelayClassification(delay_reason=reason, confidence=confidence)

        except Exception:
            return DelayClassification(
                delay_reason=DelayReasonEnum.UNKNOWN, confidence=0.0
            )
```

**Step 4: Run tests → PASS**

**Step 5: Commit**

```bash
git add backend/app/services/delay_classifier.py backend/tests/unit/test_delay_classifier.py
git commit -m "feat: implement Delay Classifier Service"
```

---

### Task 7: Implement Rate Limiter Service

**Files:**
- Create: `backend/app/services/rate_limiter.py`
- Create: `backend/tests/unit/test_rate_limiter.py`

**Step 1: Write failing tests**

```python
# backend/tests/unit/test_rate_limiter.py
from app.services.rate_limiter import RateLimiter

class FakeRedis:
    def __init__(self):
        self.store = {}
    def get(self, key):
        return self.store.get(key)
    def incr(self, key):
        self.store[key] = self.store.get(key, 0) + 1
        return self.store[key]
    def expire(self, key, seconds):
        pass
    def ttl(self, key):
        return 3600

def test_first_request_allowed():
    redis = FakeRedis()
    limiter = RateLimiter(redis)
    allowed, remaining = limiter.check("1234567890", "sms")
    assert allowed is True

def test_sms_limit_10_per_hour():
    redis = FakeRedis()
    limiter = RateLimiter(redis)
    for i in range(10):
        allowed, _ = limiter.check("1234567890", "sms")
        assert allowed is True
    allowed, _ = limiter.check("1234567890", "sms")
    assert allowed is False

def test_safety_limit_3_per_day():
    redis = FakeRedis()
    limiter = RateLimiter(redis)
    for i in range(3):
        allowed, _ = limiter.check("1234567890", "safety")
        assert allowed is True
    allowed, _ = limiter.check("1234567890", "safety")
    assert allowed is False

def test_different_phones_independent():
    redis = FakeRedis()
    limiter = RateLimiter(redis)
    for i in range(10):
        limiter.check("1111111111", "sms")
    allowed, _ = limiter.check("2222222222", "sms")
    assert allowed is True
```

**Step 2: Run → FAIL**

**Step 3: Implement**

```python
# backend/app/services/rate_limiter.py

LIMITS = {
    "sms": {"max": 10, "ttl": 3600},       # 10/hour
    "ivr": {"max": 5, "ttl": 3600},         # 5/hour
    "safety": {"max": 3, "ttl": 86400},     # 3/day
}

class RateLimiter:
    def __init__(self, redis_client):
        self.redis = redis_client

    def check(self, phone: str, channel: str) -> tuple[bool, int]:
        config = LIMITS.get(channel, LIMITS["sms"])
        key = f"rate:{phone}:{channel}"

        current = self.redis.get(key)
        if current is None:
            self.redis.incr(key)
            self.redis.expire(key, config["ttl"])
            return True, config["max"] - 1

        count = int(current) if isinstance(current, (str, bytes)) else current
        if count >= config["max"]:
            return False, 0

        self.redis.incr(key)
        return True, config["max"] - count - 1
```

**Step 4: Run → PASS**

**Step 5: Commit**

```bash
git add backend/app/services/rate_limiter.py backend/tests/unit/test_rate_limiter.py
git commit -m "feat: implement Redis-based Rate Limiter"
```

---

### Task 8: Implement Audit Logger Service

**Files:**
- Create: `backend/app/services/audit_logger.py`
- Create: `backend/tests/unit/test_audit_logger.py`

**Step 1: Write failing tests**

```python
# backend/tests/unit/test_audit_logger.py
import json
from app.services.audit_logger import AuditLogger

class FakeS3:
    def __init__(self):
        self.objects = {}
    def put_object(self, Bucket, Key, Body):
        self.objects[Key] = Body

def test_log_creates_s3_object():
    s3 = FakeS3()
    logger = AuditLogger(s3_client=s3, bucket="test-bucket")
    logger.log(
        event_type="trip_status_change",
        data={"trip_id": "t1", "status": "Running Today"},
        confidence=0.9
    )
    assert len(s3.objects) == 1

def test_log_contains_required_fields():
    s3 = FakeS3()
    logger = AuditLogger(s3_client=s3, bucket="test-bucket")
    logger.log(
        event_type="arrival_prediction",
        data={"trip_id": "t1"},
        confidence=0.75
    )
    key = list(s3.objects.keys())[0]
    body = json.loads(s3.objects[key])
    assert "timestamp" in body
    assert "event_type" in body
    assert "data" in body
    assert "confidence" in body
```

**Step 2: Run → FAIL**

**Step 3: Implement**

```python
# backend/app/services/audit_logger.py
import json
import uuid
from datetime import datetime

class AuditLogger:
    def __init__(self, s3_client, bucket: str):
        self.s3 = s3_client
        self.bucket = bucket

    def log(self, event_type: str, data: dict, confidence: float = None):
        entry = {
            "audit_id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "event_type": event_type,
            "data": data,
            "confidence": confidence,
        }
        now = datetime.utcnow()
        key = f"audit/{now.strftime('%Y/%m/%d')}/{entry['audit_id']}.json"
        self.s3.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=json.dumps(entry),
        )
```

**Step 4: Run → PASS**

**Step 5: Commit**

```bash
git add backend/app/services/audit_logger.py backend/tests/unit/test_audit_logger.py
git commit -m "feat: implement S3-based Audit Logger"
```

---

### Task 9: Implement Query Router and API Endpoints

**Files:**
- Create: `backend/app/services/query_router.py`
- Create: `backend/app/routers/query.py`
- Create: `backend/app/routers/emergency.py`
- Create: `backend/app/routers/safety.py`
- Create: `backend/app/routers/feedback.py`
- Modify: `backend/app/main.py`
- Create: `backend/tests/unit/test_api.py`

**Step 1: Write failing API tests**

```python
# backend/tests/unit/test_api.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_query_bus_returns_valid_response():
    response = client.post("/api/v1/query", json={
        "bus_number": "45A",
        "stop_name": "Adyar",
        "language": "en"
    })
    assert response.status_code == 200
    data = response.json()
    assert "trip_status" in data
    assert "arrival_window" in data

def test_query_bus_without_stop():
    response = client.post("/api/v1/query", json={
        "bus_number": "45A",
        "language": "en"
    })
    assert response.status_code == 200

def test_emergency_info():
    response = client.get("/api/v1/emergency/45A")
    assert response.status_code == 200
    data = response.json()
    assert "bus_number" in data
    assert "helpline_numbers" in data

def test_feedback_submit():
    response = client.post("/api/v1/feedback", json={
        "route_id": "CHN-MAD-1",
        "feedback_type": "Satisfactory",
        "channel": "Web"
    })
    assert response.status_code == 200

def test_feedback_invalid_type():
    response = client.post("/api/v1/feedback", json={
        "route_id": "CHN-MAD-1",
        "feedback_type": "Amazing",
        "channel": "Web"
    })
    assert response.status_code == 422

def test_safety_escalation():
    response = client.post("/api/v1/safety/escalate", json={
        "phone_number": "9876543210",
        "bus_number": "45A",
        "incident_category": "Harassment"
    })
    assert response.status_code == 200
    data = response.json()
    assert "escalation_id" in data
```

**Step 2: Run → FAIL**

**Step 3: Implement routers**

```python
# backend/app/routers/query.py
import uuid
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/v1", tags=["query"])

class BusQueryRequest(BaseModel):
    bus_number: str
    stop_name: Optional[str] = None
    language: str = "en"

class BusQueryResponse(BaseModel):
    request_id: str
    trip_status: str
    arrival_window: str
    delay_reason: Optional[str] = None
    timestamp: str
    language: str

@router.post("/query")
def query_bus(req: BusQueryRequest) -> BusQueryResponse:
    # MVP: Returns mock data; will be wired to real services in Phase 2 integration
    return BusQueryResponse(
        request_id=f"req-{uuid.uuid4().hex[:8]}",
        trip_status="Running Today",
        arrival_window="10-15 minutes",
        delay_reason=None,
        timestamp=datetime.now().isoformat(),
        language=req.language,
    )
```

```python
# backend/app/routers/emergency.py
from fastapi import APIRouter

router = APIRouter(prefix="/api/v1", tags=["emergency"])

HELPLINES = {
    "police": "112",
    "ambulance": "108",
    "women_safety": "1091",
    "transport_helpline": "1800-XXX-XXXX",
}

@router.get("/emergency/{bus_number}")
def get_emergency_info(bus_number: str):
    return {
        "bus_number": bus_number,
        "route_id": None,
        "last_confirmed_stop": None,
        "helpline_numbers": HELPLINES,
    }
```

```python
# backend/app/routers/safety.py
import uuid
import hashlib
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models.schemas import IncidentCategoryEnum

router = APIRouter(prefix="/api/v1", tags=["safety"])

class SafetyEscalationRequest(BaseModel):
    phone_number: str
    bus_number: str
    incident_category: IncidentCategoryEnum
    trip_id: str | None = None

@router.post("/safety/escalate")
def escalate_safety(req: SafetyEscalationRequest):
    if not req.phone_number:
        raise HTTPException(status_code=400, detail="Phone number required for safety escalation")

    phone_hash = hashlib.sha256(req.phone_number.encode()).hexdigest()[:16]
    escalation_id = f"esc-{uuid.uuid4().hex[:8]}"

    return {
        "escalation_id": escalation_id,
        "status": "Pending",
        "message": "Your report has been forwarded to the control room.",
    }
```

```python
# backend/app/routers/feedback.py
import uuid
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel
from app.models.schemas import FeedbackTypeEnum, ChannelEnum

router = APIRouter(prefix="/api/v1", tags=["feedback"])

class FeedbackRequest(BaseModel):
    route_id: str
    feedback_type: FeedbackTypeEnum
    channel: ChannelEnum = ChannelEnum.WEB

@router.post("/feedback")
def submit_feedback(req: FeedbackRequest):
    feedback_id = f"fb-{uuid.uuid4().hex[:8]}"
    return {
        "feedback_id": feedback_id,
        "message": "Thank you for your feedback.",
    }
```

**Step 4: Update main.py to include routers**

```python
# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from app.routers import query, emergency, safety, feedback

app = FastAPI(
    title="Transit India API",
    description="National bus information platform API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(query.router)
app.include_router(emergency.router)
app.include_router(safety.router)
app.include_router(feedback.router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "transit-india"}

handler = Mangum(app, lifespan="off")
```

**Step 5: Run tests → PASS**

**Step 6: Commit**

```bash
git add backend/app/routers/ backend/app/main.py backend/tests/unit/test_api.py
git commit -m "feat: implement API endpoints for query, emergency, safety, feedback"
```

---

### Task 10: Implement SMS Parser

**Files:**
- Create: `backend/app/routers/sms.py`
- Create: `backend/tests/unit/test_sms_parser.py`

**Step 1: Write failing tests**

```python
# backend/tests/unit/test_sms_parser.py
from app.routers.sms import parse_sms

def test_parse_bus_with_stop():
    result = parse_sms("BUS 45A Adyar")
    assert result["bus_number"] == "45A"
    assert result["stop_name"] == "Adyar"

def test_parse_bus_without_stop():
    result = parse_sms("BUS 45A")
    assert result["bus_number"] == "45A"
    assert result["stop_name"] is None

def test_parse_case_insensitive():
    result = parse_sms("bus 45a adyar")
    assert result["bus_number"] == "45A"
    assert result["stop_name"] == "Adyar"

def test_parse_multiword_stop():
    result = parse_sms("BUS 21G T Nagar Bus Stand")
    assert result["bus_number"] == "21G"
    assert result["stop_name"] == "T Nagar Bus Stand"

def test_parse_invalid_format():
    result = parse_sms("hello world")
    assert result is None

def test_parse_empty():
    result = parse_sms("")
    assert result is None
```

**Step 2: Run → FAIL**

**Step 3: Implement**

```python
# backend/app/routers/sms.py
import re
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1", tags=["sms"])

def parse_sms(message: str) -> dict | None:
    if not message or not message.strip():
        return None

    message = message.strip()
    match = re.match(r'^bus\s+(\S+)(?:\s+(.+))?$', message, re.IGNORECASE)

    if not match:
        return None

    bus_number = match.group(1).upper()
    stop_name = match.group(2)
    if stop_name:
        stop_name = stop_name.strip().title()

    return {"bus_number": bus_number, "stop_name": stop_name}

class SMSWebhookRequest(BaseModel):
    phone_number: str
    message: str

@router.post("/sms/webhook")
def handle_sms(req: SMSWebhookRequest):
    parsed = parse_sms(req.message)
    if parsed is None:
        return {
            "response": "Invalid format. Please use: BUS <BusNumber> <StopName>. Example: BUS 45A Adyar"
        }

    # MVP: mock response; will be wired to query router
    return {
        "response": f"Bus {parsed['bus_number']}: Running Today. Arrival: 10-15 minutes. Time: {__import__('datetime').datetime.now().strftime('%H:%M')}"
    }
```

**Step 4: Run → PASS**

**Step 5: Commit**

```bash
git add backend/app/routers/sms.py backend/tests/unit/test_sms_parser.py
git commit -m "feat: implement SMS parser and webhook handler"
```

---

### Task 11: Synthetic Data Generator

**Files:**
- Create: `backend/app/data/seed.py`
- Create: `backend/app/data/tamil_nadu_routes.py`

**Step 1: Write the seed data module with Tamil Nadu routes**

```python
# backend/app/data/tamil_nadu_routes.py
DISTRICTS = {
    "Chennai": ["Broadway", "T Nagar", "Adyar", "Anna Nagar", "Tambaram", "Chrompet", "Guindy", "Egmore", "Triplicane", "Mylapore", "Velachery", "Porur", "Ambattur", "Avadi", "Perambur"],
    "Coimbatore": ["Gandhipuram", "RS Puram", "Ukkadam", "Singanallur", "Peelamedu", "Saravanampatti", "Kuniyamuthur", "Hopes College", "Town Hall", "Sidhapudur"],
    "Madurai": ["Periyar Bus Stand", "Mattuthavani", "Anna Bus Stand", "Tallakulam", "Goripalayam", "KK Nagar", "Thirunagar", "Vilangudi", "Palanganatham", "Sellur"],
    "Tiruchirappalli": ["Central Bus Stand", "Chathram Bus Stand", "Srirangam", "Thillai Nagar", "KK Nagar", "Woraiyur", "Cantonment", "Puthur", "Thennur", "Crawford"],
    "Salem": ["New Bus Stand", "Old Bus Stand", "Suramangalam", "Hasthampatti", "Ammapet", "Alagapuram", "Fairlands", "Shevapet", "Steel Plant", "Junction"],
}

BUS_TYPES = ["Ordinary", "Express", "Deluxe", "Ultra Deluxe", "AC"]

def generate_bus_number(district_code: str, index: int) -> str:
    suffixes = ["", "A", "B", "C", "D", "E", "F", "G"]
    num = (index % 99) + 1
    suffix = suffixes[index % len(suffixes)]
    return f"{num}{suffix}"
```

```python
# backend/app/data/seed.py
import uuid
import random
from datetime import datetime, timedelta, date, time
from app.data.tamil_nadu_routes import DISTRICTS, BUS_TYPES

def generate_routes(num_routes=50):
    routes = []
    district_names = list(DISTRICTS.keys())

    for i in range(num_routes):
        origin_district = district_names[i % len(district_names)]
        dest_district = district_names[(i + 1) % len(district_names)]
        origin_stops = DISTRICTS[origin_district]
        dest_stops = DISTRICTS[dest_district]

        num_stops = random.randint(8, 20)
        stop_sequence = random.sample(origin_stops, min(num_stops // 2, len(origin_stops)))
        stop_sequence += random.sample(dest_stops, min(num_stops - len(stop_sequence), len(dest_stops)))

        route = {
            "id": f"R-{i+1:03d}",
            "name": f"{origin_district} - {dest_district} {BUS_TYPES[i % len(BUS_TYPES)]}",
            "stops_sequence": stop_sequence,
            "status": "active",
        }
        routes.append(route)
    return routes

def generate_stops():
    stops = []
    seen = set()
    for district, stop_names in DISTRICTS.items():
        for name in stop_names:
            if name not in seen:
                stops.append({
                    "id": f"S-{len(stops)+1:04d}",
                    "name_en": name,
                    "name_ta": name,  # placeholder
                    "name_hi": name,  # placeholder
                    "latitude": round(random.uniform(8.0, 13.5), 4),
                    "longitude": round(random.uniform(76.0, 80.5), 4),
                })
                seen.add(name)
    return stops

def generate_trips(routes, days=7):
    trips = []
    for route in routes:
        for day_offset in range(days):
            trip_date = date.today() + timedelta(days=day_offset)
            departures = [time(h, 0) for h in [6, 8, 10, 12, 14, 16, 18, 20]]
            for dep_time in random.sample(departures, random.randint(3, 6)):
                departure = datetime.combine(trip_date, dep_time)
                bus_num = f"{random.randint(1,99)}{random.choice(['', 'A', 'B', 'C', 'D'])}"
                has_etm = random.random() > 0.2

                trips.append({
                    "id": f"T-{uuid.uuid4().hex[:8]}",
                    "route_id": route["id"],
                    "bus_number": bus_num,
                    "scheduled_departure": departure.isoformat(),
                    "status": "Running Today" if has_etm else "Status Not Confirmed",
                    "etm_login_time": (departure - timedelta(minutes=random.randint(5, 15))).isoformat() if has_etm else None,
                })
    return trips

def generate_historical_performance(routes, stops, months=12):
    records = []
    base_date = date.today() - timedelta(days=months * 30)

    for route in routes[:20]:  # first 20 routes for training data
        route_stops = route["stops_sequence"][:5]  # first 5 stops per route
        for day_offset in range(months * 30):
            record_date = base_date + timedelta(days=day_offset)
            day_of_week = record_date.weekday() + 1

            for dep_hour in [8, 12, 16]:
                for stop_name in route_stops:
                    base_delay = random.gauss(5, 3)
                    if day_of_week <= 5 and dep_hour in [8, 16]:
                        base_delay += random.gauss(8, 4)  # rush hour

                    delay = max(0, int(base_delay))
                    scheduled = datetime.combine(record_date, time(dep_hour, 0))
                    actual = scheduled + timedelta(minutes=delay)

                    records.append({
                        "route_id": route["id"],
                        "stop_name": stop_name,
                        "scheduled_time": scheduled.isoformat(),
                        "actual_arrival": actual.isoformat(),
                        "delay_minutes": delay,
                        "day_of_week": day_of_week,
                        "season": "summer" if record_date.month in [3,4,5] else "monsoon" if record_date.month in [6,7,8,9] else "winter",
                    })
    return records

if __name__ == "__main__":
    routes = generate_routes(50)
    stops = generate_stops()
    trips = generate_trips(routes, days=7)
    historical = generate_historical_performance(routes, stops, months=12)

    print(f"Generated: {len(routes)} routes, {len(stops)} stops, {len(trips)} trips, {len(historical)} historical records")
```

**Step 2: Test data generator runs**

```bash
cd backend && python -m app.data.seed
# Expected: "Generated: 50 routes, XX stops, XX trips, XX historical records"
```

**Step 3: Commit**

```bash
git add backend/app/data/
git commit -m "feat: add synthetic data generator for Tamil Nadu routes"
```

---

## Phase 2: AWS Infrastructure Deployment

### Task 12: Create AWS SAM Template

**Files:**
- Create: `backend/infrastructure/template.yaml`
- Create: `backend/infrastructure/samconfig.toml`

**Step 1: Write SAM template**

```yaml
# backend/infrastructure/template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: Transit India - National Bus Information Platform

Globals:
  Function:
    Timeout: 30
    Runtime: python3.11
    MemorySize: 512
    Environment:
      Variables:
        TRANSIT_DATABASE_URL: !Sub 'postgresql://${DBUsername}:${DBPassword}@${PostgresDB.Endpoint.Address}:5432/transitindia'
        TRANSIT_REDIS_URL: !Sub 'redis://${RedisCluster.RedisEndpoint.Address}:6379'
        TRANSIT_AWS_REGION: !Ref AWS::Region
        TRANSIT_AUDIT_BUCKET: !Ref AuditBucket
        TRANSIT_ML_BUCKET: !Ref MLBucket

Parameters:
  DBUsername:
    Type: String
    Default: transit
  DBPassword:
    Type: String
    NoEcho: true
    Default: TransitIndia2026!
  Environment:
    Type: String
    Default: dev
    AllowedValues: [dev, staging, prod]

Resources:
  # VPC
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsSupport: true
      EnableDnsHostnames: true
      Tags:
        - Key: Name
          Value: transit-india-vpc

  PublicSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.1.0/24
      AvailabilityZone: !Select [0, !GetAZs '']
      MapPublicIpOnLaunch: true

  PublicSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.2.0/24
      AvailabilityZone: !Select [1, !GetAZs '']
      MapPublicIpOnLaunch: true

  PrivateSubnet1:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.3.0/24
      AvailabilityZone: !Select [0, !GetAZs '']

  PrivateSubnet2:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId: !Ref VPC
      CidrBlock: 10.0.4.0/24
      AvailabilityZone: !Select [1, !GetAZs '']

  InternetGateway:
    Type: AWS::EC2::InternetGateway

  AttachGateway:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref VPC
      InternetGatewayId: !Ref InternetGateway

  PublicRouteTable:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId: !Ref VPC

  PublicRoute:
    Type: AWS::EC2::Route
    DependsOn: AttachGateway
    Properties:
      RouteTableId: !Ref PublicRouteTable
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId: !Ref InternetGateway

  PublicSubnet1RouteAssoc:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnet1
      RouteTableId: !Ref PublicRouteTable

  PublicSubnet2RouteAssoc:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref PublicSubnet2
      RouteTableId: !Ref PublicRouteTable

  # RDS PostgreSQL
  DBSubnetGroup:
    Type: AWS::RDS::DBSubnetGroup
    Properties:
      DBSubnetGroupDescription: Transit India DB Subnet Group
      SubnetIds:
        - !Ref PrivateSubnet1
        - !Ref PrivateSubnet2

  DBSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Transit India DB Security Group
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 5432
          ToPort: 5432
          SourceSecurityGroupId: !Ref LambdaSecurityGroup

  PostgresDB:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: transit-india-db
      DBInstanceClass: db.t3.micro
      Engine: postgres
      EngineVersion: '15'
      MasterUsername: !Ref DBUsername
      MasterUserPassword: !Ref DBPassword
      DBName: transitindia
      AllocatedStorage: 20
      DBSubnetGroupName: !Ref DBSubnetGroup
      VPCSecurityGroups:
        - !Ref DBSecurityGroup
      PubliclyAccessible: false

  # ElastiCache Redis
  RedisSubnetGroup:
    Type: AWS::ElastiCache::SubnetGroup
    Properties:
      Description: Transit India Redis Subnet Group
      SubnetIds:
        - !Ref PrivateSubnet1
        - !Ref PrivateSubnet2

  RedisSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Transit India Redis Security Group
      VpcId: !Ref VPC
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 6379
          ToPort: 6379
          SourceSecurityGroupId: !Ref LambdaSecurityGroup

  RedisCluster:
    Type: AWS::ElastiCache::CacheCluster
    Properties:
      CacheNodeType: cache.t3.micro
      Engine: redis
      NumCacheNodes: 1
      CacheSubnetGroupName: !Ref RedisSubnetGroup
      VpcSecurityGroupIds:
        - !Ref RedisSecurityGroup

  # Lambda Security Group
  LambdaSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Transit India Lambda Security Group
      VpcId: !Ref VPC
      SecurityGroupEgress:
        - IpProtocol: -1
          CidrIp: 0.0.0.0/0

  # S3 Buckets
  AuditBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'transit-india-audit-${AWS::AccountId}'
      LifecycleConfiguration:
        Rules:
          - Id: DeleteAfter90Days
            Status: Enabled
            ExpirationInDays: 90

  MLBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'transit-india-ml-${AWS::AccountId}'

  FrontendBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'transit-india-frontend-${AWS::AccountId}'
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: index.html

  # Lambda Function
  TransitIndiaAPI:
    Type: AWS::Serverless::Function
    Properties:
      FunctionName: transit-india-api
      Handler: app.main.handler
      CodeUri: ../
      Timeout: 30
      MemorySize: 512
      VpcConfig:
        SecurityGroupIds:
          - !Ref LambdaSecurityGroup
        SubnetIds:
          - !Ref PrivateSubnet1
          - !Ref PrivateSubnet2
      Policies:
        - S3CrudPolicy:
            BucketName: !Ref AuditBucket
        - S3CrudPolicy:
            BucketName: !Ref MLBucket
        - Version: '2012-10-17'
          Statement:
            - Effect: Allow
              Action:
                - sagemaker:InvokeEndpoint
              Resource: '*'
      Events:
        ApiGateway:
          Type: Api
          Properties:
            Path: /{proxy+}
            Method: ANY
        HealthCheck:
          Type: Api
          Properties:
            Path: /health
            Method: GET

  # CloudFront for Frontend
  FrontendCDN:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt FrontendBucket.RegionalDomainName
            Id: S3Origin
            S3OriginConfig:
              OriginAccessIdentity: ''
        Enabled: true
        DefaultRootObject: index.html
        DefaultCacheBehavior:
          AllowedMethods: [GET, HEAD]
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          ForwardedValues:
            QueryString: false

Outputs:
  ApiEndpoint:
    Description: API Gateway endpoint URL
    Value: !Sub 'https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod'
  FrontendURL:
    Description: CloudFront frontend URL
    Value: !GetAtt FrontendCDN.DomainName
  DatabaseEndpoint:
    Description: PostgreSQL endpoint
    Value: !GetAtt PostgresDB.Endpoint.Address
  RedisEndpoint:
    Description: Redis endpoint
    Value: !GetAtt RedisCluster.RedisEndpoint.Address
```

**Step 2: Write samconfig.toml**

```toml
# backend/infrastructure/samconfig.toml
version = 0.1

[default.deploy.parameters]
stack_name = "transit-india"
resolve_s3 = true
s3_prefix = "transit-india"
region = "ap-south-1"
confirm_changeset = true
capabilities = "CAPABILITY_IAM CAPABILITY_AUTO_EXPAND"
```

**Step 3: Commit**

```bash
git add backend/infrastructure/
git commit -m "feat: add AWS SAM template for full infrastructure"
```

---

### Task 13: Deploy AWS Infrastructure

**Step 1: Install AWS SAM CLI (if not installed)**

```bash
pip install aws-sam-cli
```

**Step 2: Build**

```bash
cd backend && sam build -t infrastructure/template.yaml
```

**Step 3: Deploy**

```bash
cd backend && sam deploy -t infrastructure/template.yaml --guided
# Follow prompts, accept defaults, note the outputs
```

**Step 4: Record outputs** — save the API Gateway URL, CloudFront URL, DB endpoint, and Redis endpoint.

**Step 5: Commit**

```bash
git commit -m "chore: deploy infrastructure to AWS"
```

---

### Task 14: Seed Database with Synthetic Data

**Files:**
- Create: `backend/app/data/seed_db.py`

**Step 1: Write the database seeder**

```python
# backend/app/data/seed_db.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.database import Base, Route, Stop, Trip
from app.data.seed import generate_routes, generate_stops, generate_trips
from datetime import datetime

def seed_database():
    db_url = os.environ.get("TRANSIT_DATABASE_URL", "postgresql://transit:TransitIndia2026!@localhost:5432/transitindia")
    engine = create_engine(db_url)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    # Generate data
    routes_data = generate_routes(50)
    stops_data = generate_stops()
    trips_data = generate_trips(routes_data, days=7)

    # Seed stops
    for s in stops_data:
        stop = Stop(id=s["id"], name_en=s["name_en"], name_ta=s["name_ta"], name_hi=s["name_hi"],
                     latitude=s["latitude"], longitude=s["longitude"])
        session.merge(stop)

    # Seed routes
    for r in routes_data:
        route = Route(id=r["id"], name=r["name"], stops_sequence=r["stops_sequence"], status=r["status"])
        session.merge(route)

    # Seed trips
    for t in trips_data:
        trip = Trip(
            id=t["id"], route_id=t["route_id"], bus_number=t["bus_number"],
            scheduled_departure=datetime.fromisoformat(t["scheduled_departure"]),
            status=t["status"],
            etm_login_time=datetime.fromisoformat(t["etm_login_time"]) if t["etm_login_time"] else None,
        )
        session.merge(trip)

    session.commit()
    print(f"Seeded: {len(stops_data)} stops, {len(routes_data)} routes, {len(trips_data)} trips")
    session.close()

if __name__ == "__main__":
    seed_database()
```

**Step 2: Run seeder against RDS**

```bash
cd backend && TRANSIT_DATABASE_URL="postgresql://transit:TransitIndia2026!@<RDS_ENDPOINT>:5432/transitindia" python -m app.data.seed_db
```

**Step 3: Commit**

```bash
git add backend/app/data/seed_db.py
git commit -m "feat: add database seeder script"
```

---

## Phase 3: AI/ML Pipeline

### Task 15: Prophet Forecasting Model Training Script

**Files:**
- Create: `backend/ml_training/forecasting/train.py`
- Create: `backend/ml_training/forecasting/requirements.txt`

**Step 1: Write training script**

```python
# backend/ml_training/forecasting/train.py
import os
import json
import pandas as pd
import numpy as np
from prophet import Prophet
import joblib

def train():
    data_path = os.environ.get("SM_CHANNEL_TRAIN", "/opt/ml/input/data/train")
    model_dir = os.environ.get("SM_MODEL_DIR", "/opt/ml/model")

    df = pd.read_csv(f"{data_path}/historical_performance.csv")

    # Prepare Prophet format
    df["ds"] = pd.to_datetime(df["scheduled_time"])
    df["y"] = df["delay_minutes"]

    # Train per-route models (top routes)
    models = {}
    for route_id in df["route_id"].unique()[:20]:
        route_df = df[df["route_id"] == route_id][["ds", "y"]].copy()
        if len(route_df) < 30:
            continue

        model = Prophet(
            daily_seasonality=True,
            weekly_seasonality=True,
            yearly_seasonality=True,
            changepoint_prior_scale=0.05,
        )
        model.fit(route_df)
        models[route_id] = model

    # Save models
    joblib.dump(models, f"{model_dir}/prophet_models.joblib")

    # Save model metadata
    metadata = {
        "num_routes": len(models),
        "route_ids": list(models.keys()),
    }
    with open(f"{model_dir}/metadata.json", "w") as f:
        json.dump(metadata, f)

    print(f"Trained {len(models)} route models")

if __name__ == "__main__":
    train()
```

```
# backend/ml_training/forecasting/requirements.txt
prophet==1.1.5
pandas==2.2.0
numpy==1.26.4
joblib==1.3.2
```

**Step 2: Commit**

```bash
git add backend/ml_training/forecasting/
git commit -m "feat: add Prophet forecasting training script for SageMaker"
```

---

### Task 16: XGBoost Delay Classifier Training Script

**Files:**
- Create: `backend/ml_training/delay_classifier/train.py`
- Create: `backend/ml_training/delay_classifier/requirements.txt`

**Step 1: Write training script**

```python
# backend/ml_training/delay_classifier/train.py
import os
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import xgboost as xgb
import joblib

DELAY_CLASSES = {
    0: "Heavy traffic",
    1: "Late departure",
    2: "Road diversion",
    3: "Service disruption",
}

def assign_label(row):
    delay = row["delay_minutes"]
    hour = pd.to_datetime(row["scheduled_time"]).hour
    dow = row["day_of_week"]

    if hour in [7, 8, 9, 17, 18, 19] and delay > 5:
        return 0  # Heavy traffic
    elif delay > 0 and delay <= 10:
        return 1  # Late departure
    elif row.get("season") == "monsoon" and delay > 10:
        return 2  # Road diversion
    elif delay > 20:
        return 3  # Service disruption
    else:
        return 1  # default: Late departure

def train():
    data_path = os.environ.get("SM_CHANNEL_TRAIN", "/opt/ml/input/data/train")
    model_dir = os.environ.get("SM_MODEL_DIR", "/opt/ml/model")

    df = pd.read_csv(f"{data_path}/historical_performance.csv")

    # Feature engineering
    df["hour"] = pd.to_datetime(df["scheduled_time"]).dt.hour
    df["is_rush_hour"] = df["hour"].isin([7, 8, 9, 17, 18, 19]).astype(int)
    df["is_weekend"] = (df["day_of_week"] >= 6).astype(int)
    df["season_monsoon"] = (df["season"] == "monsoon").astype(int)
    df["season_summer"] = (df["season"] == "summer").astype(int)

    # Assign labels
    df["label"] = df.apply(assign_label, axis=1)

    features = ["delay_minutes", "hour", "is_rush_hour", "is_weekend", "day_of_week", "season_monsoon", "season_summer"]
    X = df[features]
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = xgb.XGBClassifier(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        objective="multi:softprob",
        num_class=4,
        random_state=42,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    report = classification_report(y_test, y_pred, target_names=list(DELAY_CLASSES.values()))
    print(report)

    joblib.dump(model, f"{model_dir}/delay_classifier.joblib")

    metadata = {
        "features": features,
        "classes": DELAY_CLASSES,
        "accuracy": float((y_pred == y_test).mean()),
    }
    with open(f"{model_dir}/metadata.json", "w") as f:
        json.dump(metadata, f)

if __name__ == "__main__":
    train()
```

```
# backend/ml_training/delay_classifier/requirements.txt
xgboost==2.0.3
scikit-learn==1.4.1
pandas==2.2.0
numpy==1.26.4
joblib==1.3.2
```

**Step 2: Commit**

```bash
git add backend/ml_training/delay_classifier/
git commit -m "feat: add XGBoost delay classifier training script"
```

---

### Task 17: Upload Training Data and Run SageMaker Jobs

**Step 1: Generate and upload training data to S3**

```bash
cd backend && python -c "
from app.data.seed import generate_routes, generate_stops, generate_historical_performance
import csv
routes = generate_routes(50)
stops = generate_stops()
historical = generate_historical_performance(routes, stops, months=12)
with open('/tmp/historical_performance.csv', 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=historical[0].keys())
    writer.writeheader()
    writer.writerows(historical)
print(f'Wrote {len(historical)} records to /tmp/historical_performance.csv')
"
```

```bash
aws s3 cp /tmp/historical_performance.csv s3://transit-india-ml-<ACCOUNT_ID>/training-data/historical_performance.csv
```

**Step 2: Create SageMaker training job (forecasting)**

This will use SageMaker's ScriptMode with the Prophet training script.

**Step 3: Create SageMaker training job (delay classifier)**

**Step 4: Deploy SageMaker endpoints**

**Step 5: Commit config changes**

---

## Phase 4: Frontend Updates

### Task 18: Update React App for Passenger vs Admin Split

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/TrackingDashboard.jsx`

**Step 1: Update App.jsx to separate passenger and admin flows**

The passenger flow skips login entirely and goes straight to the tracking dashboard. Admin flow (Login → OTP → Control Room) is separate.

Update `src/App.jsx`:
- Default `currentPage` to `'track'` instead of `'login'`
- Add `isAdmin` state toggle
- Passenger routes: track, routeDetails, emergency, service-reporting
- Admin routes: login, otp, profile (control room)

**Step 2: Update TrackingDashboard to call real API**

Replace the `generateDistrictRoutes()` mock function with actual fetch calls to the API Gateway endpoint:
- `POST /api/v1/query` with bus_number and stop_name
- Parse real response: trip_status, arrival_window, delay_reason

**Step 3: Update EmergencyDashboard to call real API**

- `GET /api/v1/emergency/{bus_number}` for helpline numbers
- `POST /api/v1/safety/escalate` for safety escalation

**Step 4: Update ServiceReporting to call real API**

- `POST /api/v1/feedback` for feedback submission

**Step 5: Build and deploy to S3**

```bash
npm run build
aws s3 sync dist/ s3://transit-india-frontend-<ACCOUNT_ID>/ --delete
```

**Step 6: Commit**

```bash
git add src/
git commit -m "feat: wire frontend to real API endpoints, split passenger/admin flows"
```

---

## Phase 5: SMS Channel Integration

### Task 19: Set Up SNS for SMS

**Step 1: Create SNS topic**

```bash
aws sns create-topic --name transit-india-sms-inbound
```

**Step 2: Configure SMS webhook** — route inbound SMS to the Lambda function's `/api/v1/sms/webhook` endpoint.

**Step 3: Test SMS flow**

```bash
# Simulate an inbound SMS
curl -X POST https://<API_GATEWAY_URL>/api/v1/sms/webhook \
  -H "Content-Type: application/json" \
  -d '{"phone_number": "9876543210", "message": "BUS 45A Adyar"}'
```

**Step 4: Commit**

---

## Phase 6: Kinesis Streaming (ETM Events)

### Task 20: Set Up Kinesis for Real-Time ETM Ingestion

**Step 1: Create Kinesis stream**

```bash
aws kinesis create-stream --stream-name transit-india-etm-events --shard-count 1
```

**Step 2: Create Lambda consumer** that reads ETM events from Kinesis and:
- Updates trip status in Redis cache
- Stores events in Timestream (or falls back to S3 if Timestream not yet configured)

**Step 3: Create synthetic ETM event producer** that simulates real-time bus operations.

**Step 4: Test end-to-end**: Producer → Kinesis → Lambda → Redis → Query API returns updated status.

**Step 5: Commit**

---

## Test Summary

After all phases, run the full test suite:

```bash
cd backend && python -m pytest tests/ -v --tb=short
```

Expected coverage:
- **Unit tests**: All services (Trip Status, Arrival Prediction, Delay Classifier, Rate Limiter, Audit Logger, SMS Parser)
- **Property tests**: Properties 1-8, 11, 20, 26-28
- **API tests**: All endpoints return correct status codes and response shapes
- **Integration tests**: SMS → API → Response pipeline

Target: 80%+ code coverage, all 32 correctness properties validated.
