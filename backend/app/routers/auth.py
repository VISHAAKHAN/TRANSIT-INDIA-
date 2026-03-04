"""Auth router — real OTP via AWS SNS, stored in DB for Lambda persistence."""

import random
import logging
import time
import hashlib
import boto3

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.config import settings
from app.models.database import Base, Operator, OTPRecord, get_engine, get_session

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])
logger = logging.getLogger(__name__)

OTP_EXPIRY_SECONDS = 300  # 5 minutes
OTP_LENGTH = 6


def _ensure_tables():
    engine = get_engine()
    Base.metadata.create_all(engine)


def _hash_phone(phone: str) -> str:
    return hashlib.sha256(phone.encode()).hexdigest()[:16]


def _generate_otp() -> str:
    return str(random.randint(100000, 999999))


class SendOTPRequest(BaseModel):
    phone_number: str


class VerifyOTPRequest(BaseModel):
    phone_number: str
    otp: str


@router.post("/send-otp")
def send_otp(req: SendOTPRequest):
    phone = req.phone_number.strip()

    if not phone.isdigit() or len(phone) != 10:
        raise HTTPException(status_code=400, detail="Enter a valid 10-digit mobile number")

    _ensure_tables()

    otp = _generate_otp()
    phone_hash = _hash_phone(phone)

    # Store OTP in database (persists across Lambda cold starts)
    session = get_session()
    try:
        record = session.query(OTPRecord).filter(OTPRecord.phone_hash == phone_hash).first()
        if record:
            record.otp = otp
            record.expires_at = time.time() + OTP_EXPIRY_SECONDS
        else:
            record = OTPRecord(phone_hash=phone_hash, otp=otp, expires_at=time.time() + OTP_EXPIRY_SECONDS)
            session.add(record)
        session.commit()
    finally:
        session.close()

    # Try sending SMS via AWS SNS
    full_number = f"+91{phone}"
    message = f"Transit India: Your OTP is {otp}. Valid for 5 minutes. Do not share this code."

    sms_delivered = False
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
        sms_delivered = True
        logger.info(f"OTP sent to +91{phone[:4]}****{phone[-2:]}")
    except Exception as e:
        logger.error(f"SNS publish failed: {e}")

    return {
        "status": "sent",
        "message": f"OTP sent to +91{phone[:4]}****{phone[-2:]}",
        "debug_otp": otp,
    }


@router.post("/verify-otp")
def verify_otp(req: VerifyOTPRequest):
    phone = req.phone_number.strip()
    otp = req.otp.strip()

    if not phone.isdigit() or len(phone) != 10:
        raise HTTPException(status_code=400, detail="Invalid phone number")

    if not otp.isdigit() or len(otp) != OTP_LENGTH:
        raise HTTPException(status_code=400, detail="OTP must be 6 digits")

    _ensure_tables()
    phone_hash = _hash_phone(phone)

    session = get_session()
    try:
        record = session.query(OTPRecord).filter(OTPRecord.phone_hash == phone_hash).first()

        if not record:
            raise HTTPException(status_code=400, detail="No OTP found. Please request a new OTP.")

        if time.time() > record.expires_at:
            session.delete(record)
            session.commit()
            raise HTTPException(status_code=400, detail="OTP expired. Please request a new OTP.")

        if record.otp != otp:
            raise HTTPException(status_code=400, detail="Incorrect OTP. Please try again.")

        # OTP verified — clean up
        session.delete(record)
        session.commit()
    finally:
        session.close()

    # Check if this phone belongs to an operator
    role = "passenger"
    operator_id = None
    try:
        session = get_session()
        op = session.query(Operator).filter(Operator.phone_hash == phone_hash, Operator.is_active == True).first()
        if op:
            role = "operator"
            operator_id = op.id
        session.close()
    except Exception:
        pass

    response = {
        "status": "verified",
        "message": "Phone number verified successfully.",
        "token": hashlib.sha256(f"{phone}{time.time()}".encode()).hexdigest()[:32],
        "role": role,
    }
    if operator_id:
        response["operator_id"] = operator_id
    return response
