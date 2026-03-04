from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class TripStatusEnum(str, Enum):
    RUNNING = "Running Today"
    NOT_RUNNING = "Not Running"
    UNCONFIRMED = "Status Not Confirmed"
    DISCONTINUED = "Service Discontinued"


class DelayReasonEnum(str, Enum):
    HEAVY_TRAFFIC = "Heavy traffic"
    LATE_DEPARTURE = "Late departure"
    ROAD_DIVERSION = "Road diversion"
    SERVICE_DISRUPTION = "Service disruption"
    UNKNOWN = "Status unknown"


class ChannelEnum(str, Enum):
    SMS = "SMS"
    IVR = "IVR"
    WEB = "Web"


class IncidentCategoryEnum(str, Enum):
    HARASSMENT = "Harassment"
    FIGHT = "Fight"
    MEDICAL = "Medical"
    THREAT = "Threat"


class FeedbackTypeEnum(str, Enum):
    SATISFACTORY = "Satisfactory"
    NEEDS_IMPROVEMENT = "Needs Improvement"


class EscalationStatusEnum(str, Enum):
    PENDING = "Pending"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"


class EventTypeEnum(str, Enum):
    TRIP_START = "TripStart"
    TICKET_SALE = "TicketSale"
    TRIP_END = "TripEnd"


class QueryRequest(BaseModel):
    request_id: str
    channel: ChannelEnum
    phone_number: Optional[str] = None
    bus_number: str
    stop_name: Optional[str] = None
    language: str = "en"
    timestamp: datetime


class QueryResponse(BaseModel):
    request_id: str
    trip_status: str
    arrival_window: str
    delay_reason: Optional[str] = None
    response_timestamp: datetime
    language: str


class TripStatus(BaseModel):
    trip_id: str
    route_id: str
    bus_number: str
    scheduled_departure: datetime
    status: TripStatusEnum
    last_updated: datetime
    etm_login_time: Optional[datetime] = None
    administrative_note: Optional[str] = None


class ArrivalPrediction(BaseModel):
    trip_id: str
    stop_id: str
    query_time: datetime
    predicted_arrival_min: int
    predicted_arrival_max: int
    confidence_level: float = Field(ge=0.0, le=1.0)
    data_sources_used: list[str]
    prediction_id: str


class DelayInformation(BaseModel):
    trip_id: str
    current_delay_minutes: int
    delay_reason: DelayReasonEnum
    classification_confidence: float = Field(ge=0.0, le=1.0)
    timestamp: datetime


class SafetyEscalation(BaseModel):
    escalation_id: str
    phone_hash: str
    bus_number: str
    trip_id: Optional[str] = None
    incident_category: IncidentCategoryEnum
    timestamp: datetime
    control_room_status: EscalationStatusEnum
    resolution_notes: Optional[str] = None
    operator_id: Optional[str] = None


class Feedback(BaseModel):
    feedback_id: str
    route_id: str
    time_period: datetime
    feedback_type: FeedbackTypeEnum
    channel: ChannelEnum
    timestamp: datetime


class ETMEvent(BaseModel):
    event_id: str
    event_type: EventTypeEnum
    trip_id: str
    bus_number: str
    stop_id: Optional[str] = None
    timestamp: datetime
    etm_device_id: str
