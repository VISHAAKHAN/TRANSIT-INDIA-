"""Feedback router — saves to database."""

import uuid
import logging
from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel

from app.models.schemas import FeedbackTypeEnum, ChannelEnum
from app.models.database import FeedbackRecord, get_session

router = APIRouter(prefix="/api/v1", tags=["feedback"])
logger = logging.getLogger(__name__)


class FeedbackRequest(BaseModel):
    route_id: str
    feedback_type: FeedbackTypeEnum
    channel: ChannelEnum = ChannelEnum.WEB


@router.post("/feedback")
def submit_feedback(req: FeedbackRequest):
    fb_id = f"fb-{uuid.uuid4().hex[:8]}"

    try:
        session = get_session()
        record = FeedbackRecord(
            id=fb_id,
            route_id=req.route_id,
            time_period=datetime.now(timezone.utc),
            feedback_type=req.feedback_type.value,
            channel=req.channel.value,
            created_at=datetime.now(timezone.utc),
        )
        session.add(record)
        session.commit()
        session.close()
    except Exception as e:
        logger.warning(f"Failed to save feedback to DB: {e}")

    return {
        "feedback_id": fb_id,
        "message": "Thank you for your feedback.",
    }
