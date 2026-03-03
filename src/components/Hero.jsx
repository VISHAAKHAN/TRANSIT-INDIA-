import React from 'react';
import { Bus, Home, LogOut, AlertCircle, Sun, Moon } from 'lucide-react';
import { t } from '../translations';

export default function Hero({ activeTab, setActiveTab, lang, setLang, navigateTo, isDarkMode, setIsDarkMode }) {
    const isLogoutSuccess = activeTab === 'logoutSuccess';
    const showHome = activeTab !== 'login' && activeTab !== 'otp' && !isLogoutSuccess;
    const showProfile = activeTab !== 'login' && activeTab !== 'otp' && !isLogoutSuccess;
    const showEmergency = activeTab !== 'login' && activeTab !== 'otp';
    const showLogout = activeTab === 'profile';

    return (
        <header className="bg-[#0f172a] dark:bg-slate-950 text-white w-full shadow-md z-50 transition-colors duration-300 border-b border-transparent dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">

                {/* Left: Logo & Title */}
                <div
                    className="flex items-center space-x-3 cursor-pointer select-none"
                    onClick={() => navigateTo('track')}
                >
                    <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0 border border-gray-200 dark:border-slate-700 shadow-sm">
                        <img src="/logo.jpg" alt="TransitIndia Logo" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center text-left">
                        <span className="text-xl font-bold leading-tight tracking-wide">TransitIndia</span>
                        <span className="text-[10px] font-semibold tracking-wide text-gray-400">{t('govIndia', lang)}</span>
                    </div>
                </div>

                {/* Center: Quote */}
                <div className="hidden lg:flex flex-1 justify-center items-center px-4">
                    <span className="text-xs italic text-gray-300 dark:text-gray-400 font-medium font-serif border-x-2 border-orange-500/50 px-4">
                        "Predictable arrival times, absolute transparency, and safety first."
                    </span>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center space-x-4 sm:space-x-6">
                    {/* Home Button */}
                    {showHome && (
                        <button
                            onClick={() => navigateTo('track')}
                            className="flex items-center space-x-2 text-white hover:text-gray-300 font-medium text-sm transition-colors"
                        >
                            <Home size={18} />
                            <span className="hidden sm:inline">{t('home', lang)}</span>
                        </button>
                    )}

                    {!isLogoutSuccess && (
                        <>
                            <div className="hidden sm:flex relative group">
                                <select
                                    value={lang}
                                    onChange={(e) => setLang(e.target.value)}
                                    className="flex items-center space-x-2 bg-[#1e293b] dark:bg-slate-800 border border-gray-600 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 px-3 py-1.5 rounded text-sm text-gray-200 transition-colors appearance-none cursor-pointer outline-none focus:border-gray-300"
                                >
                                    <option value="English">🌐 English</option>
                                    <option value="Hindi">🌐 हिन्दी</option>
                                    <option value="Tamil">🌐 தமிழ்</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                    <span className="text-xs">▼</span>
                                </div>
                            </div>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="w-9 h-9 flex items-center justify-center bg-[#1e293b] dark:bg-slate-800 hover:bg-gray-700 dark:hover:bg-slate-700 text-yellow-400 dark:text-blue-300 rounded transition-colors shrink-0 border border-gray-600 dark:border-slate-700"
                                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            >
                                {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                            </button>

                            {/* Emergency Diamond */}
                            {showEmergency && (
                                <button
                                    onClick={() => navigateTo('emergency')}
                                    className="w-9 h-9 flex items-center justify-center bg-[#ef4444] text-white rounded transform hover:scale-105 transition-transform shrink-0 shadow-md"
                                    title={t('emergencySupport', lang)}
                                >
                                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-[#ef4444]">
                                        <AlertCircle size={16} className="fill-current text-white bg-[#ef4444] rounded-full" />
                                    </div>
                                </button>
                            )}

                            {/* Logout Button */}
                            {showLogout && (
                                <button
                                    onClick={() => navigateTo('logoutSuccess')}
                                    className="flex items-center space-x-2 bg-transparent border border-gray-600 hover:bg-gray-800 px-3 py-1.5 rounded text-sm text-white font-medium transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span className="hidden sm:inline">{t('logout', lang)}</span>
                                </button>
                            )}

                            {/* Profile Avatar */}
                            {showProfile && (
                                <div
                                    onClick={() => navigateTo('profile')}
                                    className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-transparent hover:border-orange-500 transition-colors shrink-0"
                                    title={t('account', lang)}
                                >
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Meera&backgroundColor=c0aede" alt="Profile" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </>
                    )}
                </div>

            </div>
        </header>
    );
}
