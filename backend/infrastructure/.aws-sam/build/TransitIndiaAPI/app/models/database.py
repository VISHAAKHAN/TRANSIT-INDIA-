from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, Integer, JSON, ForeignKey, Boolean, create_engine
from sqlalchemy.orm import DeclarativeBase, relationship, sessionmaker
from app.config import settings


class Base(DeclarativeBase):
    pass


class Route(Base):
    __tablename__ = "routes"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    stops_sequence = Column(JSON, nullable=False)
    status = Column(String, nullable=False, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    trips = relationship("Trip", back_populates="route")


class Stop(Base):
    __tablename__ = "stops"
    id = Column(String, primary_key=True)
    name_en = Column(String, nullable=False)
    name_ta = Column(String, nullable=True)
    name_hi = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Trip(Base):
    __tablename__ = "trips"
    id = Column(String, primary_key=True)
    route_id = Column(String, ForeignKey("routes.id"), nullable=False)
    bus_number = Column(String, nullable=False)
    scheduled_departure = Column(DateTime, nullable=False)
    status = Column(String, nullable=False, default="Status Not Confirmed")
    last_updated = Column(DateTime, default=datetime.utcnow)
    etm_login_time = Column(DateTime, nullable=True)
    administrative_note = Column(String, nullable=True)
    route = relationship("Route", back_populates="trips")


class OTPRecord(Base):
    __tablename__ = "otp_records"
    phone_hash = Column(String, primary_key=True)
    otp = Column(String, nullable=False)
    expires_at = Column(Float, nullable=False)


class Operator(Base):
    __tablename__ = "operators"
    id = Column(String, primary_key=True)
    phone_hash = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class SafetyEscalationRecord(Base):
    __tablename__ = "safety_escalations"
    id = Column(String, primary_key=True)
    phone_hash = Column(String, nullable=False)
    bus_number = Column(String, nullable=False)
    trip_id = Column(String, nullable=True)
    incident_category = Column(String, nullable=False)
    control_room_status = Column(String, nullable=False, default="Pending")
    resolution_notes = Column(String, nullable=True)
    operator_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class FeedbackRecord(Base):
    __tablename__ = "feedback"
    id = Column(String, primary_key=True)
    route_id = Column(String, nullable=False)
    time_period = Column(DateTime, nullable=False)
    feedback_type = Column(String, nullable=False)
    channel = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


def get_engine():
    return create_engine(settings.database_url)


def get_session():
    engine = get_engine()
    SessionLocal = sessionmaker(bind=engine)
    return SessionLocal()
