from sqlalchemy import create_engine, inspect
from app.models.database import Base


def test_all_tables_created():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    tables = inspect(engine).get_table_names()
    assert "routes" in tables
    assert "stops" in tables
    assert "trips" in tables
    assert "safety_escalations" in tables
    assert "feedback" in tables


def test_route_has_required_columns():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    columns = [c["name"] for c in inspect(engine).get_columns("routes")]
    assert "id" in columns
    assert "name" in columns
    assert "stops_sequence" in columns


def test_trip_has_status_column():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    columns = [c["name"] for c in inspect(engine).get_columns("trips")]
    assert "status" in columns
    assert "bus_number" in columns
    assert "etm_login_time" in columns
