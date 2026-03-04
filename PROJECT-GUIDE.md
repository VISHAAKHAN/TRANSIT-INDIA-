# Transit India - National Bus Information Platform

## Project Guide

**Transit India** is a national-level digital public infrastructure platform for real-time bus transit information across Indian state transport corporations. It provides real-time bus tracking, arrival predictions, emergency services, safety escalation, and feedback collection — built entirely on AWS serverless infrastructure.

---

## Live URLs

| Service | URL |
|---------|-----|
| **Frontend (Website)** | [https://d1k3y16wwsnjnb.cloudfront.net](https://d1k3y16wwsnjnb.cloudfront.net) |
| **API Gateway** | [https://puzyuk2l8j.execute-api.ap-south-1.amazonaws.com/Prod](https://puzyuk2l8j.execute-api.ap-south-1.amazonaws.com/Prod) |
| **Health Check** | [https://puzyuk2l8j.execute-api.ap-south-1.amazonaws.com/Prod/health](https://puzyuk2l8j.execute-api.ap-south-1.amazonaws.com/Prod/health) |

---

## How to Use the Platform

### For Passengers (No login required)

1. **Open the website** — Go to [https://d1k3y16wwsnjnb.cloudfront.net](https://d1k3y16wwsnjnb.cloudfront.net)
2. **Search for a bus** — Select your boarding point and destination from the dropdowns, then click "Get Bus Status"
3. **View live results** — See active buses with real-time ETA, delay reasons, and confidence scores
4. **Click any bus card** — View detailed route information
5. **Emergency** — Navigate to the Emergency tab for helpline numbers (Police 112, Ambulance 108, Women Safety 1091) and to report safety incidents
6. **Service Reporting** — Submit feedback (Satisfied/Unsatisfied) or report concerns (Rash Driving, Misconduct, Overcrowding)

### For Admin / Control Room

1. Login via the Login page (accessible from navigation)
2. Enter any 10-digit mobile number + solve the CAPTCHA
3. Enter any 6-digit OTP (demo mode)
4. Access the Profile page to set district preferences

---

## Features

| Feature | Description | Status |
|---------|-------------|--------|
| **Bus Route Search** | Search routes by boarding/destination across Tamil Nadu districts | Working (Real DB) |
| **Live Bus Status** | Real-time trip status: Running Today, Not Running, Status Not Confirmed | Working (Real DB) |
| **Arrival Predictions** | Confidence-based ETA windows (never exact times) | Working (Real DB) |
| **Emergency Dashboard** | One-tap access to Police (112), Ambulance (108), Women Safety (1091) | Working |
| **Safety Escalation** | Report harassment, threats, fights — saved to database | Working (Real DB) |
| **Feedback System** | Rate trips as Satisfactory/Needs Improvement | Working (Real DB) |
| **SMS Channel** | Parse SMS queries like "BUS 42B Adyar" | Working (Real DB) |
| **Dark/Light Mode** | Toggle between themes | Working |
| **Multi-language** | English, Hindi, Tamil | Working |
| **Responsive Design** | Mobile, tablet, and desktop | Working |

---

## Architecture

```
                    Users
                      |
                CloudFront CDN
                      |
              S3 (React Frontend)
                      |
              API Gateway (REST)
                      |
               Lambda (FastAPI)
                /     |      \
          RDS       Redis    S3 Buckets
       PostgreSQL  ElastiCache  (Audit/ML)
```

### AWS Services Used

| Service | Resource | Purpose |
|---------|----------|---------|
| **VPC** | `transit-india-vpc` (10.0.0.0/16) | Network isolation |
| **Subnets** | 2 public + 2 private | Multi-AZ deployment |
| **NAT Gateway** | In public subnet | Private subnet internet access |
| **API Gateway** | REST API | HTTPS endpoint for all API calls |
| **Lambda** | `transit-india-api` (Python 3.9, 512MB) | Runs FastAPI backend via Mangum |
| **RDS PostgreSQL** | `transit-india-db` (db.t3.micro, v15) | Persistent storage for routes, trips, feedback |
| **ElastiCache Redis** | `cache.t3.micro` | Caching layer (rate limiting ready) |
| **S3** | `transit-india-frontend-*` | Static website hosting |
| **S3** | `transit-india-audit-*` | Audit logs (90-day lifecycle) |
| **S3** | `transit-india-ml-*` | ML model artifacts |
| **CloudFront** | CDN distribution | Global edge caching for frontend |

### Region: `ap-south-1` (Mumbai)

---

## API Endpoints

### 1. Health Check
```
GET /health
Response: {"status": "healthy", "service": "transit-india"}
```

### 2. Route Search
```
GET /api/v1/routes/search?from_stop=Broadway&to_stop=Tambaram&district=Chennai

Response: {
  "routes": [
    {
      "id": "81-R-016",
      "route": "Tirunelveli - Erode Ordinary",
      "bus_number": "81",
      "status": "running",
      "currentLocation": "Broadway",
      "expectedArrival": "07 - 14 Minutes",
      "confidence": 89,
      "delayReason": null,
      "source": "GPS Sync"
    }
  ],
  "count": 4
}
```

### 3. Bus Query
```
POST /api/v1/query
Body: {"bus_number": "42B", "stop_name": "Adyar", "language": "en"}

Response: {
  "request_id": "req-c7d12671",
  "trip_status": "Running Today",
  "arrival_window": "9-12 minutes",
  "delay_reason": null,
  "timestamp": "2026-03-04T05:14:23Z"
}
```

### 4. Emergency Info
```
GET /api/v1/emergency/42B

Response: {
  "bus_number": "42B",
  "route_id": "R-011",
  "last_confirmed_stop": "Porur",
  "helpline_numbers": {
    "police": "112",
    "ambulance": "108",
    "women_safety": "1091",
    "transport_helpline": "1800-XXX-XXXX"
  }
}
```

### 5. Safety Escalation
```
POST /api/v1/safety/escalate
Body: {
  "phone_number": "9876543210",
  "bus_number": "42B",
  "incident_category": "Harassment"    // Harassment | Fight | Medical | Threat
}

Response: {
  "escalation_id": "esc-270446d7",
  "status": "Pending",
  "message": "Your report has been forwarded to the control room."
}
```

### 6. Feedback
```
POST /api/v1/feedback
Body: {
  "route_id": "R-001",
  "feedback_type": "Satisfactory",     // Satisfactory | Needs Improvement
  "channel": "Web"                     // Web | SMS | IVR
}

Response: {
  "feedback_id": "fb-7ea3666d",
  "message": "Thank you for your feedback."
}
```

### 7. SMS Webhook
```
POST /api/v1/sms/webhook
Body: {"phone_number": "9876543210", "message": "BUS 42B Adyar"}

Response: {
  "response": "Bus 42B: Running Today. Arrival: 5-12 minutes. Time: 05:14"
}
```

### 8. Database Status (Admin)
```
GET /api/v1/admin/db-status

Response: {"status": "connected", "routes": 50, "stops": 95, "trips": 1556}
```

### 9. Seed Database (Admin)
```
POST /api/v1/admin/seed

Response: {"status": "seeded", "stops": 95, "routes": 50, "trips": 1556}
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Python 3.9, FastAPI, Mangum (ASGI-to-Lambda adapter) |
| **Database** | PostgreSQL 15 (RDS), SQLAlchemy ORM |
| **Caching** | Redis (ElastiCache) |
| **Infrastructure** | AWS SAM (CloudFormation), VPC, Lambda, API Gateway |
| **CDN** | CloudFront |
| **Storage** | S3 (frontend hosting, audit logs, ML data) |
| **ML (Ready)** | SageMaker (Prophet forecasting, XGBoost delay classifier) |

---

## Database Schema

| Table | Rows | Description |
|-------|------|-------------|
| `routes` | 50 | Bus routes across Tamil Nadu (origin, destination, stops sequence) |
| `stops` | 95 | Bus stops with English/Tamil/Hindi names and GPS coordinates |
| `trips` | 1,556 | Individual trip instances with ETM login tracking and status |
| `safety_escalations` | Live | Safety incident reports (phone hash, category, status) |
| `feedback` | Live | Service feedback records (route, type, channel) |

### Data Coverage
- **10 districts**: Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem, Tirunelveli, Erode, Vellore, Thanjavur, Dindigul
- **50 routes** with 8-20 stops each
- **7 days** of trip data with realistic ETM login patterns
- **5 bus types**: Ordinary, Express, Deluxe, Ultra Deluxe, AC

---

## Project Structure

```
TRANSIT-INDIA/
├── src/                          # React Frontend
│   ├── components/
│   │   ├── TrackingDashboard.jsx   # Main bus search (calls real API)
│   │   ├── EmergencyDashboard.jsx  # Safety & helplines (calls real API)
│   │   ├── ServiceReporting.jsx    # Feedback & reporting (calls real API)
│   │   ├── RouteDetails.jsx        # Detailed route view
│   │   ├── Hero.jsx                # Navigation header
│   │   ├── Login.jsx               # Admin login (CAPTCHA)
│   │   ├── OTP.jsx                 # OTP verification (demo)
│   │   ├── Profile.jsx             # User profile (localStorage)
│   │   ├── AboutAI.jsx             # AI architecture explainer
│   │   ├── Footer.jsx              # Footer
│   │   ├── BusAnimation.jsx        # Decorative animation
│   │   └── LogoutSuccess.jsx       # Logout confirmation
│   ├── api.js                      # API client (all endpoints)
│   ├── App.jsx                     # Main router
│   └── data/districtStops.js       # 52 districts stop data
│
├── backend/                      # Python Backend
│   ├── app/
│   │   ├── main.py                 # FastAPI app + Mangum handler
│   │   ├── config.py               # Environment settings (TRANSIT_ prefix)
│   │   ├── routers/
│   │   │   ├── query.py            # POST /api/v1/query
│   │   │   ├── routes.py           # GET  /api/v1/routes/search
│   │   │   ├── emergency.py        # GET  /api/v1/emergency/{bus}
│   │   │   ├── safety.py           # POST /api/v1/safety/escalate
│   │   │   ├── feedback.py         # POST /api/v1/feedback
│   │   │   ├── sms.py              # POST /api/v1/sms/webhook
│   │   │   └── admin.py            # POST /api/v1/admin/seed
│   │   ├── models/
│   │   │   ├── schemas.py          # Pydantic models & enums
│   │   │   └── database.py         # SQLAlchemy ORM models
│   │   ├── services/
│   │   │   ├── trip_status.py      # Trip status management
│   │   │   ├── arrival_prediction.py # Confidence-based predictions
│   │   │   ├── delay_classifier.py # Delay reason classification
│   │   │   ├── rate_limiter.py     # Redis rate limiting
│   │   │   └── audit_logger.py     # S3 audit logging
│   │   ├── ml/
│   │   │   ├── confidence.py       # Confidence calculator
│   │   │   ├── forecasting.py      # SageMaker forecasting client
│   │   │   └── delay_model.py      # SageMaker delay classifier
│   │   └── data/
│   │       ├── tamil_nadu_routes.py # Route/stop static data
│   │       ├── seed.py             # Synthetic data generators
│   │       └── seed_db.py          # Database seeder
│   ├── ml_training/
│   │   ├── forecasting/train.py    # Prophet model training
│   │   └── delay_classifier/train.py # XGBoost model training
│   ├── tests/                      # 51 tests (all passing)
│   │   ├── unit/                   # 7 test files
│   │   └── property/               # 2 property-based test files
│   ├── infrastructure/
│   │   ├── template.yaml           # SAM CloudFormation template
│   │   └── samconfig.toml          # Deployment config
│   └── requirements.txt
│
├── dist/                         # Built frontend (deployed to S3)
├── package.json                  # Node dependencies
└── PROJECT-GUIDE.md              # This file
```

---

## Key Design Principles

1. **Honesty Over Precision** — The system never shows exact ETAs. It provides confidence-based arrival windows (e.g., "7-14 minutes" at 89% confidence). If data is stale or uncertain, it honestly says "Status Not Confirmed" instead of guessing.

2. **No Login Required for Passengers** — Citizens access bus tracking, emergency services, and feedback directly. Login is reserved for admin/control room only.

3. **Government-Grade UI** — Clean, professional interface. White/off-white backgrounds with navy/indigo text. Orange (#f97316) as the accent color. No frivolous animations.

4. **Graceful Degradation** — If the database is unreachable, the API falls back to sensible defaults. If the API is unreachable, the frontend falls back to mock data. The system never crashes.

5. **Multi-Channel** — Web, SMS ("BUS 42B Adyar"), and IVR channels are supported with consistent response formats.

---

## Testing

```bash
cd backend
python3 -m pytest tests/ -v
```

**Result: 51 tests passing** — covering schemas, database models, trip status, arrival predictions, delay classification, rate limiting, audit logging, API endpoints, SMS parsing, and property-based tests.

---

## AWS Account Details

| Item | Value |
|------|-------|
| **Account ID** | 862558960576 |
| **Region** | ap-south-1 (Mumbai) |
| **CloudFormation Stack** | `transit-india` |
| **Lambda Function** | `transit-india-api` |
| **RDS Instance** | `transit-india-db` |
| **S3 Buckets** | `transit-india-frontend-*`, `transit-india-audit-*`, `transit-india-ml-*` |

---

## Quick Test Commands

```bash
# Health check
curl https://puzyuk2l8j.execute-api.ap-south-1.amazonaws.com/Prod/health

# Search routes from Broadway to Tambaram in Chennai
curl "https://puzyuk2l8j.execute-api.ap-south-1.amazonaws.com/Prod/api/v1/routes/search?from_stop=Broadway&to_stop=Tambaram&district=Chennai"

# Query a specific bus
curl -X POST https://puzyuk2l8j.execute-api.ap-south-1.amazonaws.com/Prod/api/v1/query \
  -H "Content-Type: application/json" \
  -d '{"bus_number":"42B"}'

# Get emergency info
curl https://puzyuk2l8j.execute-api.ap-south-1.amazonaws.com/Prod/api/v1/emergency/42B

# Submit safety escalation
curl -X POST https://puzyuk2l8j.execute-api.ap-south-1.amazonaws.com/Prod/api/v1/safety/escalate \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"9876543210","bus_number":"42B","incident_category":"Harassment"}'

# Submit feedback
curl -X POST https://puzyuk2l8j.execute-api.ap-south-1.amazonaws.com/Prod/api/v1/feedback \
  -H "Content-Type: application/json" \
  -d '{"route_id":"R-001","feedback_type":"Satisfactory","channel":"Web"}'

# SMS webhook
curl -X POST https://puzyuk2l8j.execute-api.ap-south-1.amazonaws.com/Prod/api/v1/sms/webhook \
  -H "Content-Type: application/json" \
  -d '{"phone_number":"9876543210","message":"BUS 42B Adyar"}'

# Check database status
curl https://puzyuk2l8j.execute-api.ap-south-1.amazonaws.com/Prod/api/v1/admin/db-status
```
