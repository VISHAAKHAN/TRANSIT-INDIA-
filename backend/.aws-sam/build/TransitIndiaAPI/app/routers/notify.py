"""SMS ETA notification router — sends real SMS via Pinpoint SMS V2."""

import logging
import random
import boto3
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.config import settings
from app.models.database import Trip, Route, Stop, get_session

router = APIRouter(prefix="/api/v1", tags=["notify"])
logger = logging.getLogger(__name__)

IST = timezone(timedelta(hours=5, minutes=30))


class ETANotifyRequest(BaseModel):
    phone_number: str
    bus_id: str
    bus_route: str
    boarding: str
    destination: str
    eta: str
    confidence: Optional[int] = None


@router.post("/notify/eta")
def notify_eta(req: ETANotifyRequest):
    phone = req.phone_number.strip()

    if not phone.isdigit() or len(phone) != 10:
        raise HTTPException(status_code=400, detail="Enter a valid 10-digit mobile number")

    full_number = f"+91{phone}"
    now = datetime.now(IST).strftime("%I:%M %p IST")

    message = (
        f"Transit India\n"
        f"Bus: {req.bus_id} ({req.bus_route})\n"
        f"From: {req.boarding}\n"
        f"To: {req.destination}\n"
        f"ETA: {req.eta}\n"
        f"Time: {now}\n"
        f"Track live: https://d1k3y16wwsnjnb.cloudfront.net"
    )

    try:
        client = boto3.client("pinpoint-sms-voice-v2", region_name=settings.aws_region)
        client.send_text_message(
            DestinationPhoneNumber=full_number,
            MessageBody=message,
            MessageType="TRANSACTIONAL",
        )
        logger.info(f"ETA SMS sent to +91{phone[:4]}****{phone[-2:]}")
        return {
            "status": "sent",
            "message": f"ETA alert sent to +91{phone[:4]}****{phone[-2:]}",
        }
    except Exception as e:
        logger.error(f"SMS send failed: {e}")
        return {
            "status": "error",
            "message": f"Failed to send SMS: {str(e)}",
        }


@router.get("/routes/{route_id}/map")
def get_route_map_data(route_id: str):
    """Return route stops with GPS coordinates for map rendering."""
    try:
        session = get_session()

        route = session.query(Route).filter(Route.id == route_id).first()
        if not route:
            session.close()
            return {"stops": [], "bus_position": None}

        stop_names = route.stops_sequence or []
        all_stops = session.query(Stop).all()
        stop_map = {s.name_en: {"lat": s.latitude, "lng": s.longitude, "name": s.name_en} for s in all_stops}

        route_stops = []
        for name in stop_names:
            if name in stop_map:
                route_stops.append(stop_map[name])
            else:
                for sname, sdata in stop_map.items():
                    if name.lower() in sname.lower() or sname.lower() in name.lower():
                        route_stops.append({**sdata, "name": name})
                        break

        # Simulate bus position (between first and midpoint stop)
        bus_pos = None
        if len(route_stops) >= 2:
            idx = random.randint(0, len(route_stops) // 2)
            stop = route_stops[idx]
            bus_pos = {
                "lat": stop["lat"] + random.uniform(-0.005, 0.005),
                "lng": stop["lng"] + random.uniform(-0.005, 0.005),
                "heading": random.randint(0, 360),
            }

        session.close()
        return {
            "route_name": route.name,
            "stops": route_stops,
            "bus_position": bus_pos,
        }
    except Exception as e:
        logger.exception("Map data query failed")
        return {"stops": [], "bus_position": None, "error": str(e)}
