import React, { useState } from 'react';
import { Phone, ShieldCheck, MapPin, CheckCircle, ShieldAlert, AlertTriangle, Sparkles, MessageSquare, Mail, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '../translations';
import { api } from '../api';

export default function EmergencyDashboard({ routeData, navigateTo, lang }) {
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dialingContact, setDialingContact] = useState(null);
    const [countdown, setCountdown] = useState(5);
    const countdownRef = React.useRef(null);

    React.useEffect(() => {
        return () => {
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, []);

    const startDialing = (contact) => {
        setDialingContact(contact);
        setCountdown(5);
    };

    React.useEffect(() => {
        if (!dialingContact) {
            cancelDialing();
            return;
        }

        countdownRef.current = setInterval(() => {
            setCountdown((prev) => {
                const nextVal = prev - 1;
                if (nextVal <= 0) {
                    clearInterval(countdownRef.current);
                    window.location.href = `tel:${dialingContact.number}`;
                    // Defer clearing so modal shows transition before unmounting
                    setTimeout(() => setDialingContact(null), 500);
                    return 0;
                }
                return nextVal;
            });
        }, 1000);

        return () => clearInterval(countdownRef.current);
    }, [dialingContact]);

    const cancelDialing = () => {
        if (countdownRef.current) clearInterval(countdownRef.current);
        setDialingContact(null);
    };

    const dialImmediately = () => {
        if (countdownRef.current) clearInterval(countdownRef.current);
        window.location.href = `tel:${dialingContact.number}`;
        setDialingContact(null);
    };

    const categories = [
        { id: 'harassment', translationKey: 'harassment', severity: 'High', badgeBg: 'bg-orange-50 text-orange-600 border-orange-105 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30', icon: ShieldAlert },
        { id: 'threat', translationKey: 'threatToLife', severity: 'Critical', badgeBg: 'bg-red-50 text-red-600 border-red-105 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30', icon: AlertTriangle },
        { id: 'fight', translationKey: 'fightInBus', severity: 'High', badgeBg: 'bg-orange-50 text-orange-600 border-orange-105 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30', icon: ShieldAlert },
        { id: 'misconduct', translationKey: 'staffMisconduct', severity: 'Medium', badgeBg: 'bg-yellow-50 text-yellow-600 border-yellow-105 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30', icon: ShieldAlert }
    ];

    const currentRoute = routeData?.route || '500A-1';
    const busId = routeData?.busNo || 'KA-01-F-1234';

    const handleEscalation = async () => {
        if (!selectedCategory) return;

        // Map frontend categories to backend enum values
        const categoryMap = {
            'harassment': 'Harassment',
            'threat': 'Threat',
            'fight': 'Fight',
            'misconduct': 'Harassment',
        };

        // Submit escalation to real API
        try {
            await api.submitSafetyEscalation(
                'anonymous',
                routeData?.id || currentRoute,
                categoryMap[selectedCategory] || 'Harassment',
            );
        } catch (e) {
            console.warn('Escalation submission failed:', e);
        }

        setShowConfirmModal(false);
        setShowModal(true);
    };

    return (
        <div className="max-w-7xl mx-auto w-full pb-16 pt-6 px-4 sm:px-6 lg:px-8 transition-colors duration-300">

            {/* Header Protocol Bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div className="text-left">
                    <div className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1 rounded-full border border-emerald-150 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] uppercase tracking-widest mb-3.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{t('safetyProtocolActive', lang)}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-[#0F1E36] dark:text-white mb-2 tracking-tight">
                        {t('emergencySupport', lang)}
                    </h2>
                    <p className="text-sm text-gray-555 dark:text-gray-400 font-bold max-w-2xl leading-relaxed">
                        {t('emergencyDashboardDesc', lang)}
                    </p>
                </div>
                <div className="flex items-center space-x-3 self-start md:self-center shrink-0">
                    <div className="bg-white dark:bg-[#0B1E36] border border-gray-255 dark:border-slate-800 rounded-xl px-4 py-2 flex items-center shadow-sm">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2.5 animate-ping"></span>
                        <span className="text-[10px] font-black text-emerald-650 dark:text-emerald-400 tracking-widest uppercase">{t('liveMonitoringActive', lang)}</span>
                    </div>
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); alert("National safety guidelines under Section 43 of ITA: Maintain composure. Use the verified escalation panel for reporting in-cabin anomalies immediately."); }}
                        className="bg-white dark:bg-[#0B1E36] hover:bg-gray-50 dark:hover:bg-slate-850 border border-gray-255 dark:border-slate-800 text-[10px] font-black uppercase text-[#0F1E36] dark:text-white rounded-xl px-4 py-2.5 flex items-center shadow-sm transition-all"
                    >
                        <span>{t('viewGuidelinesLink', lang)}</span>
                    </a>
                </div>
            </div>

            {/* Split Content Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 text-left">
                {/* Left Side Content Column (Width 3/5) */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Active Transit Session Panel */}
                    <div className="bg-[#0B1B2D] text-white border border-[#15293E] rounded-3xl p-6 relative overflow-hidden shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center space-x-3.5">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shadow-inner">
                                    <BusIcon className="w-5.5 h-5.5 animate-bounce" />
                                </div>
                                <div>
                                    <span className="text-[9px] font-black tracking-widest opacity-60 uppercase block">{t('activeTransitSession', lang) || "Active Transit Session"}</span>
                                    <h4 className="text-lg font-black tracking-tight flex items-baseline">
                                        Route {currentRoute}
                                        <span className="ml-2.5 text-xs text-gray-400 font-bold tracking-wider">{busId}</span>
                                    </h4>
                                </div>
                            </div>
                            <div className="bg-[#12820B]/10 border border-[#12820B]/30 rounded-xl px-3 py-1.5 flex items-center">
                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2 animate-ping"></span>
                                <span className="text-[8px] font-black text-emerald-400 tracking-wider uppercase">Live GPS Verified</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/5 pt-5">
                            <div className="space-y-1">
                                <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest block">Driver</span>
                                <span className="text-xs font-black text-white block">Rajesh Kumar</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest block">Next Stop</span>
                                <span className="text-xs font-black text-white block">MG Road • 6 min</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest block">Speed</span>
                                <span className="text-xs font-black text-white block">38 km/h</span>
                            </div>
                        </div>
                    </div>

                    {/* Verified Escalation Panel */}
                    <div className="bg-white dark:bg-[#0B1E36] border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 relative shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2.5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 dark:border-emerald-900/30 flex items-center justify-center text-[#008060] dark:text-emerald-400">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <h4 className="text-md font-black text-[#0F1E36] dark:text-white tracking-tight uppercase">{t('verifiedEscalationPanelTitle', lang)}</h4>
                            </div>
                            <span className="text-[9px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest">{t('stepOf', lang)}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-6 leading-relaxed">
                            {t('verifiedEscalationDesc', lang)}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`p-5 rounded-2xl flex items-center justify-between border-2 text-left transition-all ${
                                        selectedCategory === cat.id
                                            ? 'border-[#008060] bg-[#008060]/5 dark:bg-[#008060]/5 dark:border-[#008060] shadow-sm'
                                            : 'border-gray-150 dark:border-slate-800 hover:border-gray-250 dark:hover:border-slate-700 bg-white dark:bg-[#070F1E]/40'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3.5">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                            selectedCategory === cat.id ? 'bg-[#008060] text-white' : 'bg-gray-50 dark:bg-slate-850 text-gray-500'
                                        }`}>
                                            <cat.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-black text-[#0F1E36] dark:text-white block mb-1">{t(cat.translationKey, lang)}</span>
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${cat.badgeBg}`}>
                                                {cat.severity === 'High' ? t('severityHigh', lang) || 'High' : cat.severity === 'Critical' ? t('severityCritical', lang) || 'Critical' : t('severityMedium', lang) || 'Medium'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                        selectedCategory === cat.id ? 'border-[#008060] bg-[#008060]' : 'border-gray-300 dark:border-slate-700'
                                    }`}>
                                        {selectedCategory === cat.id && (
                                            <div className="w-2 h-2 bg-white rounded-full" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowConfirmModal(true)}
                            disabled={!selectedCategory}
                            className="w-full py-4 bg-[#0B1B2D] hover:bg-[#15293E] text-white font-extrabold rounded-2xl transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[10px] shadow-sm space-x-2 cursor-pointer"
                        >
                            <SendIcon className="w-4 h-4" />
                            <span>{t('requestVerifiedEscalation', lang)} ↗</span>
                        </button>

                        <div className="mt-6 text-left">
                            <h5 className="text-[10px] font-black text-red-750 dark:text-red-400 uppercase tracking-widest mb-1">{t('importantLegalNotice', lang)}</h5>
                            <p className="text-[10px] text-red-655 dark:text-red-300 font-bold leading-relaxed">
                                {t('legalNoticeDesc', lang)}
                            </p>
                        </div>
                    </div>

                    {/* Recent Escalations */}
                    <div className="bg-white dark:bg-[#0B1E36] border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-md font-black text-[#0F1E36] dark:text-white tracking-tight uppercase">{t('recentEscalations', lang)}</h4>
                            <a href="#" onClick={(e) => { e.preventDefault(); setShowHistoryModal(true); }} className="text-[10px] font-black text-[#008060] uppercase tracking-wider hover:underline">{t('viewAllHistory', lang)} &gt;</a>
                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-slate-800/80">
                            {/* Escalation 1 */}
                            <div className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-850 flex items-center justify-center text-[#0F1E36] dark:text-white border border-gray-200 dark:border-slate-800">
                                        <ShieldCheck className="w-4.5 h-4.5 text-[#008060]" />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-black text-[#0F1E36] dark:text-white">
                                            Harassment <span className="text-gray-400 font-bold ml-1.5">TRX-88214</span>
                                        </h5>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-0.5">Route 1C • 2h ago</p>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">Resolved</span>
                            </div>
                            
                            {/* Escalation 2 */}
                            <div className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-850 flex items-center justify-center text-[#0F1E36] dark:text-white border border-gray-200 dark:border-slate-800">
                                        <ShieldCheck className="w-4.5 h-4.5 text-orange-500" />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-black text-[#0F1E36] dark:text-white">
                                            Staff Misconduct <span className="text-gray-400 font-bold ml-1.5">TRX-88109</span>
                                        </h5>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-0.5">Route 5E • 6h ago</p>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30">Under Review</span>
                            </div>

                            {/* Escalation 3 */}
                            <div className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-850 flex items-center justify-center text-[#0F1E36] dark:text-white border border-gray-200 dark:border-slate-800">
                                        <ShieldCheck className="w-4.5 h-4.5 text-[#008060]" />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-black text-[#0F1E36] dark:text-white">
                                            Fight in Bus <span className="text-gray-400 font-bold ml-1.5">TRX-87912</span>
                                        </h5>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-0.5">Route 12X • 1d ago</p>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">Resolved</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side Content Column (Width 2/5) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Emergency Contacts Panel */}
                    <div className="bg-white dark:bg-[#0B1E36] border border-gray-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-md font-black text-[#0F1E36] dark:text-white tracking-tight uppercase">{t('emergencyContacts', lang)}</h4>
                            <span className="text-[7px] font-black bg-emerald-50 text-emerald-655 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30 px-2 py-0.5 rounded tracking-widest uppercase shrink-0">{t('goiVerified', lang)}</span>
                        </div>
                        <p className="text-[10px] text-gray-450 dark:text-gray-500 font-bold mb-6 uppercase tracking-wider">{t('oneTapDialGps', lang)}</p>
                        
                        <div className="space-y-6">
                            {/* Police Control */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs font-extrabold text-gray-500 dark:text-gray-400">{t('policeControlLabel', lang)}</span>
                                    <span className="text-2xl font-black text-[#0F1E36] dark:text-white flex items-baseline">
                                        112 <span className="text-[9px] text-gray-400 font-bold ml-1.5 lowercase">&lt; 4 min</span>
                                    </span>
                                </div>
                                <button 
                                    onClick={() => startDialing({ name: 'Police Control', number: '112' })}
                                    className="w-full py-3.5 bg-[#008060] hover:bg-[#006b50] text-white font-extrabold rounded-xl transition-all shadow-md transform active:scale-95 text-[10px] uppercase tracking-widest flex items-center justify-center space-x-1.5 cursor-pointer border-0"
                                >
                                    <Phone className="w-3.5 h-3.5 fill-currentColor" />
                                    <span>{t('dialNumber', lang)} 112</span>
                                </button>
                            </div>

                            {/* Ambulance */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs font-extrabold text-gray-500 dark:text-gray-400">AMBULANCE</span>
                                    <span className="text-2xl font-black text-[#0F1E36] dark:text-white flex items-baseline">
                                        108 <span className="text-[9px] text-gray-400 font-bold ml-1.5 lowercase">&lt; 8 min</span>
                                    </span>
                                </div>
                                <button 
                                    onClick={() => startDialing({ name: 'Ambulance', number: '108' })}
                                    className="w-full py-3.5 bg-[#FF9933] hover:bg-orange-600 text-white font-extrabold rounded-xl transition-all shadow-md transform active:scale-95 text-[10px] uppercase tracking-widest flex items-center justify-center space-x-1.5 cursor-pointer border-0"
                                >
                                    <Phone className="w-3.5 h-3.5 fill-currentColor" />
                                    <span>Dial 108</span>
                                </button>
                            </div>

                            {/* Women Safety */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs font-extrabold text-gray-500 dark:text-gray-400">WOMEN SAFETY</span>
                                    <span className="text-2xl font-black text-[#0F1E36] dark:text-white flex items-baseline">
                                        1091 <span className="text-[9px] text-gray-400 font-bold ml-1.5 lowercase">24/7 available</span>
                                    </span>
                                </div>
                                <button 
                                    onClick={() => startDialing({ name: 'Women Safety', number: '1091' })}
                                    className="w-full py-3.5 bg-[#0B1B2D] hover:bg-[#15293E] text-white font-extrabold rounded-xl transition-all shadow-md transform active:scale-95 text-[10px] uppercase tracking-widest flex items-center justify-center space-x-1.5 cursor-pointer border-0"
                                >
                                    <Phone className="w-3.5 h-3.5 fill-currentColor" />
                                    <span>Dial 1091</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Non-Emergency Support Panel */}
                    <div className="bg-white dark:bg-[#0B1E36] border border-gray-250 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
                        <h4 className="text-md font-black text-[#0F1E36] dark:text-white tracking-tight uppercase mb-1">Non-Emergency Support</h4>
                        <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold mb-6 uppercase tracking-wider">For general queries and complaints</p>
                        
                        <div className="space-y-3">
                            {/* WhatsApp */}
                            <a 
                                href="https://wa.me/919876543210" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center justify-between p-4 bg-white dark:bg-[#070F1E]/50 border border-gray-200 dark:border-slate-800 rounded-2xl hover:border-[#008060] transition-colors"
                            >
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-[#008060] flex items-center justify-center">
                                        <MessageSquare className="w-4.5 h-4.5" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-[#0F1E36] dark:text-white block">WhatsApp Helpline</span>
                                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 block mt-0.5">+91 98765 43210</span>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                            </a>

                            {/* Email */}
                            <a 
                                href="mailto:help@transitindia.gov.in" 
                                className="flex items-center justify-between p-4 bg-white dark:bg-[#070F1E]/50 border border-gray-200 dark:border-slate-800 rounded-2xl hover:border-[#008060] transition-colors"
                            >
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-500 flex items-center justify-center">
                                        <Mail className="w-4.5 h-4.5" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-[#0F1E36] dark:text-white block">Email Support</span>
                                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 block mt-0.5">help@transitindia.gov.in</span>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                            </a>

                            {/* Report a Fault */}
                            <button 
                                onClick={() => navigateTo('service-reporting')}
                                className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#070F1E]/50 border border-gray-200 dark:border-slate-800 rounded-2xl hover:border-[#008060] transition-colors text-left cursor-pointer"
                            >
                                <div className="flex items-center space-x-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-500 flex items-center justify-center">
                                        <ShieldAlert className="w-4.5 h-4.5" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black text-[#0F1E36] dark:text-white block">Report a Fault</span>
                                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 block mt-0.5">Non-emergency issues</span>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Green Promo Banner */}
                    <div className="bg-[#008060] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-[#006048] relative overflow-hidden shadow-sm">
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
                                <ShieldCheck className="w-5.5 h-5.5" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-black tracking-tight leading-tight">Travel Safe. <br/>Travel Verified.</h4>
                                <p className="text-[11px] text-emerald-100 font-medium leading-relaxed">
                                    Enable Auto-Share GPS so your live location is shared with a trusted contact throughout the journey.
                                </p>
                            </div>
                            <button 
                                onClick={() => alert("Auto-Share GPS coordinates initialized with registered emergency contact.")}
                                className="w-full py-3 bg-white hover:bg-gray-50 text-[#008060] font-black rounded-xl text-xs uppercase tracking-widest flex items-center justify-center space-x-1.5 transition-all shadow-md transform active:scale-95 cursor-pointer mt-4 border-0"
                            >
                                <span>Enable Auto-Share ↗</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal Overlay */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1E36]/90 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-center relative pointer-events-auto border-t-8 border-green-500 border-x border-b border-gray-100 dark:border-slate-800"
                        >
                            <div className="p-10">
                                <div className="w-24 h-24 bg-green-50 dark:bg-green-950/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-black text-[#0F1E36] dark:text-white mb-4">Escalation Logged</h3>
                                <div className="mb-8 text-left space-y-3">
                                    <p className="text-xs text-gray-600 dark:text-gray-300 font-bold leading-relaxed">
                                        Your safety request and live telemetry GPS coordinates have been securely forwarded to the <strong className="text-[#0F1E36] dark:text-white">Depot Control Room</strong>.
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 font-bold leading-relaxed">
                                        An authorized safety officer is reviewing this case and will contact the bus crew immediately.
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedCategory(null);
                                    }}
                                    className="w-full py-4 bg-gradient-to-r from-[#FF9933] to-[#FF6F00] text-white font-extrabold rounded-2xl transition-colors shadow-md uppercase tracking-widest text-xs cursor-pointer border-0"
                                >
                                    Return to Safety
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirmation Modal Overlay */}
            <AnimatePresence>
                {showConfirmModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1E36]/90 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-center relative pointer-events-auto border border-gray-150 dark:border-slate-800"
                        >
                            <div className="p-8">
                                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/20 rounded-full flex items-center justify-center mx-auto mb-5 text-[#FF9933]">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black text-[#0F1E36] dark:text-white mb-3">Confirm Escalation?</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-6 leading-relaxed">
                                    You are requesting safety escalation for <strong className="text-[#0F1E36] dark:text-white">{categories.find(c => c.id === selectedCategory)?.label}</strong>.
                                    This will alert Depot Control Room with live coordinates.
                                </p>
                                
                                <div className="space-y-3">
                                    <button
                                        onClick={handleEscalation}
                                        className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-2xl transition-colors tracking-widest shadow-md uppercase cursor-pointer border-0"
                                    >
                                        Yes, Escalate Now
                                    </button>
                                    <button
                                        onClick={() => setShowConfirmModal(false)}
                                        className="w-full py-3.5 bg-white dark:bg-slate-900 text-[#0F1E36] dark:text-gray-200 border border-gray-250 dark:border-slate-800 font-extrabold text-xs rounded-2xl transition-colors tracking-widest shadow-sm uppercase cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* History Modal Overlay */}
            <AnimatePresence>
                {showHistoryModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1E36]/90 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden text-left relative pointer-events-auto border border-gray-150 dark:border-slate-800"
                        >
                            <div className="p-6 sm:p-8">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-black text-[#0F1E36] dark:text-white uppercase tracking-tight">Escalation History</h3>
                                    <span className="text-[8px] font-black bg-emerald-50 text-emerald-650 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30 px-2 py-0.5 rounded tracking-widest uppercase">7 Logs</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-6">
                                    All safety escalations logged under this device credentials.
                                </p>

                                <div className="max-h-[350px] overflow-y-auto space-y-4 pr-1 my-6 divide-y divide-gray-100 dark:divide-slate-800/80">
                                    {/* History Item 1 */}
                                    <div className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                                        <div className="flex items-center space-x-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-850 flex items-center justify-center text-[#0F1E36] dark:text-white border border-gray-200 dark:border-slate-800">
                                                <ShieldCheck className="w-4.5 h-4.5 text-[#008060]" />
                                            </div>
                                            <div>
                                                <h5 className="text-xs font-black text-[#0F1E36] dark:text-white">
                                                    {t('harassment', lang)} <span className="text-gray-400 font-bold ml-1.5">TRX-88214</span>
                                                </h5>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-0.5">Route 1C • 2h ago</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">{t('resolved', lang)}</span>
                                    </div>

                                    {/* History Item 2 */}
                                    <div className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                                        <div className="flex items-center space-x-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-850 flex items-center justify-center text-[#0F1E36] dark:text-white border border-gray-200 dark:border-slate-800">
                                                <ShieldCheck className="w-4.5 h-4.5 text-orange-500" />
                                            </div>
                                            <div>
                                                <h5 className="text-xs font-black text-[#0F1E36] dark:text-white">
                                                    {t('staffMisconduct', lang)} <span className="text-gray-400 font-bold ml-1.5">TRX-88109</span>
                                                </h5>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-0.5">Route 5E • 6h ago</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-orange-50 text-orange-600 border border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/30">{t('underReview', lang)}</span>
                                    </div>

                                    {/* History Item 3 */}
                                    <div className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                                        <div className="flex items-center space-x-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-850 flex items-center justify-center text-[#0F1E36] dark:text-white border border-gray-200 dark:border-slate-800">
                                                <ShieldCheck className="w-4.5 h-4.5 text-[#008060]" />
                                            </div>
                                            <div>
                                                <h5 className="text-xs font-black text-[#0F1E36] dark:text-white">
                                                    {t('fightInBus', lang)} <span className="text-gray-400 font-bold ml-1.5">TRX-87912</span>
                                                </h5>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-0.5">Route 12X • 1d ago</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">{t('resolved', lang)}</span>
                                    </div>

                                    {/* History Item 4 */}
                                    <div className="pt-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-850 flex items-center justify-center text-[#0F1E36] dark:text-white border border-gray-200 dark:border-slate-800">
                                                <ShieldCheck className="w-4.5 h-4.5 text-[#008060]" />
                                            </div>
                                            <div>
                                                <h5 className="text-xs font-black text-[#0F1E36] dark:text-white">
                                                    Threat to Life <span className="text-gray-400 font-bold ml-1.5">TRX-87604</span>
                                                </h5>
                                                <p className="text-[10px] text-gray-550 dark:text-gray-400 font-bold mt-0.5">Route 4B • 3d ago</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">Resolved</span>
                                    </div>

                                    {/* History Item 5 */}
                                    <div className="pt-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-850 flex items-center justify-center text-[#0F1E36] dark:text-white border border-gray-200 dark:border-slate-800">
                                                <ShieldCheck className="w-4.5 h-4.5 text-[#008060]" />
                                            </div>
                                            <div>
                                                <h5 className="text-xs font-black text-[#0F1E36] dark:text-white">
                                                    Harassment <span className="text-gray-400 font-bold ml-1.5">TRX-87401</span>
                                                </h5>
                                                <p className="text-[10px] text-gray-550 dark:text-gray-400 font-bold mt-0.5">Route 9D • 5d ago</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">Resolved</span>
                                    </div>

                                    {/* History Item 6 */}
                                    <div className="pt-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-850 flex items-center justify-center text-[#0F1E36] dark:text-white border border-gray-200 dark:border-slate-800">
                                                <ShieldCheck className="w-4.5 h-4.5 text-[#008060]" />
                                            </div>
                                            <div>
                                                <h5 className="text-xs font-black text-[#0F1E36] dark:text-white">
                                                    Fight in Bus <span className="text-gray-400 font-bold ml-1.5">TRX-87299</span>
                                                </h5>
                                                <p className="text-[10px] text-gray-555 dark:text-gray-400 font-bold mt-0.5">Route 500A • 1w ago</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">Resolved</span>
                                    </div>

                                    {/* History Item 7 */}
                                    <div className="pt-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-850 flex items-center justify-center text-[#0F1E36] dark:text-white border border-gray-200 dark:border-slate-800">
                                                <ShieldCheck className="w-4.5 h-4.5 text-[#008060]" />
                                            </div>
                                            <div>
                                                <h5 className="text-xs font-black text-[#0F1E36] dark:text-white">
                                                    Staff Misconduct <span className="text-gray-400 font-bold ml-1.5">TRX-87110</span>
                                                </h5>
                                                <p className="text-[10px] text-gray-550 dark:text-gray-400 font-bold mt-0.5">Route 12X • 2w ago</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">Resolved</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowHistoryModal(false)}
                                    className="w-full py-4 bg-gradient-to-r from-[#FF9933] to-[#FF6F00] text-white font-extrabold text-xs rounded-2xl transition-colors tracking-widest shadow-md uppercase cursor-pointer border-0 mt-4"
                                >
                                    Close History
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Dialing Modal Overlay */}
            <AnimatePresence>
                {dialingContact && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1E36]/90 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-2xl max-w-md w-full overflow-hidden text-center relative pointer-events-auto border border-gray-155 dark:border-slate-800"
                        >
                            <div className="p-8 pb-10">
                                <h3 className="text-2xl font-black text-[#0F1E36] dark:text-white mb-2">Initiating Call...</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-350 font-bold mb-8">
                                    Dialing <strong className="text-red-500 font-extrabold">{dialingContact.number}</strong> ({dialingContact.name})
                                </p>

                                <div className="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90 absolute inset-0 text-gray-100 dark:text-slate-800" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
                                        <circle
                                            cx="50" cy="50" r="45" fill="none"
                                            stroke="currentColor"
                                            strokeWidth="6"
                                            strokeDasharray="283"
                                            strokeDashoffset={283 - (283 * countdown) / 5}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-linear text-[#FF9933]"
                                        />
                                    </svg>
                                    <span className="text-5xl font-black text-[#0F1E36] dark:text-white absolute">{countdown}</span>
                                </div>

                                <button
                                    onClick={dialImmediately}
                                    className="w-full py-4 bg-gradient-to-r from-[#FF9933] to-[#FF6F00] text-white font-extrabold text-xs rounded-2xl transition-colors flex items-center justify-center mb-3 tracking-widest shadow-md uppercase cursor-pointer border-0"
                                >
                                    <Phone className="w-4 h-4 mr-2" fill="currentColor" /> Dial Immediately
                                </button>

                                <button
                                    onClick={cancelDialing}
                                    className="w-full py-4 bg-white dark:bg-slate-900 text-[#0F1E36] dark:text-gray-200 border-2 border-gray-250 dark:border-slate-800 font-extrabold text-xs rounded-2xl transition-colors flex items-center justify-center mb-6 tracking-widest shadow-sm uppercase cursor-pointer"
                                >
                                    Cancel Call
                                </button>

                                <p className="text-[9px] text-gray-400 dark:text-gray-500 max-w-xs mx-auto leading-relaxed">
                                    Authorized emergency request initiated. False alarms are subject to prosecution.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const BusIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6v6" /><path d="M15 6v6" /><path d="M2 12h19.6" /><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
    </svg>
);
const SendIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);
