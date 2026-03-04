import React, { useState } from 'react';
import { Star, MessageSquare, AlertCircle, ShieldOff, Zap, CheckCircle2, Bus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeedbackSection({ routeData }) {
    const [rating, setRating] = useState({ cleanliness: 0, punctuality: 0, safety: 0 });
    const [reportType, setReportType] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [submittedRating, setSubmittedRating] = useState(false);

    const reportOptions = [
        { id: 'rash', label: 'Rash Driving', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
        { id: 'misconduct', label: 'Crew Misconduct', icon: MessageSquare, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
        { id: 'crowd', label: 'Overcrowding', icon: AlertCircle, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
        { id: 'clean', label: 'Cleanliness Issue', icon: ShieldOff, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
    ];

    const currentRoute = routeData?.route || '500A';

    const handleRating = (category, val) => {
        setRating(prev => ({ ...prev, [category]: val }));
    };

    const submitReport = () => {
        setShowModal(true);
    };

    const renderStars = (category) => {
        return (
            <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        onClick={() => handleRating(category, star)}
                        className="focus:outline-none hover:scale-110 transition-transform"
                    >
                        <Star
                            className={`w-8 h-8 ${rating[category] >= star ? 'fill-ti-saffron text-ti-saffron drop-shadow-sm' : 'text-gray-300'}`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    const getAggregatedScore = () => {
        const vals = Object.values(rating).filter(v => v > 0);
        if (vals.length === 0) return "0.0";
        return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
    };

    return (
        <div className="max-w-4xl mx-auto w-full mb-10">
            <div className="mb-6">
                <h3 className="text-xs font-bold text-ti-saffron uppercase tracking-widest flex items-center mb-2">
                    <MessageSquare className="w-4 h-4 mr-2" /> COMMUNITY FEEDBACK
                </h3>
                <h2 className="text-3xl font-extrabold text-ti-navy">Service Reporting</h2>
                <p className="text-gray-500 mt-2 max-w-xl">Help us improve transit quality. Submit anonymous reports or rate the historical performance of specific routes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Safety & Service Reporting */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-5 text-white flex items-center justify-between">
                        <div className="flex items-center">
                            <AlertCircle className="w-6 h-6 mr-3 text-red-400" />
                            <h3 className="font-bold text-lg">Anonymous Report</h3>
                        </div>
                        <div className="bg-white/20 px-3 py-1 text-xs font-bold rounded flex items-center shadow-inner text-orange-100 uppercase tracking-widest">
                            <Bus className="w-3 h-3 mr-1.5" /> {currentRoute}
                        </div>
                    </div>

                    <div className="p-6 flex-grow flex flex-col relative">
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col h-full"
                        >
                            <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                                Select an issue to log against the current route. Pattern detection enabled.
                            </p>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {reportOptions.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setReportType(opt.id)}
                                        className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${reportType === opt.id ? `ring-2 ring-offset-1 ring-${opt.color.split('-')[1]}-500 ${opt.bg} ${opt.border}` : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                                    >
                                        <opt.icon className={`w-8 h-8 mb-2 ${reportType === opt.id ? opt.color : 'text-gray-400'}`} />
                                        <span className={`text-xs font-bold ${reportType === opt.id ? 'text-gray-900' : 'text-gray-500'}`}>{opt.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-auto">
                                <button
                                    disabled={!reportType}
                                    onClick={submitReport}
                                    className="w-full py-4 rounded-xl font-bold bg-ti-navy text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl"
                                >
                                    Submit Anonymous Report
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Aggregate Route Rating */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col overflow-hidden">
                    <div className="bg-ti-saffron-light/10 p-5 flex items-center justify-between border-b border-orange-100">
                        <div className="flex items-center text-orange-900">
                            <Star className="w-6 h-6 mr-2 fill-ti-saffron text-ti-saffron" />
                            <h3 className="font-bold text-lg">Rate Route Pattern</h3>
                        </div>
                        <div className="bg-white text-ti-navy font-black text-xl px-3 py-1 rounded-lg border border-orange-100 shadow-sm flex items-center">
                            {getAggregatedScore()} <Star className="w-4 h-4 ml-1 fill-ti-saffron text-ti-saffron" />
                        </div>
                    </div>

                    <div className="p-6 flex-grow flex flex-col justify-between">
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            Ratings apply to the route <strong>{currentRoute}</strong> historical performance, not individual drivers.
                        </p>

                        <div className="space-y-6 mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                <span className="font-semibold text-gray-700 mb-2 sm:mb-0">Cleanliness</span>
                                {renderStars('cleanliness')}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                <span className="font-semibold text-gray-700 mb-2 sm:mb-0">Punctuality</span>
                                {renderStars('punctuality')}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                <span className="font-semibold text-gray-700 mb-2 sm:mb-0">Perceived Safety</span>
                                {renderStars('safety')}
                            </div>
                        </div>

                        <button
                            disabled={getAggregatedScore() === "0.0" || submittedRating}
                            onClick={() => {
                                setSubmittedRating(true);
                                setTimeout(() => { setRating({ cleanliness: 0, punctuality: 0, safety: 0 }); setSubmittedRating(false); }, 3000);
                            }}
                            className="w-full py-4 rounded-xl font-bold bg-white border-2 border-ti-saffron text-ti-navy disabled:opacity-50 disabled:border-gray-200 disabled:text-gray-400 hover:bg-orange-50 transition-colors mt-auto shadow-sm"
                        >
                            {submittedRating ? 'Rating Submitted' : 'Submit Route Rating'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ti-navy/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden text-center relative pointer-events-auto"
                        >
                            <div className="pt-10 pb-6 px-10">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-ti-navy mb-3">Report Successfully Logged</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
                                    Your anonymous report for Route {currentRoute} has been recorded for pattern analysis.
                                </p>

                                <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-4 py-2 rounded-full shadow-sm mb-10 w-fit mx-auto">
                                    <Zap className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs font-bold text-blue-900 uppercase tracking-widest">Pattern Detection Enabled</span>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setReportType(null);
                                    }}
                                    className="w-full py-4 bg-ti-navy text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
