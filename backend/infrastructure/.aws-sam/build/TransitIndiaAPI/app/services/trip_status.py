import json
from typing import Optional
from datetime import datetime, timedelta
from app.models.schemas import TripStatusEnum

TIMEOUT_MINUTES = 30
CACHE_TTL_SECONDS = 86400  # 24 hours


class TripStatusService:
    def __init__(self, cache, db):
        self.cache = cache
        self.db = db

    def process_etm_login(self, trip_id: str, bus_number: str, login_time: datetime) -> TripStatusEnum:
        status = TripStatusEnum.RUNNING
        self._cache_status(trip_id, status, bus_number, login_time)
        return status

    def check_status(self, trip_id: str, scheduled_departure: datetime, etm_login_time: Optional[datetime]) -> TripStatusEnum:
        cached = self._get_cached(trip_id)
        if cached:
            return TripStatusEnum(cached["status"])

        if etm_login_time:
            return TripStatusEnum.RUNNING

        now = datetime.now()
        if now > scheduled_departure + timedelta(minutes=TIMEOUT_MINUTES):
            return TripStatusEnum.UNCONFIRMED

        return TripStatusEnum.UNCONFIRMED

    def admin_cancel(self, trip_id: str) -> TripStatusEnum:
        status = TripStatusEnum.NOT_RUNNING
        self._cache_status(trip_id, status)
        return status

    def discontinue(self, trip_id: str) -> TripStatusEnum:
        status = TripStatusEnum.DISCONTINUED
        self._cache_status(trip_id, status)
        return status

    def _cache_status(self, trip_id: str, status: TripStatusEnum, bus_number: str = None, login_time: datetime = None):
        data = {
            "status": status.value,
            "bus_number": bus_number,
            "login_time": login_time.isoformat() if login_time else None,
            "updated_at": datetime.now().isoformat(),
        }
        self.cache.set(f"trip:{trip_id}", json.dumps(data), ex=CACHE_TTL_SECONDS)

    def _get_cached(self, trip_id: str) -> Optional[dict]:
        raw = self.cache.get(f"trip:{trip_id}")
        if raw:
            return json.loads(raw) if isinstance(raw, str) else json.loads(raw.decode())
        return None
