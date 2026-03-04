import React from 'react';
import { ArrowLeft, Clock, CheckCircle, MapPin, AlertTriangle, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import { t } from '../translations';

export default function RouteDetails({ routeData, navigateTo, setGlobalRouteDetails, lang }) {
    if (!routeData) {
        return (
            <div className="text-center p-10">
                <p>No route data found.</p>
                <button onClick={() => navigateTo('track')} className="text-ti-saffron underline mt-4">Go Back</button>
            </div>
        );
    }

    // 70% running today, 30% delayed (logic applied here or passed in)
    // We already receive it from routeData in the planned architecture.
    const isDelayed = routeData.status === 'delayed';

    const handleReportIssue = () => {
        setGlobalRouteDetails(routeData);
        navigateTo('service-reporting');
    };

    const handleSubmitFeedback = () => {
        setGlobalRouteDetails(routeData);
        navigateTo('service-reporting');
    };

    return (
        <div className="max-w-5xl mx-auto w-full pt-8 transition-colors">
            <button
                onClick={() => navigateTo('track')}
                className="mb-8 flex items-center text-gray-500 hover:text-[#0f172a] dark:text-gray-400 dark:hover:text-white font-bold transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Search Results
            </button>

            {/* Header Strip - Dynamic based on status */}
            <div className="w-full flex items-center justify-between mb-4 relative z-10 px-2 transition-colors">
                <div className="flex items-center space-x-6">
                    <div className={`px-4 py-1.5 font-bold text-sm rounded-full flex items-center transition-colors ${isDelayed ? 'bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-400' : 'bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-400'}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 transition-colors ${isDelayed ? 'bg-red-500' : 'bg-green-500'}`}></span>
                        {isDelayed ? 'Delayed' : 'Running Today'}
                    </div>

                    <div className="flex items-center text-sm font-bold text-gray-400 dark:text-gray-500 transition-colors">
                        <CheckCircle className="w-4 h-4 mr-2" /> Trip confirmed via ETM login at {routeData.lastConfirmedTime || '08:42 AM'}
                    </div>
                </div>

                {isDelayed && (
                    <div className="px-4 py-1.5 font-bold text-sm bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded flex items-center transition-colors">
                        <AlertTriangle className="w-4 h-4 mr-2" /> Delay Reason: {routeData.delayReason || 'Traffic Congestion'}
                    </div>
                )}
            </div>

            {/* Main AI Prediction Card */}
            {/* Main AI Prediction Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-[#fed7aa] dark:border-orange-900/50 p-8 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

                    {/* Left Side: Prediction */}
                    <div className="md:col-span-7 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xs font-bold text-[#0f172a] dark:text-gray-300 uppercase tracking-[0.2em] flex items-center mb-8 transition-colors">
                                <div className="w-6 h-6 rounded-full bg-[#0f172a] dark:bg-slate-700 flex items-center justify-center mr-3 transition-colors">
                                    <Clock className="w-3.5 h-3.5 text-white" />
                                </div>
                                AI Arrival Prediction for Bus {routeData.id}
                            </h3>

                            <div className="mb-10">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 transition-colors">Expected Arrival:</p>
                                <div className="flex items-baseline space-x-2 text-[#f97316] dark:text-orange-500 transition-colors flex-wrap">
                                    <span className="text-5xl md:text-7xl font-extrabold leading-none tracking-tighter">{routeData.etaRange || '10 - 15'}</span>
                                    <span className="text-xl md:text-3xl font-extrabold pb-2">Minutes</span>
                                </div>
                            </div>

                            <div className="mb-10">
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 transition-colors">Arrival Stop:</p>
                                <h2 className="text-4xl md:text-[2.75rem] font-extrabold text-[#0f172a] dark:text-white leading-tight tracking-tight transition-colors">{routeData.arrivalStop || routeData.destination}</h2>
                            </div>
                        </div>

                        <div className="bg-[#fff7ed] dark:bg-orange-950/20 rounded-xl p-5 flex items-center transition-colors">
                            <div className="bg-[#f97316] text-white p-3 rounded-full mr-5 shrink-0 shadow-sm transition-colors">
                                <Navigation className="w-6 h-6 transform rotate-45" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-[#ea580c] dark:text-orange-400 uppercase tracking-widest mb-0.5 transition-colors">Next Stop</p>
                                <p className="text-xl font-bold text-[#0f172a] dark:text-white transition-colors">{routeData.nextStop || 'Approaching Stop'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Metrics & Actions */}
                    <div className="md:col-span-5 bg-[#f8fafc] dark:bg-slate-900/50 rounded-2xl p-8 border border-gray-100 dark:border-slate-700 flex flex-col justify-between h-full transition-colors">
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="mt-1">
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-tight transition-colors">Reliability Metric</p>
                                    <p className="text-sm font-extrabold text-[#0f172a] dark:text-gray-200 transition-colors">AI CONFIDENCE</p>
                                </div>
                                <span className="text-4xl font-extrabold text-[#0f172a] dark:text-white transition-colors">{routeData.confidence}%</span>
                            </div>

                            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 mb-6 overflow-hidden transition-colors">
                                <motion.div
                                    className="h-full rounded-full bg-gradient-to-r from-gray-500 to-[#0f172a] dark:from-slate-500 dark:to-slate-300 transition-colors"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${routeData.confidence}%` }}
                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                ></motion.div>
                            </div>

                            <p className="text-[10px] text-gray-400 dark:text-gray-500 italic font-medium leading-relaxed uppercase tracking-wider transition-colors">
                                Model optimized for local Tamil Nadu terrain and real-time transit density at peak hours
                            </p>
                        </div>

                        <div className="mt-auto pt-10">
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button
                                    onClick={handleSubmitFeedback}
                                    className="w-full py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-bold text-[#0f172a] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                                >
                                    Submit Feedback
                                </button>
                                <button
                                    onClick={handleReportIssue}
                                    className="w-full py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-bold text-[#0f172a] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                                >
                                    {t('reportIssue', lang) || 'Report Issue'}
                                </button>
                            </div>

                            <div className="flex items-center justify-start text-[10px] font-bold text-green-600 dark:text-green-500 uppercase tracking-widest transition-colors">
                                <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2 shrink-0 transition-colors">
                                    <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                                </div>
                                Real-time GPS sync active
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
