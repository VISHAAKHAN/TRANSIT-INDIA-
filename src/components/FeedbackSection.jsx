import React, { useState } from 'react';
import { Star, MessageSquare, AlertCircle, ShieldOff, Zap, CheckCircle2, Bus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeedbackSection({ routeData }) {
    const [rating, setRating] = useState({ cleanliness: 0, punctuality: 0, safety: 0 });
    const [reportType, setReportType] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [submittedRating, setSubmittedRating] = useState(false);

    const reportOptions = [
        { id: 'rash', label: 'Rash Driving', icon: Zap, color: 'text-[#FF9933]', bg: 'bg-[#FF9933]/10', border: 'border-[#FF9933]/30' },
        { id: 'misconduct', label: 'Crew Misconduct', icon: MessageSquare, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-200 dark:border-red-900/30' },
        { id: 'crowd', label: 'Overcrowding', icon: AlertCircle, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20', border: 'border-purple-200 dark:border-purple-900/30' },
        { id: 'clean', label: 'Cleanliness Issue', icon: ShieldOff, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-900/30' },
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
                            className={`w-7.5 h-7.5 ${rating[category] >= star ? 'fill-[#FF9933] text-[#FF9933] drop-shadow-sm' : 'text-gray-300 dark:text-slate-800'}`}
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
        <div className="max-w-4xl mx-auto w-full mb-10 transition-colors duration-300">
            <div className="mb-6">
                <h3 className="text-[10px] font-black text-[#FF9933] uppercase tracking-widest flex items-center mb-1">
                    <MessageSquare className="w-4 h-4 mr-2" /> COMMUNITY FEEDBACK
                </h3>
                <h2 className="text-2xl font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">Service Reporting</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xl font-bold uppercase tracking-wide">Help us improve transit quality. Submit anonymous reports or rate specific routes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Safety & Service Reporting */}
                <div className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-[0_8px_30px_rgba(15,30,54,0.06)] border-2 border-[#FF9933]/15 flex flex-col overflow-hidden chakra-pattern-modern">
                    <div className="bg-[#0F1E36] p-5 text-white flex items-center justify-between border-b-2 border-[#FF9933]/20">
                        <div className="flex items-center">
                            <AlertCircle className="w-5.5 h-5.5 mr-2.5 text-red-500" />
                            <h3 className="font-extrabold text-sm uppercase tracking-wider">Anonymous Report</h3>
                        </div>
                        <div className="bg-white/10 px-3.5 py-1.5 text-[9px] font-black rounded-lg flex items-center shadow-inner text-orange-200 uppercase tracking-widest border border-white/10">
                            <Bus className="w-3.5 h-3.5 mr-1.5" /> Route {currentRoute}
                        </div>
                    </div>

                    <div className="p-6 flex-grow flex flex-col relative justify-between">
                        <div>
                            <p className="text-gray-550 dark:text-gray-400 text-xs font-bold mb-5 leading-relaxed">
                                Select an issue category below to register a pattern metric. Reports are processed anonymously.
                            </p>

                            <div className="grid grid-cols-2 gap-3.5 mb-6">
                                {reportOptions.map(opt => {
                                    const isSelected = reportType === opt.id;
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => setReportType(opt.id)}
                                            className={`p-4.5 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all ${isSelected ? `border-[#FF9933] ${opt.bg} shadow-md` : 'border-gray-150 dark:border-slate-800 bg-[#FAF9F6] dark:bg-[#070F1E]/40 hover:border-gray-250 dark:hover:border-slate-700'}`}
                                        >
                                            <opt.icon className={`w-8 h-8 mb-2 ${isSelected ? opt.color : 'text-gray-400'}`} />
                                            <span className={`text-xs font-black uppercase tracking-wider ${isSelected ? 'text-[#0F1E36] dark:text-white' : 'text-gray-500'}`}>{opt.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mt-auto pt-2">
                            <button
                                disabled={!reportType}
                                onClick={submitReport}
                                className="w-full py-4.5 rounded-2xl font-extrabold text-xs uppercase tracking-widest bg-gradient-to-r from-[#FF9933] to-[#FF6F00] hover:from-orange-655 hover:to-orange-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-md transform active:scale-95 transition-all"
                            >
                                Submit Anonymous Report
                            </button>
                        </div>
                    </div>
                </div>

                {/* Aggregate Route Rating */}
                <div className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-[0_8px_30px_rgba(15,30,54,0.06)] border-2 border-[#FF9933]/15 flex flex-col overflow-hidden chakra-pattern-modern">
                    <div className="bg-gray-50/50 dark:bg-slate-900/40 p-5 flex items-center justify-between border-b border-gray-150 dark:border-slate-800">
                        <div className="flex items-center text-[#0F1E36] dark:text-white">
                            <Star className="w-5.5 h-5.5 mr-2.5 fill-[#FF9933] text-[#FF9933]" />
                            <h3 className="font-extrabold text-sm uppercase tracking-wider">Rate Route Pattern</h3>
                        </div>
                        <div className="bg-white dark:bg-slate-900 text-[#0F1E36] dark:text-white font-black text-base px-3.5 py-1.5 rounded-xl border-2 border-[#FF9933]/20 shadow-sm flex items-center">
                            {getAggregatedScore()} <Star className="w-3.5 h-3.5 ml-1 fill-[#FF9933] text-[#FF9933]" />
                        </div>
                    </div>

                    <div className="p-6 flex-grow flex flex-col justify-between">
                        <p className="text-gray-550 dark:text-gray-400 text-xs font-bold mb-6 leading-relaxed">
                            Ratings apply to Route <strong>{currentRoute}</strong> historical averages, not individual drivers.
                        </p>

                        <div className="space-y-6 mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                <span className="font-black text-xs uppercase tracking-wider text-gray-650 dark:text-gray-300">Cleanliness</span>
                                {renderStars('cleanliness')}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                <span className="font-black text-xs uppercase tracking-wider text-gray-650 dark:text-gray-300">Punctuality</span>
                                {renderStars('punctuality')}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                <span className="font-black text-xs uppercase tracking-wider text-gray-650 dark:text-gray-300">Perceived Safety</span>
                                {renderStars('safety')}
                            </div>
                        </div>

                        <button
                            disabled={getAggregatedScore() === "0.0" || submittedRating}
                            onClick={() => {
                                setSubmittedRating(true);
                                setTimeout(() => { setRating({ cleanliness: 0, punctuality: 0, safety: 0 }); setSubmittedRating(false); }, 3000);
                            }}
                            className="w-full py-4.5 rounded-2xl font-extrabold text-xs uppercase tracking-widest bg-white dark:bg-[#070F1E] border-2 border-[#FF9933] hover:bg-[#FF9933]/5 text-[#0F1E36] dark:text-gray-250 disabled:opacity-40 disabled:border-gray-200 dark:disabled:border-slate-800 disabled:text-gray-400 shadow-sm transition-all transform active:scale-95 mt-auto"
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden text-center relative pointer-events-auto border-t-8 border-[#FF9933] border-x border-b border-gray-150 dark:border-slate-800"
                        >
                            <div className="pt-10 pb-6 px-10">
                                <div className="w-20 h-20 bg-green-50 dark:bg-green-950/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-550" />
                                </div>
                                <h3 className="text-xl font-black text-[#0F1E36] dark:text-white mb-3 uppercase tracking-wide">Report Successfully Logged</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-300 font-bold leading-relaxed mb-6">
                                    Your anonymous report for Route {currentRoute} has been recorded for pattern analysis.
                                </p>

                                <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#FF9933]/10 to-[#12820B]/10 border-2 border-dashed border-[#FF9933]/25 px-4.5 py-2.5 rounded-2xl mb-8 w-fit mx-auto">
                                    <Zap className="w-4 h-4 text-[#FF9933]" />
                                    <span className="text-[9px] font-black text-[#0F1E36] dark:text-gray-350 uppercase tracking-widest">Pattern Detection Enabled</span>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setReportType(null);
                                    }}
                                    className="w-full py-4 bg-[#0F1E36] dark:bg-slate-700 text-white font-extrabold rounded-2xl hover:bg-[#1b2f4f] dark:hover:bg-slate-600 transition-all shadow-md text-xs uppercase tracking-widest"
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
