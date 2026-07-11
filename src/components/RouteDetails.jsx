import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, CheckCircle, MapPin, AlertTriangle, Navigation, Phone, Send, Loader2, Bus, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import { t } from '../translations';
import { api } from '../api';
import LiveMap from './LiveMap';

export default function RouteDetails({ routeData, navigateTo, setGlobalRouteDetails, lang, region }) {
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
            let loaded = false;
            for (const rid of tryRouteIds) {
                const data = await api.getRouteMapData(rid);
                if (data && data.stops && data.stops.length > 0) {
                    setMapStops(data.stops);
                    setBusPosition(data.bus_position);
                    loaded = true;
                    return;
                }
            }

            // Fallback for Kerala routes if API database is not seeded/returns empty
            if (!loaded) {
                const rId = routeData.id || '';
                if (rId.includes('KL-1')) {
                    setMapStops([
                        { name: 'Vyttila Hub', lat: 9.9703, lng: 76.3220 },
                        { name: 'Palarivattom', lat: 9.9986, lng: 76.3116 },
                        { name: 'Edappally', lat: 10.0261, lng: 76.3080 },
                        { name: 'Kalamassery', lat: 10.0534, lng: 76.3216 },
                        { name: 'Aluva', lat: 10.1076, lng: 76.3492 }
                    ]);
                    setBusPosition({ lat: 10.0123, lng: 76.3090, heading: 45 });
                } else if (rId.includes('KL-2')) {
                    setMapStops([
                        { name: 'Ernakulam South', lat: 9.9678, lng: 76.2863 },
                        { name: 'Kadavanthra', lat: 9.9670, lng: 76.2998 },
                        { name: 'Vyttila', lat: 9.9703, lng: 76.3220 },
                        { name: 'Palarivattom', lat: 9.9986, lng: 76.3116 },
                        { name: 'Kakkanad', lat: 10.0159, lng: 76.3418 }
                    ]);
                    setBusPosition({ lat: 9.9800, lng: 76.3150, heading: 90 });
                } else if (rId.includes('KL-3')) {
                    setMapStops([
                        { name: 'High Court', lat: 9.9856, lng: 76.2730 },
                        { name: 'Marine Drive', lat: 9.9803, lng: 76.2754 },
                        { name: 'Ernakulam South', lat: 9.9678, lng: 76.2863 },
                        { name: 'Thoppumpady', lat: 9.9392, lng: 76.2625 },
                        { name: 'Fort Kochi', lat: 9.9657, lng: 76.2421 }
                    ]);
                    setBusPosition({ lat: 9.9550, lng: 76.2550, heading: 180 });
                } else if (rId.includes('KL-4')) {
                    setMapStops([
                        { name: 'Edappally', lat: 10.0261, lng: 76.3080 },
                        { name: 'Kakkanad', lat: 10.0159, lng: 76.3418 },
                        { name: 'Kizhakkambalam', lat: 10.0238, lng: 76.4026 },
                        { name: 'Muvattupuzha', lat: 9.9882, lng: 76.5794 }
                    ]);
                    setBusPosition({ lat: 10.0190, lng: 76.3700, heading: 120 });
                }
            }
        }

        loadMapData();
    }, [routeData]);

    if (!routeData) {
        return (
            <div className="text-center p-10">
                <p>{t('noRouteData', lang)}</p>
                <button onClick={() => navigateTo('track')} className="text-ti-saffron underline mt-4">{t('goBack', lang)}</button>
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
        <div className="max-w-5xl mx-auto w-full pt-8 px-2 transition-colors">
            <button
                onClick={() => navigateTo('track')}
                className="mb-6 flex items-center text-gray-500 hover:text-[#0F1E36] dark:text-gray-400 dark:hover:text-white font-extrabold text-sm transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> {t('backToSearchResults', lang)}
            </button>

            {/* Route Name Header */}
            <div className="mb-4 px-2">
                <div className="flex items-center space-x-3 mb-2">
                    <Bus className="w-6 h-6 text-[#FF9933]" />
                    <h2 className="text-xl font-black text-[#0F1E36] dark:text-white tracking-tight">
                        {routeData.route || `Bus ${routeData.id}`}
                    </h2>
                </div>
            </div>

            {/* Status Strip */}
            <div className="w-full flex flex-wrap items-center gap-3 mb-6 px-2">
                <div className={`px-4 py-1.5 font-bold text-xs rounded-full flex items-center transition-colors ${isDelayed ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400' : 'bg-[#12820B]/10 dark:bg-green-950/20 text-[#12820B] dark:text-green-400'}`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${isDelayed ? 'bg-red-500 animate-pulse' : 'bg-[#12820B]'}`}></span>
                    {isDelayed ? t('delayed', lang) : t('onTime', lang)}
                </div>
                <div className="flex items-center text-xs font-bold text-gray-400 dark:text-gray-500 transition-colors">
                    <CheckCircle className="w-4 h-4 mr-1.5 text-[#12820B]" /> {t('tripConfirmedAt', lang)} {routeData.lastConfirmedTime || '08:42 AM'}
                </div>
                {isDelayed && routeData.delayReason && (
                    <div className="px-3 py-1.5 font-bold text-xs bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 rounded-full flex items-center">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> {routeData.delayReason}
                    </div>
                )}
            </div>

            {/* Live Map */}
            <div className="mb-8 relative z-10">
                <div className="flex items-center mb-3 px-1">
                    <Radio className="w-4 h-4 text-red-500 mr-2 animate-pulse" />
                    <h3 className="text-xs font-black text-[#0F1E36] dark:text-gray-200 uppercase tracking-widest">{t('liveTelemetryMap', lang)}</h3>
                    <span className="ml-2 px-2.5 py-0.5 bg-red-500 text-white text-[8px] font-black rounded-md tracking-wider animate-pulse">{t('radarLive', lang)}</span>
                </div>
                <LiveMap
                    stops={mapStops}
                    busPosition={busPosition}
                    boarding={routeData.currentStop || ''}
                    destination={routeData.destination || routeData.arrivalStop || ''}
                    routeData={routeData}
                    lang={lang}
                    region={region}
                />
            </div>

            {/* ETA + Actions Card */}
            <div className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-xl border-2 border-[#FF9933]/15 p-8 transition-colors chakra-pattern-modern">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

                    {/* Left: ETA */}
                    <div className="md:col-span-7 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xs font-black text-gray-400 dark:text-gray-555 uppercase tracking-[0.2em] flex items-center mb-6">
                                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#FF9933] to-[#FF6F00] flex items-center justify-center mr-3 shadow-md">
                                    <Clock className="w-4 h-4 text-white" />
                                </div>
                                {t('estimatedArrival', lang)}
                            </h3>

                            <div className="mb-8">
                                <div className="flex items-baseline space-x-2 text-[#FF9933] dark:text-orange-400 transition-colors flex-wrap">
                                    <span className="text-6xl md:text-8xl font-black leading-none tracking-tighter bg-gradient-to-r from-[#FF9933] to-[#FF6F00] bg-clip-text text-transparent">{routeData.etaRange || '10 - 15'}</span>
                                    <span className="text-xl md:text-2xl font-black text-gray-500 dark:text-gray-400">{t('minutesUnit', lang)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 dark:text-gray-555 uppercase tracking-widest mb-1.5">{t('fromStop', lang)}</p>
                                    <p className="text-base font-extrabold text-[#0F1E36] dark:text-white">{routeData.currentStop || routeData.boarding || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 dark:text-gray-555 uppercase tracking-widest mb-1.5">{t('toDestination', lang)}</p>
                                    <p className="text-base font-extrabold text-[#0F1E36] dark:text-white">{routeData.arrivalStop || routeData.destination || '-'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#FAF9F6] dark:bg-[#070F1E]/50 rounded-2xl p-5 flex items-center border border-gray-150 dark:border-slate-800/80">
                            <div className="bg-gradient-to-br from-[#12820B] to-emerald-600 text-white p-3 rounded-xl mr-5 shrink-0 shadow-md">
                                <Navigation className="w-5 h-5 transform rotate-45 animate-pulse" />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-[#12820B] uppercase tracking-widest mb-0.5">{t('nextStationStop', lang)}</p>
                                <p className="text-base font-extrabold text-[#0F1E36] dark:text-white">{routeData.nextStop || t('approachingStop', lang)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: SMS + Actions */}
                    <div className="md:col-span-5 bg-[#FAF9F6] dark:bg-[#070F1E]/50 rounded-2xl p-6 border border-gray-150 dark:border-slate-800/80 flex flex-col justify-between h-full">

                        {/* SMS Alert Section */}
                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF9933] to-[#FF6F00] flex items-center justify-center mr-3 shadow-md">
                                    <Phone className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-extrabold text-[#0F1E36] dark:text-gray-200">{t('getSmsAlert', lang)}</p>
                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold">{t('receiveEtaOnPhone', lang)}</p>
                                </div>
                            </div>
                            <form onSubmit={handleSendSMS} className="flex space-x-2">
                                <div className="flex flex-1">
                                    <span className="inline-flex items-center px-3 py-2.5 border border-r-0 border-gray-200 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-300 text-xs font-bold rounded-l-xl">+91</span>
                                    <input
                                        type="tel"
                                        placeholder={t('mobileNumberPlaceholder', lang)}
                                        value={phone}
                                        onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); setSmsResult(null); }}
                                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-r-xl focus:border-[#FF9933] focus:ring-0 text-sm font-bold text-[#0F1E36] dark:text-white"
                                        maxLength={10}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={smsSending || phone.length !== 10}
                                    className="px-4 py-2.5 bg-gradient-to-r from-[#FF9933] to-orange-600 text-white font-extrabold rounded-xl text-sm transition-all disabled:opacity-40 flex items-center shadow-md transform active:scale-95"
                                >
                                    {smsSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </button>
                            </form>
                            {smsResult && (
                                <p className={`text-xs font-bold mt-2.5 ${smsResult.status === 'sent' ? 'text-[#12820B]' : 'text-red-500'}`}>
                                    {smsResult.message}
                                </p>
                            )}
                        </div>

                        {/* Route Info */}
                        <div className="bg-white dark:bg-[#070F1E] rounded-xl p-4.5 mb-6 border border-gray-150 dark:border-slate-800/80">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-widest mb-1">{t('busRouteId', lang)}</p>
                                    <p className="text-xs font-extrabold text-[#0F1E36] dark:text-white">{routeData.id}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 dark:text-gray-555 uppercase tracking-widest mb-1">{t('telemetry', lang)}</p>
                                    <p className="text-xs font-extrabold text-[#0F1E36] dark:text-white">{routeData.source === 'GPS Sync' ? t('gpsSync', lang) : routeData.source || t('gpsSync', lang)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <button
                                    onClick={handleSubmitFeedback}
                                    className="w-full py-3 bg-white dark:bg-slate-900 border-2 border-gray-250 dark:border-slate-700 rounded-xl text-xs font-extrabold text-[#0F1E36] dark:text-gray-200 hover:border-[#FF9933] transition-colors shadow-sm"
                                >
                                    {t('submitFeedback', lang)}
                                </button>
                                <button
                                    onClick={handleReportIssue}
                                    className="w-full py-3 bg-white dark:bg-slate-900 border-2 border-red-500/20 rounded-xl text-xs font-extrabold text-red-650 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                >
                                    {t('reportIncident', lang)}
                                </button>
                            </div>

                            <div className="flex items-center justify-center text-[9px] font-black text-[#12820B] uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#12820B] mr-2 animate-ping"></div>
                                {t('liveEtmGpsSyncActive', lang)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
