import React, { useState } from 'react';
import { Search, MapPin, Navigation, Clock, ShieldAlert, CheckCircle, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackingDashboard() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [routeNo, setRouteNo] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (!routeNo) return;

        setLoading(true);
        setResult(null);

        // Simulate API delay
        setTimeout(() => {
            setLoading(false);
            setResult({
                status: 'running', // running, unconfirmed, cancelled
                busNo: 'KL-15-A-9082',
                route: routeNo,
                lastConfirmedTime: '08:42 AM',
                source: 'ETM Login',
                etaRange: '15 - 20',
                confidence: 85,
                delayReason: 'Heavy Traffic',
                currentStop: 'Silk Board Junction',
                nextStop: 'Madiwala',
                destination: 'Majestic Bus Stand',
            });
        }, 1800);
    };

    return (
        <div className="max-w-4xl mx-auto w-full">
            {/* Search Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-ti-saffron/20 to-transparent rounded-bl-full opacity-50 pointer-events-none group-hover:scale-110 transition-transform"></div>

                <h3 className="text-2xl font-bold text-ti-navy mb-6 flex items-center">
                    <Search className="mr-3 text-ti-saffron" /> Find Your Bus
                </h3>

                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Route No.</label>
                        <input
                            type="text"
                            placeholder="e.g. 356C"
                            value={routeNo}
                            onChange={(e) => setRouteNo(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-ti-saffron focus:ring-0 transition-colors text-lg font-bold text-ti-navy uppercase placeholder-gray-400"
                        />
                    </div>
                    <div className="md:col-span-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Boarding From</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                            <select className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-ti-saffron appearance-none text-gray-700 font-medium">
                                <option>Select Stop</option>
                                <option>Electronic City</option>
                                <option>Silk Board</option>
                                <option>Koramangala</option>
                            </select>
                        </div>
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Destination</label>
                        <div className="relative">
                            <Navigation className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                            <select className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-ti-saffron appearance-none text-gray-700 font-medium">
                                <option>Select Stop</option>
                                <option>Majestic</option>
                                <option>Shivajinagar</option>
                                <option>KR Market</option>
                            </select>
                        </div>
                    </div>
                    <div className="md:col-span-2 flex items-end">
                        <button
                            type="submit"
                            disabled={loading || !routeNo}
                            className="w-full h-[52px] bg-gradient-to-r from-ti-saffron to-ti-saffron-light text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center group"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>Track</span>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Section */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: 20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {/* Main Status Card */}
                        <div className="md:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
                            <div className="px-6 py-4 bg-ti-navy text-white flex justify-between items-center relative overflow-hidden">
                                <div className="z-10">
                                    <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Bus No.</span>
                                    <div className="text-2xl font-bold flex items-center">
                                        {result.busNo} <span className="ml-3 px-2 py-0.5 bg-white/20 rounded text-sm text-ti-saffron">Route {result.route}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 z-10 bg-ti-emerald/20 px-3 py-1.5 rounded-full border border-ti-emerald/30">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ti-emerald opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-ti-emerald"></span>
                                    </span>
                                    <span className="text-ti-emerald font-semibold text-sm">Running Today</span>
                                </div>
                                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white/10 to-transparent transform -skew-x-12"></div>
                            </div>

                            <div className="p-6 flex-grow flex flex-col justify-between">
                                <div className="flex items-start justify-between mb-8">
                                    <div>
                                        <h4 className="text-gray-500 font-medium mb-1">Trip Authenticity</h4>
                                        <p className="text-gray-800 font-semibold flex items-center text-sm">
                                            <CheckCircle className="w-4 h-4 text-ti-emerald mr-1" />
                                            Trip confirmed via {result.source} at {result.lastConfirmedTime}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-orange-50 rounded-xl p-5 border border-orange-100 flex items-center mb-6">
                                    <div className="bg-white p-3 rounded-full shadow-sm mr-5 relative">
                                        <Clock className="w-8 h-8 text-ti-saffron" />
                                        <motion.div
                                            className="absolute inset-0 border-2 border-ti-saffron rounded-full"
                                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-gray-500 font-medium text-sm mb-1 uppercase tracking-wider">Expected Arrival Window</h4>
                                        <div className="flex items-baseline group relative cursor-help">
                                            <span className="text-4xl font-extrabold text-ti-navy mr-2">{result.etaRange}</span>
                                            <span className="text-xl font-bold text-gray-600">Mins</span>
                                            <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 w-64 bg-gray-900 text-white text-xs p-3 rounded shadow-xl z-20">
                                                Arrival window generated using historical route patterns & time-of-day variations. Model confidence: {result.confidence}%.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold text-gray-600">AI Confidence Meter</span>
                                        <span className="text-sm font-bold text-ti-navy">{result.confidence}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                        <motion.div
                                            className="h-2.5 rounded-full bg-gradient-to-r from-green-400 to-ti-emerald"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${result.confidence}%` }}
                                            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                        ></motion.div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Delay Reason Card */}
                            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 group">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Traffic Conditions</h4>
                                <div className="flex items-center space-x-3 mb-3">
                                    <span className="px-3 py-1.5 bg-red-100 text-red-700 font-bold text-sm rounded-lg border border-red-200 flex items-center shadow-sm">
                                        <AlertTriangle className="w-4 h-4 mr-1.5" />
                                        {result.delayReason}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded-md border border-gray-100 font-medium">
                                    Reason classified using pattern-based AI comparison.
                                </p>
                            </div>

                            {/* Stop tracking card */}
                            <div className="bg-gradient-to-br from-ti-navy to-blue-900 rounded-2xl shadow-md p-5 text-white relative overflow-hidden flex-grow">
                                <div className="absolute top-0 right-0 opacity-10">
                                    <MapPin size={100} className="-mr-6 -mt-6" />
                                </div>
                                <h4 className="text-sm font-bold text-blue-200 uppercase tracking-wider mb-5">Live Position</h4>

                                <div className="relative pl-6 space-y-4">
                                    <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-blue-700/50"></div>
                                    <motion.div
                                        className="absolute left-[3px] top-6 w-1.5 h-10 bg-ti-saffron rounded-full shadow-[0_0_8px_rgba(255,153,51,0.8)]"
                                        animate={{ top: ["8px", "40px", "8px"] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    />

                                    <div className="relative">
                                        <div className="absolute -left-6 w-3 h-3 bg-ti-saffron rounded-full border-2 border-ti-navy top-1"></div>
                                        <p className="text-xs text-blue-300 mb-0.5 font-medium">Last Confirmed Stop</p>
                                        <p className="text-sm font-bold">{result.currentStop}</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-6 w-3 h-3 bg-white rounded-full border-2 border-ti-navy top-1"></div>
                                        <p className="text-xs text-blue-300 mb-0.5 font-medium">Next Stop</p>
                                        <p className="text-sm font-bold">{result.nextStop}</p>
                                    </div>
                                    <div className="relative pt-2">
                                        <div className="absolute -left-6 w-3 h-3 bg-gray-400 rounded-full border-2 border-ti-navy top-3"></div>
                                        <p className="text-xs text-blue-300 mb-0.5 font-medium">Destination</p>
                                        <p className="text-sm font-bold opacity-80">{result.destination}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
