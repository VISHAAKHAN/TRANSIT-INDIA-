import React, { useState, useEffect } from 'react';
import { Bus, MapPin, ChevronRight, ChevronDown, Power, PowerOff, Loader2, RefreshCw } from 'lucide-react';
import { api } from '../api';

export default function OperatorDashboard({ navigateTo, lang }) {
    const [routes, setRoutes] = useState([]);
    const [expandedRoute, setExpandedRoute] = useState(null);
    const [routeDetail, setRouteDetail] = useState(null);
    const [busNumber, setBusNumber] = useState('');
    const [activeTrips, setActiveTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activating, setActivating] = useState(false);
    const [deactivating, setDeactivating] = useState(null);
    const [message, setMessage] = useState(null);

    const operatorId = sessionStorage.getItem('operatorId');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [routesData, tripsData] = await Promise.all([
            api.getOperatorRoutes(),
            operatorId ? api.getActiveTrips(operatorId) : [],
        ]);
        setRoutes(Array.isArray(routesData) ? routesData : []);
        setActiveTrips(Array.isArray(tripsData) ? tripsData : []);
        setLoading(false);
    };

    const handleRouteClick = async (routeId) => {
        if (expandedRoute === routeId) {
            setExpandedRoute(null);
            setRouteDetail(null);
            setBusNumber('');
            return;
        }
        setExpandedRoute(routeId);
        setRouteDetail(null);
        const detail = await api.getRouteDetail(routeId);
        setRouteDetail(detail);
    };

    const handleActivate = async () => {
        if (!busNumber.trim() || !expandedRoute || !operatorId) return;
        setActivating(true);
        setMessage(null);
        const result = await api.activateTrip(expandedRoute, busNumber.trim(), operatorId);
        setActivating(false);
        if (result.trip_id) {
            setMessage({ type: 'success', text: `Bus ${result.bus_number} activated on ${result.route_name}` });
            setBusNumber('');
            setExpandedRoute(null);
            setRouteDetail(null);
            // Refresh active trips
            const trips = await api.getActiveTrips(operatorId);
            setActiveTrips(trips || []);
        } else {
            setMessage({ type: 'error', text: result.detail || 'Activation failed' });
        }
    };

    const handleDeactivate = async (tripId) => {
        setDeactivating(tripId);
        setMessage(null);
        const result = await api.deactivateTrip(tripId);
        setDeactivating(null);
        if (result.status === 'Completed') {
            setMessage({ type: 'success', text: 'Trip deactivated successfully' });
            const trips = await api.getActiveTrips(operatorId);
            setActiveTrips(trips || []);
        } else {
            setMessage({ type: 'error', text: result.detail || 'Deactivation failed' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-ti-saffron" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-ti-navy dark:text-white uppercase tracking-wide">
                        Operator Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Select a route, enter bus number, and activate
                    </p>
                </div>
                <button
                    onClick={loadData}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors"
                >
                    <RefreshCw size={16} />
                    <span className="hidden sm:inline">Refresh</span>
                </button>
            </div>

            {/* Message */}
            {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-bold ${
                    message.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel: Route List */}
                <div className="lg:col-span-2 space-y-3">
                    <h2 className="text-lg font-bold text-ti-navy dark:text-white mb-3 flex items-center">
                        <MapPin size={20} className="mr-2 text-ti-saffron" />
                        Coimbatore Routes ({routes.length})
                    </h2>

                    <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                        {routes.map((route) => (
                            <div key={route.id} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm transition-all">
                                {/* Route Card */}
                                <button
                                    onClick={() => handleRouteClick(route.id)}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-750 rounded-xl transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-lg bg-ti-saffron/10 dark:bg-ti-saffron/20 flex items-center justify-center shrink-0">
                                            <Bus size={20} className="text-ti-saffron" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-ti-navy dark:text-white text-sm">
                                                {route.name}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                {route.stop_count} stops
                                            </p>
                                        </div>
                                    </div>
                                    {expandedRoute === route.id
                                        ? <ChevronDown size={20} className="text-gray-400" />
                                        : <ChevronRight size={20} className="text-gray-400" />
                                    }
                                </button>

                                {/* Expanded: Stops + Activate */}
                                {expandedRoute === route.id && (
                                    <div className="px-4 pb-4 border-t border-gray-100 dark:border-slate-700">
                                        {/* Stop sequence */}
                                        {routeDetail ? (
                                            <div className="mt-3 mb-4">
                                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                                    Stop Sequence
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {routeDetail.stops.map((stop, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300"
                                                        >
                                                            <span className="w-4 h-4 rounded-full bg-ti-saffron/20 text-ti-saffron text-[10px] font-bold flex items-center justify-center mr-1.5">
                                                                {i + 1}
                                                            </span>
                                                            {stop.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-3 mb-4 flex items-center text-gray-400 text-sm">
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading stops...
                                            </div>
                                        )}

                                        {/* Bus number input + Activate */}
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="text"
                                                placeholder="Bus number (e.g. 42A)"
                                                value={busNumber}
                                                onChange={(e) => setBusNumber(e.target.value.toUpperCase())}
                                                className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-600 rounded-lg text-sm font-bold text-ti-navy dark:text-white placeholder-gray-400 focus:border-ti-saffron dark:focus:border-ti-saffron focus:ring-0 transition-colors"
                                            />
                                            <button
                                                onClick={handleActivate}
                                                disabled={!busNumber.trim() || activating}
                                                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {activating ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Power size={16} />
                                                )}
                                                <span>{activating ? 'Activating...' : 'Activate Bus'}</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Active Buses */}
                <div>
                    <h2 className="text-lg font-bold text-ti-navy dark:text-white mb-3 flex items-center">
                        <Bus size={20} className="mr-2 text-green-500" />
                        Active Buses ({activeTrips.length})
                    </h2>

                    {activeTrips.length === 0 ? (
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 text-center">
                            <Bus size={32} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                No active buses yet
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                Select a route and activate a bus
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {activeTrips.map((trip) => (
                                <div
                                    key={trip.trip_id}
                                    className="bg-white dark:bg-slate-800 rounded-xl border border-green-200 dark:border-green-900/50 p-4 shadow-sm"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                                    RUNNING
                                                </span>
                                                <span className="text-sm font-extrabold text-ti-navy dark:text-white">
                                                    {trip.bus_number}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                {trip.route_name}
                                            </p>
                                            {trip.activated_at && (
                                                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                                                    Since {new Date(trip.activated_at).toLocaleTimeString()}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDeactivate(trip.trip_id)}
                                            disabled={deactivating === trip.trip_id}
                                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            {deactivating === trip.trip_id ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <PowerOff size={14} />
                                            )}
                                            <span>Deactivate</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
