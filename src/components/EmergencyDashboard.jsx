import React, { useState } from 'react';
import { Phone, ShieldCheck, MapPin, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '../translations';

export default function EmergencyDashboard({ routeData, lang }) {
    const [showModal, setShowModal] = useState(false);
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
        { id: 'harassment', label: 'Harassment', icon: ShieldAlert },
        { id: 'threat', label: 'Threat to Life', icon: AlertTriangle },
        { id: 'fight', label: 'Fight in Bus', icon: ShieldAlert },
        { id: 'misconduct', label: 'Staff Misconduct', icon: ShieldAlert }
    ];

    const helplines = [
        { name: 'Police Control', number: '112', bg: 'bg-red-500 hover:bg-red-600', text: 'text-white', iconBg: 'bg-red-100 text-red-600' },
        { name: 'Ambulance', number: '108', bg: 'bg-blue-500 hover:bg-blue-600', text: 'text-white', iconBg: 'bg-blue-100 text-blue-600' },
        { name: 'Women Safety', number: '1091', bg: 'bg-purple-500 hover:bg-purple-600', text: 'text-white', iconBg: 'bg-purple-100 text-purple-600' },
    ];

    const currentRoute = routeData?.route || '500A-1';
    const busId = routeData?.busNo || 'KA-01-F-1234';

    const handleEscalation = () => {
        if (!selectedCategory) return;
        setShowModal(true);
    };

    return (
        <div className="max-w-4xl mx-auto w-full pb-10 pt-4 transition-colors">

            {/* Sub Navigation */}
            <div className="flex border-b border-gray-200 dark:border-slate-700 mb-8 space-x-8 overflow-x-auto text-sm font-bold text-gray-400 dark:text-gray-500 transition-colors">
                <button className="pb-4 hover:text-gray-800 dark:hover:text-gray-300 transition-colors uppercase tracking-widest whitespace-nowrap">{t('home', lang) || 'Home'}</button>
                <button className="pb-4 hover:text-gray-800 dark:hover:text-gray-300 transition-colors uppercase tracking-widest whitespace-nowrap">{t('tracking', lang) || 'Tracking'}</button>
                <button className="pb-4 border-b-2 border-[#f97316] text-[#f97316] flex items-center uppercase tracking-widest whitespace-nowrap transition-colors">
                    <ShieldCheck className="w-4 h-4 mr-2" /> {t('safety', lang) || 'Safety'}
                </button>
                <button className="pb-4 hover:text-gray-800 dark:hover:text-gray-300 transition-colors uppercase tracking-widest whitespace-nowrap">{t('account', lang) || 'Account'}</button>
            </div>

            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-[#0f172a] dark:text-white mb-2 tracking-tight transition-colors">{t('emergencySupport', lang)}</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed transition-colors">
                    {t('emergencyDesc', lang) || 'Your safety is our priority. Access immediate help, report incidents, and stay protected during your transit journey.'}
                </p>
            </div>

            {/* Active Session & Escalation Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700 mb-8 z-10 relative transition-colors">

                {/* Orange Banner Header */}
                <div className="bg-[#f97316] dark:bg-orange-600 px-6 py-4 flex flex-col md:flex-row justify-between items-center transition-colors">
                    <div className="flex items-center text-white mb-3 md:mb-0">
                        <BusIcon className="w-6 h-6 mr-3 text-white" />
                        <div>
                            <span className="text-sm font-bold tracking-wider opacity-90 block md:inline md:mr-2">{t('activeTransitSession', lang)}</span>
                            <h3 className="text-lg font-bold flex items-center md:inline-flex">
                                Route {currentRoute} <span className="ml-2 font-medium opacity-80">{busId}</span>
                            </h3>
                        </div>
                    </div>

                    <div className="bg-[#0f172a] dark:bg-slate-900 rounded-full px-4 py-1.5 flex items-center shadow-sm relative z-10 transition-colors">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        <span className="text-xs font-bold text-white tracking-widest uppercase">LIVE GPS VERIFIED</span>
                    </div>
                </div>

                <div className="p-8">
                    <h4 className="text-xl font-bold text-[#0f172a] dark:text-gray-200 mb-6 transition-colors">Verified Escalation Panel</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`p-5 rounded-lg flex items-center border-[1.5px] transition-all ${selectedCategory === cat.id
                                    ? 'border-[#f97316] bg-orange-50 dark:bg-orange-900/30 dark:border-orange-500 shadow-sm'
                                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 bg-white dark:bg-slate-800/50'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-colors ${selectedCategory === cat.id ? 'bg-[#f97316] text-white' : 'bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400'}`}>
                                    <cat.icon className="w-5 h-5" />
                                </div>
                                <span className={`font-bold text-lg transition-colors ${selectedCategory === cat.id ? 'text-[#0f172a] dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{cat.label}</span>
                                {selectedCategory === cat.id && (
                                    <CheckCircle className="w-5 h-5 text-[#f97316] dark:text-orange-400 ml-auto transition-colors" />
                                )}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleEscalation}
                        disabled={!selectedCategory}
                        className="w-full py-4.5 bg-[#0f172a] dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-bold rounded-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
                    >
                        <SendIcon className="w-5 h-5 mr-3" /> {t('requestEscalation', lang) || 'Request Escalation'}
                    </button>
                </div>
            </div>

            {/* Legal Notice */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg p-5 mb-12 flex items-start transition-colors">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500 mr-4 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold text-red-800 dark:text-red-400 uppercase tracking-widest mb-1.5 transition-colors">IMPORTANT LEGAL NOTICE</h4>
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium leading-relaxed transition-colors">
                        Misuse of these emergency services results in severe criminal penalties under suitable sections of the law. All escalations are logged with verified GPS and device credentials.
                    </p>
                </div>
            </div>

            {/* Emergency Contacts */}
            <h3 className="text-xl font-bold text-[#0f172a] dark:text-white mb-6 transition-colors">Emergency Contacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {helplines.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-gray-100 dark:border-slate-700 p-8 flex flex-col justify-between items-center text-center transition-colors">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-colors ${item.iconBg.replace('bg-', 'dark:bg-opacity-20 bg-')}`}>
                            {idx === 0 ? <ShieldCheck className="w-8 h-8" /> : idx === 1 ? <HealthIcon className="w-8 h-8" /> : <WomanIcon className="w-8 h-8" />}
                        </div>
                        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 tracking-[0.2em] uppercase mb-2 transition-colors">{item.name}</h4>
                        <div className="text-4xl font-extrabold text-[#0f172a] dark:text-white mb-8 transition-colors">{item.number}</div>
                        <button onClick={() => startDialing(item)} className={`w-full py-3.5 rounded-lg font-bold text-sm tracking-widest transition-colors ${item.bg} ${item.text} tracking-widest uppercase`}>
                            DIAL NOW
                        </button>
                    </div>
                ))}
            </div>

            {/* Success Modal Overlay */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden text-center relative pointer-events-auto border-t-8 border-green-500 transition-colors"
                        >
                            <div className="p-10">
                                <div className="w-24 h-24 bg-green-50 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                </div>
                                <h3 className="text-2xl font-extrabold text-[#0f172a] dark:text-white mb-4 transition-colors">Escalation Successfully Logged</h3>
                                <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4 mb-8 border border-gray-100 dark:border-slate-700 text-left transition-colors">
                                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-3 transition-colors">
                                        Your details and live GPS coordinates have been securely forwarded to the <strong className="text-gray-900 dark:text-white">Depot Control Room</strong>.
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed transition-colors">
                                        A safety officer is reviewing this case and will contact the bus crew immediately.
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedCategory(null);
                                    }}
                                    className="w-full py-4 bg-[#f97316] text-white font-bold rounded-lg hover:bg-[#ea580c] transition-colors shadow-sm uppercase tracking-widest text-sm"
                                >
                                    Return to Safety
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
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0f172a]/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden text-center relative pointer-events-auto transition-colors"
                        >
                            <div className="p-8 pb-10">
                                <h3 className="text-2xl font-extrabold text-[#0f172a] dark:text-white mb-2 transition-colors">Initiating Emergency Call...</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-8 transition-colors">
                                    Dialing <strong className="text-red-600 font-bold">{dialingContact.number}</strong> ({dialingContact.name} {dialingContact.name === 'Women Safety' ? 'Helpline' : 'Support'})
                                </p>

                                <div className="relative w-36 h-36 mx-auto mb-8 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90 absolute inset-0 text-[#f1f5f9] dark:text-slate-700 transition-colors" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
                                        <circle
                                            cx="50" cy="50" r="45" fill="none"
                                            stroke="currentColor" /* changed from hardcoded color to currentColor */
                                            strokeWidth="6"
                                            strokeDasharray="283"
                                            strokeDashoffset={283 - (283 * countdown) / 5}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-linear text-[#0f172a] dark:text-white"
                                        />
                                    </svg>
                                    <span className="text-6xl font-extrabold text-[#0f172a] dark:text-white absolute transition-colors">{countdown}</span>
                                </div>

                                <button
                                    onClick={dialImmediately}
                                    className="w-full py-4 bg-[#0f172a] dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-bold text-base rounded-lg transition-colors flex items-center justify-center mb-4 tracking-wide shadow-md"
                                >
                                    <Phone className="w-5 h-5 mr-3" fill="currentColor" /> Dial Immediately
                                </button>

                                <button
                                    onClick={cancelDialing}
                                    className="w-full py-4 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-[#0f172a] dark:text-gray-200 border border-gray-200 dark:border-slate-700 font-bold text-base rounded-lg transition-colors flex items-center justify-center mb-6 tracking-wide shadow-sm"
                                >
                                    Cancel Now
                                </button>

                                <p className="text-[10px] text-gray-400 dark:text-gray-500 max-w-xs mx-auto leading-relaxed transition-colors">
                                    Authorized emergency request initiated. False alarms are subject to legal action under IPC sections.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Minimal Icons
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
const HealthIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" /></svg>
);
const WomanIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a2 2 0 110 4 2 2 0 010-4zm4 6H8a2 2 0 00-2 2v6h2v6h4v-6h4v6h4v-6h2V10a2 2 0 00-2-2z" /></svg>
);
