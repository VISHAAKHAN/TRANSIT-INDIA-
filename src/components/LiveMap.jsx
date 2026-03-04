import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons for Leaflet + bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const busIcon = new L.DivIcon({
    html: `<div class="bus-marker-pulse"><div style="background:#f97316;color:white;width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:20px;border:3px solid white;box-shadow:0 4px 14px rgba(249,115,22,0.5);position:relative;z-index:10;">🚌</div></div>`,
    className: '',
    iconSize: [42, 42],
    iconAnchor: [21, 21],
});

const stopIcon = new L.DivIcon({
    html: `<div style="background:white;width:12px;height:12px;border-radius:50%;border:3px solid #f97316;box-shadow:0 1px 4px rgba(0,0,0,0.2);"></div>`,
    className: '',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
});

const boardingIcon = new L.DivIcon({
    html: `<div style="position:relative;"><div style="background:#22c55e;color:white;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(34,197,94,0.4);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;">A</div></div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
});

const destinationIcon = new L.DivIcon({
    html: `<div style="position:relative;"><div style="background:#ef4444;color:white;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(239,68,68,0.4);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;">B</div></div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
});

function FitBounds({ stops, busPosition }) {
    const map = useMap();
    useEffect(() => {
        const points = stops.map(s => [s.lat, s.lng]);
        if (busPosition) points.push([busPosition.lat, busPosition.lng]);
        if (points.length >= 2) {
            map.fitBounds(points, { padding: [50, 50] });
        } else if (points.length === 1) {
            map.setView(points[0], 14);
        }
    }, [stops, busPosition, map]);
    return null;
}

// Animated bus that moves along the route
function AnimatedBus({ stops, initialPosition, routeData }) {
    const [position, setPosition] = useState(initialPosition ? [initialPosition.lat, initialPosition.lng] : null);
    const posRef = useRef(position);
    const indexRef = useRef(0);

    useEffect(() => {
        if (!stops || stops.length < 2 || !initialPosition) return;

        // Find the closest stop index to the initial position
        let closestIdx = 0;
        let minDist = Infinity;
        stops.forEach((s, i) => {
            const d = Math.abs(s.lat - initialPosition.lat) + Math.abs(s.lng - initialPosition.lng);
            if (d < minDist) { minDist = d; closestIdx = i; }
        });
        indexRef.current = closestIdx;

        const interval = setInterval(() => {
            const nextIdx = indexRef.current + 1;
            if (nextIdx >= stops.length) {
                indexRef.current = 0;
            } else {
                indexRef.current = nextIdx;
            }

            const target = stops[indexRef.current];
            const current = posRef.current || [initialPosition.lat, initialPosition.lng];

            // Smooth interpolation over 3 seconds (60fps * 3s = 180 steps)
            const steps = 60;
            const dLat = (target.lat - current[0]) / steps;
            const dLng = (target.lng - current[1]) / steps;
            let step = 0;

            const animate = setInterval(() => {
                step++;
                const newPos = [current[0] + dLat * step, current[1] + dLng * step];
                setPosition(newPos);
                posRef.current = newPos;
                if (step >= steps) clearInterval(animate);
            }, 50);

        }, 5000);

        return () => clearInterval(interval);
    }, [stops, initialPosition]);

    if (!position) return null;

    return (
        <>
            {/* Bus glow ring */}
            <CircleMarker
                center={position}
                radius={20}
                pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.1, weight: 1 }}
            />
            <Marker position={position} icon={busIcon} zIndexOffset={1000}>
                <Popup>
                    <div style={{ fontFamily: 'system-ui', padding: '4px' }}>
                        <div style={{ fontWeight: 'bold', color: '#f97316', fontSize: '14px', marginBottom: '4px' }}>Bus {routeData.id}</div>
                        <div style={{ fontSize: '13px', color: '#333' }}>ETA: {routeData.expectedArrival}</div>
                        <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>Status: {routeData.status === 'running' ? 'On Time' : 'Delayed'}</div>
                    </div>
                </Popup>
            </Marker>
        </>
    );
}

export default function LiveMap({ stops = [], busPosition = null, boarding = '', destination = '', routeData = {} }) {
    const defaultCenter = [11.0168, 76.9558]; // Coimbatore center (Gandhipuram)
    const routeLine = stops.map(s => [s.lat, s.lng]);

    return (
        <>
            <style>{`
                .bus-marker-pulse {
                    position: relative;
                }
                .bus-marker-pulse::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 42px;
                    height: 42px;
                    margin: -21px 0 0 -21px;
                    border-radius: 50%;
                    background: rgba(249, 115, 22, 0.3);
                    animation: busPulse 2s ease-out infinite;
                }
                @keyframes busPulse {
                    0% { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
            `}</style>
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-slate-600 shadow-lg" style={{ height: '420px' }}>
                <MapContainer
                    center={defaultCenter}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                    zoomControl={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <FitBounds stops={stops} busPosition={busPosition} />

                    {/* Route path - solid colored line */}
                    {routeLine.length >= 2 && (
                        <>
                            {/* Shadow line */}
                            <Polyline
                                positions={routeLine}
                                color="#0f172a"
                                weight={7}
                                opacity={0.15}
                            />
                            {/* Main route line */}
                            <Polyline
                                positions={routeLine}
                                color="#f97316"
                                weight={5}
                                opacity={0.9}
                                lineCap="round"
                                lineJoin="round"
                            />
                            {/* Animated dash overlay */}
                            <Polyline
                                positions={routeLine}
                                color="white"
                                weight={2}
                                opacity={0.5}
                                dashArray="12,18"
                            />
                        </>
                    )}

                    {/* Stop markers */}
                    {stops.map((stop, i) => {
                        const isBoarding = (boarding && stop.name.toLowerCase().includes(boarding.toLowerCase())) || i === 0;
                        const isDest = (destination && stop.name.toLowerCase().includes(destination.toLowerCase())) || i === stops.length - 1;
                        const icon = isBoarding ? boardingIcon : isDest ? destinationIcon : stopIcon;

                        return (
                            <Marker key={i} position={[stop.lat, stop.lng]} icon={icon}>
                                <Popup>
                                    <div style={{ fontFamily: 'system-ui', padding: '2px' }}>
                                        {isBoarding && <span style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '11px' }}>BOARDING POINT<br/></span>}
                                        {isDest && <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '11px' }}>DESTINATION<br/></span>}
                                        <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{stop.name}</span>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}

                    {/* Animated bus */}
                    <AnimatedBus
                        stops={stops}
                        initialPosition={busPosition}
                        routeData={routeData}
                    />
                </MapContainer>
            </div>
        </>
    );
}
