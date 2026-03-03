import React, { useState } from 'react';
import { Bus, Bell, Home, ThumbsUp, ThumbsDown, AlertCircle, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ServiceReporting({ routeData, navigateTo }) {
    const [feedback, setFeedback] = useState(null); // 'satisfied' or 'unsatisfied'
    const [concern, setConcern] = useState(null);
    const [details, setDetails] = useState('');
    const [showModal, setShowModal] = useState(false);

    const activeRoute = routeData?.route || '500A-1';

    const handleHome = () => {
        navigateTo('track');
    };

    const handleSubmit = () => {
        setShowModal(true);
    };

    return (
        <div className="bg-[#F8FAFC] dark:bg-slate-900 min-h-screen text-gray-800 dark:text-gray-200 font-sans transition-colors">
            {/* Header */}
            <header className="bg-ti-navy dark:bg-slate-800 text-white px-6 py-4 flex justify-between items-center shadow-md transition-colors">
                <div className="flex items-center space-x-4">
                    <div className="bg-white dark:bg-slate-700 rounded-md p-1.5 flex items-center justify-center transition-colors">
                        <Bus className="w-6 h-6 text-ti-navy dark:text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-tight">Service Reporting & Trip Feedback</h1>
                        <p className="text-[10px] text-ti-saffron dark:text-orange-400 tracking-widest font-bold uppercase transition-colors">Government Transport Department</p>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <button className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                        <Bell className="w-5 h-5" />
                    </button>
                    <button onClick={handleHome} className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">
                        <Home className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto w-full p-6 space-y-8 mt-4">
                {/* Trip Feedback */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
                    <div className="bg-orange-50/50 dark:bg-slate-900/50 px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex items-center transition-colors">
                        <div className="text-ti-navy dark:text-gray-300 mr-3 transition-colors"><MessageSquareIcon /></div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">Trip Feedback</h2>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-8 text-center max-w-2xl mx-auto transition-colors">
                            Your feedback is vital for continuous service improvement and maintaining high standards of public transport. Please let us know how your last journey was.
                        </p>

                        <div className="flex justify-center space-x-12 mb-8">
                            <button
                                onClick={() => setFeedback('satisfied')}
                                className="flex flex-col items-center group"
                            >
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors ${feedback === 'satisfied' ? 'bg-ti-navy dark:bg-slate-700 text-white' : 'bg-gray-100 dark:bg-slate-700/50 text-gray-400 dark:text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'}`}>
                                    <ThumbsUp className="w-8 h-8" />
                                </div>
                                <span className={`text-sm font-bold transition-colors ${feedback === 'satisfied' ? 'text-ti-navy dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>Satisfied</span>
                            </button>
                            <button
                                onClick={() => setFeedback('unsatisfied')}
                                className="flex flex-col items-center group"
                            >
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors ${feedback === 'unsatisfied' ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-slate-700/50 text-gray-400 dark:text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'}`}>
                                    <ThumbsDown className="w-8 h-8 mt-1" />
                                </div>
                                <span className={`text-sm font-bold transition-colors ${feedback === 'unsatisfied' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>Unsatisfied</span>
                            </button>
                        </div>

                        <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-lg p-4 text-xs italic text-gray-500 dark:text-gray-400 transition-colors">
                            <strong>LEGAL DISCLAIMER</strong><br />
                            Feedback provided is recorded for quality assurance purposes. Personal data is handled according to the National Data Protection Policy. Submissions are monitored 24/7.
                        </div>
                    </div>
                </div>

                {/* Reporting Service */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
                    <div className="bg-ti-navy dark:bg-slate-900 px-6 py-4 flex items-center text-white transition-colors">
                        <AlertTriangle className="w-5 h-5 mr-3 text-ti-saffron dark:text-orange-400 transition-colors" />
                        <h2 className="text-lg font-bold">Reporting Service</h2>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 transition-colors">Ask for Bus Route / Route Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={activeRoute}
                                    onChange={() => { }}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-slate-900 focus:ring-ti-saffron focus:border-ti-saffron transition-colors"
                                    placeholder="Enter route number or destination..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Type of Concern</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => setConcern('rash')}
                                    className={`py-3 px-4 border rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${concern === 'rash' ? 'border-ti-saffron bg-orange-50 text-ti-navy' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <ZapIcon className="w-4 h-4 mr-2 text-ti-saffron" /> Rash Driving
                                </button>
                                <button
                                    onClick={() => setConcern('misconduct')}
                                    className={`py-3 px-4 border rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${concern === 'misconduct' ? 'border-ti-saffron bg-orange-50 text-ti-navy' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <UserXIcon className="w-4 h-4 mr-2 text-ti-saffron" /> Misconduct
                                </button>
                                <button
                                    onClick={() => setConcern('overcrowding')}
                                    className={`py-3 px-4 border rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${concern === 'overcrowding' ? 'border-ti-saffron bg-orange-50 text-ti-navy' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <UsersIcon className="w-4 h-4 mr-2 text-ti-saffron" /> Overcrowding
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Additional Details (Optional)</label>
                            <textarea
                                rows="4"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className="block w-full p-3 border border-gray-200 rounded-lg text-gray-900 focus:ring-ti-saffron focus:border-ti-saffron resize-none shadow-inner"
                                placeholder="Describe the incident in brief..."
                            ></textarea>
                        </div>

                        <div className="bg-orange-50 border-l-4 border-ti-saffron p-4 rounded-r-lg flex items-start">
                            <AlertCircle className="w-5 h-5 text-ti-saffron mr-3 flex-shrink-0 mt-0.5" />
                            <p className="text-xs font-bold text-orange-900">
                                IMPORTANT: All reports are logged for pattern-based analysis and are subject to review by relevant transport authorities. Data integrity is maintained for administrative action.
                            </p>
                        </div>

                        <button
                            disabled={!concern}
                            onClick={handleSubmit}
                            className="w-full py-4 bg-[#F25E22] hover:bg-[#d44d18] text-white font-bold rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 shadow-md active:scale-95"
                        >
                            <Send className="w-5 h-5 mr-2" /> Submit Report
                        </button>

                        <div className="bg-red-50 p-4 border border-red-100 rounded-lg flex items-start">
                            <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                            <p className="text-xs font-bold text-red-700">
                                WARNING: Misuse of this service results in severe crime under suitable sections of the Penal Code. False reporting is a punishable offense.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

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
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-sm w-full overflow-hidden text-center relative pointer-events-auto border-t-4 border-ti-saffron dark:border-orange-500 transition-colors"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                ✕
                            </button>

                            <div className="pt-8 pb-6 px-8">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Report Submitted Successfully</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-8 px-4 transition-colors">
                                    Your report has been logged for official review. We promise to maintain the confidentiality of your report and investigate the matter promptly.
                                </p>

                                <div className="space-y-3">
                                    <button
                                        onClick={handleHome}
                                        className="w-full py-3 bg-ti-navy dark:bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors shadow flex justify-center items-center"
                                    >
                                        <Home className="w-4 h-4 mr-2" /> Go to Home
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="w-full py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        View Report Details
                                    </button>
                                </div>

                                <div className="mt-8 pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-gray-400 dark:text-gray-500 transition-colors">
                                    <ShieldIcon className="w-3 h-3 mr-1" /> OFFICIAL GOVERNMENT CONFIRMATION
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Icons
const MessageSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
const SearchIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
const ZapIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
const UserXIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5c-2.2 0-4 1.8-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="18" y1="8" x2="23" y2="13" /><line x1="23" y1="8" x2="18" y2="13" /></svg>
const UsersIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
const ShieldIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
