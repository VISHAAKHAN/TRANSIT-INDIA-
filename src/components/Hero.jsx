import React from 'react';
import { Bus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero({ activeTab, setActiveTab, lang, setLang }) {
    const navItems = [
        { id: 'track', label: 'Track Bus' },
        { id: 'emergency', label: 'Emergency' },
        { id: 'feedback', label: 'Feedback' },
        { id: 'about', label: 'About AI' }
    ];

    return (
        <div className="bg-ti-navy text-white relative overflow-hidden flex flex-col pt-4 pb-12 shadow-xl border-b-4 border-ti-saffron">
            <div className="absolute inset-0 chakra-pattern pointer-events-none"></div>

            {/* Navbar overlay */}
            <nav className="relative z-10 w-full px-6 flex flex-col md:flex-row justify-between items-center mb-12 max-w-7xl mx-auto">
                <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full md:w-auto justify-between md:justify-start">
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('track')}>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-ti-saffron to-ti-saffron-light flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(255,153,51,0.5)]">
                            <Bus className="text-ti-navy w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">Transit India</h1>
                        </div>
                    </div>

                    {/* Mobile Language Switcher */}
                    <div className="flex md:hidden border border-gray-600 rounded-md overflow-hidden bg-ti-navy/80 backdrop-blur-md">
                        {['EN', 'HI', 'TA'].map(l => (
                            <button
                                key={l}
                                onClick={() => setLang(l === 'EN' ? 'English' : l === 'HI' ? 'Hindi' : 'Tamil')}
                                className={`px-3 py-1.5 text-xs font-medium transition-all ${lang.startsWith(l[0]) ? 'bg-ti-saffron text-ti-navy' : 'bg-transparent text-gray-300 hover:bg-gray-800'}`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 items-center w-full md:w-auto">
                    <div className="flex space-x-6 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto justify-center">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`text-sm md:text-base font-medium transition-all focus:outline-none whitespace-nowrap px-1 py-1 ${activeTab === item.id ? 'text-ti-saffron border-b-2 border-ti-saffron' : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-gray-500'}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Desktop Language Switcher */}
                    <div className="hidden md:flex border border-gray-600 rounded-md overflow-hidden bg-ti-navy/80 backdrop-blur-md">
                        {['Tamil', 'English', 'Hindi'].map(l => (
                            <button
                                key={l}
                                onClick={() => setLang(l)}
                                className={`px-4 py-1.5 text-sm font-medium transition-all ${lang === l ? 'bg-ti-saffron text-ti-navy shadow-inner' : 'bg-transparent text-gray-300 hover:bg-gray-800'}`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col md:flex-row px-6 items-center max-w-7xl mx-auto w-full">
                <div className="md:w-[55%] flex flex-col items-start pr-0 md:pr-8 text-center md:text-left">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
                        <div className="inline-flex items-center space-x-2 py-1 px-3 rounded-full bg-ti-emerald/20 text-emerald-400 border border-ti-emerald/30 text-xs font-semibold mb-6 uppercase tracking-widest shadow-[0_0_10px_rgba(19,136,8,0.2)]">
                            <span className="w-2 h-2 rounded-full bg-ti-emerald animate-pulse"></span>
                            <span>Live Nationwide Pilot</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-extrabold leading-[1.15] mb-6 drop-shadow-xl text-white">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">Honest. Inclusive.</span><br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ti-saffron to-ti-saffron-light filter drop-shadow-[0_0_8px_rgba(255,153,51,0.4)]">
                                AI-Powered
                            </span> Bus Info.
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 font-medium max-w-xl mb-8 border-l-4 border-ti-saffron pl-4 mx-auto md:mx-0">
                            Building a responsive public infrastructure for Bharat. Predictable arrival times, absolute transparency, and safety first.
                        </p>
                    </motion.div>
                </div>

                {/* Animated Right Side */}
                <div className="md:w-[45%] mt-12 md:mt-0 relative w-full h-[250px] md:h-[350px] flex items-end justify-center md:justify-end border-b-2 border-blue-900/50 overflow-hidden rounded-xl bg-gradient-to-b from-transparent to-black/20">
                    {/* Line art monuments - stylized */}
                    <div className="absolute bottom-0 w-[120%] flex justify-between items-end opacity-30 select-none pb-1 px-4">
                        {/* India Gate */}
                        <div className="w-16 h-32 border-2 text-white border-b-0 border-current rounded-t-sm flex flex-col items-center justify-end">
                            <div className="w-8 h-12 border-2 border-b-0 border-current rounded-t-full"></div>
                        </div>
                        {/* Taj Mahal */}
                        <div className="w-24 h-40 border-2 text-white border-b-0 border-current rounded-t-full relative flex justify-center">
                            <div className="absolute -left-6 bottom-0 w-4 h-24 border-2 border-b-0 border-current"></div>
                            <div className="absolute -right-6 bottom-0 w-4 h-24 border-2 border-b-0 border-current"></div>
                        </div>
                        {/* Gateway of India */}
                        <div className="w-20 h-28 border-2 text-white border-b-0 border-current rounded-t-sm flex flex-col items-center justify-end">
                            <div className="w-10 h-16 border-2 border-b-0 border-current rounded-t-full"></div>
                        </div>
                        {/* Charminar */}
                        <div className="w-16 h-36 border-2 text-white border-b-0 border-current rounded-t-sm relative flex justify-center">
                            <div className="absolute -left-2 bottom-0 w-2 h-44 border-2 border-b-0 border-current"></div>
                            <div className="absolute -right-2 bottom-0 w-2 h-44 border-2 border-b-0 border-current"></div>
                        </div>
                    </div>

                    <motion.div
                        className="absolute bottom-1 left-0 z-20"
                        animate={{ x: ["-100%", "500%"] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="relative">
                            <Bus size={64} className="text-ti-saffron drop-shadow-[0_0_15px_rgba(255,153,51,0.9)]" />
                            <motion.div
                                className="absolute bottom-1 right-2 w-2 h-2 bg-yellow-300 rounded-full"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
