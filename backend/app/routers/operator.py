"""Operator router — route selection, trip activation/deactivation."""

import uuid
import logging
from datetime import datetime, date

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.models.database import Route, Stop, Trip, Operator, get_session

router = APIRouter(prefix="/api/v1/operator", tags=["operator"])
logger = logging.getLogger(__name__)


class ActivateTripRequest(BaseModel):
    route_id: str
    bus_number: str
    operator_id: str


@router.get("/routes")
def list_routes():
    """List all routes with stop sequences."""
    session = get_session()
    try:
        routes = session.query(Route).filter(Route.status == "active").all()
        return [
            {
                "id": r.id,
                "name": r.name,
                "stops_sequence": r.stops_sequence,
                "stop_count": len(r.stops_sequence) if r.stops_sequence else 0,
            }
            for r in routes
        ]
    finally:
        session.close()


@router.get("/routes/{route_id}")
def get_route_detail(route_id: str):
    """Route detail with GPS-enriched stops."""
    session = get_session()
    try:
        route = session.query(Route).filter(Route.id == route_id).first()
        if not route:
            raise HTTPException(status_code=404, detail="Route not found")

        # Enrich stops with GPS coordinates from Stop table
        enriched_stops = []
        for stop_name in (route.stops_sequence or []):
            stop = session.query(Stop).filter(Stop.name_en == stop_name).first()
            enriched_stops.append({
                "name": stop_name,
                "latitude": stop.latitude if stop else None,
                "longitude": stop.longitude if stop else None,
            })

        return {
            "id": route.id,
            "name": route.name,
            "stops": enriched_stops,
            "stop_count": len(enriched_stops),
        }
    finally:
        session.close()


@router.post("/trips/activate")
def activate_trip(req: ActivateTripRequest):
    """Create a Trip record with status 'Running Today'."""
    session = get_session()
    try:
        # Verify route exists
        route = session.query(Route).filter(Route.id == req.route_id).first()
        if not route:
            raise HTTPException(status_code=404, detail="Route not found")

        # Verify operator exists
        op = session.query(Operator).filter(Operator.id == req.operator_id).first()
        if not op:
            raise HTTPException(status_code=403, detail="Operator not found")

        trip_id = f"T-{uuid.uuid4().hex[:8]}"
        now = datetime.utcnow()

        trip = Trip(
            id=trip_id,
            route_id=req.route_id,
            bus_number=req.bus_number.strip().upper(),
            scheduled_departure=now,
            status="Running Today",
            etm_login_time=now,
            administrative_note=f"Activated by operator {req.operator_id}",
        )
        session.add(trip)
        session.commit()

        return {
            "trip_id": trip_id,
            "route_id": req.route_id,
            "route_name": route.name,
            "bus_number": trip.bus_number,
            "status": "Running Today",
            "activated_at": now.isoformat(),
        }
    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        logger.exception("Trip activation failed")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        session.close()


@router.get("/trips/active")
def get_active_trips(operator_id: str):
    """List today's active trips created by this operator."""
    session = get_session()
    try:
        today_start = datetime.combine(date.today(), datetime.min.time())
        trips = (
            session.query(Trip)
            .filter(
                Trip.status == "Running Today",
                Trip.administrative_note.contains(operator_id),
                Trip.etm_login_time >= today_start,
            )
            .all()
        )

        result = []
        for trip in trips:
            route = session.query(Route).filter(Route.id == trip.route_id).first()
            result.append({
                "trip_id": trip.id,
                "route_id": trip.route_id,
                "route_name": route.name if route else trip.route_id,
                "bus_number": trip.bus_number,
                "status": trip.status,
                "activated_at": trip.etm_login_time.isoformat() if trip.etm_login_time else None,
            })
        return result
    finally:
        session.close()


@router.post("/trips/{trip_id}/deactivate")
def deactivate_trip(trip_id: str):
    """Set trip status to 'Completed'."""
    session = get_session()
    try:
        trip = session.query(Trip).filter(Trip.id == trip_id).first()
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")

        trip.status = "Completed"
        trip.last_updated = datetime.utcnow()
        session.commit()

        return {"trip_id": trip_id, "status": "Completed"}
    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        logger.exception("Trip deactivation failed")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        session.close()
