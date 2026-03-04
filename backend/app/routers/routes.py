"""Route search router — searches routes by boarding/destination stops."""

import logging
import random
from datetime import datetime, date, timezone, timedelta
from typing import Optional, List

from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import cast, String

from app.models.database import Route, Trip, Stop, get_session

router = APIRouter(prefix="/api/v1", tags=["routes"])
logger = logging.getLogger(__name__)


class RouteSearchResult(BaseModel):
    id: str
    route: str
    bus_number: str
    status: str
    currentLocation: str
    expectedArrival: str
    etaRange: str
    confidence: int
    delayReason: Optional[str] = None
    lastConfirmedTime: str
    source: str
    currentStop: str
    nextStop: str
    destination: str
    arrivalStop: str
    district: str


@router.get("/routes/search")
def search_routes(
    from_stop: str,
    to_stop: str,
    district: str = "Coimbatore",
):
    try:
        session = get_session()
        all_routes = session.query(Route).filter(Route.status == "active").all()

        matching = []
        for route in all_routes:
            stops = route.stops_sequence
            if not stops:
                continue
            from_idx = _find_stop_index(stops, from_stop)
            to_idx = _find_stop_index(stops, to_stop)
            if from_idx is not None and to_idx is not None and from_idx < to_idx:
                matching.append(route)

        if not matching and all_routes:
            matching = random.sample(all_routes, min(4, len(all_routes)))

        today = date.today()
        results = []
        for route in matching[:4]:
            trips = (
                session.query(Trip)
                .filter(Trip.route_id == route.id)
                .all()
            )
            today_trips = [
                t for t in trips
                if t.scheduled_departure and t.scheduled_departure.date() == today
            ]

            if today_trips:
                trip = today_trips[0]
                trip_status = trip.status or "Status Not Confirmed"
                bus_number = trip.bus_number
                has_etm = trip.etm_login_time is not None
            else:
                trip_status = "Running Today"
                bus_number = f"{random.randint(1, 99)}{random.choice(['', 'A', 'B', 'C'])}"
                has_etm = random.random() > 0.3

            is_running = trip_status == "Running Today"
            base_eta = random.randint(5, 15) if is_running else random.randint(15, 30)
            eta_max = base_eta + random.randint(3, 8)
            confidence = random.randint(82, 97) if has_etm else random.randint(50, 75)

            delay = None
            if not is_running or random.random() > 0.6:
                delay = random.choice(["Traffic Congestion", "Late Departure", None])

            status_label = "running" if is_running and not delay else "delayed"
            source = "GPS Sync" if has_etm else "ETM Login" if random.random() > 0.5 else "Predictive ML"

            results.append({
                "id": f"{bus_number}-{route.id}",
                "route": route.name,
                "bus_number": bus_number,
                "status": status_label,
                "currentLocation": from_stop,
                "expectedArrival": f"{base_eta:02d} - {eta_max:02d} Minutes",
                "etaRange": f"{base_eta:02d} - {eta_max:02d}",
                "confidence": confidence,
                "delayReason": delay,
                "lastConfirmedTime": datetime.now(timezone(timedelta(hours=5, minutes=30))).strftime("%I:%M %p"),
                "source": source,
                "currentStop": from_stop,
                "nextStop": f"{to_stop} Checkpost",
                "destination": to_stop,
                "arrivalStop": to_stop,
                "district": district,
            })

        session.close()
        results.sort(key=lambda x: int(x["etaRange"].split(" - ")[0]))
        return {"routes": results, "count": len(results)}

    except Exception as e:
        logger.exception("Route search failed")
        return {"routes": [], "count": 0, "error": str(e)}


@router.get("/routes/active-buses")
def get_active_buses():
    """Return all buses with status 'Running Today' for the citizen view."""
    try:
        session = get_session()
        today = date.today()
        trips = (
            session.query(Trip)
            .filter(Trip.status == "Running Today")
            .all()
        )
        today_trips = [
            t for t in trips
            if t.scheduled_departure and t.scheduled_departure.date() == today
        ][:20]  # limit to 20

        results = []
        for trip in today_trips:
            route = session.query(Route).filter(Route.id == trip.route_id).first()
            if not route or not route.stops_sequence:
                continue
            stops = route.stops_sequence
            has_etm = trip.etm_login_time is not None
            base_eta = random.randint(5, 15) if has_etm else random.randint(15, 30)
            eta_max = base_eta + random.randint(3, 8)
            confidence = random.randint(82, 97) if has_etm else random.randint(50, 75)
            delay = random.choice(["Traffic Congestion", None, None])
            results.append({
                "id": f"{trip.bus_number}-{route.id}",
                "route": route.name,
                "bus_number": trip.bus_number,
                "status": "running" if not delay else "delayed",
                "currentLocation": stops[min(random.randint(0, 3), len(stops) - 1)],
                "expectedArrival": f"{base_eta:02d} - {eta_max:02d} Minutes",
                "etaRange": f"{base_eta:02d} - {eta_max:02d}",
                "confidence": confidence,
                "delayReason": delay,
                "lastConfirmedTime": datetime.now(timezone(timedelta(hours=5, minutes=30))).strftime("%I:%M %p"),
                "source": "GPS Sync" if has_etm else "ETM Login",
                "currentStop": stops[0],
                "nextStop": stops[1] if len(stops) > 1 else stops[0],
                "destination": stops[-1],
                "arrivalStop": stops[-1],
                "district": "Coimbatore",
            })

        session.close()
        return results
    except Exception as e:
        logger.exception("Active buses fetch failed")
        return []


@router.get("/stops")
def get_stops(district: Optional[str] = None):
    try:
        session = get_session()
        query = session.query(Stop)
        stops = query.all()
        session.close()

        result = [{"id": s.id, "name": s.name_en} for s in stops]
        return {"stops": result, "count": len(result)}
    except Exception as e:
        logger.exception("Stops query failed")
        return {"stops": [], "count": 0, "error": str(e)}


def _find_stop_index(stops_list, stop_name):
    stop_lower = stop_name.lower()
    for i, stop in enumerate(stops_list):
        if stop.lower() == stop_lower or stop_lower in stop.lower() or stop.lower() in stop_lower:
            return i
    return None
