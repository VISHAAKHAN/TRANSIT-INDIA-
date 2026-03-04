import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.database import Base, Route, Stop, Trip
from app.data.seed import generate_routes, generate_stops, generate_trips
from datetime import datetime


def seed_database():
    db_url = os.environ.get("TRANSIT_DATABASE_URL", "sqlite:///transit_india.db")
    engine = create_engine(db_url)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    routes_data = generate_routes(50)
    stops_data = generate_stops()
    trips_data = generate_trips(routes_data, days=7)

    for s in stops_data:
        stop = Stop(id=s["id"], name_en=s["name_en"], name_ta=s["name_ta"],
                     name_hi=s["name_hi"], latitude=s["latitude"], longitude=s["longitude"])
        session.merge(stop)

    for r in routes_data:
        route = Route(id=r["id"], name=r["name"], stops_sequence=r["stops_sequence"], status=r["status"])
        session.merge(route)

    for t in trips_data:
        trip = Trip(
            id=t["id"], route_id=t["route_id"], bus_number=t["bus_number"],
            scheduled_departure=datetime.fromisoformat(t["scheduled_departure"]),
            status=t["status"],
            etm_login_time=datetime.fromisoformat(t["etm_login_time"]) if t["etm_login_time"] else None,
        )
        session.merge(trip)

    session.commit()
    print(f"Seeded: {len(stops_data)} stops, {len(routes_data)} routes, {len(trips_data)} trips")
    session.close()


if __name__ == "__main__":
    seed_database()
