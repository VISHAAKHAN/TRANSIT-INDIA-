"""Safety escalation router — saves to database."""

import uuid
import hashlib
import logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.models.schemas import IncidentCategoryEnum
from app.models.database import SafetyEscalationRecord, get_session

router = APIRouter(prefix="/api/v1", tags=["safety"])
logger = logging.getLogger(__name__)


class SafetyEscalationRequest(BaseModel):
    phone_number: str
    bus_number: str
    incident_category: IncidentCategoryEnum
    trip_id: Optional[str] = None


@router.post("/safety/escalate")
def escalate_safety(req: SafetyEscalationRequest):
    if not req.phone_number:
        raise HTTPException(status_code=400, detail="Phone number required for safety escalation")

    esc_id = f"esc-{uuid.uuid4().hex[:8]}"
    phone_hash = hashlib.sha256(req.phone_number.encode()).hexdigest()[:16]

    try:
        session = get_session()
        record = SafetyEscalationRecord(
            id=esc_id,
            phone_hash=phone_hash,
            bus_number=req.bus_number,
            trip_id=req.trip_id,
            incident_category=req.incident_category.value,
            control_room_status="Pending",
            created_at=datetime.now(timezone.utc),
        )
        session.add(record)
        session.commit()
        session.close()
    except Exception as e:
        logger.warning(f"Failed to save escalation to DB: {e}")

    return {
        "escalation_id": esc_id,
        "status": "Pending",
        "message": "Your report has been forwarded to the control room.",
    }
