from hypothesis import given, strategies as st
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


@given(st.text(min_size=1, max_size=20))
def test_property1_status_always_valid(trip_id):
    service = TripStatusService(cache=FakeCache(), db=None)
    scheduled = datetime.now() - timedelta(minutes=60)
    result = service.check_status(trip_id, scheduled_departure=scheduled, etm_login_time=None)
    assert result in list(TripStatusEnum)


@given(st.text(min_size=1, max_size=20), st.text(min_size=1, max_size=10))
def test_property2_etm_login_sets_running(trip_id, bus_number):
    service = TripStatusService(cache=FakeCache(), db=None)
    result = service.process_etm_login(trip_id, bus_number, datetime.now())
    assert result == TripStatusEnum.RUNNING
