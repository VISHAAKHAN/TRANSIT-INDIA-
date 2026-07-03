import React, { useState } from 'react';
import {
    Bell, AlertCircle, CheckCircle, Info, Bus, AlertTriangle,
    ArrowLeft, Filter, ChevronDown, Clock, MapPin, Zap,
    ShieldAlert, RefreshCw, Megaphone, X, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '../translations';

const allAlerts = [
    {
        id: 1,
        type: 'diversion',
        severity: 'warning',
        title: 'Route Diversion — Anna Salai',
        titleKey: 'diverstionAnnaSalaiTitle',
        desc: 'Road construction works ahead. Buses rerouted via Mount Road and Greams Road until further notice.',
        descKey: 'diverstionAnnaSalaiDesc',
        route: '12C, 27B',
        time: '10 mins ago',
        timeKey: 'minsAgo',
        timeVal: '10',
        icon: AlertCircle,
        color: 'orange',
        bgCard: 'bg-orange-50/60 dark:bg-orange-950/10',
        border: 'border-orange-200 dark:border-orange-900/30',
        iconColor: 'text-orange-500',
        badgeBg: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
        dotColor: 'bg-orange-500',
        category: 'diversion',
    },
    {
        id: 2,
        type: 'normal',
        severity: 'success',
        title: 'Route 1C — On Schedule',
        titleKey: 'route1CNormalTitle',
        desc: 'All buses running on standard timetable with normal frequencies. No disruptions reported.',
        descKey: 'route1CNormalDesc',
        route: '1C',
        time: '15 mins ago',
        timeKey: 'minsAgo',
        timeVal: '15',
        icon: CheckCircle,
        color: 'green',
        bgCard: 'bg-emerald-50/60 dark:bg-emerald-950/10',
        border: 'border-emerald-200 dark:border-emerald-900/30',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        badgeBg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
        dotColor: 'bg-emerald-500',
        category: 'service',
    },
    {
        id: 3,
        type: 'delay',
        severity: 'info',
        title: 'Route 5E — 8 min Delay',
        titleKey: 'route5EDelayTitle',
        desc: 'Traffic congestion near Central Junction causing an 8-minute delay. Alternate route via OMR advised.',
        descKey: 'route5EDelayDesc',
        route: '5E',
        time: '25 mins ago',
        timeKey: 'minsAgo',
        timeVal: '25',
        icon: Clock,
        color: 'blue',
        bgCard: 'bg-blue-50/60 dark:bg-blue-950/10',
        border: 'border-blue-200 dark:border-blue-900/30',
        iconColor: 'text-blue-500',
        badgeBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        dotColor: 'bg-blue-500',
        category: 'delay',
    },
    {
        id: 4,
        type: 'new-route',
        severity: 'info',
        title: 'New Express Route 12X Launched',
        titleKey: 'newExpress12XTitle',
        desc: 'New express bus 12X operational from Central Junction. Reduced travel time by 35% on the corridor.',
        descKey: 'newExpress12XDesc',
        route: '12X',
        time: '1 hour ago',
        timeKey: 'hourAgo',
        timeVal: '1',
        icon: Bus,
        color: 'purple',
        bgCard: 'bg-purple-50/60 dark:bg-purple-950/10',
        border: 'border-purple-200 dark:border-purple-900/30',
        iconColor: 'text-purple-500',
        badgeBg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
        dotColor: 'bg-purple-500',
        category: 'service',
    },
    {
        id: 5,
        type: 'diversion',
        severity: 'warning',
        title: 'T. Nagar Flyover Closure',
        titleKey: null,
        desc: 'Flyover closed for inspection. Buses on routes 15A, 15B, 15C diverted via South Usman Road.',
        descKey: null,
        route: '15A, 15B, 15C',
        time: '2 hours ago',
        timeKey: null,
        timeVal: '2',
        icon: AlertTriangle,
        color: 'orange',
        bgCard: 'bg-orange-50/60 dark:bg-orange-950/10',
        border: 'border-orange-200 dark:border-orange-900/30',
        iconColor: 'text-orange-500',
        badgeBg: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
        dotColor: 'bg-orange-500',
        category: 'diversion',
    },
    {
        id: 6,
        type: 'delay',
        severity: 'warning',
        title: 'Route 500A — Major Delay 18 min',
        titleKey: null,
        desc: 'Accident near Koyambedu junction causing significant traffic backup. Expect extended wait times.',
        descKey: null,
        route: '500A',
        time: '3 hours ago',
        timeKey: null,
        timeVal: '3',
        icon: AlertCircle,
        color: 'red',
        bgCard: 'bg-red-50/60 dark:bg-red-950/10',
        border: 'border-red-200 dark:border-red-900/30',
        iconColor: 'text-red-500',
        badgeBg: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
        dotColor: 'bg-red-500',
        category: 'delay',
    },
    {
        id: 7,
        type: 'normal',
        severity: 'success',
        title: 'Route 21C — Resumed Normal Service',
        titleKey: null,
        desc: 'Earlier diversion lifted. Route 21C has resumed its normal path through Adyar and Besant Nagar.',
        descKey: null,
        route: '21C',
        time: '4 hours ago',
        timeKey: null,
        timeVal: '4',
        icon: CheckCircle,
        color: 'green',
        bgCard: 'bg-emerald-50/60 dark:bg-emerald-950/10',
        border: 'border-emerald-200 dark:border-emerald-900/30',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        badgeBg: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
        dotColor: 'bg-emerald-500',
        category: 'service',
    },
    {
        id: 8,
        type: 'system',
        severity: 'info',
        title: 'GPS Sync Updated — All Zones',
        titleKey: null,
        desc: 'Real-time GPS telemetry refresh completed for Central, North, and South zones. ETA accuracy improved.',
        descKey: null,
        route: 'System',
        time: '5 hours ago',
        timeKey: null,
        timeVal: '5',
        icon: Zap,
        color: 'blue',
        bgCard: 'bg-blue-50/60 dark:bg-blue-950/10',
        border: 'border-blue-200 dark:border-blue-900/30',
        iconColor: 'text-blue-500',
        badgeBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        dotColor: 'bg-blue-500',
        category: 'system',
    },
];

const CATEGORIES = ['all', 'delay', 'diversion', 'service', 'system'];

const categoryLabel = (cat) => {
    const map = { all: 'All', delay: 'Delays', diversion: 'Diversions', service: 'Service', system: 'System' };
    return map[cat] || cat;
};

export default function AlertsPage({ navigateTo, lang }) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);
    const [dismissed, setDismissed] = useState([]);

    const filtered = allAlerts.filter(a =>
        !dismissed.includes(a.id) &&
        (activeFilter === 'all' || a.category === activeFilter)
    );

    const stats = {
        total: allAlerts.filter(a => !dismissed.includes(a.id)).length,
        delays: allAlerts.filter(a => !dismissed.includes(a.id) && a.category === 'delay').length,
        diversions: allAlerts.filter(a => !dismissed.includes(a.id) && a.category === 'diversion').length,
        service: allAlerts.filter(a => !dismissed.includes(a.id) && a.category === 'service').length,
    };

    return (
        <div className="max-w-5xl mx-auto w-full pb-16 pt-4 px-0 sm:px-2 transition-colors duration-300">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <div className="flex items-center space-x-3 mb-3">
                        <button
                            onClick={() => navigateTo('track')}
                            className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-[#0F1E36] dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back</span>
                        </button>
                    </div>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="inline-flex items-center space-x-2 bg-red-50 dark:bg-red-950/20 px-3 py-1 rounded-full border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-extrabold text-[10px] uppercase tracking-widest">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                            <span>Live Feed</span>
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-[#0F1E36] dark:text-white tracking-tight mb-1">
                        Updates & Alerts
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
                        Real-time transit alerts, diversions, and service updates across all routes.
                    </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                    <button
                        onClick={() => setDismissed([])}
                        className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest bg-white dark:bg-[#0B1E36] border border-gray-200 dark:border-slate-800 px-3 py-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-[#0F1E36] dark:hover:text-white transition-colors shadow-sm"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Refresh</span>
                    </button>
                    <div className="bg-[#FF9933] text-white text-xs font-black px-3 py-2 rounded-xl shadow-sm flex items-center space-x-1.5">
                        <Bell className="w-3.5 h-3.5" />
                        <span>{stats.total} Active</span>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                    { label: 'Total Alerts', value: stats.total, color: 'text-[#0F1E36] dark:text-white', icon: Bell, bg: 'bg-gray-50 dark:bg-[#0B1E36]', border: 'border-gray-200 dark:border-slate-800' },
                    { label: 'Delays', value: stats.delays, color: 'text-blue-600 dark:text-blue-400', icon: Clock, bg: 'bg-blue-50/60 dark:bg-blue-950/10', border: 'border-blue-200 dark:border-blue-900/30' },
                    { label: 'Diversions', value: stats.diversions, color: 'text-orange-600 dark:text-orange-400', icon: AlertTriangle, bg: 'bg-orange-50/60 dark:bg-orange-950/10', border: 'border-orange-200 dark:border-orange-900/30' },
                    { label: 'Service Updates', value: stats.service, color: 'text-emerald-600 dark:text-emerald-400', icon: TrendingUp, bg: 'bg-emerald-50/60 dark:bg-emerald-950/10', border: 'border-emerald-200 dark:border-emerald-900/30' },
                ].map((s) => (
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 flex items-center space-x-3`}>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.bg} border ${s.border}`}>
                            <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                        </div>
                        <div>
                            <span className={`text-2xl font-black block leading-none ${s.color}`}>{s.value}</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 block mt-0.5">{s.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
                <Filter className="w-4 h-4 text-gray-400 shrink-0" />
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0 transition-all ${
                            activeFilter === cat
                                ? 'bg-[#0F1E36] dark:bg-white text-white dark:text-[#0F1E36] shadow-md'
                                : 'bg-white dark:bg-[#0B1E36] border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-slate-600'
                        }`}
                    >
                        {categoryLabel(cat)}
                        {cat !== 'all' && (
                            <span className="ml-1.5 opacity-60">
                                ({allAlerts.filter(a => !dismissed.includes(a.id) && a.category === cat).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {filtered.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-[#0B1E36] border border-gray-200 dark:border-slate-800 rounded-3xl p-12 flex flex-col items-center text-center"
                        >
                            <div className="w-16 h-16 bg-gray-50 dark:bg-slate-850 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-slate-800">
                                <Bell className="w-7 h-7 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-black text-[#0F1E36] dark:text-white mb-2">No Alerts</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">All clear! No active alerts in this category.</p>
                        </motion.div>
                    )}

                    {filtered.map((alert, idx) => {
                        const isExpanded = expandedId === alert.id;
                        const titleText = alert.title;
                        const descText = alert.desc;

                        return (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                                transition={{ delay: idx * 0.04 }}
                                className={`${alert.bgCard} border ${alert.border} rounded-2xl overflow-hidden transition-all duration-200`}
                            >
                                <div className="p-4 sm:p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        {/* Left: Icon + Content */}
                                        <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                                            {/* Dot indicator */}
                                            <div className="relative shrink-0 mt-1">
                                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white dark:bg-[#0B1E36] border border-gray-150 dark:border-slate-800 shadow-sm`}>
                                                    <alert.icon className={`w-4.5 h-4.5 ${alert.iconColor}`} />
                                                </div>
                                                <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 ${alert.dotColor} rounded-full border-2 border-white dark:border-[#0B1E36]`}></span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center flex-wrap gap-2 mb-1">
                                                    <h4 className="text-sm font-black text-[#0F1E36] dark:text-white leading-tight">{titleText}</h4>
                                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${alert.badgeBg} shrink-0`}>
                                                        {alert.category}
                                                    </span>
                                                </div>

                                                <p className={`text-[11px] text-gray-600 dark:text-gray-400 font-bold leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                                                    {descText}
                                                </p>

                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        className="mt-3 pt-3 border-t border-gray-200/60 dark:border-slate-800/60 flex flex-wrap gap-3"
                                                    >
                                                        <div className="flex items-center space-x-1.5 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            <Bus className="w-3.5 h-3.5" />
                                                            <span>Route: {alert.route}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1.5 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span>{alert.time}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1.5 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            <MapPin className="w-3.5 h-3.5" />
                                                            <span>Chennai Metro Region</span>
                                                        </div>
                                                    </motion.div>
                                                )}

                                                <div className="flex items-center space-x-3 mt-2">
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{alert.time}</span>
                                                    <span className="w-1 h-1 bg-gray-300 dark:bg-slate-700 rounded-full"></span>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Route {alert.route}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col items-end space-y-2 shrink-0">
                                            <button
                                                onClick={() => setDismissed(d => [...d, alert.id])}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
                                                title="Dismiss"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
                                                title={isExpanded ? 'Collapse' : 'Expand'}
                                            >
                                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Footer info */}
            <div className="mt-8 bg-[#0B1B2D] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Megaphone className="w-4.5 h-4.5 text-[#FF9933]" />
                    </div>
                    <div>
                        <span className="text-xs font-black text-white block">Subscribe to Route Alerts</span>
                        <span className="text-[10px] text-gray-400 font-bold">Get SMS notifications for your routes</span>
                    </div>
                </div>
                <button
                    onClick={() => navigateTo('profile')}
                    className="px-4 py-2.5 bg-[#FF9933] hover:bg-orange-600 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 shrink-0"
                >
                    Manage in Profile →
                </button>
            </div>
        </div>
    );
}
