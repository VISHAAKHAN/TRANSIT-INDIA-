import uuid
import random
from datetime import datetime, timedelta, date, time
from app.data.tamil_nadu_routes import COIMBATORE_STOPS, COIMBATORE_ROUTES, BUS_TYPES


def generate_routes(num_routes=25):
    routes = []
    for i, route_info in enumerate(COIMBATORE_ROUTES[:num_routes]):
        routes.append({
            "id": f"R-{i+1:03d}",
            "name": route_info["name"],
            "stops_sequence": route_info["stops"],
            "status": "active",
        })
    return routes


def generate_stops():
    stops = []
    for i, (name, (lat, lng)) in enumerate(COIMBATORE_STOPS.items()):
        stops.append({
            "id": f"S-{i+1:04d}",
            "name_en": name,
            "name_ta": name,
            "name_hi": name,
            "latitude": lat,
            "longitude": lng,
        })
    return stops


def generate_trips(routes, days=7):
    trips = []
    for route in routes:
        for day_offset in range(days):
            trip_date = date.today() + timedelta(days=day_offset)
            departures = [time(h, 0) for h in [6, 7, 8, 9, 10, 11, 12, 14, 16, 17, 18, 19, 20]]
            for dep_time in random.sample(departures, random.randint(5, 9)):
                departure = datetime.combine(trip_date, dep_time)
                bus_num = f"{random.randint(1,99)}{random.choice(['', 'A', 'B', 'C', 'D'])}"
                has_etm = random.random() > 0.15
                trips.append({
                    "id": f"T-{uuid.uuid4().hex[:8]}",
                    "route_id": route["id"],
                    "bus_number": bus_num,
                    "scheduled_departure": departure.isoformat(),
                    "status": "Running Today" if has_etm else "Status Not Confirmed",
                    "etm_login_time": (departure - timedelta(minutes=random.randint(5, 15))).isoformat() if has_etm else None,
                })
    return trips


def generate_historical_performance(routes, stops, months=12):
    records = []
    base_date = date.today() - timedelta(days=months * 30)
    for route in routes[:10]:
        route_stops = route["stops_sequence"][:5]
        for day_offset in range(months * 30):
            record_date = base_date + timedelta(days=day_offset)
            day_of_week = record_date.weekday() + 1
            for dep_hour in [8, 12, 16]:
                for stop_name in route_stops:
                    base_delay = random.gauss(5, 3)
                    if day_of_week <= 5 and dep_hour in [8, 16]:
                        base_delay += random.gauss(8, 4)
                    delay = max(0, int(base_delay))
                    scheduled = datetime.combine(record_date, time(dep_hour, 0))
                    actual = scheduled + timedelta(minutes=delay)
                    records.append({
                        "route_id": route["id"],
                        "stop_name": stop_name,
                        "scheduled_time": scheduled.isoformat(),
                        "actual_arrival": actual.isoformat(),
                        "delay_minutes": delay,
                        "day_of_week": day_of_week,
                        "season": "summer" if record_date.month in [3,4,5] else "monsoon" if record_date.month in [6,7,8,9] else "winter",
                    })
    return records


if __name__ == "__main__":
    routes = generate_routes(25)
    stops = generate_stops()
    trips = generate_trips(routes, days=7)
    historical = generate_historical_performance(routes, stops, months=12)
    print(f"Generated: {len(routes)} routes, {len(stops)} stops, {len(trips)} trips, {len(historical)} historical records")
