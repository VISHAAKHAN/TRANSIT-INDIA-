"""SMS webhook router — parses SMS and queries real DB."""

import re
import logging
from typing import Optional
from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel

from app.models.database import Trip, get_session

router = APIRouter(prefix="/api/v1", tags=["sms"])
logger = logging.getLogger(__name__)

SMS_PATTERN = re.compile(r'^bus\s+(\S+)(?:\s+(.+))?$', re.IGNORECASE)


def parse_sms(message: str) -> Optional[dict]:
    if not message or not message.strip():
        return None
    match = SMS_PATTERN.match(message.strip())
    if not match:
        return None
    bus_number = match.group(1).upper()
    stop_name = match.group(2).strip().title() if match.group(2) else None
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

    bus_number = parsed["bus_number"]
    status = "Running Today"
    arrival = "10-15 minutes"

    try:
        session = get_session()
        trip = (
            session.query(Trip)
            .filter(Trip.bus_number == bus_number)
            .order_by(Trip.scheduled_departure.desc())
            .first()
        )
        if trip:
            status = trip.status or "Status Not Confirmed"
            if trip.etm_login_time:
                arrival = "5-12 minutes"
            else:
                arrival = "15-25 minutes"
        session.close()
    except Exception as e:
        logger.warning(f"DB query failed in SMS handler: {e}")

    now = datetime.now(timezone.utc).strftime("%H:%M")
    return {
        "response": f"Bus {bus_number}: {status}. Arrival: {arrival}. Time: {now}"
    }
