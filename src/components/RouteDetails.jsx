import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, MapPin, AlertTriangle, Navigation, Phone, Send, Loader2, Bus, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import { t } from '../translations';
import { api } from '../api';
import LiveMap from './LiveMap';

export default function RouteDetails({ routeData, navigateTo, setGlobalRouteDetails, lang }) {
    const [mapStops, setMapStops] = useState([]);
    const [busPosition, setBusPosition] = useState(null);
    const [phone, setPhone] = useState('');
    const [smsSending, setSmsSending] = useState(false);
    const [smsResult, setSmsResult] = useState(null);

    useEffect(() => {
        if (!routeData) return;

        const routeId = routeData.id?.split('-').pop() || routeData.id;
        const tryRouteIds = [routeId, `R-${routeId}`, routeData.id];

        async function loadMapData() {
            for (const rid of tryRouteIds) {
                const data = await api.getRouteMapData(rid);
                if (data && data.stops && data.stops.length > 0) {
                    setMapStops(data.stops);
                    setBusPosition(data.bus_position);
                    return;
                }
            }
        }

        loadMapData();
    }, [routeData]);

    if (!routeData) {
        return (
            <div className="text-center p-10">
                <p>No route data found.</p>
                <button onClick={() => navigateTo('track')} className="text-ti-saffron underline mt-4">Go Back</button>
            </div>
        );
    }

    const isDelayed = routeData.status === 'delayed';

    const handleReportIssue = () => {
        setGlobalRouteDetails(routeData);
        navigateTo('service-reporting');
    };

    const handleSubmitFeedback = () => {
        setGlobalRouteDetails(routeData);
        navigateTo('service-reporting');
    };

    const handleSendSMS = async (e) => {
        e.preventDefault();
        if (!phone || phone.length !== 10) return;

        setSmsSending(true);
        setSmsResult(null);

        const result = await api.notifyETA(
            phone,
            routeData.id,
            routeData.route || '',
            routeData.currentStop || routeData.boarding || '',
            routeData.destination || routeData.arrivalStop || '',
            routeData.expectedArrival || routeData.etaRange || '',
        );

        setSmsSending(false);
        setSmsResult(result);
    };

    return (
        <div className="max-w-5xl mx-auto w-full pt-8 transition-colors">
            <button
                onClick={() => navigateTo('track')}
                className="mb-6 flex items-center text-gray-500 hover:text-[#0f172a] dark:text-gray-400 dark:hover:text-white font-bold transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Search Results
            </button>

            {/* Route Name Header */}
            <div className="mb-4 px-2">
                <div className="flex items-center space-x-3 mb-2">
                    <Bus className="w-5 h-5 text-[#f97316]" />
                    <h2 className="text-lg font-extrabold text-[#0f172a] dark:text-white tracking-tight transition-colors">
                        {routeData.route || `Bus ${routeData.id}`}
                    </h2>
                </div>
            </div>

            {/* Status Strip */}
            <div className="w-full flex flex-wrap items-center gap-3 mb-5 px-2 transition-colors">
                <div className={`px-4 py-1.5 font-bold text-sm rounded-full flex items-center transition-colors ${isDelayed ? 'bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-400' : 'bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-400'}`}>
                    <span className={`w-2 h-2 rounded-full mr-2 transition-colors ${isDelayed ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
                    {isDelayed ? 'Delayed' : 'On Time'}
                </div>
                <div className="flex items-center text-sm font-bold text-gray-400 dark:text-gray-500 transition-colors">
                    <CheckCircle className="w-4 h-4 mr-1.5" /> Trip confirmed at {routeData.lastConfirmedTime || '08:42 AM'}
                </div>
                {isDelayed && routeData.delayReason && (
                    <div className="px-3 py-1.5 font-bold text-sm bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full flex items-center transition-colors">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> {routeData.delayReason}
                    </div>
                )}
            </div>

            {/* Live Map */}
            <div className="mb-6 relative z-10">
                <div className="flex items-center mb-3 px-1">
                    <Radio className="w-4 h-4 text-green-500 mr-2 animate-pulse" />
                    <h3 className="text-xs font-bold text-[#0f172a] dark:text-gray-200 uppercase tracking-widest transition-colors">Live Tracking</h3>
                    <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-[9px] font-bold rounded uppercase tracking-wider animate-pulse">LIVE</span>
                </div>
                <LiveMap
                    stops={mapStops}
                    busPosition={busPosition}
                    boarding={routeData.currentStop || ''}
                    destination={routeData.destination || routeData.arrivalStop || ''}
                    routeData={routeData}
                />
            </div>

            {/* ETA + Actions Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-8 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

                    {/* Left: ETA */}
                    <div className="md:col-span-7 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] flex items-center mb-6 transition-colors">
                                <div className="w-6 h-6 rounded-full bg-[#f97316] flex items-center justify-center mr-3">
                                    <Clock className="w-3.5 h-3.5 text-white" />
                                </div>
                                Estimated Arrival
                            </h3>

                            <div className="mb-8">
                                <div className="flex items-baseline space-x-2 text-[#f97316] dark:text-orange-400 transition-colors flex-wrap">
                                    <span className="text-5xl md:text-7xl font-extrabold leading-none tracking-tighter">{routeData.etaRange || '10 - 15'}</span>
                                    <span className="text-xl md:text-2xl font-extrabold pb-2 text-gray-500 dark:text-gray-400">min</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 transition-colors">From</p>
                                    <p className="text-lg font-extrabold text-[#0f172a] dark:text-white transition-colors">{routeData.currentStop || routeData.boarding || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 transition-colors">To</p>
                                    <p className="text-lg font-extrabold text-[#0f172a] dark:text-white transition-colors">{routeData.arrivalStop || routeData.destination || '-'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#fff7ed] dark:bg-orange-950/20 rounded-xl p-5 flex items-center transition-colors">
                            <div className="bg-[#f97316] text-white p-3 rounded-full mr-5 shrink-0 shadow-sm">
                                <Navigation className="w-5 h-5 transform rotate-45" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[#ea580c] dark:text-orange-400 uppercase tracking-widest mb-0.5 transition-colors">Next Stop</p>
                                <p className="text-lg font-bold text-[#0f172a] dark:text-white transition-colors">{routeData.nextStop || 'Approaching Stop'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: SMS + Actions */}
                    <div className="md:col-span-5 bg-[#f8fafc] dark:bg-slate-900/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 flex flex-col justify-between h-full transition-colors">

                        {/* SMS Alert Section */}
                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center mr-3">
                                    <Phone className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-extrabold text-[#0f172a] dark:text-gray-200 transition-colors">Get SMS Alert</p>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">Receive ETA on your phone</p>
                                </div>
                            </div>
                            <form onSubmit={handleSendSMS} className="flex space-x-2">
                                <div className="flex flex-1">
                                    <span className="inline-flex items-center px-3 py-2.5 border border-r-0 border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-300 text-xs font-bold rounded-l-lg transition-colors">+91</span>
                                    <input
                                        type="tel"
                                        placeholder="Mobile number"
                                        value={phone}
                                        onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setSmsResult(null); }}
                                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-r-lg focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] text-sm text-gray-900 dark:text-white transition-colors"
                                        maxLength={10}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={smsSending || phone.length !== 10}
                                    className="px-4 py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-lg text-sm transition-all disabled:opacity-40 flex items-center shadow-sm hover:shadow-md"
                                >
                                    {smsSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </button>
                            </form>
                            {smsResult && (
                                <p className={`text-xs font-bold mt-2 transition-colors ${smsResult.status === 'sent' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {smsResult.message}
                                </p>
                            )}
                        </div>

                        {/* Route Info */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-6 border border-gray-100 dark:border-slate-700 transition-colors">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Bus ID</p>
                                    <p className="text-sm font-extrabold text-[#0f172a] dark:text-white">{routeData.id}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Source</p>
                                    <p className="text-sm font-extrabold text-[#0f172a] dark:text-white">{routeData.source || 'GPS'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <button
                                    onClick={handleSubmitFeedback}
                                    className="w-full py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-bold text-[#0f172a] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                                >
                                    Feedback
                                </button>
                                <button
                                    onClick={handleReportIssue}
                                    className="w-full py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-bold text-[#0f172a] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                                >
                                    Report Issue
                                </button>
                            </div>

                            <div className="flex items-center justify-center text-[10px] font-bold text-green-600 dark:text-green-500 uppercase tracking-widest transition-colors">
                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                                Real-time GPS sync active
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
