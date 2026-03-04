# Transit India — AWS Implementation Design

**Date:** 2026-03-04
**Goal:** Functional MVP — all features working end-to-end on AWS serverless
**Backend:** Python (FastAPI) on Lambda
**Architecture:** Serverless-First
**Data:** Synthetic (50 Tamil Nadu routes, 12-month historical data)

## AWS Infrastructure Architecture

```
FRONTEND
  React (Vite) → S3 + CloudFront

ACCESS LAYER
  API Gateway (REST) → Lambda (FastAPI via Mangum)
  SNS/Pinpoint → Lambda (SMS Handler)
  Rate Limiting: API Gateway throttling + Redis-based custom limiter

CORE SERVICES (Lambda)
  Trip Status | Arrival Prediction | Delay Classifier
  Emergency Info | Safety Escalation | Feedback | Query Router

AI/ML SERVICES
  SageMaker Endpoints: Prophet (forecasting), XGBoost (delay classifier)
  SageMaker Training Jobs: Weekly/Monthly retraining via EventBridge
  Confidence Calculator: In-Lambda computation

DATA LAYER
  RDS PostgreSQL: Routes, Stops, Trips, Escalations, Feedback
  Amazon Timestream: Historical performance, ETM events
  ElastiCache Redis: Trip status cache (24hr TTL), rate limiting
  S3: Audit logs (90-day lifecycle), ML data, model artifacts, frontend
  Kinesis Data Streams: Real-time ETM event ingestion
```

## Backend Structure

```
backend/
├── app/
│   ├── main.py                    # FastAPI + Mangum handler
│   ├── routers/
│   │   ├── query.py               # Bus query endpoints
│   │   ├── emergency.py           # Emergency info endpoints
│   │   ├── safety.py              # Safety escalation endpoints
│   │   ├── feedback.py            # Feedback endpoints
│   │   └── sms.py                 # SMS webhook handler
│   ├── services/
│   │   ├── trip_status.py         # 4-state trip status logic
│   │   ├── arrival_prediction.py  # Confidence → window mapping
│   │   ├── delay_classifier.py    # Delay reason classification
│   │   ├── query_router.py        # Query routing
│   │   ├── rate_limiter.py        # Redis-based rate limiting
│   │   └── audit_logger.py        # S3-based audit logging
│   ├── ml/
│   │   ├── forecasting.py         # SageMaker Prophet client
│   │   ├── confidence.py          # Confidence calculator
│   │   └── delay_model.py         # SageMaker XGBoost client
│   ├── models/
│   │   ├── schemas.py             # Pydantic models
│   │   └── database.py            # SQLAlchemy models
│   ├── data/
│   │   └── seed.py                # Synthetic data generator
│   └── config.py                  # Environment config
├── ml_training/
│   ├── forecasting/
│   │   ├── train.py               # Prophet training for SageMaker
│   │   └── requirements.txt
│   └── delay_classifier/
│       ├── train.py               # XGBoost training for SageMaker
│       └── requirements.txt
├── tests/
│   ├── unit/
│   ├── property/                  # hypothesis-based property tests
│   └── integration/
├── infrastructure/
│   └── template.yaml              # AWS SAM template
├── requirements.txt
└── samconfig.toml
```

## Data Layer

### RDS PostgreSQL Tables

- `routes` — id, name, stops_sequence (JSON), status (active/discontinued), created_at
- `stops` — id, name_en, name_ta, name_hi, latitude, longitude, created_at
- `trips` — id, route_id, bus_number, scheduled_departure, status (4 enum values), last_updated, etm_login_time, admin_note
- `safety_escalations` — id, phone_hash, bus_number, trip_id, category (4 enum values), status, resolution_notes, operator_id, created_at
- `feedback` — id, route_id, time_period, type (Satisfactory/Needs Improvement), channel, created_at

### Amazon Timestream Tables

- `etm_events` — event_type, trip_id, bus_number, stop_id, timestamp, device_id
- `historical_performance` — route_id, stop_id, scheduled_time, actual_arrival, delay_minutes, day_of_week, season, date
- `gps_locations` — bus_id, latitude, longitude, timestamp

### ElastiCache Redis Keys

- `trip:{trip_id}` — JSON trip status, TTL 24h
- `rate:{phone}:sms` — counter, TTL 1h (limit: 10)
- `rate:{phone}:ivr` — counter, TTL 1h (limit: 5)
- `rate:{phone}:safety` — counter, TTL 24h (limit: 3)

### S3 Buckets

- `transit-india-audit-logs` — JSON audit entries, 90-day lifecycle policy
- `transit-india-ml-data` — training datasets, model artifacts
- `transit-india-frontend` — static React build for CloudFront

## AI/ML Pipeline

### Prophet Forecasting (SageMaker)

- **Training data:** 12 months historical stop-level arrival times
- **Features:** time of day, day of week, season, route_id, stop_id
- **Output:** predicted arrival time + prediction interval
- **Deployment:** SageMaker real-time endpoint
- **Retraining:** Weekly via EventBridge + SageMaker Training Job

### XGBoost Delay Classifier (SageMaker)

- **Training data:** labeled delay records with known reasons
- **Features:** delay_minutes, rush_hour, route_history, speed_data
- **Classes:** Heavy traffic, Late departure, Road diversion, Service disruption
- **Deployment:** SageMaker real-time endpoint
- **Retraining:** Monthly

### Confidence Calculator (In-Lambda)

Maps confidence score to arrival window width:
- >80%: narrow window (5-min range, e.g., "10-15 minutes")
- 50-80%: medium window (10-min range, e.g., "10-20 minutes")
- 30-50%: wide window (15-min range, e.g., "10-25 minutes")
- <30%: return "Status Not Confirmed"

Inputs: prediction variance, data recency, GPS availability, historical accuracy.

## SMS Channel

- Amazon SNS for inbound SMS (passenger sends "BUS 45A Adyar")
- Lambda parses message format, extracts bus_number and stop_name
- Routes through same core services as Web API
- Response sent back via SNS publish
- Rate limiting: 10 queries/hr per phone via Redis

## Frontend Updates

- **Passenger UI (public):** No login required. Bus query, emergency info, safety reporting, feedback.
- **Admin/Control Room UI:** Login/OTP protected. View escalations, manage trips, view audit logs.
- **Deployment:** S3 static hosting + CloudFront CDN
- **Styling:** Government-grade (white/off-white, navy/indigo, no animations, min 16px text)

## Implementation Phases

### Phase 1: Foundation (Infrastructure + Data)
1. AWS SAM template: VPC, RDS PostgreSQL, ElastiCache Redis, S3 buckets, Timestream DB
2. Database schema creation (all PostgreSQL tables, Timestream tables)
3. Synthetic data generator (50 routes, 500+ stops, 12-month historical data, ETM events)
4. Seed databases with synthetic data

### Phase 2: Core Backend Services
1. FastAPI app with Mangum adapter
2. Trip Status Service (ETM login → Running, timeout → Unconfirmed, etc.)
3. Arrival Prediction Service (confidence → window width mapping)
4. Delay Classifier Service (single reason, default to "Status unknown")
5. Query Router (channel-agnostic routing)
6. Rate Limiter (Redis counters with TTL)
7. Audit Logger (S3 JSON writes)
8. Emergency Info, Safety Escalation, Feedback services
9. Deploy Lambda + API Gateway via SAM

### Phase 3: AI/ML Pipeline
1. Prophet model training script for SageMaker
2. XGBoost delay classifier training script
3. Upload training data to S3
4. Run SageMaker training jobs
5. Deploy SageMaker real-time endpoints
6. Wire ML endpoints into Arrival Prediction and Delay Classifier services
7. EventBridge schedules for periodic retraining

### Phase 4: SMS Channel
1. SNS topic and subscription setup
2. SMS parser Lambda (extract bus number, stop name from text)
3. SMS response formatter (concise text format)
4. Integration with core services via Query Router
5. Rate limiting for SMS channel

### Phase 5: Frontend + Deployment
1. Update React app: passenger UI (no login) + admin UI (with login)
2. Wire components to real API endpoints
3. Language toggle connected to API language parameter
4. Build and deploy to S3 + CloudFront
5. API Gateway custom domain setup

### Phase 6: Streaming + Real-time
1. Kinesis Data Stream for ETM event ingestion
2. Lambda consumer: update trip status in Redis cache
3. Lambda consumer: store events in Timestream
4. Synthetic ETM event producer (simulates real-time bus operations)

## Correctness Properties

All 32 properties from the design document will be validated through:
- Unit tests (pytest) for specific examples and edge cases
- Property-based tests (hypothesis) for universal invariants
- Integration tests for end-to-end flows
- Target: 80%+ code coverage, all properties passing
