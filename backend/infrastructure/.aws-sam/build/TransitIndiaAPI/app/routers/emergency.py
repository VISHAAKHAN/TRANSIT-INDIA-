"""Emergency information router — queries DB for bus info."""

import logging
from fastapi import APIRouter

from app.models.database import Trip, Route, get_session

router = APIRouter(prefix="/api/v1", tags=["emergency"])
logger = logging.getLogger(__name__)

HELPLINE_NUMBERS = {
    "police": "112",
    "ambulance": "108",
    "women_safety": "1091",
    "transport_helpline": "1800-XXX-XXXX",
}


@router.get("/emergency/{bus_number}")
def get_emergency_info(bus_number: str):
    route_id = None
    last_stop = None

    try:
        session = get_session()
        trip = (
            session.query(Trip)
            .filter(Trip.bus_number == bus_number)
            .order_by(Trip.scheduled_departure.desc())
            .first()
        )
        if trip:
            route_id = trip.route_id
            route = session.query(Route).filter(Route.id == trip.route_id).first()
            if route and route.stops_sequence:
                last_stop = route.stops_sequence[0]
        session.close()
    except Exception as e:
        logger.warning(f"DB query failed in emergency: {e}")

    return {
        "bus_number": bus_number,
        "route_id": route_id,
        "last_confirmed_stop": last_stop,
        "helpline_numbers": HELPLINE_NUMBERS,
    }
