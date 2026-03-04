from datetime import datetime, timedelta
from app.services.trip_status import TripStatusService
from app.models.schemas import TripStatusEnum


class FakeCache:
    def __init__(self):
        self.store = {}
    def get(self, key):
        return self.store.get(key)
    def set(self, key, value, ex=None):
        self.store[key] = value


def test_etm_login_sets_running_status():
    service = TripStatusService(cache=FakeCache(), db=None)
    result = service.process_etm_login("t1", "45A", datetime.now())
    assert result == TripStatusEnum.RUNNING


def test_no_login_past_threshold_returns_unconfirmed():
    service = TripStatusService(cache=FakeCache(), db=None)
    scheduled = datetime.now() - timedelta(minutes=31)
    result = service.check_status("t1", scheduled_departure=scheduled, etm_login_time=None)
    assert result == TripStatusEnum.UNCONFIRMED


def test_admin_cancellation_returns_not_running():
    service = TripStatusService(cache=FakeCache(), db=None)
    assert service.admin_cancel("t1") == TripStatusEnum.NOT_RUNNING


def test_discontinued_returns_discontinued():
    service = TripStatusService(cache=FakeCache(), db=None)
    assert service.discontinue("t1") == TripStatusEnum.DISCONTINUED


def test_etm_login_caches_status():
    cache = FakeCache()
    service = TripStatusService(cache=cache, db=None)
    service.process_etm_login("t1", "45A", datetime.now())
    assert cache.store.get("trip:t1") is not None
