import React, { useState } from 'react';
import {
    AlertCircle, AlertTriangle, Send, CheckCircle2,
    Search, Shield, CheckCircle, User, Zap,
    ThumbsUp, ThumbsDown, Home, MessageSquare
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '../api';
import { t } from '../translations';

export default function ServiceReporting({ routeData, navigateTo, lang }) {
    const [feedback, setFeedback] = useState(null);
    const [concern, setConcern] = useState(null);
    const [details, setDetails] = useState('');
    const [route, setRoute] = useState(routeData?.route || '');
    const [showModal, setShowModal] = useState(false);

    const handleHome = () => navigateTo('track');

    const handleSubmit = async () => {
        const feedbackType = feedback === 'satisfied' ? 'Satisfactory' : 'Needs Improvement';
        try {
            await api.submitFeedback(routeData?.id || route || '500A', feedbackType, 'Web');
        } catch (e) {
            console.warn('Feedback submission failed:', e);
        }
        setShowModal(true);
    };

    const concerns = [
        { id: 'rash',         emoji: '🚗', labelKey: 'rashDriving' },
        { id: 'misconduct',   emoji: '🚫', labelKey: 'misconduct' },
        { id: 'overcrowding', emoji: '👥', labelKey: 'overcrowding' },
    ];

    const trustPillars = [
        { icon: Shield,       titleKey: 'safeAndSecure',  descKey: 'safeAndSecureDesc' },
        { icon: CheckCircle,  titleKey: 'monitored247',   descKey: 'monitored247Desc' },
        { icon: Zap,          titleKey: 'actionable',     descKey: 'actionableDesc' },
    ];

    return (
        <div className="bg-[#f5f6f8] dark:bg-[#070F1E] min-h-screen text-[#0F1E36] dark:text-gray-100 font-sans">
            <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">

                {/* ── Trip Feedback Card ── */}
                <div className="bg-white dark:bg-[#0B1E36] rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                    {/* Top banner row */}
                    <div className="flex items-stretch">
                        {/* Left content */}
                        <div className="flex-1 p-7">
                            <div className="flex items-center space-x-2 mb-4">
                                <MessageSquare className="w-4 h-4 text-[#0F1E36] dark:text-white" />
                                <span className="text-sm font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">{t('tripFeedback', lang)}</span>
                            </div>
                            <h2 className="text-2xl font-black text-[#0F1E36] dark:text-white leading-tight mb-3">
                                {t('helpImproveJourney', lang)}
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xs">
                                {t('feedbackHelpsUs', lang)}
                            </p>
                        </div>

                        {/* Right illustration */}
                        <div className="w-44 bg-gradient-to-br from-[#f0f4ff] to-[#e8f5e9] dark:from-[#0d1f35] dark:to-[#0a1f10] flex items-center justify-center p-4 shrink-0">
                            <div className="relative">
                                <div className="w-24 h-36 bg-[#0F1E36] rounded-2xl border-4 border-[#1a2d4a] shadow-lg flex flex-col overflow-hidden">
                                    <div className="bg-[#1a2d4a] h-4 flex items-center justify-center">
                                        <div className="w-8 h-1 bg-[#2a3d5a] rounded-full"></div>
                                    </div>
                                    <div className="flex-1 bg-white flex flex-col items-center justify-center px-2 py-2 space-y-1">
                                        <span className="text-[7px] text-gray-500 font-bold uppercase tracking-wider">{t('yourFeedback', lang)}</span>
                                        <div className="w-8 h-8 bg-[#FF9933] rounded-full flex items-center justify-center shadow">
                                            <span className="text-sm">😊</span>
                                        </div>
                                        <div className="flex space-x-0.5">
                                            {[1,2,3,4].map(s => (
                                                <svg key={s} className="w-2.5 h-2.5 text-[#FF9933]" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                            <svg className="w-2.5 h-2.5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                        <div className="w-12 h-1.5 bg-gray-100 rounded-full mt-1"></div>
                                        <div className="w-10 h-1.5 bg-gray-100 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="absolute -top-2 right-0 w-7 h-7 bg-[#FF9933] rounded-full opacity-80"></div>
                                <div className="absolute bottom-0 -right-3 w-4 h-4 bg-[#12820B] rounded-full opacity-70"></div>
                            </div>
                        </div>
                    </div>

                    {/* Experience rating */}
                    <div className="border-t border-gray-100 dark:border-slate-700 px-7 py-5">
                        <p className="text-center text-sm font-black text-[#0F1E36] dark:text-white mb-4">{t('overallExperience', lang)}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setFeedback('satisfied')}
                                className={`flex items-center justify-center space-x-2.5 py-3.5 rounded-xl border-2 font-black text-sm transition-all active:scale-95 ${
                                    feedback === 'satisfied'
                                        ? 'border-[#FF9933] bg-[#FF9933]/10 text-[#FF9933]'
                                        : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-300 hover:border-[#FF9933]/50'
                                }`}
                            >
                                <ThumbsUp className="w-5 h-5" />
                                <span>{t('satisfied', lang)}</span>
                            </button>
                            <button
                                onClick={() => setFeedback('unsatisfied')}
                                className={`flex items-center justify-center space-x-2.5 py-3.5 rounded-xl border-2 font-black text-sm transition-all active:scale-95 ${
                                    feedback === 'unsatisfied'
                                        ? 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-500'
                                        : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-300 hover:border-red-300'
                                }`}
                            >
                                <ThumbsDown className="w-5 h-5" />
                                <span>{t('unsatisfied', lang)}</span>
                            </button>
                        </div>
                    </div>

                    {/* Legal disclaimer */}
                    <div className="mx-7 mb-6 flex items-start space-x-3 bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl p-4">
                        <div className="w-7 h-7 bg-gray-200 dark:bg-slate-700 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                            <Shield className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-0.5">{t('legalDisclaimer', lang)}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                {t('legalDisclaimerText', lang)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Report a Service Issue Card ── */}
                <div className="bg-white dark:bg-[#0B1E36] rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
                    <div className="px-7 pt-7 pb-2 flex items-center space-x-2.5">
                        <AlertTriangle className="w-5 h-5 text-[#FF9933]" />
                        <h2 className="text-lg font-black text-[#0F1E36] dark:text-white">{t('reportServiceIssue', lang)}</h2>
                    </div>

                    <div className="px-7 pb-7 pt-5 space-y-5">
                        {/* Route input */}
                        <div>
                            <label className="block text-xs font-black text-[#0F1E36] dark:text-gray-200 mb-2 uppercase tracking-wider">{t('routeDestination', lang)}</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Search className="w-4 h-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={route}
                                    onChange={e => setRoute(e.target.value)}
                                    placeholder={t('enterRouteOrDest', lang)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-[#0F1E36] dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-[#FF9933] font-medium placeholder-gray-400 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Type of concern */}
                        <div>
                            <label className="block text-xs font-black text-[#0F1E36] dark:text-gray-200 mb-3 uppercase tracking-wider">{t('typeOfConcern', lang)}</label>
                            <div className="grid grid-cols-3 gap-3">
                                {concerns.map(c => (
                                    <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => setConcern(c.id)}
                                        className={`flex items-center space-x-2 px-4 py-3.5 border-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                                            concern === c.id
                                                ? 'border-[#FF9933] bg-[#FF9933]/8 text-[#0F1E36] dark:text-white'
                                                : 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                                        }`}
                                    >
                                        <span className="text-base">{c.emoji}</span>
                                        <span className="text-[11px] font-black">{t(c.labelKey, lang)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Additional details */}
                        <div>
                            <label className="block text-xs font-black text-[#0F1E36] dark:text-gray-200 mb-2 uppercase tracking-wider">{t('additionalDetails', lang)}</label>
                            <textarea
                                rows={4}
                                value={details}
                                onChange={e => setDetails(e.target.value.slice(0, 500))}
                                placeholder={t('describeIncident', lang)}
                                className="w-full p-3.5 border border-gray-200 dark:border-slate-600 rounded-xl text-sm text-[#0F1E36] dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:border-[#FF9933] resize-none font-medium placeholder-gray-400 transition-colors"
                            />
                            <div className="flex justify-end mt-1">
                                <span className="text-[10px] text-gray-400 font-bold">{details.length} / 500</span>
                            </div>
                        </div>

                        {/* Important notice */}
                        <div className="flex items-start space-x-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 rounded-xl p-4">
                            <AlertCircle className="w-5 h-5 text-[#FF9933] shrink-0 mt-0.5" />
                            <p className="text-[11px] text-orange-900 dark:text-orange-300 font-medium leading-relaxed">
                                {t('importantAllReports', lang)}
                            </p>
                        </div>

                        {/* Submit button */}
                        <button
                            disabled={!concern}
                            onClick={handleSubmit}
                            className="w-full py-4 bg-[#E84B1A] hover:bg-[#c93f14] disabled:opacity-40 text-white font-black rounded-xl transition-all flex items-center justify-center space-x-2 text-sm uppercase tracking-widest shadow-md active:scale-95 cursor-pointer"
                        >
                            <Send className="w-4 h-4" />
                            <span>{t('submitReport', lang)}</span>
                        </button>

                        {/* Warning */}
                        <div className="flex items-start space-x-3 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded-r-xl p-4">
                            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-red-700 dark:text-red-400 font-medium leading-relaxed">
                                {t('warningMisuse', lang)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Trust Pillars ── */}
                <div className="grid grid-cols-3 gap-4">
                    {trustPillars.map((p, i) => (
                        <div key={i} className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-200 dark:border-slate-700 p-5 flex flex-col items-start space-y-2 shadow-sm">
                            <div className="w-9 h-9 rounded-xl bg-[#FF9933]/10 border border-[#FF9933]/20 flex items-center justify-center">
                                <p.icon className="w-4.5 h-4.5 text-[#FF9933]" />
                            </div>
                            <p className="text-xs font-black text-[#0F1E36] dark:text-white">{t(p.titleKey, lang)}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{t(p.descKey, lang)}</p>
                        </div>
                    ))}
                </div>

                {/* ── Safety tagline ── */}
                <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-200 dark:border-slate-700 px-6 py-5 flex items-center space-x-4 shadow-sm">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-[#0F1E36] dark:text-white">{t('yourSafetyTitle', lang)}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">{t('yourSafetyDesc', lang)}</p>
                    </div>
                </div>

            </main>

            {/* ── Success Modal ── */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1E36]/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden text-center relative border-t-8 border-[#FF9933]"
                        >
                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
                            <div className="pt-10 pb-8 px-8">
                                <div className="w-20 h-20 bg-green-50 dark:bg-green-950/25 rounded-full flex items-center justify-center mx-auto mb-5">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </div>
                                <h3 className="text-xl font-black text-[#0F1E36] dark:text-white mb-3">{t('reportSubmitted', lang)}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-300 font-medium mb-8 leading-relaxed">{t('reportSubmittedDesc', lang)}</p>
                                <div className="space-y-3">
                                    <button onClick={handleHome} className="w-full py-3 bg-[#0F1E36] dark:bg-slate-700 text-white font-black rounded-xl hover:bg-[#1b2f4f] transition-all shadow-md flex justify-center items-center text-xs uppercase tracking-widest space-x-2">
                                        <Home className="w-4 h-4" />
                                        <span>{t('goToHome', lang)}</span>
                                    </button>
                                    <button onClick={() => setShowModal(false)} className="w-full py-3 bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 font-black rounded-xl hover:bg-gray-100 transition-colors text-xs uppercase tracking-widest">
                                        {t('viewDetails', lang)}
                                    </button>
                                </div>
                                <div className="mt-7 pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-center space-x-1.5 text-[9px] font-black text-gray-400 tracking-wider">
                                    <Shield className="w-3 h-3 text-[#FF9933]" />
                                    <span>{t('officialConfirmationEmbedded', lang)}</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
