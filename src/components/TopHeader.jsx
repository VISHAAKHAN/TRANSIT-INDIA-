import React, { useState, useEffect, useRef } from 'react';
import { Bell, LogIn, LogOut, Menu, ArrowLeft, ShieldAlert, User, X, CheckCircle, AlertCircle, Info, Bus, Clock, ChevronRight } from 'lucide-react';
import { t } from '../translations';

const NOTIFICATIONS = [
    {
        id: 1,
        icon: AlertCircle,
        iconColor: 'text-orange-500',
        iconBg: 'bg-orange-50',
        title: 'Route Diversion — Anna Salai',
        desc: 'Buses rerouted via Mount Road due to road works.',
        time: '10 min ago',
        unread: true,
    },
    {
        id: 2,
        icon: CheckCircle,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-50',
        title: 'Route 1C — On Schedule',
        desc: 'All buses running normally. No disruptions.',
        time: '15 min ago',
        unread: true,
    },
    {
        id: 3,
        icon: Bus,
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-50',
        title: 'New Express Route 12X',
        desc: 'Express bus 12X now operational from Central Junction.',
        time: '1 hr ago',
        unread: true,
    },
    {
        id: 4,
        icon: Clock,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-50',
        title: 'Route 5E — 8 min Delay',
        desc: 'Traffic congestion near Central Junction.',
        time: '25 min ago',
        unread: false,
    },
    {
        id: 5,
        icon: Info,
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-50',
        title: 'GPS Sync Updated',
        desc: 'Real-time ETA accuracy improved for all zones.',
        time: '5 hr ago',
        unread: false,
    },
];

export default function TopHeader({ navigateTo, lang, toggleSidebar, currentPage }) {
    const [time, setTime] = useState(new Date());
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState(NOTIFICATIONS);
    const notifRef = useRef(null);
    const isLoggedIn = !!sessionStorage.getItem('authToken');

    const unreadCount = notifications.filter(n => n.unread).length;

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLoginClick = () => {
        if (isLoggedIn) {
            navigateTo('logoutSuccess');
        } else {
            navigateTo('login');
        }
    };

    const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    const dismissNotif = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formattedDate = time.toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
    const isLoginPage = currentPage === 'login' || currentPage === 'otp';

    return (
        <>
            {/* Notification dropdown keyframes */}
            <style>{`
                @keyframes notifDrop {
                    from { opacity: 0; transform: translateY(-10px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>

            <header className="bg-white dark:bg-[#0B1E36] border-b border-gray-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between z-20 shadow-sm transition-colors duration-300">

                {/* Left — Hamburger & Brand */}
                <div className="flex items-center space-x-4">
                    {isLoginPage ? (
                        <button
                            onClick={() => navigateTo('track')}
                            className="px-3.5 py-2 hover:bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-xs font-black uppercase tracking-wider text-[#0F1E36] dark:text-white transition-all active:scale-95 shadow-sm cursor-pointer space-x-1.5"
                            title={t('goBack', lang)}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>{t('goBack', lang)}</span>
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={toggleSidebar}
                                className="p-2.5 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-[#0F1E36] dark:text-white transition-all active:scale-95 shadow-sm cursor-pointer"
                                title="Open Sidebar"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            {currentPage !== 'track' && (
                                <button
                                    onClick={() => navigateTo('track')}
                                    className="px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-xs font-black uppercase tracking-wider text-[#0F1E36] dark:text-white transition-all active:scale-95 shadow-sm cursor-pointer space-x-1"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    <span>{t('home', lang) || 'Home'}</span>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Brand */}
                    <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-slate-800 pl-4">
                        <svg className="w-7 h-5 rounded shadow-sm border border-gray-100 dark:border-slate-700 shrink-0" viewBox="0 0 90 60">
                            <rect width="90" height="20" fill="#FF9933" />
                            <rect y="20" width="90" height="20" fill="#FFFFFF" />
                            <rect y="40" width="90" height="20" fill="#12820B" />
                            <circle cx="45" cy="30" r="8" stroke="#000080" strokeWidth="1" fill="none" />
                            <circle cx="45" cy="30" r="1.5" fill="#000080" />
                            {Array.from({ length: 12 }).map((_, idx) => {
                                const angle = (idx * Math.PI) / 6;
                                return <line key={idx} x1="45" y1="30" x2={45 + 8 * Math.cos(angle)} y2={30 + 8 * Math.sin(angle)} stroke="#000080" strokeWidth="0.5" />;
                            })}
                        </svg>
                        <div className="text-left leading-none">
                            <h1 className="text-md font-black tracking-tight leading-none text-[#0F1E36] dark:text-white">{t('transitIndia', lang)}</h1>
                            <span className="text-[7px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block mt-1">{t('smartPublicTransport', lang)}</span>
                        </div>
                    </div>
                </div>

                {/* Center — Clock */}
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-sm font-black text-[#0F1E36] dark:text-white tracking-wide">{formattedTime}</div>
                    <div className="text-[9px] text-[#12820B] dark:text-green-400 font-black uppercase tracking-widest mt-0.5">{formattedDate}</div>
                </div>

                {/* Right — Actions */}
                <div className="flex items-center space-x-3">

                    {/* Emergency */}
                    <button
                        onClick={() => navigateTo('emergency')}
                        className="relative w-10 h-10 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 border border-red-200 dark:border-red-900 rounded-xl flex items-center justify-center text-red-500 dark:text-red-400 transition-colors cursor-pointer animate-pulse"
                        title={t('safety', lang) || 'Emergency'}
                    >
                        <ShieldAlert className="w-5 h-5" />
                    </button>

                    {/* Notification Bell */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setShowNotifications(prev => !prev)}
                            className={`relative w-10 h-10 border rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                                showNotifications
                                    ? 'bg-[#12820B]/10 border-[#12820B]/40 text-[#12820B]'
                                    : 'bg-gray-50 dark:bg-[#070F1E] hover:bg-gray-100 border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400'
                            }`}
                            title={t('notifications', lang)}
                        >
                            <Bell className="w-4.5 h-4.5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#12820B] text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0B1E36]">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* ── Notification Panel ── */}
                        {showNotifications && (
                            <div
                                className="absolute right-0 top-[calc(100%+10px)] w-[360px] rounded-2xl overflow-hidden"
                                style={{
                                    animation: 'notifDrop 0.2s cubic-bezier(0.16,1,0.3,1) both',
                                    zIndex: 9999,
                                    backgroundColor: '#ffffff',
                                    border: '1.5px solid #e5e7eb',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.20), 0 4px 16px rgba(0,0,0,0.10)',
                                }}
                            >
                                {/* Header */}
                                <div style={{ backgroundColor: '#ffffff', borderBottom: '1.5px solid #f0f0f0' }}
                                    className="flex items-center justify-between px-5 pt-4 pb-3">
                                    <div className="flex items-center space-x-2">
                                        <Bell className="w-4 h-4 text-[#0F1E36]" />
                                        <span className="text-sm font-black text-[#0F1E36] uppercase tracking-wider">Notifications</span>
                                        {unreadCount > 0 && (
                                            <span className="px-2 py-0.5 bg-[#12820B] text-white text-[9px] font-black rounded-full">{unreadCount} new</span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        {unreadCount > 0 && (
                                            <button onClick={markAllRead} className="text-[9px] font-black uppercase tracking-wider text-[#12820B] hover:underline">
                                                Mark all read
                                            </button>
                                        )}
                                        <button onClick={() => setShowNotifications(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* List */}
                                <div className="max-h-[340px] overflow-y-auto" style={{ backgroundColor: '#ffffff' }}>
                                    {notifications.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-12" style={{ backgroundColor: '#ffffff' }}>
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                <Bell className="w-5 h-5 text-gray-300" />
                                            </div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-wider">All caught up!</p>
                                            <p className="text-[10px] text-gray-300 font-bold mt-1">No notifications right now.</p>
                                        </div>
                                    ) : (
                                        notifications.map((notif, idx) => (
                                            <div
                                                key={notif.id}
                                                className="flex items-start space-x-3 px-5 py-3.5 group cursor-default"
                                                style={{
                                                    backgroundColor: notif.unread ? 'rgba(18,130,11,0.04)' : '#ffffff',
                                                    borderTop: idx === 0 ? 'none' : '1px solid #f3f4f6',
                                                    transition: 'background-color 0.15s',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f9fafb'; }}
                                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = notif.unread ? 'rgba(18,130,11,0.04)' : '#ffffff'; }}
                                            >
                                                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5 ${notif.iconBg}`}>
                                                    <notif.icon className={`w-4 h-4 ${notif.iconColor}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-[11px] font-black text-[#0F1E36] leading-snug" style={{ opacity: notif.unread ? 1 : 0.6 }}>
                                                            {notif.title}
                                                        </p>
                                                        <button
                                                            onClick={() => dismissNotif(notif.id)}
                                                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-300 hover:text-gray-500 transition-all shrink-0"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 font-bold mt-0.5 leading-relaxed line-clamp-2">{notif.desc}</p>
                                                    <div className="flex items-center space-x-2 mt-1.5">
                                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{notif.time}</span>
                                                        {notif.unread && <span className="w-1.5 h-1.5 bg-[#12820B] rounded-full"></span>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Footer */}
                                <div style={{ backgroundColor: '#ffffff', borderTop: '1.5px solid #f0f0f0' }} className="px-5 py-3">
                                    <button
                                        onClick={() => { setShowNotifications(false); navigateTo('alerts'); }}
                                        className="w-full flex items-center justify-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-[#12820B] hover:text-green-700 transition-colors py-1"
                                    >
                                        <span>View all alerts</span>
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile */}
                    <button
                        onClick={() => navigateTo('profile')}
                        className="w-10 h-10 bg-gradient-to-br from-[#12820B]/20 to-[#0F1E36]/30 hover:from-[#12820B]/30 hover:to-[#0F1E36]/50 border border-[#12820B]/40 rounded-xl flex items-center justify-center text-[#12820B] dark:text-green-400 transition-all active:scale-95 shadow-sm"
                        title={t('profile', lang) || 'Profile'}
                    >
                        <User className="w-4.5 h-4.5" />
                    </button>

                    {/* Login / Logout */}
                    <button
                        onClick={handleLoginClick}
                        className="flex items-center space-x-2 px-4 py-2.5 bg-[#12820B] hover:bg-green-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-widest shadow-md transition-all active:scale-95 shrink-0"
                    >
                        {isLoggedIn ? (
                            <>
                                <LogOut className="w-4 h-4" />
                                <span>{t('logout', lang)}</span>
                            </>
                        ) : (
                            <>
                                <LogIn className="w-4 h-4" />
                                <span>{t('citizenLogin', lang)}</span>
                            </>
                        )}
                    </button>
                </div>
            </header>
        </>
    );
}
