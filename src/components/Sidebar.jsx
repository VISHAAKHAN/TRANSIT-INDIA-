import React from 'react';
import { Home, Radio, MapPin, Bell, BarChart2, Ticket, ShieldAlert, LifeBuoy, Sun, Moon, Globe, Bus, X, Menu } from 'lucide-react';
import { t } from '../translations';

export default function Sidebar({ currentPage, navigateTo, isDarkMode, setIsDarkMode, lang, setLang, isOpen, setIsOpen }) {
    const menuItems = [
        { id: 'track', label: 'Home', translationKey: 'home', icon: Home },
        { id: 'alerts', label: 'Alerts', translationKey: 'alerts', icon: Bell },
        { id: 'about', label: 'Analytics', translationKey: 'analytics', icon: BarChart2 },
        { id: 'emergency', label: 'EMergency', translationKey: 'safety', icon: ShieldAlert },
        { id: 'service-reporting', label: 'Support', translationKey: 'support', icon: LifeBuoy },
    ];

    const handleMenuClick = (id) => {
        navigateTo(id);
        setIsOpen(false); // Close sidebar on selection
    };

    return (
        <>
            {/* Backdrop overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-[#070F1E]/60 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar drawer container */}
            <aside className={`fixed top-0 bottom-0 left-0 w-64 bg-[#0B1B2D] text-white flex flex-col justify-between shrink-0 h-screen overflow-y-auto border-r border-[#15293E] z-50 transition-transform duration-300 ease-out select-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                {/* Simplified Menu Header */}
                <div className="p-6 pb-4 border-b border-[#15293E] flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 text-gray-300">
                        <Menu size={16} className="text-[#12820B]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('navigationMenu', lang)}</span>
                    </div>

                    {/* Close button */}
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                        title={t('closeSidebar', lang)}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation links */}
                <nav className="flex-1 px-4 py-6 space-y-1.5">
                    {menuItems.map((item) => {
                        const isActive = currentPage === item.id || 
                            (item.id === 'track' && (currentPage === 'track' || currentPage === 'routeDetails'));
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleMenuClick(item.id)}
                                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                    isActive 
                                        ? 'bg-[#12820B]/10 text-green-400 border-l-4 border-[#12820B] font-extrabold shadow-sm' 
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <item.icon className={`w-4.5 h-4.5 ${isActive ? 'text-[#12820B] dark:text-green-400' : 'text-gray-400'}`} />
                                <span>{t(item.translationKey, lang)}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Sidebar Bottom Monument card */}
                <div className="px-5 mb-4">
                    <div className="bg-[#071524] rounded-2xl p-4.5 border border-[#15293E] relative overflow-hidden text-center group">
                        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none w-full">
                            <svg viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="1" className="w-full h-full object-cover">
                                <path d="M10 90 L90 90 M20 90 L20 70 L30 70 L30 90 M40 90 L40 50 Q50 30 60 50 L60 90" />
                            </svg>
                        </div>
                        <div className="w-12 h-8 mx-auto mb-3 flex items-center justify-center bg-white/5 rounded-lg border border-white/10 group-hover:scale-105 transition-transform">
                            <Bus className="w-5 h-5 text-green-400" />
                        </div>
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-normal mb-1">{t('movingIndia', lang)}</h4>
                        <p className="text-[9px] text-[#12820B] font-black uppercase tracking-wider mb-2.5">{t('towardsSmarterCities', lang)}</p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest leading-none">{t('sidebarTagline', lang)}</p>
                    </div>
                </div>

                {/* Bottom Controls panel */}
                <div className="p-4 border-t border-[#15293E] bg-[#071524]/60 space-y-3">
                    
                    {/* Language Select */}
                    <div className="flex items-center justify-between text-xs px-2 text-gray-400">
                        <div className="flex items-center space-x-2">
                            <Globe size={14} className="text-gray-400" />
                            <span className="font-bold uppercase tracking-wider">{t('language', lang)}</span>
                        </div>
                        <select
                            value={lang}
                            onChange={(e) => setLang(e.target.value)}
                            className="bg-transparent border-0 text-white font-extrabold text-xs focus:ring-0 outline-none cursor-pointer p-0 select-none"
                        >
                            <option value="English" className="bg-[#0B1B2D]">EN</option>
                            <option value="Hindi" className="bg-[#0B1B2D]">हिन्दी</option>
                            <option value="Tamil" className="bg-[#0B1B2D]">தமிழ்</option>
                            <option value="Malayalam" className="bg-[#0B1B2D]">മലയാളം</option>
                        </select>
                    </div>

                    {/* Dark Mode toggle switch */}
                    <div className="flex items-center justify-between text-xs px-2 text-gray-400">
                        <div className="flex items-center space-x-2">
                            {isDarkMode ? <Moon size={14} className="text-yellow-400" /> : <Sun size={14} className="text-orange-400" />}
                            <span className="font-bold uppercase tracking-wider">{isDarkMode ? t('darkMode', lang) : t('lightMode', lang)}</span>
                        </div>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${isDarkMode ? 'bg-[#12820B]' : 'bg-gray-600'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
