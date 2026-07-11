import React, { useState, useEffect, useRef } from 'react';
import { Bell, LogIn, LogOut, Menu, ArrowLeft, ShieldAlert, User, X, CheckCircle, AlertCircle, Info, Bus, Clock, ChevronRight, ChevronDown } from 'lucide-react';
import { t } from '../translations';

const NOTIFICATIONS_TN = [
    {
        id: 1,
        icon: AlertCircle,
        iconColor: 'text-orange-500',
        iconBg: 'bg-orange-50',
        title: 'Route Diversion — Anna Salai',
        titleKey: 'diverstionAnnaSalaiTitle',
        desc: 'Buses rerouted via Mount Road due to road works.',
        descKey: 'diverstionAnnaSalaiDesc',
        time: '10 min ago',
        timeKey: 'minsAgo',
        timeVal: '10',
        unread: true,
    },
    {
        id: 2,
        icon: CheckCircle,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-50',
        title: 'Route 1C — On Schedule',
        titleKey: 'route1CNormalTitle',
        desc: 'All buses running normally. No disruptions.',
        descKey: 'route1CNormalDesc',
        time: '15 min ago',
        timeKey: 'minsAgo',
        timeVal: '15',
        unread: true,
    },
    {
        id: 3,
        icon: Bus,
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-50',
        title: 'New Express Route 12X',
        titleKey: 'newExpress12XTitle',
        desc: 'Express bus 12X now operational from Central Junction.',
        descKey: 'newExpress12XDesc',
        time: '1 hr ago',
        timeKey: 'hourAgo',
        timeVal: '1',
        unread: true,
    },
    {
        id: 4,
        icon: Clock,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-50',
        title: 'Route 5E — 8 min Delay',
        titleKey: 'route5EDelayTitle',
        desc: 'Traffic congestion near Central Junction.',
        descKey: 'route5EDelayDesc',
        time: '25 min ago',
        timeKey: 'minsAgo',
        timeVal: '25',
        unread: false,
    },
    {
        id: 5,
        icon: Info,
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-50',
        title: 'GPS Sync Updated',
        titleKey: 'gpsSyncUpdatedTitle',
        desc: 'Real-time ETA accuracy improved for all zones.',
        descKey: 'gpsSyncUpdatedDesc',
        time: '5 hr ago',
        timeKey: 'hoursAgo',
        timeVal: '5',
        unread: false,
    },
];

const NOTIFICATIONS_KL = [
    {
        id: 1,
        icon: AlertCircle,
        iconColor: 'text-orange-500',
        iconBg: 'bg-orange-50',
        title: 'Route Diversion — MG Road, Kochi',
        titleKey: 'diverstionMGRoadTitle',
        desc: 'Buses rerouted via Chittoor Road due to Metro maintenance.',
        descKey: 'diverstionMGRoadDesc',
        time: '10 min ago',
        timeKey: 'minsAgo',
        timeVal: '10',
        unread: true,
    },
    {
        id: 2,
        icon: CheckCircle,
        iconColor: 'text-emerald-500',
        iconBg: 'bg-emerald-50',
        title: 'KSRTC FP Route KL-1 — On Schedule',
        titleKey: 'ksrtcFPOnScheduleTitle',
        desc: 'All buses running normally between Vyttila Hub and Aluva.',
        descKey: 'ksrtcFPOnScheduleDesc',
        time: '15 min ago',
        timeKey: 'minsAgo',
        timeVal: '15',
        unread: true,
    },
    {
        id: 3,
        icon: Bus,
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-50',
        title: 'New SWIFT Electric Route KL-2E',
        titleKey: 'newSwiftElectricTitle',
        desc: 'SWIFT e-buses now operational between Kakkanad Infopark and Vyttila.',
        descKey: 'newSwiftElectricDesc',
        time: '1 hr ago',
        timeKey: 'hourAgo',
        timeVal: '1',
        unread: true,
    },
    {
        id: 4,
        icon: Clock,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-50',
        title: 'Route KL-4 — 12 min Delay',
        titleKey: 'routeKL4DelayTitle',
        desc: 'Traffic delay near Edappally Bypass Junction.',
        descKey: 'routeKL4DelayDesc',
        time: '25 min ago',
        timeKey: 'minsAgo',
        timeVal: '25',
        unread: false,
    },
    {
        id: 5,
        icon: Info,
        iconColor: 'text-blue-400',
        iconBg: 'bg-blue-50',
        title: 'GPS Sync Updated — Ernakulam Zone',
        titleKey: 'gpsKochiSyncTitle',
        desc: 'Real-time GPS telemetry refresh completed for Ernakulam district.',
        descKey: 'gpsKochiSyncDesc',
        time: '5 hr ago',
        timeKey: 'hoursAgo',
        timeVal: '5',
        unread: false,
    },
];

const formatNotificationTime = (notif, lang) => {
    if (notif.timeKey === 'minsAgo') {
        return `${notif.timeVal} ${t('minsAgo', lang) || 'mins ago'}`;
    }
    if (notif.timeKey === 'hourAgo') {
        return `${notif.timeVal} ${t('hourAgo', lang) || 'hour ago'}`;
    }
    if (notif.timeKey === 'hoursAgo') {
        return `${notif.timeVal} ${t('hoursAgo', lang) || 'hours ago'}`;
    }
    return notif.time;
};

export default function TopHeader({ navigateTo, lang, toggleSidebar, currentPage, region, onAdminEmergency }) {
    const [time, setTime] = useState(new Date());
    const [showNotifications, setShowNotifications] = useState(false);
    const activeNotifications = region === 'Kerala' ? NOTIFICATIONS_KL : NOTIFICATIONS_TN;
    const [notifications, setNotifications] = useState(activeNotifications);
    const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
    
    useEffect(() => {
        setNotifications(region === 'Kerala' ? NOTIFICATIONS_KL : NOTIFICATIONS_TN);
    }, [region]);
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

            <header className="relative bg-white dark:bg-[#0B1E36] border-b border-gray-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between z-30 shadow-sm transition-colors duration-300">

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
                            {currentPage !== 'track' && currentPage !== 'operatorDashboard' && (
                                <button
                                    onClick={() => {
                                        const isOperator = sessionStorage.getItem('userRole') === 'operator';
                                        navigateTo(isOperator ? 'operatorDashboard' : 'track');
                                    }}
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

                {/* Center — Clock + Welcome */}
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-sm font-black text-[#0F1E36] dark:text-white tracking-wide">{formattedTime}</div>
                    <div className="text-[9px] text-[#12820B] dark:text-green-400 font-black uppercase tracking-widest mt-0.5">{formattedDate}</div>
                    {currentPage !== 'operatorDashboard' && userName && (
                        <div className="mt-1 flex items-center space-x-1">
                            <span className="text-[9px] text-[#FF9933] font-black uppercase tracking-widest">👋 Welcome, {userName}!</span>
                        </div>
                    )}
                </div>

                {/* Right — Actions */}
                <div className="flex items-center space-x-3">

                    {/* Emergency */}
                    {currentPage !== 'operatorDashboard' && (
                        <button
                            onClick={() => navigateTo('emergency')}
                            className="relative w-10 h-10 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 border border-red-200 dark:border-red-900 rounded-xl flex items-center justify-center text-red-500 dark:text-red-400 transition-colors cursor-pointer animate-pulse"
                            title={t('safety', lang) || 'Emergency'}
                        >
                            <ShieldAlert className="w-5 h-5" />
                        </button>
                    )}

                    {/* Notification Bell */}
                    {currentPage !== 'operatorDashboard' && (
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
                                    className="absolute right-0 top-full mt-2.5 w-[360px] rounded-2xl bg-white dark:bg-[#0B1E36] border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden z-[9999]"
                                    style={{
                                        animation: 'notifDrop 0.2s cubic-bezier(0.16,1,0.3,1) both',
                                    }}
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-slate-800/60 bg-white dark:bg-[#0B1E36]">
                                        <div className="flex items-center space-x-2 shrink-0">
                                            <Bell className="w-4 h-4 text-[#0F1E36] dark:text-gray-300" />
                                            <span className="text-xs font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">{t('notificationsTitle', lang) || 'Notifications'}</span>
                                            {unreadCount > 0 && (
                                                <span className="px-2 py-0.5 bg-[#12820B] text-white text-[9px] font-black rounded-full whitespace-nowrap shrink-0">{unreadCount} {t('newNotificationsCount', lang) || 'new'}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-3 shrink-0 ml-2">
                                            {unreadCount > 0 && (
                                                <button onClick={markAllRead} className="text-[9px] font-black uppercase tracking-wider text-[#12820B] dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline transition-colors">
                                                    {t('markAllRead', lang) || 'Mark all read'}
                                                </button>
                                            )}
                                            <button onClick={() => setShowNotifications(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-gray-550 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* List */}
                                    <div className="max-h-[340px] overflow-y-auto bg-white dark:bg-[#0B1E36]">
                                        {notifications.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-[#0B1E36]">
                                                <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800/60 rounded-full flex items-center justify-center mb-3">
                                                    <Bell className="w-5 h-5 text-gray-300 dark:text-slate-600" />
                                                </div>
                                                <p className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider">{t('allCaughtUp', lang) || 'All caught up!'}</p>
                                                <p className="text-[10px] text-gray-355 dark:text-slate-600 font-bold mt-1">{t('noNotificationsNow', lang) || 'No notifications right now.'}</p>
                                            </div>
                                        ) : (
                                            notifications.map((notif, idx) => (
                                                <div
                                                    key={notif.id}
                                                    className={`flex items-start space-x-3 px-5 py-3.5 group cursor-default transition-colors border-t border-gray-100 dark:border-slate-800/40 ${
                                                        idx === 0 ? 'border-t-0' : ''
                                                    } ${
                                                        notif.unread
                                                            ? 'bg-green-500/[0.04] dark:bg-[#12820B]/[0.05]'
                                                            : 'bg-white dark:bg-[#0B1E36]'
                                                    } hover:bg-gray-50 dark:hover:bg-slate-850/40`}
                                                >
                                                    <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5 ${notif.iconBg} dark:bg-slate-800/40`}>
                                                        <notif.icon className={`w-4 h-4 ${notif.iconColor}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p className="text-[11px] font-black text-[#0F1E36] dark:text-gray-200 leading-snug" style={{ opacity: notif.unread ? 1 : 0.6 }}>
                                                                {notif.titleKey ? t(notif.titleKey, lang) : notif.title}
                                                            </p>
                                                            <button
                                                                onClick={() => dismissNotif(notif.id)}
                                                                className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-300 dark:text-slate-600 hover:text-gray-555 dark:hover:text-gray-300 transition-all shrink-0"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold mt-0.5 leading-relaxed line-clamp-2">{notif.descKey ? t(notif.descKey, lang) : notif.desc}</p>
                                                        <div className="flex items-center space-x-2 mt-1.5">
                                                            <span className="text-[9px] text-gray-400 dark:text-gray-555 font-bold uppercase tracking-wider">{formatNotificationTime(notif, lang)}</span>
                                                            {notif.unread && <span className="w-1.5 h-1.5 bg-[#12820B] rounded-full"></span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="px-5 py-3 border-t border-gray-100 dark:border-slate-800/60 bg-white dark:bg-[#0B1E36]">
                                        <button
                                            onClick={() => { setShowNotifications(false); navigateTo('alerts'); }}
                                            className="w-full flex items-center justify-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-[#12820B] dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors py-1"
                                        >
                                            <span>{t('viewAllAlertsCta', lang) || 'View all alerts'}</span>
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Profile */}
                    {currentPage !== 'operatorDashboard' && (
                        <button
                            onClick={() => navigateTo('profile')}
                            className="flex items-center space-x-3 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer select-none text-left border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
                            title={t('profile', lang) || 'Profile'}
                        >
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full border border-gray-250 dark:border-slate-700 overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#12820B]/10 to-[#0F1E36]/20 flex items-center justify-center relative">
                                {sessionStorage.getItem('userRole') === 'operator' ? (
                                    <img 
                                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80" 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-5 h-5 text-gray-400 dark:text-gray-350" />
                                )}
                            </div>

                            {/* User Details */}
                            <div className="hidden sm:block leading-tight">
                                <h4 className="text-xs font-black text-[#0F1E36] dark:text-white">
                                    {sessionStorage.getItem('userRole') === 'operator' 
                                        ? (sessionStorage.getItem('operatorName') || 'Shri Rajesh Kumar')
                                        : 'Guest Citizen'
                                    }
                                </h4>
                                <p className="text-[9px] text-[#12820B] dark:text-green-400 font-extrabold uppercase tracking-wider mt-0.5">
                                    {sessionStorage.getItem('userRole') === 'operator' ? 'Chief Controller' : 'Citizen'}
                                </p>
                            </div>

                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                    )}

                    {/* ── ADMIN DASHBOARD: Emergency + Profile ── */}
                    {currentPage === 'operatorDashboard' && (
                        <>
                            {/* Admin Emergency Icon — navigates to Safety Alerts tab */}
                            <button
                                onClick={() => onAdminEmergency && onAdminEmergency()}
                                className="relative w-10 h-10 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800/60 rounded-xl flex items-center justify-center text-red-500 dark:text-red-400 transition-colors cursor-pointer animate-pulse"
                                title="Safety Alerts"
                            >
                                <ShieldAlert className="w-5 h-5" />
                            </button>

                            {/* Admin Profile Card */}
                            <div className="flex items-center space-x-3 px-3 py-1.5 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-slate-700/50 rounded-xl">
                                {/* Avatar circle */}
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00B074]/30 to-[#0F1E36]/60 border-2 border-[#00B074]/40 flex items-center justify-center shrink-0">
                                    <User className="w-4 h-4 text-[#00B074]" />
                                </div>
                                {/* Name + role */}
                                <div className="hidden sm:block leading-tight">
                                    <p className="text-xs font-black text-[#0F1E36] dark:text-white">
                                        {sessionStorage.getItem('operatorName') || 'Vishaakhan'}
                                    </p>
                                    <p className="text-[9px] text-[#00B074] font-extrabold uppercase tracking-wider mt-0.5">
                                        Chief Controller
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Admin Login — always visible on passenger pages */}
                    {currentPage !== 'operatorDashboard' && (
                        <button
                            onClick={() => navigateTo('login')}
                            className="flex items-center space-x-2 px-4 py-2.5 bg-[#12820B] hover:bg-green-700 text-white rounded-xl text-xs font-extrabold uppercase tracking-widest shadow-md transition-all active:scale-95 shrink-0"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Admin Login</span>
                        </button>
                    )}
                </div>
            </header>
        </>
    );
}
