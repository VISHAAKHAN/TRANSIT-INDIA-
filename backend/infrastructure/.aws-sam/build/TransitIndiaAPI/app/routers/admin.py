"""Admin router — database seeding and health checks."""

import hashlib
import logging
from fastapi import APIRouter

from app.models.database import Base, Route, Stop, Trip, Operator, get_engine, get_session
from app.data.seed import generate_routes, generate_stops, generate_trips
from datetime import datetime

OPERATOR_PHONES = [
    {"phone": "9786763705", "name": "Operator 1"},
    {"phone": "9715051646", "name": "Operator 2"},
]

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])
logger = logging.getLogger(__name__)


@router.post("/seed")
def seed_database():
    try:
        engine = get_engine()
        Base.metadata.create_all(engine)
        session = get_session()

        # Clear old data and re-seed
        session.query(Trip).delete()
        session.query(Route).delete()
        session.query(Stop).delete()
        session.commit()

        routes_data = generate_routes(25)
        stops_data = generate_stops()
        trips_data = generate_trips(routes_data, days=7)

        for s in stops_data:
            stop = Stop(
                id=s["id"], name_en=s["name_en"], name_ta=s["name_ta"],
                name_hi=s["name_hi"], latitude=s["latitude"], longitude=s["longitude"],
            )
            session.merge(stop)

        for r in routes_data:
            route = Route(
                id=r["id"], name=r["name"],
                stops_sequence=r["stops_sequence"], status=r["status"],
            )
            session.merge(route)

        for t in trips_data:
            trip = Trip(
                id=t["id"], route_id=t["route_id"], bus_number=t["bus_number"],
                scheduled_departure=datetime.fromisoformat(t["scheduled_departure"]),
                status=t["status"],
                etm_login_time=datetime.fromisoformat(t["etm_login_time"]) if t["etm_login_time"] else None,
            )
            session.merge(trip)

        # Seed operators
        session.query(Operator).delete()
        for i, op_info in enumerate(OPERATOR_PHONES):
            phone_hash = hashlib.sha256(op_info["phone"].encode()).hexdigest()[:16]
            op = Operator(
                id=f"OP-{i+1:03d}",
                phone_hash=phone_hash,
                name=op_info["name"],
                is_active=True,
            )
            session.merge(op)

        session.commit()
        result = {
            "status": "seeded",
            "stops": len(stops_data),
            "routes": len(routes_data),
            "trips": len(trips_data),
            "operators": len(OPERATOR_PHONES),
        }
        session.close()
        return result
    except Exception as e:
        logger.exception("Seed failed")
        return {"status": "error", "detail": str(e)}


@router.get("/db-status")
def db_status():
    try:
        session = get_session()
        routes = session.query(Route).count()
        stops = session.query(Stop).count()
        trips = session.query(Trip).count()
        session.close()
        return {"status": "connected", "routes": routes, "stops": stops, "trips": trips}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
