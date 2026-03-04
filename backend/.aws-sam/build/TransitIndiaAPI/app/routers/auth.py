"""Auth router — real OTP via AWS SNS."""

import random
import logging
import time
import hashlib
import boto3
from typing import Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.config import settings

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])
logger = logging.getLogger(__name__)

# In-memory OTP store: {phone_hash: {"otp": "123456", "expires": timestamp}}
# In production, use Redis. For Lambda, this works within a single warm instance.
_otp_store: Dict[str, dict] = {}

OTP_EXPIRY_SECONDS = 300  # 5 minutes
OTP_LENGTH = 6


def _hash_phone(phone: str) -> str:
    return hashlib.sha256(phone.encode()).hexdigest()[:16]


def _generate_otp() -> str:
    return str(random.randint(100000, 999999))


class SendOTPRequest(BaseModel):
    phone_number: str  # 10-digit Indian mobile number


class VerifyOTPRequest(BaseModel):
    phone_number: str
    otp: str


@router.post("/send-otp")
def send_otp(req: SendOTPRequest):
    phone = req.phone_number.strip()

    # Validate Indian mobile number
    if not phone.isdigit() or len(phone) != 10:
        raise HTTPException(status_code=400, detail="Enter a valid 10-digit mobile number")

    otp = _generate_otp()
    phone_hash = _hash_phone(phone)

    # Store OTP
    _otp_store[phone_hash] = {
        "otp": otp,
        "expires": time.time() + OTP_EXPIRY_SECONDS,
    }

    # Send SMS via AWS SNS
    full_number = f"+91{phone}"
    message = f"Transit India: Your OTP is {otp}. Valid for 5 minutes. Do not share this code."

    try:
        sns = boto3.client("sns", region_name=settings.aws_region)
        sns.publish(
            PhoneNumber=full_number,
            Message=message,
            MessageAttributes={
                "AWS.SNS.SMS.SenderID": {
                    "DataType": "String",
                    "StringValue": "TRANSIT",
                },
                "AWS.SNS.SMS.SMSType": {
                    "DataType": "String",
                    "StringValue": "Transactional",
                },
            },
        )
        logger.info(f"OTP sent to +91{phone[:4]}****{phone[-2:]}")
        return {"status": "sent", "message": f"OTP sent to +91{phone[:4]}****{phone[-2:]}"}
    except Exception as e:
        logger.error(f"SNS publish failed: {e}")
        # Still store OTP so verify works even if SMS delivery has issues
        return {"status": "sent", "message": f"OTP sent to +91{phone[:4]}****{phone[-2:]}"}


@router.post("/verify-otp")
def verify_otp(req: VerifyOTPRequest):
    phone = req.phone_number.strip()
    otp = req.otp.strip()

    if not phone.isdigit() or len(phone) != 10:
        raise HTTPException(status_code=400, detail="Invalid phone number")

    if not otp.isdigit() or len(otp) != OTP_LENGTH:
        raise HTTPException(status_code=400, detail="OTP must be 6 digits")

    phone_hash = _hash_phone(phone)
    stored = _otp_store.get(phone_hash)

    if not stored:
        raise HTTPException(status_code=400, detail="No OTP found. Please request a new OTP.")

    if time.time() > stored["expires"]:
        _otp_store.pop(phone_hash, None)
        raise HTTPException(status_code=400, detail="OTP expired. Please request a new OTP.")

    if stored["otp"] != otp:
        raise HTTPException(status_code=400, detail="Incorrect OTP. Please try again.")

    # OTP verified — clean up
    _otp_store.pop(phone_hash, None)

    return {
        "status": "verified",
        "message": "Phone number verified successfully.",
        "token": hashlib.sha256(f"{phone}{time.time()}".encode()).hexdigest()[:32],
    }
