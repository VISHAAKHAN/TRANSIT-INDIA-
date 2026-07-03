import React, { useState, useEffect } from 'react';
import {
    Bus, Clock, AlertTriangle, Activity, MapPin, Sliders, Settings,
    Shield, ShieldAlert, Bell, User, MoreVertical, Sparkles, FileText,
    CheckCircle, TrendingUp, LogOut, Menu, ArrowRight, Search, Users,
    RefreshCw, Power, Loader2, ChevronDown, ChevronRight, ChevronLeft,
    CheckCircle2
} from 'lucide-react';
import { api } from '../api';
import { t } from '../translations';

export default function OperatorDashboard({ navigateTo, lang }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [operatorName, setOperatorName] = useState('Admin Authority');
    
    // original desk state for Coimbatore routes
    const [routes, setRoutes] = useState([]);
    const [expandedRoute, setExpandedRoute] = useState(null);
    const [routeDetail, setRouteDetail] = useState(null);
    const [busNumber, setBusNumber] = useState('');
    const [activeTrips, setActiveTrips] = useState([]);
    const [loadingRoutes, setLoadingRoutes] = useState(true);
    const [activating, setActivating] = useState(false);
    const [deactivating, setDeactivating] = useState(null);
    const [routesMessage, setRoutesMessage] = useState(null);

    const operatorId = sessionStorage.getItem('operatorId');

    useEffect(() => {
        const storedName = sessionStorage.getItem('operatorName');
        if (storedName) {
            setOperatorName(storedName);
        }
        loadRoutesData();
    }, []);

    const loadRoutesData = async () => {
        setLoadingRoutes(true);
        try {
            const [routesData, tripsData] = await Promise.all([
                api.getOperatorRoutes(),
                operatorId ? api.getActiveTrips(operatorId) : [],
            ]);
            setRoutes(Array.isArray(routesData) ? routesData : []);
            setActiveTrips(Array.isArray(tripsData) ? tripsData : []);
        } catch (e) {
            console.error(e);
        }
        setLoadingRoutes(false);
    };

    const handleRouteClick = async (routeId) => {
        if (expandedRoute === routeId) {
            setExpandedRoute(null);
            setRouteDetail(null);
            setBusNumber('');
            return;
        }
        setExpandedRoute(routeId);
        setRouteDetail(null);
        const detail = await api.getRouteDetail(routeId);
        setRouteDetail(detail);
    };

    const handleActivate = async () => {
        if (!busNumber.trim() || !expandedRoute || !operatorId) return;
        setActivating(true);
        setRoutesMessage(null);
        const result = await api.activateTrip(expandedRoute, busNumber.trim(), operatorId);
        setActivating(false);
        if (result.trip_id) {
            setRoutesMessage({ type: 'success', text: `Bus ${result.bus_number} activated on ${result.route_name}` });
            setBusNumber('');
            setExpandedRoute(null);
            setRouteDetail(null);
            // Refresh
            const trips = await api.getActiveTrips(operatorId);
            setActiveTrips(trips || []);
        } else {
            setRoutesMessage({ type: 'error', text: result.detail || 'Activation failed' });
        }
    };

    const handleDeactivate = async (tripId) => {
        setDeactivating(tripId);
        setRoutesMessage(null);
        const result = await api.deactivateTrip(tripId);
        setDeactivating(null);
        if (result.status === 'Completed') {
            setRoutesMessage({ type: 'success', text: 'Trip deactivated successfully' });
            const trips = await api.getActiveTrips(operatorId);
            setActiveTrips(trips || []);
        } else {
            setRoutesMessage({ type: 'error', text: result.detail || 'Deactivation failed' });
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigateTo('logoutSuccess');
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Activity },
        { id: 'routes', label: 'Route Management', icon: MapPin },
        { id: 'fleet', label: 'Fleet Management', icon: Bus },
        { id: 'alerts', label: 'Safety Alerts', icon: ShieldAlert, badge: 3 },
        { id: 'reports', label: 'Service Reports', icon: FileText },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#070F1E] text-[#0F1E36] dark:text-gray-100 font-sans transition-colors duration-300">
            
            {/* ── Left Sidebar (Control Center Navy Theme) ── */}
            <aside className="w-64 bg-[#020B19] text-white flex flex-col justify-between p-6 shrink-0 border-r border-white/5 z-20">
                <div className="space-y-8">
                    {/* Sidebar Header Brand */}
                    <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#00B074] to-[#008060] rounded-xl flex items-center justify-center shadow-lg font-black text-lg text-white">
                            TI
                        </div>
                        <div className="text-left">
                            <h2 className="text-sm font-black tracking-tight leading-none text-white">TRANSIT INDIA</h2>
                            <span className="text-[9px] text-[#00B074] font-black uppercase tracking-widest block mt-1">Control Center</span>
                        </div>
                    </div>

                    {/* Menu list */}
                    <nav className="space-y-1 text-left">
                        {menuItems.map((item) => {
                            const IconComp = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                        isActive
                                            ? 'bg-[#00B074]/15 text-[#00B074] border-l-4 border-[#00B074]'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <IconComp className={`w-4.5 h-4.5 ${isActive ? 'text-[#00B074]' : 'text-gray-400'}`} />
                                        <span>{item.label}</span>
                                    </div>
                                    {item.badge && (
                                        <span className="px-2 py-0.5 bg-[#FF9933] text-white text-[9px] font-black rounded-full leading-none">
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Sidebar Footer Cards */}
                <div className="space-y-6">
                    {/* System Secure Badge Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left relative overflow-hidden">
                        <div className="absolute right-2 -bottom-2 opacity-5 text-[#00B074]">
                            <Shield className="w-16 h-16" />
                        </div>
                        <div className="flex items-center space-x-2 mb-2 text-[#00B074]">
                            <div className="w-7 h-7 rounded-lg bg-[#00B074]/10 border border-[#00B074]/20 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider">System Secure</span>
                        </div>
                        <p className="text-[10px] text-gray-300 font-bold leading-tight">All systems are operational</p>
                        <p className="text-[8px] text-gray-500 font-black uppercase tracking-wider mt-1.5 flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 bg-[#00B074] rounded-full inline-block animate-ping"></span>
                            <span>Last sync: 2 mins ago</span>
                        </p>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 py-3 bg-red-650/10 hover:bg-red-650/20 border border-red-500/25 rounded-xl text-xs font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout Desk</span>
                    </button>
                </div>
            </aside>

            {/* ── Main Panel Area ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                
                {/* ── Top Header Bar ── */}
                <header className="bg-white dark:bg-[#0B1E36] border-b border-gray-150 dark:border-slate-800 px-8 py-4 flex items-center justify-between shrink-0 shadow-sm transition-colors">
                    {/* Welcome note */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl md:hidden">
                            <Menu className="w-5 h-5 text-gray-500" />
                        </button>
                        <div className="text-left">
                            <h1 className="text-lg font-black text-[#0F1E36] dark:text-white leading-tight">
                                Welcome, {operatorName}
                            </h1>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block mt-0.5">
                                Real-time overview of public transport operations
                            </p>
                        </div>
                    </div>

                    {/* Central search */}
                    <div className="hidden lg:flex items-center relative w-80">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search buses, routes, drivers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-slate-700 bg-[#FAF9F6] dark:bg-[#070F1E] rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white focus:outline-none focus:border-[#00B074]"
                        />
                    </div>

                    {/* Right profile widgets */}
                    <div className="flex items-center space-x-4">
                        {/* Bell */}
                        <div className="relative">
                            <button className="w-10 h-10 bg-gray-50 dark:bg-[#070F1E] border border-gray-150 dark:border-slate-700 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors">
                                <Bell className="w-4.5 h-4.5" />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF9933] text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0B1E36]">
                                    3
                                </span>
                            </button>
                        </div>

                        {/* Profile dropdown */}
                        <div className="flex items-center space-x-3.5 border-l border-gray-200 dark:border-slate-800 pl-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00B074] to-[#0F1E36] flex items-center justify-center text-white font-black text-sm shrink-0 border border-[#00B074]/30 shadow-inner">
                                AA
                            </div>
                            <div className="hidden sm:block text-left leading-none">
                                <p className="text-xs font-black text-[#0F1E36] dark:text-white">{operatorName}</p>
                                <span className="text-[8px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block mt-1">New Delhi Region</span>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                    </div>
                </header>

                {/* ── Sub-page contents based on active tab ── */}
                <main className="flex-grow p-8 space-y-8">
                    {activeTab === 'dashboard' && (
                        <>
                            {/* ── 1. Dashboard Metrics row ── */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Card 1: Active Buses */}
                                <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden text-left transition-all">
                                    <div className="flex items-start justify-between mb-3.5">
                                        <div>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider">Active Buses</p>
                                            <h3 className="text-3xl font-black text-[#0F1E36] dark:text-white mt-1">324</h3>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-500">
                                            <Bus className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1.5 text-[10px] font-black text-emerald-600">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        <span>↑ 5.2% vs yesterday</span>
                                    </div>
                                    {/* Sparkline overlay */}
                                    <div className="absolute bottom-0 inset-x-0 h-8 opacity-45 pointer-events-none">
                                        <svg viewBox="0 0 100 30" className="w-full h-full text-emerald-500" fill="none">
                                            <path d="M0 25 C10 20, 20 28, 30 18 C40 10, 50 25, 60 12 C70 5, 80 18, 90 8 C95 10, 100 5, 100 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Card 2: Delayed Buses */}
                                <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden text-left transition-all">
                                    <div className="flex items-start justify-between mb-3.5">
                                        <div>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider">Delayed Buses</p>
                                            <h3 className="text-3xl font-black text-[#0F1E36] dark:text-white mt-1">18</h3>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center text-amber-500">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1.5 text-[10px] font-black text-amber-600">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-ping"></span>
                                        <span>High Alert</span>
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 h-8 opacity-45 pointer-events-none">
                                        <svg viewBox="0 0 100 30" className="w-full h-full text-amber-500" fill="none">
                                            <path d="M0 10 C10 15, 20 5, 30 22 C40 28, 50 12, 60 18 C70 10, 80 25, 90 18 C95 20, 100 22, 100 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Card 3: Emergency Alerts */}
                                <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden text-left transition-all">
                                    <div className="flex items-start justify-between mb-3.5">
                                        <div>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-550 font-black uppercase tracking-wider">Emergency Alerts</p>
                                            <h3 className="text-3xl font-black text-[#0F1E36] dark:text-white mt-1">2</h3>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 flex items-center justify-center text-red-500">
                                            <ShieldAlert className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1.5 text-[10px] font-black text-red-600">
                                        <span>♦ Immediate Action</span>
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 h-8 opacity-45 pointer-events-none">
                                        <svg viewBox="0 0 100 30" className="w-full h-full text-red-500" fill="none">
                                            <path d="M0 25 C10 25, 20 20, 30 20 C40 10, 50 10, 60 18 C70 18, 80 5, 90 5 C95 10, 100 15, 100 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Card 4: Routes Active */}
                                <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between relative overflow-hidden text-left transition-all">
                                    <div className="flex items-start justify-between mb-3.5">
                                        <div>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-550 font-black uppercase tracking-wider">Routes Active</p>
                                            <h3 className="text-3xl font-black text-[#0F1E36] dark:text-white mt-1">56</h3>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-500">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1.5 text-[10px] font-black text-emerald-600">
                                        <span>✔ All Corridors Clear</span>
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 h-8 opacity-45 pointer-events-none">
                                        <svg viewBox="0 0 100 30" className="w-full h-full text-emerald-500" fill="none">
                                            <path d="M0 15 C10 12, 20 18, 30 14 C40 12, 50 10, 60 8 C70 5, 80 12, 90 6 C95 5, 100 10, 100 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* ── 2. Split view main grid ── */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left split column (65% width) */}
                                <div className="lg:col-span-2 space-y-8">
                                    
                                    {/* Fleet Overview Card */}
                                    <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-6 shadow-sm text-left">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="flex items-center space-x-2">
                                                <Bus className="w-5 h-5 text-[#00B074]" />
                                                <h3 className="text-sm font-black uppercase tracking-wider">Fleet Overview</h3>
                                            </div>
                                            <button className="text-xs font-black text-[#00B074] hover:underline flex items-center space-x-1">
                                                <span>View All</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-gray-100 dark:border-slate-800 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                                        <th className="pb-3.5">Vehicle ID</th>
                                                        <th className="pb-3.5">Route</th>
                                                        <th className="pb-3.5">Driver</th>
                                                        <th className="pb-3.5">Status</th>
                                                        <th className="pb-3.5">Last Update</th>
                                                        <th className="pb-3.5">Location</th>
                                                        <th className="pb-3.5"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50 dark:divide-slate-800/40 text-xs">
                                                    {[
                                                        { id: 'ND-8812', route: 'Outer Ring (R101)', driver: 'R. Sharma', status: 'OVERSPEEDING', statusColor: 'bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border-red-200 dark:border-red-900/40', time: '2 mins ago', loc: 'Connaught Pl.' },
                                                        { id: 'ND-4450', route: 'Connaught Pl (R204)', driver: 'A. Khan', status: 'ON TIME', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40', time: '14 mins ago', loc: 'India Gate' },
                                                        { id: 'ND-1022', route: 'Minto Rd (R402)', driver: 'S. Singh', status: 'IDLE', statusColor: 'bg-amber-50 dark:bg-amber-950/20 text-amber-650 dark:text-amber-400 border-amber-200 dark:border-amber-900/40', time: '1 min ago', loc: 'Minto Road' },
                                                        { id: 'ND-5590', route: 'Dwarka (R511)', driver: 'M. Verma', status: 'ON TIME', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40', time: '22 mins ago', loc: 'Dwarka Sec 9' },
                                                    ].map((item) => (
                                                        <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/20">
                                                            <td className="py-4 font-black flex items-center space-x-2">
                                                                <div className="w-6 h-6 rounded-lg bg-gray-50 dark:bg-[#070F1E] flex items-center justify-center shrink-0">
                                                                    <Bus className="w-3.5 h-3.5 text-gray-400" />
                                                                </div>
                                                                <span>{item.id}</span>
                                                            </td>
                                                            <td className="py-4 font-bold text-gray-550 dark:text-gray-300">{item.route}</td>
                                                            <td className="py-4 font-bold text-gray-550 dark:text-gray-300">{item.driver}</td>
                                                            <td className="py-4">
                                                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border uppercase tracking-wider ${item.statusColor}`}>
                                                                    {item.status}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 font-bold text-gray-400 dark:text-gray-500">{item.time}</td>
                                                            <td className="py-4 font-black text-gray-600 dark:text-gray-250">{item.loc}</td>
                                                            <td className="py-4">
                                                                <button className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-400">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Smooth Running status banner */}
                                    <div className="bg-emerald-50/60 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5 flex items-center justify-between text-left relative overflow-hidden">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                                                <CheckCircle2 className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-emerald-800 dark:text-emerald-400">All systems are running smoothly.</h4>
                                                <p className="text-[10px] text-emerald-600 dark:text-emerald-555 font-bold mt-0.5">Last updated at 10:24 AM, May 21, 2024</p>
                                            </div>
                                        </div>
                                        {/* Subtle city vector mockup */}
                                        <div className="hidden sm:block opacity-10 dark:opacity-20 text-[#00B074]">
                                            <svg className="w-32 h-12" viewBox="0 0 120 40" fill="currentColor">
                                                <rect x="10" y="20" width="8" height="20" />
                                                <rect x="22" y="10" width="12" height="30" />
                                                <rect x="38" y="25" width="10" height="15" />
                                                <rect x="52" y="15" width="14" height="25" />
                                                <rect x="70" y="5" width="16" height="35" />
                                                <rect x="90" y="22" width="12" height="18" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Operational Summary row */}
                                    <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-6 shadow-sm text-left">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-sm font-black uppercase tracking-wider">Operational Summary</h3>
                                            <div className="flex items-center space-x-1.5 px-3 py-1.5 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-wider text-gray-500">
                                                <span>This Week</span>
                                                <ChevronDown className="w-3 h-3" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                            {[
                                                { label: 'Total Buses', value: '540', sub: 'All Regions', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40' },
                                                { label: 'On Time', value: '412', sub: '76.3%', color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40' },
                                                { label: 'At Risk', value: '24', sub: '4.4%', color: 'text-red-600 bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/40' },
                                                { label: 'Performance', value: '92.1%', sub: 'This Week', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40' },
                                            ].map((stat, i) => (
                                                <div key={i} className="flex flex-col items-center justify-center p-4 border border-gray-100 dark:border-slate-800/80 rounded-2xl bg-gray-50/30 dark:bg-slate-900/10">
                                                    <div className={`w-12 h-12 rounded-full border flex flex-col items-center justify-center font-black text-sm mb-2.5 ${stat.color}`}>
                                                        {stat.value}
                                                    </div>
                                                    <span className="text-[10px] text-gray-455 font-black uppercase tracking-wider">{stat.label}</span>
                                                    <span className="text-[9px] text-[#00B074] font-bold mt-0.5">{stat.sub}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>

                                {/* Right split column (35% width) */}
                                <div className="space-y-8">
                                    
                                    {/* AI Predictive Insight Card */}
                                    <div className="bg-[#020B19] text-white rounded-2xl border border-white/5 p-6 shadow-xl text-left relative overflow-hidden">
                                        <div className="absolute right-2 top-2 opacity-5 text-[#FF9933]">
                                            <Sparkles className="w-20 h-20" />
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 mb-5">
                                            <Sparkles className="w-5 h-5 text-[#FF9933]" />
                                            <h3 className="text-sm font-black text-white uppercase tracking-wider">AI Predictive Insight</h3>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Alert 1 */}
                                            <div className="border-l-4 border-[#FF9933] bg-white/5 p-4 rounded-r-xl">
                                                <div className="flex items-center space-x-2 text-[#FF9933] mb-1.5">
                                                    <div className="w-6 h-6 rounded bg-[#FF9933]/15 flex items-center justify-center shrink-0">
                                                        <Clock className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Congestion Warning</span>
                                                </div>
                                                <p className="text-[11px] text-gray-300 font-bold leading-relaxed">
                                                    High traffic predicted at Connaught Place intersection between 17:30 - 18:45.
                                                </p>
                                                <p className="text-[9px] text-gray-400 font-extrabold uppercase mt-2 tracking-wide">
                                                    Suggested: Reroute 4 buses via Minto Rd
                                                </p>
                                            </div>

                                            {/* Alert 2 */}
                                            <div className="border-l-4 border-[#00B074] bg-white/5 p-4 rounded-r-xl">
                                                <div className="flex items-center space-x-2 text-[#00B074] mb-1.5">
                                                    <div className="w-6 h-6 rounded bg-[#00B074]/15 flex items-center justify-center shrink-0">
                                                        <TrendingUp className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Fuel Efficiency</span>
                                                </div>
                                                <p className="text-[11px] text-gray-300 font-bold leading-relaxed">
                                                    Optimizing idle times on Route R204 could save ₹4,200/day.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Button */}
                                        <button className="w-full mt-6 py-3.5 bg-[#F47B20] hover:bg-[#dd6914] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer transform active:scale-95">
                                            <FileText className="w-4 h-4" />
                                            <span>View Full Report</span>
                                        </button>
                                    </div>

                                    {/* Recent Safety Alerts Card */}
                                    <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-6 shadow-sm text-left">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-sm font-black uppercase tracking-wider">Recent Safety Alerts</h3>
                                            <button className="text-[10px] font-black uppercase tracking-wider text-[#00B074] hover:underline">
                                                View All
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {[
                                                { type: 'Overspeeding Detected', desc: 'ND-8812 • Outer Ring Road', time: '12 mins ago', icon: ShieldAlert, iconColor: 'text-red-500 bg-red-50 dark:bg-red-950/20' },
                                                { type: 'Hard Braking Detected', desc: 'ND-1022 • Minto Road', time: '45 mins ago', icon: AlertTriangle, iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
                                                { type: 'Overcrowding Alert', desc: 'ND-4450 • Connaught Pl', time: '1 hr ago', icon: Users, iconColor: 'text-red-500 bg-red-50 dark:bg-red-950/20' },
                                            ].map((alert, i) => (
                                                <div key={i} className="flex items-start space-x-3.5 p-3.5 rounded-xl border border-gray-100 dark:border-slate-800/80 bg-gray-50/30 dark:bg-slate-900/10">
                                                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${alert.iconColor}`}>
                                                        <alert.icon className="w-4.5 h-4.5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[11px] font-black text-[#0F1E36] dark:text-white leading-tight">
                                                            {alert.type}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 font-bold mt-0.5 block">{alert.desc}</p>
                                                        <span className="text-[8px] text-gray-500 font-black uppercase tracking-wider block mt-1.5">{alert.time}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Route Management Tab (Coimbatore service desk integration) ── */}
                    {activeTab === 'routes' && (
                        <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-8 text-left shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">
                                        Service Route Registration & Desk
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-1 uppercase tracking-widest">
                                        Activate routes, register ETM machines & monitor active services
                                    </p>
                                </div>
                                <button
                                    onClick={loadRoutesData}
                                    className="flex items-center space-x-1.5 px-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-250 dark:border-slate-800 hover:border-[#00B074] rounded-xl text-xs font-black text-gray-600 dark:text-gray-300 transition-colors shadow-sm cursor-pointer"
                                >
                                    <RefreshCw size={14} className="text-[#00B074]" />
                                    <span>Refresh Data</span>
                                </button>
                            </div>

                            {routesMessage && (
                                <div className={`mb-6 p-4 rounded-xl text-xs font-black uppercase tracking-wider border ${
                                    routesMessage.type === 'success'
                                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 text-emerald-700'
                                        : 'bg-red-50 dark:bg-red-950/20 border-red-200 text-red-700'
                                }`}>
                                    {routesMessage.text}
                                </div>
                            )}

                            {loadingRoutes ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader2 className="w-8 h-8 animate-spin text-[#00B074]" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Panel: Route List */}
                                    <div className="lg:col-span-2 space-y-4">
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center">
                                            <MapPin size={14} className="mr-1.5 text-[#FF9933]" />
                                            Active Service Routes ({routes.length})
                                        </h4>

                                        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                                            {routes.map((route) => (
                                                <div key={route.id} className="bg-gray-50/50 dark:bg-slate-900/30 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow transition-shadow">
                                                    <button
                                                        onClick={() => handleRouteClick(route.id)}
                                                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100/50 dark:hover:bg-slate-800/40 transition-colors"
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-9 h-9 rounded-xl bg-[#00B074]/10 border border-[#00B074]/20 flex items-center justify-center text-[#00B074]">
                                                                <Bus size={18} />
                                                            </div>
                                                            <div>
                                                                <p className="font-extrabold text-[#0F1E36] dark:text-white text-sm">
                                                                    {route.name}
                                                                </p>
                                                                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                                                                    {route.stop_count} Stop Stations
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {expandedRoute === route.id
                                                            ? <ChevronDown size={18} className="text-[#00B074]" />
                                                            : <ChevronRight size={18} className="text-gray-400" />
                                                        }
                                                    </button>

                                                    {expandedRoute === route.id && (
                                                        <div className="px-5 pb-5 border-t border-gray-250/60 dark:border-slate-800">
                                                            {routeDetail ? (
                                                                <div className="mt-4 mb-5 text-left">
                                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5">
                                                                        Stops Alignment
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {routeDetail.stops.map((stop, i) => (
                                                                            <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF9F6] dark:bg-[#070F1E] border border-gray-150 dark:border-slate-800 text-[#0F1E36] dark:text-gray-300">
                                                                                <span className="w-4.5 h-4.5 rounded-lg bg-[#FF9933]/15 text-[#FF9933] text-[9px] font-black flex items-center justify-center mr-1.5 border border-[#FF9933]/30">
                                                                                    {i + 1}
                                                                                </span>
                                                                                {stop.name}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="mt-4 mb-5 flex items-center text-gray-400 text-xs font-bold">
                                                                    <Loader2 className="w-4 h-4 animate-spin mr-2 text-[#00B074]" /> Loading Stops Matrix...
                                                                </div>
                                                            )}

                                                            {/* Bus number registration */}
                                                            <div className="flex items-center space-x-3 pt-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Bus Number (e.g. TN-37-AN-4421)"
                                                                    value={busNumber}
                                                                    onChange={(e) => setBusNumber(e.target.value.toUpperCase())}
                                                                    className="flex-1 px-4 py-3 bg-[#FAF9F6] dark:bg-[#070F1E] border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-black text-[#0F1E36] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00B074] transition-colors"
                                                                />
                                                                <button
                                                                    onClick={handleActivate}
                                                                    disabled={!busNumber.trim() || activating}
                                                                    className="flex items-center space-x-1.5 px-5 py-3 bg-[#00B074] hover:bg-[#009050] text-white font-extrabold rounded-xl shadow transition-all disabled:opacity-50 text-xs uppercase tracking-widest cursor-pointer"
                                                                >
                                                                    {activating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power size={14} />}
                                                                    <span>{activating ? 'Activating...' : 'Activate'}</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right Panel: Active buses */}
                                    <div className="space-y-4 text-left">
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center">
                                            <Bus size={14} className="mr-1.5 text-[#00B074]" />
                                            Active Transits ({activeTrips.length})
                                        </h4>

                                        {activeTrips.length === 0 ? (
                                            <div className="bg-gray-50/50 dark:bg-slate-900/30 rounded-xl border border-gray-200 dark:border-slate-800 p-8 text-center">
                                                <Bus size={36} className="mx-auto mb-4 text-gray-300" />
                                                <p className="text-xs font-black uppercase tracking-wider text-gray-400">No Active Telemetry Logs</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {activeTrips.map((trip) => (
                                                    <div key={trip.trip_id} className="bg-gray-50/50 dark:bg-slate-900/30 rounded-xl border border-emerald-500/20 p-4 relative overflow-hidden shadow-sm">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <div className="flex items-center space-x-2 mb-1.5">
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-black bg-emerald-600 text-white tracking-widest uppercase animate-pulse">
                                                                        RUNNING
                                                                    </span>
                                                                    <span className="text-xs font-black text-[#0F1E36] dark:text-white">
                                                                        {trip.bus_number}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs font-extrabold text-gray-600 dark:text-gray-300">{trip.route_name}</p>
                                                                <span className="text-[9px] text-gray-400 font-bold block mt-1">Operator ID: {trip.operator_id}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeactivate(trip.trip_id)}
                                                                disabled={deactivating === trip.trip_id}
                                                                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl border border-red-100 transition-colors cursor-pointer"
                                                                title="Deactivate Trip"
                                                            >
                                                                {deactivating === trip.trip_id ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <Power size={14} />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Placeholder tabs */}
                    {['fleet', 'alerts', 'reports', 'analytics', 'settings'].includes(activeTab) && (
                        <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-12 text-center shadow-sm">
                            <Activity className="w-12 h-12 text-[#00B074] mx-auto mb-4 animate-pulse" />
                            <h3 className="text-base font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">{activeTab} Control Section</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-1 uppercase tracking-widest">
                                Integration update scheduled under national transit management protocol
                            </p>
                        </div>
                    )}
                </main>

                {/* ── Footer row ── */}
                <footer className="bg-white dark:bg-[#0B1E36] border-t border-gray-150 dark:border-slate-800 py-4 px-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 font-bold shrink-0 transition-colors">
                    <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
                        <Shield className="w-3.5 h-3.5" />
                        <span className="uppercase tracking-wider">Secure Network Connection</span>
                    </div>
                    <div>
                        © 2024 Ministry of Transport, India
                    </div>
                    <div className="flex items-center space-x-6">
                        <a href="#" className="hover:underline">Privacy Policy</a>
                        <a href="#" className="hover:underline">Terms of Use</a>
                        <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                            <span>System Status: Operational</span>
                        </div>
                    </div>
                </footer>

            </div>
        </div>
    );
}
