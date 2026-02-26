import React, { useState } from 'react';
import { ShieldAlert, Phone, AlertTriangle, Send, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmergencyDashboard() {
    const [showModal, setShowModal] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleEscalation = () => {
        setShowModal(true);
    };

    const submitEscalation = () => {
        setSubmitted(true);
        setTimeout(() => {
            setShowModal(false);
            setSubmitted(false);
            setConfirmed(false);
        }, 3000);
    };

    const helplines = [
        { name: 'National Emergency', number: '112', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: AlertTriangle },
        { name: 'Ambulance', number: '108', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: Phone },
        { name: 'Women Safety', number: '1091', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', icon: ShieldCheck },
    ];

    return (
        <div className="max-w-4xl mx-auto w-full">
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-4 shadow-inner">
                    <ShieldAlert size={40} className="text-red-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-ti-navy">Emergency Assistance</h2>
                <p className="text-gray-500 mt-2 max-w-lg mx-auto">Immediate rapid-response numbers and live verified escalation tools for passengers inside the bus.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Direct Helplines */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center">
                        <Phone className="w-5 h-5 mr-2 text-ti-navy" /> Immediate Help
                    </h3>
                    <div className="flex-grow flex flex-col justify-around space-y-4">
                        {helplines.map((item, idx) => (
                            <a href={`tel:${item.number}`} key={idx} className={`p-4 rounded-xl border ${item.bg} ${item.border} flex justify-between items-center group hover:shadow-md transition-all active:scale-95`}>
                                <div className="flex items-center">
                                    <item.icon className={`w-6 h-6 mr-3 ${item.text}`} />
                                    <span className={`font-bold ${item.text}`}>{item.name}</span>
                                </div>
                                <div className="flex items-center bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
                                    <Phone className="w-3 h-3 mr-1.5 text-black" />
                                    <span className="font-extrabold text-black text-lg">{item.number}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Live Context Card */}
                <div className="bg-gradient-to-br from-ti-navy to-slate-800 rounded-2xl shadow-xl text-white p-6 relative overflow-hidden flex flex-col">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-ti-saffron/20 rounded-full blur-2xl"></div>

                    <div className="flex justify-between items-start mb-6 align-top">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            Live Trip Context
                        </h3>
                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider animate-pulse flex items-center">
                            <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5"></span> LIVE
                        </span>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-6 flex-grow">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                            <div>
                                <span className="text-gray-400 text-xs uppercase block mb-1">Bus Number</span>
                                <span className="font-bold text-lg">KL-15-A-9082</span>
                            </div>
                            <div>
                                <span className="text-gray-400 text-xs uppercase block mb-1">Route</span>
                                <span className="font-bold text-lg text-ti-saffron-light">356C</span>
                            </div>
                            <div className="col-span-2 pt-2 border-t border-white/10">
                                <span className="text-gray-400 text-xs uppercase block mb-1">Last Confirmed Stop</span>
                                <span className="font-semibold">Silk Board Junction</span>
                                <span className="text-xs text-gray-400 ml-2">(10 min ago)</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleEscalation}
                        className="w-full py-4 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-colors flex items-center justify-center uppercase tracking-wide text-sm active:scale-95"
                    >
                        <ShieldAlert className="w-5 h-5 mr-2" /> Request Verified Escalation
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ti-navy/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            <div className="bg-red-600 p-4 text-white flex justify-between items-center">
                                <h3 className="font-bold flex items-center"><AlertTriangle className="mr-2" /> Escalation Warning</h3>
                                <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white">✕</button>
                            </div>

                            <div className="p-6">
                                {!submitted ? (
                                    <>
                                        <p className="text-gray-800 font-bold text-lg leading-tight mb-4 text-center">
                                            Do you confirm you are currently inside Bus KL-15-A-9082 on Route 356C?
                                        </p>
                                        <p className="text-sm text-gray-500 text-center mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            False alarms divert crucial resources. By confirming, your verified location and IP context will be logged directly to the depot control room.
                                        </p>

                                        <label className="flex items-start space-x-3 mb-6 p-4 border-2 border-orange-100 bg-orange-50 rounded-xl cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={confirmed}
                                                onChange={(e) => setConfirmed(e.target.checked)}
                                                className="mt-1 w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
                                            />
                                            <span className="text-sm font-semibold text-gray-800">I acknowledge the severity of this action and confirm my physical presence on this bus.</span>
                                        </label>

                                        <button
                                            disabled={!confirmed}
                                            onClick={submitEscalation}
                                            className="w-full py-4 bg-red-600 text-white font-bold rounded-xl disabled:opacity-50 transition-opacity flex justify-center items-center shadow-lg"
                                        >
                                            <Send className="w-5 h-5 mr-2" /> Dispatch Emergency Request
                                        </button>
                                    </>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-6 flex flex-col items-center"
                                    >
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 relative">
                                            <ShieldCheck size={40} className="text-green-600 relative z-10" />
                                            <motion.div animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ duration: 1, repeat: Infinity }} className="absolute inset-0 bg-green-400 rounded-full" />
                                        </div>
                                        <h3 className="text-xl font-bold text-green-700 mb-2">Escalation Verified</h3>
                                        <p className="text-gray-600 font-medium">Details securely forwarded to depot control room.</p>
                                        <p className="text-xs text-gray-400 mt-4">Case ID: #IND-9028-EMG</p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
