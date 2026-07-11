import React, { useState, useEffect } from 'react';
import {
    Bus, Clock, AlertTriangle, Activity, MapPin, Sliders, Settings,
    Shield, ShieldAlert, Bell, User, MoreVertical, Sparkles, FileText,
    CheckCircle, TrendingUp, LogOut, Menu, ArrowRight, Search, Users,
    RefreshCw, Power, Loader2, ChevronDown, ChevronRight, ChevronLeft,
    CheckCircle2, X, Sun, Moon, Globe, Download, Filter, Eye, Plus, Zap,
    Flag, Home, Calendar, ShieldCheck, Wind, Cpu, Phone
} from 'lucide-react';
import { api } from '../api';
import { t } from '../translations';
import TopHeader from './TopHeader';
import Footer from './Footer';

export default function OperatorDashboard({ navigateTo, lang, setLang, region, isDarkMode, setIsDarkMode }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [operatorName, setOperatorName] = useState('Vishaakhan');
    
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
    const [filterRouteNo, setFilterRouteNo] = useState('');
    const [filterBoarding, setFilterBoarding] = useState('');
    const [filterDestination, setFilterDestination] = useState('');
    const [filterDepot, setFilterDepot] = useState('');
    const [filterSearchQuery, setFilterSearchQuery] = useState('');
    const [searchFiltersTriggered, setSearchFiltersTriggered] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assignRouteId, setAssignRouteId] = useState('');
    const [assignBusNo, setAssignBusNo] = useState('');
    
    // Fleet Management States
    const [fleetSubPage, setFleetSubPage] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedBus, setSelectedBus] = useState(null);
    const [searchBusNo, setSearchBusNo] = useState('');
    const [searchRegNo, setSearchRegNo] = useState('');
    const [searchBusType, setSearchBusType] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [searchRoute, setSearchRoute] = useState('');
    const [searchDriver, setSearchDriver] = useState('');
    // Bus Details Modal states
    const [selectedBusForDetails, setSelectedBusForDetails] = useState(null);
    const [showBreakdownConfirm, setShowBreakdownConfirm] = useState(false);
    const [showBreakdownSuccess, setShowBreakdownSuccess] = useState(false);
    const [searchDepot, setSearchDepot] = useState('');
    const [searchFuelType, setSearchFuelType] = useState('');
    const [searchCondition, setSearchCondition] = useState('');
    const [searchETMStatus, setSearchETMStatus] = useState('');
    const [fleetSearchTriggered, setFleetSearchTriggered] = useState(false);
    
    // Quick action modals
    const [showRegisterBusModal, setShowRegisterBusModal] = useState(false);
    const [showBreakdownModal, setShowBreakdownModal] = useState(false);
    
    // Form fields for new bus registration
    const [newBusNo, setNewBusNo] = useState('');
    const [newBusReg, setNewBusReg] = useState('');
    const [newBusModel, setNewBusModel] = useState('');
    const [newBusType, setNewBusType] = useState('AC Low Floor');
    const [newBusDepot, setNewBusDepot] = useState('Central Metro Depot');
    
    // Breakdown workflow states
    const [breakdownBusNo, setBreakdownBusNo] = useState('');
    const [breakdownIssue, setBreakdownIssue] = useState('Engine');
    const [breakdownWorkshop, setBreakdownWorkshop] = useState('Hosur Road Workshop');
    const [breakdownReplacement, setBreakdownReplacement] = useState('');
    const [incidents, setIncidents] = useState([
        { id: '#TR-89241', route: '500A', type: 'Rash Driving', icon: AlertTriangle, iconColor: 'text-red-500 bg-red-50 dark:bg-red-950/20', time: '24 Oct 2023, 02:22 PM', status: 'Pending', statusColor: 'bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border-red-200 dark:border-red-900/40' },
        { id: '#TR-89239', route: 'DL-2C', type: 'Overcrowding', icon: Users, iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20', time: '24 Oct 2023, 12:45 PM', status: 'Under Review', statusColor: 'bg-amber-50 dark:bg-amber-950/20 text-amber-650 dark:text-amber-400 border-amber-200 dark:border-amber-900/40' },
        { id: '#TR-89235', route: '413', type: 'Cleanliness', icon: Sparkles, iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20', time: '24 Oct 2023, 10:10 AM', status: 'Resolved', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' },
        { id: '#TR-89232', route: '966', type: 'Misconduct', icon: User, iconColor: 'text-red-500 bg-red-50 dark:bg-red-950/20', time: '24 Oct 2023, 09:30 AM', status: 'Pending', statusColor: 'bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border-red-200 dark:border-red-900/40' },
        { id: '#TR-89228', route: '522', type: 'Cleanliness', icon: Sparkles, iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20', time: '23 Oct 2023, 09:15 PM', status: 'Resolved', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' },
        { id: '#TR-89225', route: '1C', type: 'Late Arrival', icon: Clock, iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20', time: '23 Oct 2023, 05:40 PM', status: 'Resolved', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' },
        { id: '#TR-89221', route: '34', type: 'AC Malfunction', icon: Wind || Cpu, iconColor: 'text-red-500 bg-red-50 dark:bg-red-950/20', time: '23 Oct 2023, 03:10 PM', status: 'Under Review', statusColor: 'bg-amber-50 dark:bg-amber-950/20 text-amber-650 dark:text-amber-400 border-amber-200 dark:border-amber-900/40' },
        { id: '#TR-89218', route: '10', type: 'Seat Damage', icon: AlertTriangle, iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20', time: '23 Oct 2023, 01:25 PM', status: 'Resolved', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' },
        { id: '#TR-89214', route: '21G', type: 'ETM Issue', icon: Cpu, iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20', time: '23 Oct 2023, 11:00 AM', status: 'Resolved', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' },
        { id: '#TR-89210', route: '1A', type: 'Rash Driving', icon: AlertTriangle, iconColor: 'text-red-500 bg-red-50 dark:bg-red-950/20', time: '23 Oct 2023, 09:42 AM', status: 'Pending', statusColor: 'bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border-red-200 dark:border-red-900/40' },
        { id: '#TR-89205', route: '5', type: 'Overcrowding', icon: Users, iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20', time: '22 Oct 2023, 06:15 PM', status: 'Resolved', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' },
        { id: '#TR-89201', route: '11G', type: 'Cleanliness', icon: Sparkles, iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20', time: '22 Oct 2023, 04:30 PM', status: 'Resolved', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' },
        { id: '#TR-89198', route: '47D', type: 'Misconduct', icon: User, iconColor: 'text-red-500 bg-red-50 dark:bg-red-950/20', time: '22 Oct 2023, 02:20 PM', status: 'Pending', statusColor: 'bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border-red-200 dark:border-red-900/40' },
        { id: '#TR-89195', route: 'KL-2', type: 'Late Arrival', icon: Clock, iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20', time: '22 Oct 2023, 11:15 AM', status: 'Resolved', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' },
        { id: '#TR-89190', route: 'KL-3', type: 'ETM Issue', icon: Cpu, iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20', time: '22 Oct 2023, 09:05 AM', status: 'Resolved', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' },
        { id: '#TR-89185', route: '500C', type: 'AC Malfunction', icon: Wind || Cpu, iconColor: 'text-red-500 bg-red-50 dark:bg-red-950/20', time: '21 Oct 2023, 08:30 PM', status: 'Pending', statusColor: 'bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border-red-200 dark:border-red-900/40' },
        { id: '#TR-89180', route: '12', type: 'Seat Damage', icon: AlertTriangle, iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20', time: '21 Oct 2023, 06:12 PM', status: 'Resolved', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' },
        { id: '#TR-89175', route: 'Swift Spl', type: 'Overcrowding', icon: Users, iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20', time: '21 Oct 2023, 04:00 PM', status: 'Under Review', statusColor: 'bg-amber-50 dark:bg-amber-950/20 text-amber-650 dark:text-amber-400 border-amber-200 dark:border-amber-900/40' },
        { id: '#TR-89170', route: '102', type: 'Rash Driving', icon: AlertTriangle, iconColor: 'text-red-500 bg-red-50 dark:bg-red-950/20', time: '21 Oct 2023, 01:45 PM', status: 'Pending', statusColor: 'bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border-red-200 dark:border-red-900/40' },
        { id: '#TR-89165', route: '70', type: 'Cleanliness', icon: Sparkles, iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20', time: '21 Oct 2023, 11:20 AM', status: 'Resolved', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' },
        { id: '#TR-89160', route: '15', type: 'Misconduct', icon: User, iconColor: 'text-red-500 bg-red-50 dark:bg-red-950/20', time: '21 Oct 2023, 09:10 AM', status: 'Under Review', statusColor: 'bg-amber-50 dark:bg-amber-950/20 text-amber-650 dark:text-amber-400 border-amber-200 dark:border-amber-900/40' },
        { id: '#TR-89155', route: '570', type: 'Late Arrival', icon: Clock, iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20', time: '20 Oct 2023, 05:55 PM', status: 'Resolved', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' },
        { id: '#TR-89150', route: 'S1', type: 'ETM Issue', icon: Cpu, iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20', time: '20 Oct 2023, 03:22 PM', status: 'Resolved', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' },
        { id: '#TR-89145', route: '11', type: 'AC Malfunction', icon: Wind || Cpu, iconColor: 'text-red-500 bg-red-50 dark:bg-red-950/20', time: '20 Oct 2023, 01:15 PM', status: 'Pending', statusColor: 'bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 border-red-200 dark:border-red-900/40' },
        { id: '#TR-89140', route: '18A', type: 'Overcrowding', icon: Users, iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20', time: '20 Oct 2023, 10:45 AM', status: 'Resolved', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40' }
    ]);

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

    const handleActivateRouteDirectly = async (routeId, busNo) => {
        if (!busNo.trim() || !routeId || !operatorId) return;
        setActivating(true);
        setRoutesMessage(null);
        const result = await api.activateTrip(routeId, busNo.trim(), operatorId);
        setActivating(false);
        if (result.trip_id) {
            setRoutesMessage({ type: 'success', text: `Bus ${result.bus_number} activated on ${result.route_name}` });
            // Refresh
            const trips = await api.getActiveTrips(operatorId);
            setActiveTrips(trips || []);
            setShowAssignModal(false);
            setAssignBusNo('');
            setAssignRouteId('');
        } else {
            setRoutesMessage({ type: 'error', text: result.detail || 'Activation failed' });
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
            
            {/* Backdrop overlay */}
            {isMobileSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-[#070F1E]/60 backdrop-blur-sm z-40 transition-opacity duration-300"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* ── Left Sidebar (Control Center Navy Theme) ── */}
            <aside className={`fixed top-0 bottom-0 left-0 w-64 bg-[#020B19] text-white flex flex-col justify-between p-6 shrink-0 border-r border-white/5 z-50 transition-transform duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="space-y-8">
                    {/* Sidebar Header Brand */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3.5 text-left">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#00B074] to-[#008060] rounded-xl flex items-center justify-center shadow-lg font-black text-lg text-white shrink-0">
                                TI
                            </div>
                            <div>
                                <h2 className="text-sm font-black tracking-tight leading-none text-white">TRANSIT INDIA</h2>
                                <span className="text-[9px] text-[#00B074] font-black uppercase tracking-widest block mt-1">Control Center</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
                            title="Close Sidebar"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Menu list */}
                    <nav className="space-y-1 text-left">
                        {menuItems.map((item) => {
                            const IconComp = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setIsMobileSidebarOpen(false);
                                    }}
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

                    {/* Theme & Language Controls */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 text-left space-y-3.5">
                        {/* Language Select */}
                        <div className="flex items-center justify-between text-xs text-gray-300">
                            <div className="flex items-center space-x-2">
                                <Globe size={14} className="text-gray-400" />
                                <span className="font-extrabold uppercase tracking-wider">{t('language', lang)}</span>
                            </div>
                            <select
                                value={lang}
                                onChange={(e) => setLang(e.target.value)}
                                className="bg-transparent border-0 text-white font-extrabold text-xs focus:ring-0 outline-none cursor-pointer p-0 select-none animate-none"
                            >
                                <option value="English" className="bg-[#020B19]">EN</option>
                                <option value="Hindi" className="bg-[#020B19]">हिन्दी</option>
                                <option value="Tamil" className="bg-[#020B19]">தமிழ்</option>
                                <option value="Malayalam" className="bg-[#020B19]">മലയാളം</option>
                            </select>
                        </div>

                        {/* Dark Mode toggle switch */}
                        <div className="flex items-center justify-between text-xs text-gray-300 border-t border-white/5 pt-3">
                            <div className="flex items-center space-x-2">
                                {isDarkMode ? <Moon size={14} className="text-yellow-450" /> : <Sun size={14} className="text-orange-400" />}
                                <span className="font-extrabold uppercase tracking-wider">{isDarkMode ? t('darkMode', lang) : t('lightMode', lang)}</span>
                            </div>
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${isDarkMode ? 'bg-[#00B074]' : 'bg-gray-600'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${isDarkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
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
                <TopHeader 
                    navigateTo={navigateTo} 
                    lang={lang} 
                    toggleSidebar={() => setIsMobileSidebarOpen(prev => !prev)} 
                    currentPage="operatorDashboard"
                    region={region}
                    onAdminEmergency={() => setActiveTab('alerts')}
                />

                {/* ── Sub-page contents based on active tab ── */}
                <main className="flex-grow p-8 space-y-8">
                    {activeTab === 'dashboard' && (
                        <>
                            {/* Welcome Banner */}
                            <div className="text-left bg-gradient-to-r from-[#00B074]/15 via-[#00B074]/5 to-transparent p-6 rounded-2xl border border-[#00B074]/20 shadow-sm mb-2">
                                <h1 className="text-xl font-black text-[#0F1E36] dark:text-white leading-tight">
                                    Welcome, {operatorName}
                                </h1>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-extrabold uppercase tracking-wider block mt-1">
                                    Real-time overview of public transport operations
                                </p>
                            </div>

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
                                            <img 
                                                src="/login_hero.png" 
                                                alt="Bus Stop Illustration" 
                                                className="w-16 h-12 object-contain shrink-0 filter dark:brightness-95" 
                                            />
                                            <div>
                                                <h4 className="text-sm font-black text-emerald-800 dark:text-emerald-400">All systems are running smoothly.</h4>
                                                <p className="text-[10px] text-emerald-600 dark:text-emerald-555 font-bold mt-0.5">Last updated at 10:24 AM, May 21, 2024</p>
                                            </div>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shrink-0 z-10">
                                            <CheckCircle2 className="w-6 h-6" />
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

                    {/* ── Route Management Tab ── */}
                    {activeTab === 'routes' && (
                        <div className="space-y-6">
                            
                            {/* Breadcrumb & Title strip */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between text-left pb-4 border-b border-gray-150 dark:border-slate-800">
                                <div>
                                    <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">
                                        <span>Control Center</span>
                                        <span>/</span>
                                        <span className="text-[#FF9933]">Route Management</span>
                                    </div>
                                    <h2 className="text-2xl font-black text-[#0F1E36] dark:text-white uppercase tracking-wider leading-none">
                                        Route & Bus Assignment
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-1.5 uppercase tracking-widest">
                                        Design and assign routes, buses and depots efficiently.
                                    </p>
                                </div>
                                <button
                                    onClick={loadRoutesData}
                                    className="mt-4 md:mt-0 flex items-center space-x-1.5 px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-250 dark:border-slate-800 hover:border-[#FF9933] rounded-xl text-xs font-black text-gray-600 dark:text-gray-300 transition-colors shadow-sm cursor-pointer"
                                >
                                    <RefreshCw size={14} className="text-[#FF9933]" />
                                    <span>Refresh Services</span>
                                </button>
                            </div>

                            {/* Status message */}
                            {routesMessage && (
                                <div className={`p-4 rounded-xl text-xs font-black uppercase tracking-wider border text-left ${
                                    routesMessage.type === 'success'
                                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250 text-emerald-700 dark:text-emerald-400'
                                        : 'bg-red-50 dark:bg-red-950/20 border-red-250 text-red-700 dark:text-red-400'
                                }`}>
                                    {routesMessage.text}
                                </div>
                            )}

                            {/* Top Metrics Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                                {/* Card 1: Active Routes */}
                                <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden h-[135px]">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-550 font-black uppercase tracking-wider">Active Routes</p>
                                            <h3 className="text-3xl font-black text-[#0F1E36] dark:text-white mt-1">56</h3>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                            <MapPin size={18} />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">All corridors clear</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-8 opacity-40">
                                        <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                                            <path d="M0 30 Q30 15, 60 25 T120 10 T180 20 T200 15" fill="none" stroke="#10B981" strokeWidth="2" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Card 2: Buses On Route */}
                                <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden h-[135px]">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-550 font-black uppercase tracking-wider">Buses On Route</p>
                                            <h3 className="text-3xl font-black text-[#0F1E36] dark:text-white mt-1">324</h3>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-[#FF9933]/10 text-[#FF9933] flex items-center justify-center">
                                            <Clock size={18} />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto font-bold">
                                        <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">12 delayed</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-8 opacity-40">
                                        <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                                            <path d="M0 25 Q30 35, 60 20 T120 30 T180 15 T200 25" fill="none" stroke="#F59E0B" strokeWidth="2" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Card 3: Alerts */}
                                <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden h-[135px]">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-550 font-black uppercase tracking-wider">Alerts</p>
                                            <h3 className="text-3xl font-black text-[#0F1E36] dark:text-white mt-1">2</h3>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center animate-pulse">
                                            <AlertTriangle size={18} />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">Immediate action</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-8 opacity-40">
                                        <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                                            <path d="M0 20 Q30 10, 60 30 T120 15 T180 25 T200 10" fill="none" stroke="#EF4444" strokeWidth="2" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Card 4: Depots */}
                                <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden h-[135px]">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-555 font-black uppercase tracking-wider">Depots</p>
                                            <h3 className="text-3xl font-black text-[#0F1E36] dark:text-white mt-1">18</h3>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                            <Home size={18} />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Across network</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-8 opacity-40">
                                        <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                                            <path d="M0 35 Q30 25, 60 30 T120 20 T180 30 T200 20" fill="none" stroke="#3B82F6" strokeWidth="2" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Split layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                                
                                {/* Left main column */}
                                <div className="lg:col-span-2 space-y-6">
                                    
                                    {/* Configure Route Form Card */}
                                    <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-6 text-left shadow-sm">
                                        <div className="flex items-center space-x-2 mb-5">
                                            <div className="w-7 h-7 rounded-lg bg-[#FF9933]/15 text-[#FF9933] flex items-center justify-center">
                                                <Settings size={15} />
                                            </div>
                                            <h3 className="text-sm font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">Configure Route</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-[9px] font-black text-gray-400 dark:text-gray-550 uppercase tracking-widest mb-1.5">Route Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. 502-EXT"
                                                    value={filterRouteNo}
                                                    onChange={(e) => setFilterRouteNo(e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF9933]"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-black text-gray-400 dark:text-gray-550 uppercase tracking-widest mb-1.5">Start Stop (Boarding Point)</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Majestic Central"
                                                        value={filterBoarding}
                                                        onChange={(e) => setFilterBoarding(e.target.value)}
                                                        className="w-full pl-3 pr-8 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF9933]"
                                                    />
                                                    <MapPin size={13} className="text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest mb-1.5">End Point (Destination)</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="International Airport"
                                                        value={filterDestination}
                                                        onChange={(e) => setFilterDestination(e.target.value)}
                                                        className="w-full pl-3 pr-8 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF9933]"
                                                    />
                                                    <Flag size={13} className="text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <label className="block text-[9px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest mb-1.5">Assigned Depot</label>
                                                <div className="relative">
                                                    <select
                                                        value={filterDepot}
                                                        onChange={(e) => setFilterDepot(e.target.value)}
                                                        className="w-full pl-8 pr-10 py-2 bg-gray-55 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white appearance-none cursor-pointer focus:outline-none focus:border-[#FF9933]"
                                                    >
                                                        <option value="">Select Depot...</option>
                                                        <option value="Central Metro Depot">Central Metro Depot</option>
                                                        <option value="Hosur Road Depot">Hosur Road Depot</option>
                                                        <option value="Majestic Depot">Majestic Depot</option>
                                                        <option value="Gandhipuram Depot">Gandhipuram Depot</option>
                                                    </select>
                                                    <Home size={13} className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                    <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-gray-400">
                                                        <ChevronDown size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-black text-gray-400 dark:text-gray-550 uppercase tracking-widest mb-1.5">Quick Search</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        placeholder="Search by Route Number or ID..."
                                                        value={filterSearchQuery}
                                                        onChange={(e) => setFilterSearchQuery(e.target.value)}
                                                        className="w-full pl-8 pr-3 py-2 bg-gray-55 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF9933]"
                                                    />
                                                    <Search size={13} className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end space-x-3 mt-5">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFilterRouteNo('');
                                                    setFilterBoarding('');
                                                    setFilterDestination('');
                                                    setFilterDepot('');
                                                    setFilterSearchQuery('');
                                                    setSearchFiltersTriggered(false);
                                                }}
                                                className="flex items-center space-x-1.5 px-4 py-2 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-xs font-black text-gray-500 dark:text-gray-400 transition-colors shadow-sm cursor-pointer"
                                            >
                                                <RefreshCw size={12} />
                                                <span>Reset</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setSearchFiltersTriggered(true)}
                                                className="flex items-center space-x-1.5 px-5 py-2 bg-[#FF9933] hover:bg-[#E07A00] text-white font-extrabold rounded-xl transition-all shadow-sm text-xs uppercase tracking-wider cursor-pointer"
                                            >
                                                <Search size={12} />
                                                <span>Search Route</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Available Buses on Route Card */}
                                    <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-6 text-left shadow-sm overflow-hidden">
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-7 h-7 rounded-lg bg-[#FF9933]/15 text-[#FF9933] flex items-center justify-center">
                                                    <Bus size={15} />
                                                </div>
                                                <h3 className="text-sm font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">Available Buses on Route</h3>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button className="flex items-center space-x-1 px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                                    <Filter size={10} />
                                                    <span>Filters</span>
                                                </button>
                                                <button className="flex items-center space-x-1 px-3 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                                    <Download size={10} />
                                                    <span>Export</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-gray-100 dark:border-slate-800 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                        <th className="pb-3 font-black">BUS ID</th>
                                                        <th className="pb-3 font-black">BUS ROUTE NUMBER</th>
                                                        <th className="pb-3 font-black">CURRENT LOCATION</th>
                                                        <th className="pb-3 font-black">STATUS</th>
                                                        <th className="pb-3 font-black">ETA</th>
                                                        <th className="pb-3 text-right font-black">ACTION</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(() => {
                                                        const baseMockBuses = [
                                                            { id: 'BUS-IND-102', route: '90C', location: 'Electronic City Ph 1', status: 'On Time', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-250 dark:border-emerald-900/40', eta: '05 mins' },
                                                            { id: 'BUS-IND-445', route: '500A-1', location: 'HSR Layout Gate', status: 'Running', statusColor: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40', eta: '12 mins' },
                                                            { id: 'BUS-IND-089', route: '365-N', location: 'Silk Board Junction', status: 'Delayed', statusColor: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-250 dark:border-amber-900/40', eta: '22 mins' },
                                                            { id: 'BUS-IND-762', route: '201-B', location: 'Agara Lake Stop', status: 'On Time', statusColor: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40', eta: '08 mins' }
                                                        ];

                                                        const allBuses = [
                                                            ...activeTrips.map(t => ({
                                                                id: t.bus_number,
                                                                route: t.route_name,
                                                                location: 'Gandhipuram Bus Stand',
                                                                status: 'Running',
                                                                statusColor: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40',
                                                                eta: '02 mins',
                                                                tripId: t.trip_id,
                                                                isReal: true
                                                            })),
                                                            ...baseMockBuses
                                                        ];

                                                        const filteredBuses = allBuses.filter(bus => {
                                                            if (filterRouteNo && !bus.route.toLowerCase().includes(filterRouteNo.toLowerCase())) return false;
                                                            if (filterBoarding && !bus.location.toLowerCase().includes(filterBoarding.toLowerCase())) return false;
                                                            if (filterDestination && !bus.location.toLowerCase().includes(filterDestination.toLowerCase())) return false;
                                                            if (filterSearchQuery && !(bus.id.toLowerCase().includes(filterSearchQuery.toLowerCase()) || bus.route.toLowerCase().includes(filterSearchQuery.toLowerCase()))) return false;
                                                            return true;
                                                        });

                                                        if (filteredBuses.length === 0) {
                                                            return (
                                                                <tr>
                                                                    <td colSpan="6" className="text-center py-8 text-xs font-bold text-gray-400 uppercase tracking-wider">No matching active transits found</td>
                                                                </tr>
                                                            );
                                                        }

                                                        return filteredBuses.map((bus) => (
                                                            <tr
                                                                key={bus.id}
                                                                className="border-b border-gray-100 dark:border-slate-800/40 text-xs text-gray-650 dark:text-gray-300 hover:bg-[#FF9933]/5 dark:hover:bg-[#FF9933]/5 transition-colors cursor-pointer"
                                                                onClick={() => setSelectedBusForDetails(bus)}
                                                            >
                                                                <td className="py-4 font-black flex items-center space-x-2 text-[#0F1E36] dark:text-white">
                                                                    <Bus className="w-3.5 h-3.5 text-gray-400" />
                                                                    <span>{bus.id}</span>
                                                                </td>
                                                                <td className="py-4 font-black text-[#FF9933]">{bus.route}</td>
                                                                <td className="py-4 font-bold">
                                                                    <div className="flex items-center space-x-1">
                                                                        <MapPin className="w-3 h-3 text-gray-400" />
                                                                        <span>{bus.location}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 font-bold">
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider ${bus.statusColor}`}>
                                                                        {bus.status}
                                                                    </span>
                                                                </td>
                                                                <td className="py-4 font-black">{bus.eta}</td>
                                                                <td className="py-4 text-right" onClick={e => e.stopPropagation()}>
                                                                    <button
                                                                        onClick={() => setSelectedBusForDetails(bus)}
                                                                        className="px-3 py-1.5 bg-[#FF9933]/10 hover:bg-[#FF9933]/20 text-[#FF9933] border border-[#FF9933]/30 text-[10px] font-black rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
                                                                    >
                                                                        View Details
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ));
                                                    })()}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-slate-800/60 gap-4">
                                            <p className="text-[10px] text-gray-400 dark:text-slate-500 font-black uppercase tracking-wider">
                                                Showing {activeTrips.length + 4} of 12 active buses
                                            </p>
                                            <div className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest">
                                                <button className="px-2.5 py-1.5 border border-gray-200 dark:border-slate-700 text-gray-450 dark:text-slate-400 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">Previous</button>
                                                <button className="px-3 py-1.5 bg-[#FF9933] text-white rounded-lg">1</button>
                                                <button className="px-3 py-1.5 border border-gray-200 dark:border-slate-700 text-gray-450 dark:text-slate-400 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">2</button>
                                                <button className="px-3 py-1.5 border border-gray-200 dark:border-slate-700 text-gray-450 dark:text-slate-400 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">3</button>
                                                <button className="px-2.5 py-1.5 border border-gray-200 dark:border-slate-700 text-gray-450 dark:text-slate-400 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">Next</button>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Right sidebar column */}
                                <div className="space-y-6 text-left font-bold">
                                    
                                    {/* Quick Actions Card */}
                                    <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-6 shadow-sm">
                                        <div className="flex items-center space-x-2 mb-5">
                                            <div className="w-7 h-7 rounded-lg bg-[#FF9933]/15 text-[#FF9933] flex items-center justify-center">
                                                <Zap size={15} />
                                            </div>
                                            <h3 className="text-sm font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">Quick Actions</h3>
                                        </div>

                                        <div className="space-y-3">
                                            {/* Action item 1: Create New Route */}
                                            <button
                                                onClick={() => {
                                                    setShowAssignModal(true);
                                                }}
                                                className="w-full flex items-center justify-between p-3.5 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-800/40 transition-colors text-left group cursor-pointer"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                                        <MapPin size={15} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">Create New Route</p>
                                                        <p className="text-[9px] text-gray-400 dark:text-slate-500 font-bold">Add a new public transit route</p>
                                                    </div>
                                                </div>
                                                <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                                            </button>

                                            {/* Action item 2: Assign Bus to Route */}
                                            <button
                                                onClick={() => {
                                                    setShowAssignModal(true);
                                                }}
                                                className="w-full flex items-center justify-between p-3.5 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-800/40 transition-colors text-left group cursor-pointer"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-[#00B074] flex items-center justify-center">
                                                        <Bus size={15} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">Assign Bus to Route</p>
                                                        <p className="text-[9px] text-gray-400 dark:text-slate-500 font-bold">Deploy available bus to route</p>
                                                    </div>
                                                </div>
                                                <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                                            </button>

                                            {/* Action item 3: Create Schedule */}
                                            <button
                                                onClick={() => {
                                                    setShowAssignModal(true);
                                                }}
                                                className="w-full flex items-center justify-between p-3.5 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-800/40 transition-colors text-left group cursor-pointer"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#FF9933] flex items-center justify-center">
                                                        <Calendar size={15} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">Create Schedule</p>
                                                        <p className="text-[9px] text-gray-400 dark:text-slate-500 font-bold">Set timings and frequency</p>
                                                    </div>
                                                </div>
                                                <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                                            </button>

                                            {/* Action item 4: Route Map View */}
                                            <button
                                                onClick={() => {
                                                    alert("Map routing simulation activated.");
                                                }}
                                                className="w-full flex items-center justify-between p-3.5 bg-gray-50 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-800/40 transition-colors text-left group cursor-pointer"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                                        <Eye size={15} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">Route Map View</p>
                                                        <p className="text-[9px] text-gray-400 dark:text-slate-500 font-bold">View route on map</p>
                                                    </div>
                                                </div>
                                                <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Route Overview Timeline Card */}
                                    <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-6 shadow-sm font-bold">
                                        <div className="flex items-center space-x-2 mb-5">
                                            <div className="w-7 h-7 rounded-lg bg-[#FF9933]/15 text-[#FF9933] flex items-center justify-center">
                                                <TrendingUp size={15} />
                                            </div>
                                            <h3 className="text-sm font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">Route Overview</h3>
                                        </div>

                                        <div className="relative pl-6 border-l border-gray-200 dark:border-slate-800 space-y-5 ml-3">
                                            {/* Step 1 */}
                                            <div className="relative text-left">
                                                <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0B1E36] flex items-center justify-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                                </span>
                                                <p className="text-[11px] font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">Route Created</p>
                                                <p className="text-[9px] text-gray-450 dark:text-slate-500 font-bold">May 21, 09:10 AM</p>
                                            </div>

                                            {/* Step 2 */}
                                            <div className="relative text-left">
                                                <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0B1E36] flex items-center justify-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                                </span>
                                                <p className="text-[11px] font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">Depot Assigned</p>
                                                <p className="text-[9px] text-gray-450 dark:text-slate-500 font-bold">May 21, 09:12 AM</p>
                                            </div>

                                            {/* Step 3 */}
                                            <div className="relative text-left">
                                                <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-[#0B1E36] flex items-center justify-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                                </span>
                                                <p className="text-[11px] font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">Bus Assigned</p>
                                                <p className="text-[9px] text-gray-450 dark:text-slate-500 font-bold">May 21, 09:15 AM</p>
                                            </div>

                                            {/* Step 4 */}
                                            <div className="relative text-left">
                                                <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-blue-500 border-2 border-white dark:border-[#0B1E36] flex items-center justify-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                                </span>
                                                <p className="text-[11px] font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">Driver Assigned</p>
                                                <p className="text-[9px] text-gray-450 dark:text-slate-500 font-bold">May 21, 09:18 AM</p>
                                            </div>

                                            {/* Step 5 */}
                                            <div className="relative text-left">
                                                <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-gray-200 dark:bg-slate-800 border-2 border-white dark:border-[#0B1E36] flex items-center justify-center">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-transparent"></span>
                                                </span>
                                                <p className="text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider">Route Active</p>
                                                <p className="text-[9px] text-gray-350 dark:text-slate-650 font-bold">Pending</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            {/* Bottom smooth running banner */}
                            <div className="bg-emerald-500/[0.04] dark:bg-[#12820B]/[0.05] border border-emerald-500/25 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between text-left gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 flex items-center justify-center shrink-0">
                                        <Bus size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">All systems are running smoothly.</p>
                                        <p className="text-[9px] text-gray-450 dark:text-gray-500 font-bold">Last updated at 10:24 AM, May 21, 2024</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider shrink-0">
                                    <ShieldCheck size={14} />
                                    <span>System Secure</span>
                                </div>
                            </div>

                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="space-y-6">
                            {/* Breadcrumbs */}
                            <div className="flex items-center space-x-2 text-[10px] text-gray-450 dark:text-gray-550 font-black uppercase tracking-wider text-left">
                                <span>Control Center</span>
                                <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-700" />
                                <span>Service Reports</span>
                                <ChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-700" />
                                <span className="text-[#00B074]">Overview</span>
                            </div>

                            {/* Page Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
                                <div>
                                    <h1 className="text-xl font-black text-[#0F1E36] dark:text-white tracking-tight leading-tight">
                                        Passenger Service Reports Review
                                    </h1>
                                    <p className="text-[10px] text-gray-550 dark:text-gray-400 font-extrabold uppercase tracking-wider block mt-1">
                                        Comprehensive oversight of transit operational compliance and grievance redressal.
                                    </p>
                                </div>
                                <button className="flex items-center space-x-2 px-4 py-2.5 bg-[#00523C] hover:bg-[#004030] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md transition-all active:scale-95 shrink-0 cursor-pointer self-start sm:self-center">
                                    <Download className="w-4 h-4" />
                                    <span>Export Report Logs</span>
                                </button>
                            </div>

                            {/* Metrics Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Total Reports */}
                                <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between text-left relative overflow-hidden transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-555 font-black uppercase tracking-wider">Total Reports</p>
                                            <h3 className="text-2xl font-black text-[#0F1E36] dark:text-white mt-1">142</h3>
                                        </div>
                                        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-500 animate-none">
                                            <FileText className="w-4.5 h-4.5" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 mb-2">
                                        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-md text-[9px] font-black text-emerald-600 uppercase tracking-wider">
                                            +5.2%
                                        </span>
                                        <span className="text-[9px] text-gray-450 dark:text-gray-555 font-bold">vs last 7 days</span>
                                    </div>
                                    {/* Sparkline */}
                                    <div className="h-8 mt-3 text-emerald-500">
                                        <svg viewBox="0 0 100 30" className="w-full h-full" fill="none">
                                            <defs>
                                                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                                                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                            <path d="M0 25 C10 23, 20 27, 30 20 C40 13, 50 25, 60 15 C70 5, 80 18, 90 10 C95 12, 100 8, 100 8 L100 30 L0 30 Z" fill="url(#totalGrad)" />
                                            <path d="M0 25 C10 23, 20 27, 30 20 C40 13, 50 25, 60 15 C70 5, 80 18, 90 10 C95 12, 100 8, 100 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Pending Investigation */}
                                <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between text-left relative overflow-hidden transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-555 font-black uppercase tracking-wider">Pending Investigation</p>
                                            <h3 className="text-2xl font-black text-[#0F1E36] dark:text-white mt-1">24</h3>
                                        </div>
                                        <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center text-amber-555">
                                            <Search className="w-4.5 h-4.5" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 mb-2">
                                        <span className="px-2 py-0.5 bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-md text-[9px] font-black text-red-600 uppercase tracking-wider">
                                            -12.0%
                                        </span>
                                        <span className="text-[9px] text-gray-450 dark:text-gray-555 font-bold">vs last 7 days</span>
                                    </div>
                                    {/* Sparkline */}
                                    <div className="h-8 mt-3 text-amber-500">
                                        <svg viewBox="0 0 100 30" className="w-full h-full" fill="none">
                                            <defs>
                                                <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                                                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                            <path d="M0 10 C10 15, 20 8, 30 22 C40 28, 50 12, 60 18 C70 12, 80 25, 90 18 C95 20, 100 22, 100 22 L100 30 L0 30 Z" fill="url(#pendingGrad)" />
                                            <path d="M0 10 C10 15, 20 8, 30 22 C40 28, 50 12, 60 18 C70 12, 80 25, 90 18 C95 20, 100 22, 100 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Resolved This Week */}
                                <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between text-left relative overflow-hidden transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-550 font-black uppercase tracking-wider">Resolved This Week</p>
                                            <h3 className="text-2xl font-black text-[#0F1E36] dark:text-white mt-1">98</h3>
                                        </div>
                                        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-500">
                                            <CheckCircle2 className="w-4.5 h-4.5" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 mb-2">
                                        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-md text-[9px] font-black text-emerald-600 uppercase tracking-wider">
                                            Active
                                        </span>
                                        <span className="text-[9px] text-gray-455 dark:text-gray-555 font-bold">vs last 7 days</span>
                                    </div>
                                    {/* Sparkline */}
                                    <div className="h-8 mt-3 text-emerald-500">
                                        <svg viewBox="0 0 100 30" className="w-full h-full" fill="none">
                                            <path d="M0 25 C10 20, 20 28, 30 18 C40 10, 50 25, 60 12 C70 5, 80 18, 90 8 C95 10, 100 5, 100 5 L100 30 L0 30 Z" fill="url(#totalGrad)" />
                                            <path d="M0 25 C10 20, 20 28, 30 18 C40 10, 50 25, 60 12 C70 5, 80 18, 90 8 C95 10, 100 5, 100 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Reports Overview (Donut chart) */}
                                <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-6 shadow-sm flex items-center justify-between text-left">
                                    <div className="flex flex-col justify-between h-full">
                                        <div>
                                            <p className="text-xs text-[#0F1E36] dark:text-gray-300 font-black uppercase tracking-wider flex items-center">
                                                <Activity className="w-3.5 h-3.5 mr-1 text-[#00B074]" />
                                                Reports Overview
                                            </p>
                                        </div>
                                        <div className="space-y-2 mt-4">
                                            <div className="flex items-center space-x-1.5 text-[10px] font-black text-gray-550 dark:text-gray-300">
                                                <span className="w-2 h-2 rounded-full bg-[#00B074] shrink-0"></span>
                                                <span>Resolved: 98 (69%)</span>
                                            </div>
                                            <div className="flex items-center space-x-1.5 text-[10px] font-black text-gray-550 dark:text-gray-300">
                                                <span className="w-2 h-2 rounded-full bg-[#FF9933] shrink-0"></span>
                                                <span>Pending: 24 (17%)</span>
                                            </div>
                                            <div className="flex items-center space-x-1.5 text-[10px] font-black text-gray-550 dark:text-gray-300">
                                                <span className="w-2 h-2 rounded-full bg-[#FBBF24] shrink-0"></span>
                                                <span>Under Review: 20 (14%)</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Donut chart SVG */}
                                    <div className="relative w-28 h-28 shrink-0">
                                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#E2E8F0" strokeWidth="12" className="dark:stroke-slate-800" />
                                            {/* Resolved (69%): circumference is 2 * PI * 38 = 238.76. 69% of 238.76 = 164.7 */}
                                            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#00B074" strokeWidth="12"
                                                strokeDasharray="164.7 238.76" strokeDashoffset="0" strokeLinecap="round" />
                                            {/* Pending (17%): 17% of 238.76 = 40.6. Offset is -164.7 */}
                                            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#FF9933" strokeWidth="12"
                                                strokeDasharray="40.6 238.76" strokeDashoffset="-164.7" strokeLinecap="round" />
                                            {/* Under Review (14%): 14% of 238.76 = 33.4. Offset is -(164.7 + 40.6) = -205.3 */}
                                            <circle cx="50" cy="50" r="38" fill="transparent" stroke="#FBBF24" strokeWidth="12"
                                                strokeDasharray="33.4 238.76" strokeDashoffset="-205.3" strokeLinecap="round" />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                            <span className="text-lg font-black text-[#0F1E36] dark:text-white leading-none">142</span>
                                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Total</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Split Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left split column (67% width) - incidents log table */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-6 shadow-sm text-left">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                            <div className="flex items-center space-x-2">
                                                <FileText className="w-5 h-5 text-[#00B074]" />
                                                <h3 className="text-sm font-black uppercase tracking-wider">Recent Incidents Log</h3>
                                            </div>
                                            <div className="flex items-center space-x-2 self-end sm:self-center">
                                                <button className="flex items-center space-x-1.5 px-3 py-1.5 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-[#00B074] hover:border-[#00B074]/35 transition-colors cursor-pointer">
                                                    <Filter className="w-3.5 h-3.5" />
                                                    <span>Filter</span>
                                                </button>
                                                <button className="flex items-center space-x-1.5 px-3 py-1.5 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-wider text-gray-500 hover:text-[#00B074] hover:border-[#00B074]/35 transition-colors cursor-pointer">
                                                    <Sliders className="w-3.5 h-3.5" />
                                                    <span>Sort</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-gray-100 dark:border-slate-800 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                                        <th className="pb-3.5">Report ID</th>
                                                        <th className="pb-3.5">Route No.</th>
                                                        <th className="pb-3.5">Issue Type</th>
                                                        <th className="pb-3.5">Timestamp</th>
                                                        <th className="pb-3.5">Status</th>
                                                        <th className="pb-3.5 text-right pr-4">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50 dark:divide-slate-800/40 text-xs">
                                                    {incidents.map((incident) => {
                                                        const IconComponent = incident.icon;
                                                        return (
                                                            <tr key={incident.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/20">
                                                                <td className="py-4 font-black">{incident.id}</td>
                                                                <td className="py-4">
                                                                    <span className="px-2.5 py-1 bg-emerald-50/80 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-extrabold rounded-md text-[10px] border border-emerald-100 dark:border-emerald-900/30">
                                                                        {incident.route}
                                                                    </span>
                                                                </td>
                                                                <td className="py-4">
                                                                    <div className="flex items-center space-x-2 font-bold text-gray-700 dark:text-gray-300">
                                                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${incident.iconColor}`}>
                                                                            <IconComponent className="w-3.5 h-3.5" />
                                                                        </div>
                                                                        <span>{incident.type}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 font-bold text-gray-400 dark:text-gray-550">{incident.time}</td>
                                                                <td className="py-4">
                                                                    <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black border uppercase tracking-wider ${incident.statusColor}`}>
                                                                        {incident.status}
                                                                    </span>
                                                                </td>
                                                                <td className="py-4 text-right pr-2">
                                                                    <div className="flex items-center justify-end space-x-1">
                                                                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-400 hover:text-[#00B074] transition-colors cursor-pointer">
                                                                            <Eye className="w-4 h-4" />
                                                                        </button>
                                                                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-400 hover:text-[#00B074] transition-colors cursor-pointer">
                                                                            <MoreVertical className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination */}
                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-100 dark:border-slate-800/80">
                                            <p className="text-[10px] text-gray-450 dark:text-gray-500 font-extrabold uppercase tracking-wider">
                                                Showing 1 to 5 of 142 reports
                                            </p>
                                            <div className="flex items-center space-x-1.5">
                                                <button className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-slate-850 hover:border-[#00B074] text-gray-400 hover:text-[#00B074] rounded-lg text-xs font-black transition-colors cursor-pointer">
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button className="w-7 h-7 flex items-center justify-center bg-[#00B074] text-white rounded-lg text-[10px] font-black cursor-pointer">
                                                    1
                                                </button>
                                                <button className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-slate-850 hover:border-[#00B074] text-gray-450 hover:text-[#00B074] rounded-lg text-[10px] font-black transition-colors cursor-pointer">
                                                    2
                                                </button>
                                                <button className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-slate-850 hover:border-[#00B074] text-gray-450 hover:text-[#00B074] rounded-lg text-[10px] font-black transition-colors cursor-pointer">
                                                    3
                                                </button>
                                                <span className="text-[10px] text-gray-400 font-bold px-1">...</span>
                                                <button className="w-7 h-7 flex items-center justify-center border border-gray-200 dark:border-slate-850 hover:border-[#00B074] text-gray-400 hover:text-[#00B074] rounded-lg text-xs font-black transition-colors cursor-pointer">
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right split column (33% width) - trends and actions */}
                                <div className="space-y-6">
                                    {/* Trend Overview Card */}
                                    <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-6 shadow-sm text-left">
                                        <div className="flex justify-between items-center mb-6">
                                            <div className="flex items-center space-x-2">
                                                <TrendingUp className="w-4 h-4 text-[#00B074]" />
                                                <h3 className="text-sm font-black uppercase tracking-wider">Trend Overview</h3>
                                            </div>
                                            <div className="flex items-center space-x-1.5 px-3 py-1 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-xl text-[9px] font-black uppercase tracking-wider text-gray-550">
                                                <span>7 Days</span>
                                                <ChevronDown className="w-3 h-3" />
                                            </div>
                                        </div>

                                        {/* Trend Chart SVG */}
                                        <div className="w-full text-[#00B074]">
                                            <svg viewBox="0 0 200 135" className="w-full h-auto">
                                                <defs>
                                                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                                                        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>
                                                {/* Grid lines */}
                                                <line x1="10" y1="20" x2="190" y2="20" stroke="#F1F5F9" strokeWidth="0.75" strokeDasharray="2" className="dark:stroke-slate-800" />
                                                <line x1="10" y1="50" x2="190" y2="50" stroke="#F1F5F9" strokeWidth="0.75" strokeDasharray="2" className="dark:stroke-slate-800" />
                                                <line x1="10" y1="80" x2="190" y2="80" stroke="#F1F5F9" strokeWidth="0.75" strokeDasharray="2" className="dark:stroke-slate-800" />
                                                <line x1="10" y1="110" x2="190" y2="110" stroke="#F1F5F9" strokeWidth="0.75" strokeDasharray="2" className="dark:stroke-slate-800" />
                                                
                                                {/* Area under curve */}
                                                <path d="M10 73.3 L40 61.7 L70 70.0 L100 45.0 L130 53.3 L160 56.7 L190 40.0 L190 115 L10 115 Z" fill="url(#trendGrad)" />
                                                
                                                {/* Connecting lines */}
                                                <path d="M10 73.3 L40 61.7 L70 70.0 L100 45.0 L130 53.3 L160 56.7 L190 40.0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                
                                                {/* Data dots & labels */}
                                                <circle cx="10" cy="73.3" r="2.5" fill="currentColor" stroke="white" strokeWidth="0.75" className="dark:stroke-[#0B1E36]" />
                                                <text x="10" y="65" textAnchor="middle" className="fill-[#0F1E36] dark:fill-white font-extrabold text-[7px]">28</text>
                                                
                                                <circle cx="40" cy="61.7" r="2.5" fill="currentColor" stroke="white" strokeWidth="0.75" className="dark:stroke-[#0B1E36]" />
                                                <text x="40" y="54" textAnchor="middle" className="fill-[#0F1E36] dark:fill-white font-extrabold text-[7px]">35</text>
                                                
                                                <circle cx="70" cy="70" r="2.5" fill="currentColor" stroke="white" strokeWidth="0.75" className="dark:stroke-[#0B1E36]" />
                                                <text x="70" y="62" textAnchor="middle" className="fill-[#0F1E36] dark:fill-white font-extrabold text-[7px]">30</text>
                                                
                                                <circle cx="100" cy="45" r="2.5" fill="currentColor" stroke="white" strokeWidth="0.75" className="dark:stroke-[#0B1E36]" />
                                                <text x="100" y="37" textAnchor="middle" className="fill-[#0F1E36] dark:fill-white font-extrabold text-[7px]">45</text>
                                                
                                                <circle cx="130" cy="53.3" r="2.5" fill="currentColor" stroke="white" strokeWidth="0.75" className="dark:stroke-[#0B1E36]" />
                                                <text x="130" y="45" textAnchor="middle" className="fill-[#0F1E36] dark:fill-white font-extrabold text-[7px]">40</text>
                                                
                                                <circle cx="160" cy="56.7" r="2.5" fill="currentColor" stroke="white" strokeWidth="0.75" className="dark:stroke-[#0B1E36]" />
                                                <text x="160" y="49" textAnchor="middle" className="fill-[#0F1E36] dark:fill-white font-extrabold text-[7px]">38</text>
                                                
                                                <circle cx="190" cy="40" r="2.5" fill="currentColor" stroke="white" strokeWidth="0.75" className="dark:stroke-[#0B1E36]" />
                                                <text x="190" y="32" textAnchor="middle" className="fill-[#0F1E36] dark:fill-white font-extrabold text-[7px]">48</text>

                                                {/* X Axis Labels */}
                                                <text x="10" y="125" textAnchor="middle" className="fill-gray-400 dark:fill-gray-550 font-bold text-[6px] uppercase">18 Oct</text>
                                                <text x="40" y="125" textAnchor="middle" className="fill-gray-400 dark:fill-gray-550 font-bold text-[6px] uppercase">19 Oct</text>
                                                <text x="70" y="125" textAnchor="middle" className="fill-gray-400 dark:fill-gray-550 font-bold text-[6px] uppercase">20 Oct</text>
                                                <text x="100" y="125" textAnchor="middle" className="fill-gray-400 dark:fill-gray-550 font-bold text-[6px] uppercase">21 Oct</text>
                                                <text x="130" y="125" textAnchor="middle" className="fill-gray-400 dark:fill-gray-550 font-bold text-[6px] uppercase">22 Oct</text>
                                                <text x="160" y="125" textAnchor="middle" className="fill-gray-400 dark:fill-gray-550 font-bold text-[6px] uppercase">23 Oct</text>
                                                <text x="190" y="125" textAnchor="middle" className="fill-gray-400 dark:fill-gray-550 font-bold text-[6px] uppercase">24 Oct</text>
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Quick Actions Card */}
                                    <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-6 shadow-sm text-left">
                                        <div className="flex items-center space-x-2 mb-6">
                                            <Zap className="w-4 h-4 text-[#FF9933]" />
                                            <h3 className="text-sm font-black uppercase tracking-wider">Quick Actions</h3>
                                        </div>

                                        <div className="space-y-3">
                                            <button className="w-full flex items-center justify-between p-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 hover:border-[#00B074]/35 rounded-xl text-left transition-colors cursor-pointer group">
                                                <div className="flex items-center space-x-3.5">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/20 text-[#00B074] flex items-center justify-center">
                                                        <ShieldAlert className="w-4.5 h-4.5" />
                                                    </div>
                                                    <span className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wide">Report an Incident</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#00B074] transition-colors" />
                                            </button>
                                            
                                            <button className="w-full flex items-center justify-between p-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 hover:border-[#00B074]/35 rounded-xl text-left transition-colors cursor-pointer group">
                                                <div className="flex items-center space-x-3.5">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/20 text-[#00B074] flex items-center justify-center">
                                                        <Plus className="w-4.5 h-4.5" />
                                                    </div>
                                                    <span className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wide">Add New Report</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#00B074] transition-colors" />
                                            </button>

                                            <button className="w-full flex items-center justify-between p-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 hover:border-[#00B074]/35 rounded-xl text-left transition-colors cursor-pointer group">
                                                <div className="flex items-center space-x-3.5">
                                                    <div className="w-8 h-8 rounded-lg bg-[#00B074]/10 text-[#00B074] flex items-center justify-center">
                                                        <TrendingUp className="w-4.5 h-4.5" />
                                                    </div>
                                                    <span className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wide">View Analytics</span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#00B074] transition-colors" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reports Page Footer */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 border-t border-gray-200 dark:border-slate-800 text-[10px] text-gray-400 font-extrabold uppercase tracking-wider text-left">
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 rounded bg-[#00B074]/15 border border-[#00B074]/30 flex items-center justify-center text-[#00B074]">
                                        <Shield className="w-3.5 h-3.5" />
                                    </div>
                                    <span>Designed for Bharat. Built for Better.</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                    <span>✔ Secure Networks</span>
                                    <span>📡 Real-time Monitoring</span>
                                    <span>📊 Data-Driven Decisions</span>
                                    <span>© 2026 Transit India Authority</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══════════════════════════════════════════
                         BUS DETAILS MODAL
                    ══════════════════════════════════════════ */}
                    {selectedBusForDetails && !showBreakdownConfirm && !showBreakdownSuccess && (() => {
                        const bus = selectedBusForDetails;
                        const stops = [
                            { name: 'Silk Board Junction', eta: '2 mins', current: true },
                            { name: 'Agara Lake Stop', eta: '8 mins', current: false },
                            { name: 'HSR Layout Gate', eta: '15 mins', current: false },
                        ];
                        return (
                            <div
                                className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
                                style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
                                onClick={() => setSelectedBusForDetails(null)}
                            >
                                <div
                                    className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-2xl w-full max-w-[560px] overflow-hidden"
                                    style={{ animation: 'notifDrop 0.25s cubic-bezier(0.16,1,0.3,1) both' }}
                                    onClick={e => e.stopPropagation()}
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-slate-800">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-9 h-9 rounded-xl bg-[#00B074]/10 border border-[#00B074]/20 flex items-center justify-center">
                                                <Bus className="w-5 h-5 text-[#00B074]" />
                                            </div>
                                            <h2 className="text-base font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">Bus Details</h2>
                                        </div>
                                        <button
                                            onClick={() => setSelectedBusForDetails(null)}
                                            className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center text-gray-500 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        {/* Bus ID + Route Status */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Bus ID</p>
                                                <p className="text-sm font-black text-[#0F1E36] dark:text-white">{bus.id}</p>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Route Status</p>
                                                <div className="flex items-center space-x-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-[#00B074] animate-pulse"></span>
                                                    <p className="text-xs font-black text-[#00B074]">{bus.status} · On Time</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Current Route */}
                                        <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Route</p>
                                            <p className="text-sm font-black text-[#0F1E36] dark:text-white">{bus.location} → Terminal Hub</p>
                                        </div>

                                        {/* Driver + Conductor */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Driver</p>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/30 flex items-center justify-center">
                                                        <User className="w-3.5 h-3.5 text-blue-500" />
                                                    </div>
                                                    <p className="text-xs font-black text-[#0F1E36] dark:text-white">R. Suresh</p>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Conductor</p>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                                                        <User className="w-3.5 h-3.5 text-purple-500" />
                                                    </div>
                                                    <p className="text-xs font-black text-[#0F1E36] dark:text-white">K. Raghavan</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Next 3 Stops */}
                                        <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Next 3 Stops</p>
                                            <div className="space-y-0">
                                                {stops.map((stop, i) => (
                                                    <div key={i} className="flex items-center space-x-3">
                                                        <div className="flex flex-col items-center">
                                                            <div className={`w-3 h-3 rounded-full border-2 ${stop.current ? 'bg-[#00B074] border-[#00B074]' : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600'}`}></div>
                                                            {i < 2 && <div className="w-0.5 h-6 bg-gray-200 dark:bg-slate-700 my-0.5"></div>}
                                                        </div>
                                                        <div className="flex-1 flex items-center justify-between py-1">
                                                            <p className={`text-xs font-black ${stop.current ? 'text-[#0F1E36] dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{stop.name}</p>
                                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${stop.current ? 'bg-[#00B074]/10 text-[#00B074]' : 'text-gray-400'}`}>{stop.eta}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="grid grid-cols-2 gap-3 pt-1">
                                            <button
                                                onClick={() => setShowBreakdownConfirm(true)}
                                                className="flex items-center justify-center space-x-2 py-3 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-2xl text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider transition-all"
                                            >
                                                <AlertTriangle className="w-4 h-4" />
                                                <span>Mark as Breakdown</span>
                                            </button>
                                            <button
                                                className="flex items-center justify-center space-x-2 py-3 bg-[#00B074] hover:bg-[#009060] rounded-2xl text-xs font-black text-white uppercase tracking-wider transition-all shadow-md"
                                            >
                                                <Phone className="w-4 h-4" />
                                                <span>Contact Driver</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* ══════════════════════════════════════════
                         BREAKDOWN CONFIRMATION MODAL
                    ══════════════════════════════════════════ */}
                    {showBreakdownConfirm && !showBreakdownSuccess && selectedBusForDetails && (() => {
                        const bus = selectedBusForDetails;
                        return (
                            <div
                                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                                style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
                            >
                                <div
                                    className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-2xl w-full max-w-[520px] overflow-hidden"
                                    style={{ animation: 'notifDrop 0.25s cubic-bezier(0.16,1,0.3,1) both' }}
                                >
                                    {/* Close */}
                                    <div className="flex justify-end px-5 pt-5">
                                        <button
                                            onClick={() => setShowBreakdownConfirm(false)}
                                            className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center text-gray-500"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="px-8 pb-8 space-y-5 text-center">
                                        {/* Warning Icon */}
                                        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 flex items-center justify-center mx-auto">
                                            <AlertTriangle className="w-7 h-7 text-red-500" />
                                        </div>

                                        {/* Title */}
                                        <div>
                                            <h2 className="text-lg font-black text-[#0F1E36] dark:text-white">
                                                Confirm Vehicle <span className="text-red-500">Breakdown</span>
                                            </h2>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-2 max-w-xs mx-auto leading-relaxed">
                                                Are you sure you want to mark this vehicle as <strong>broken down</strong>? This will alert the depot and dispatch a replacement vehicle immediately.
                                            </p>
                                        </div>

                                        {/* Vehicle Summary */}
                                        <div className="bg-gray-50 dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800 text-left grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Vehicle ID</p>
                                                <p className="text-xs font-black text-[#0F1E36] dark:text-white flex items-center space-x-1">
                                                    <Bus className="w-3 h-3 text-gray-400" /><span>{bus.id}</span>
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Route Status</p>
                                                <p className="text-xs font-black text-[#00B074] flex items-center space-x-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#00B074]"></span>
                                                    <span>{bus.status} · On Time</span>
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Current Route</p>
                                                <p className="text-xs font-black text-[#0F1E36] dark:text-white">{bus.location} → Hub</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Driver</p>
                                                <p className="text-xs font-black text-[#0F1E36] dark:text-white">R. Suresh</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Conductor</p>
                                                <p className="text-xs font-black text-[#0F1E36] dark:text-white">K. Raghavan</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Next Stop (ETA)</p>
                                                <p className="text-xs font-black text-[#0F1E36] dark:text-white">Silk Board Jn · 2 mins</p>
                                            </div>
                                        </div>

                                        {/* Alert Banner */}
                                        <div className="flex items-center space-x-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-3 text-left">
                                            <Bell className="w-4 h-4 text-red-500 shrink-0 animate-pulse" />
                                            <p className="text-[10px] font-black text-red-600 dark:text-red-400">A breakdown alert will be sent to the control center, depot team and operations immediately.</p>
                                        </div>

                                        {/* Buttons */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => setShowBreakdownConfirm(false)}
                                                className="flex items-center justify-center space-x-2 py-3.5 bg-white dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 rounded-2xl text-xs font-black text-gray-600 dark:text-gray-300 uppercase tracking-wider transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                                <span>Cancel</span>
                                            </button>
                                            <button
                                                onClick={() => { setShowBreakdownConfirm(false); setShowBreakdownSuccess(true); }}
                                                className="flex items-center justify-center space-x-2 py-3.5 bg-red-500 hover:bg-red-600 rounded-2xl text-xs font-black text-white uppercase tracking-wider transition-all shadow-lg"
                                            >
                                                <AlertTriangle className="w-4 h-4" />
                                                <span>Yes, Mark as Breakdown</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* ══════════════════════════════════════════
                         BREAKDOWN SUCCESS SCREEN
                    ══════════════════════════════════════════ */}
                    {showBreakdownSuccess && (
                        <div
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                            style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
                        >
                            <div
                                className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-2xl w-full max-w-[400px] overflow-hidden text-center"
                                style={{ animation: 'notifDrop 0.3s cubic-bezier(0.16,1,0.3,1) both' }}
                            >
                                <div className="p-10 space-y-5">
                                    {/* Animated Success Circle */}
                                    <div className="relative mx-auto w-20 h-20">
                                        <div className="w-20 h-20 rounded-full bg-[#00B074]/10 border-4 border-[#00B074] flex items-center justify-center">
                                            <CheckCircle2 className="w-10 h-10 text-[#00B074]" />
                                        </div>
                                        <div className="absolute inset-0 rounded-full border-4 border-[#00B074]/30 animate-ping"></div>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-black text-[#0F1E36] dark:text-white">Marked as Breakdown!</h2>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-2 leading-relaxed">
                                            Vehicle <span className="text-[#0F1E36] dark:text-white font-black">{selectedBusForDetails?.id}</span> has been flagged as broken down.<br />
                                            The depot and control center have been alerted.
                                        </p>
                                    </div>

                                    {/* Status Chips */}
                                    <div className="flex items-center justify-center space-x-2 flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-[#00B074]/10 text-[#00B074] text-[9px] font-black rounded-full border border-[#00B074]/20 uppercase tracking-widest">✓ Depot Notified</span>
                                        <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 text-[9px] font-black rounded-full border border-amber-200 dark:border-amber-800 uppercase tracking-widest">⚡ Replacement Dispatched</span>
                                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-[9px] font-black rounded-full border border-blue-200 dark:border-blue-800 uppercase tracking-widest">📋 Report Filed</span>
                                    </div>

                                    <button
                                        onClick={() => { setShowBreakdownSuccess(false); setSelectedBusForDetails(null); }}
                                        className="w-full py-3.5 bg-[#0F1E36] dark:bg-white hover:opacity-90 rounded-2xl text-xs font-black text-white dark:text-[#0F1E36] uppercase tracking-widest transition-all shadow-md"
                                    >
                                        Back to Route Management
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'fleet' && (
                        <div className="space-y-6 relative text-left">
                            
                            {/* Ashoka Chakra Background Decoration */}
                            <div className="absolute right-0 top-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none select-none overflow-hidden translate-x-12 -translate-y-10">
                                <svg width="280" height="280" viewBox="0 0 100 100" fill="currentColor" className="text-[#0F1E36] dark:text-white">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2.5" />
                                    <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                    {[...Array(24)].map((_, i) => (
                                        <line key={i} x1="50" y1="50" x2={50 + 45 * Math.cos((i * 15 * Math.PI) / 180)} y2={50 + 45 * Math.sin((i * 15 * Math.PI) / 180)} stroke="currentColor" strokeWidth="0.6" />
                                    ))}
                                </svg>
                            </div>

                            {/* ────────────────────────────────────────────────────────── */}
                            {/* MODULE 1: DRIVER & CONDUCTOR MANAGEMENT WORKSPACE */}
                            {fleetSubPage === 'drivers' && (
                                <div className="space-y-6">
                                    {/* Back Header */}
                                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-150 dark:border-slate-800">
                                        <button
                                            onClick={() => setFleetSubPage(null)}
                                            className="p-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-[#FF9933] rounded-xl text-gray-550 dark:text-gray-300 transition-colors cursor-pointer"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <div>
                                            <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                                                <span>Fleet Hub</span>
                                                <span>/</span>
                                                <span className="text-[#FF9933]">Duty Staff & Crew</span>
                                            </div>
                                            <h2 className="text-xl font-black text-[#0F1E36] dark:text-white uppercase tracking-wider leading-none">
                                                Driver & Conductor Management
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Sub KPIs */}
                                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                                        {[
                                            { label: 'Active Drivers', val: '248', desc: 'On duty rosters' },
                                            { label: 'Active Conductors', val: '210', desc: 'Shift active' },
                                            { label: 'Shift Attendance', val: '98.2%', desc: '2 absent today' },
                                            { label: 'License Validity Alerts', val: '3 Expiring', desc: 'Within 30 days' },
                                            { label: 'Average Safety Score', val: '94/100', desc: 'Zero collision record' }
                                        ].map((kpi, idx) => (
                                            <div key={idx} className="bg-white dark:bg-[#0B1E36] p-4 rounded-xl border border-gray-200 dark:border-slate-800">
                                                <p className="text-[8px] font-black text-gray-450 uppercase tracking-widest">{kpi.label}</p>
                                                <h3 className="text-lg font-black text-[#0F1E36] dark:text-white mt-1">{kpi.val}</h3>
                                                <p className="text-[8px] text-gray-400 font-bold mt-0.5">{kpi.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Shift Duty Log Table */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                                        <div className="lg:col-span-2 bg-white dark:bg-[#0B1E36] border border-gray-150 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-[#0F1E36] dark:text-white mb-4">Active Roster Assignments</h3>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-xs text-left">
                                                    <thead>
                                                        <tr className="border-b border-gray-100 dark:border-slate-800 text-[8px] font-black text-gray-450 uppercase tracking-widest">
                                                            <th className="pb-2">EMP ID</th>
                                                            <th className="pb-2">CREW NAME</th>
                                                            <th className="pb-2">VEHICLE / ROUTE</th>
                                                            <th className="pb-2">SHIFT TIMING</th>
                                                            <th className="pb-2">PERFORMANCE</th>
                                                            <th className="pb-2 text-right">ACTION</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {[
                                                            { id: 'DR-0104', name: 'K. Ramanujan', role: 'Driver', exp: '12 yrs', bus: 'TN-37-N-8812', route: '1C', shift: '06:00 AM - 02:00 PM', score: 94, state: 'Active' },
                                                            { id: 'CO-0242', name: 'S. Muthu', role: 'Conductor', exp: '6 yrs', bus: 'TN-37-N-8812', route: '1C', shift: '06:00 AM - 02:00 PM', score: 88, state: 'Active' },
                                                            { id: 'DR-0115', name: 'A. Joseph', role: 'Driver', exp: '8 yrs', bus: 'TN-37-N-3211', route: 'Chennai Exp', shift: '02:00 PM - 10:00 PM', score: 91, state: 'Standby' },
                                                            { id: 'CO-0195', name: 'G. Selvam', role: 'Conductor', exp: '4 yrs', bus: 'TN-01-AN-9905', route: '500A', shift: '06:00 AM - 02:00 PM', score: 85, state: 'On Leave' },
                                                            { id: 'DR-0120', name: 'M. Palanisamy', role: 'Driver', exp: '15 yrs', bus: 'TN-38-N-4421', route: '34', shift: '06:00 AM - 02:00 PM', score: 95, state: 'Active' },
                                                            { id: 'CO-0301', name: 'A. Kumaran', role: 'Conductor', exp: '5 yrs', bus: 'TN-38-N-4421', route: '34', shift: '06:00 AM - 02:00 PM', score: 89, state: 'Active' },
                                                            { id: 'DR-0088', name: 'H. Kempegowda', role: 'Driver', exp: '10 yrs', bus: 'KA-57-F-9921', route: '500C', shift: '02:00 PM - 10:00 PM', score: 93, state: 'Active' },
                                                            { id: 'CO-0105', name: 'R. Gowda', role: 'Conductor', exp: '7 yrs', bus: 'KA-57-F-9921', route: '500C', shift: '02:00 PM - 10:00 PM', score: 90, state: 'Active' },
                                                            { id: 'DR-0145', name: 'P. Sukumaran', role: 'Driver', exp: '9 yrs', bus: 'KL-02-B-5561', route: '2B', shift: '06:00 AM - 02:05 PM', score: 87, state: 'Active' },
                                                            { id: 'CO-0220', name: 'M. Shaji', role: 'Conductor', exp: '4 yrs', bus: 'KL-02-B-5561', route: '2B', shift: '06:00 AM - 02:05 PM', score: 86, state: 'Active' },
                                                            { id: 'DR-0160', name: 'R. Kuppusamy', role: 'Driver', exp: '14 yrs', bus: 'TN-37-N-8812', route: '1C', shift: '06:00 AM - 02:00 PM', score: 92, state: 'Active' },
                                                            { id: 'CO-0245', name: 'M. Sivaraman', role: 'Conductor', exp: '5 yrs', bus: 'TN-37-N-8812', route: '1C', shift: '06:00 AM - 02:00 PM', score: 88, state: 'Active' },
                                                            { id: 'DR-0180', name: 'S. Rajendran', role: 'Driver', exp: '11 yrs', bus: 'TN-37-N-1022', route: '1A', shift: '06:00 AM - 02:00 PM', score: 90, state: 'Active' },
                                                            { id: 'CO-0250', name: 'K. Balu', role: 'Conductor', exp: '6 yrs', bus: 'TN-37-N-1022', route: '1A', shift: '06:00 AM - 02:00 PM', score: 87, state: 'Active' },
                                                            { id: 'DR-0190', name: 'V. Jayakumar', role: 'Driver', exp: '10 yrs', bus: 'KL-01-A-4450', route: '20A', shift: '02:00 PM - 10:00 PM', score: 89, state: 'Active' },
                                                            { id: 'CO-0260', name: 'P. Harikrishnan', role: 'Conductor', exp: '8 yrs', bus: 'KL-01-A-4450', route: '20A', shift: '02:00 PM - 10:00 PM', score: 91, state: 'Active' },
                                                            { id: 'DR-0200', name: 'K. Kathiravan', role: 'Driver', exp: '13 yrs', bus: 'TN-01-AN-9905', route: '500A', shift: '06:00 AM - 02:00 PM', score: 94, state: 'Active' },
                                                            { id: 'CO-0270', name: 'M. Sebastian', role: 'Conductor', exp: '7 yrs', bus: 'KL-15-E-7021', route: 'Swift Spl', shift: '06:00 AM - 02:00 PM', score: 88, state: 'Active' },
                                                            { id: 'DR-0210', name: 'K. Sunny', role: 'Driver', exp: '6 yrs', bus: 'KL-15-E-7021', route: 'Swift Spl', shift: '06:00 AM - 02:00 PM', score: 85, state: 'Active' },
                                                            { id: 'CO-0280', name: 'T. Krishnakumar', role: 'Conductor', exp: '9 yrs', bus: 'KL-14-E-1002', route: '15', shift: '02:00 PM - 10:00 PM', score: 92, state: 'Active' },
                                                            { id: 'DR-0220', name: 'J. Bobby', role: 'Driver', exp: '12 yrs', bus: 'KL-14-E-1002', route: '15', shift: '02:00 PM - 10:00 PM', score: 90, state: 'Active' },
                                                            { id: 'CO-0290', name: 'S. Kannan', role: 'Conductor', exp: '5 yrs', bus: 'TN-37-N-3211', route: 'Chennai Exp', shift: '02:00 PM - 10:00 PM', score: 86, state: 'Active' },
                                                            { id: 'DR-0230', name: 'A. Murugan', role: 'Driver', exp: '15 yrs', bus: 'TN-40-B-1102', route: '10', shift: '06:00 AM - 02:00 PM', score: 96, state: 'Active' },
                                                            { id: 'CO-0310', name: 'P. Arasu', role: 'Conductor', exp: '6 yrs', bus: 'TN-40-B-1102', route: '10', shift: '06:00 AM - 02:00 PM', score: 89, state: 'Active' },
                                                            { id: 'DR-0240', name: 'V. Rangasamy', role: 'Driver', exp: '8 yrs', bus: 'TN-37-N-6652', route: '5', shift: '02:00 PM - 10:00 PM', score: 88, state: 'Active' }
                                                        ].map((crew, idx) => (
                                                            <tr key={idx} onClick={() => setSelectedEmployee(crew)} className="border-b border-gray-100 dark:border-slate-800/40 hover:bg-gray-50/50 dark:hover:bg-slate-850/20 cursor-pointer">
                                                                <td className="py-3 font-black text-[#0F1E36] dark:text-white">{crew.id}</td>
                                                                <td className="py-3">
                                                                    <div className="font-extrabold text-[#0F1E36] dark:text-white">{crew.name}</div>
                                                                    <div className="text-[8px] text-gray-400 font-bold">{crew.role} • {crew.exp}</div>
                                                                </td>
                                                                <td className="py-3 font-bold text-gray-550 dark:text-gray-300">{crew.bus} • Route {crew.route}</td>
                                                                <td className="py-3 font-extrabold uppercase text-[9px] tracking-wide text-[#FF9933]">{crew.shift}</td>
                                                                <td className="py-3">
                                                                    <div className="flex items-center space-x-1">
                                                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                                                                        <span className="font-black text-[#0F1E36] dark:text-white">{crew.score}%</span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 text-right">
                                                                    <span className="text-[9px] font-black uppercase text-gray-400">View</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Duty Crew Detail Profile Card */}
                                        <div className="bg-white dark:bg-[#0B1E36] border border-gray-150 dark:border-slate-800 rounded-2xl p-6 shadow-sm font-bold">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-[#0F1E36] dark:text-white mb-4">Crew Details Profile</h3>
                                            {selectedEmployee ? (
                                                <div className="space-y-4 text-xs text-gray-555 dark:text-gray-300">
                                                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-900 rounded-xl">
                                                        <div className="w-10 h-10 rounded-full bg-[#FF9933]/10 text-[#FF9933] flex items-center justify-center font-black">
                                                            {selectedEmployee.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-sm text-[#0F1E36] dark:text-white">{selectedEmployee.name}</p>
                                                            <p className="text-[9px] text-gray-450 uppercase font-black">{selectedEmployee.role} • ID: {selectedEmployee.id}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 border-t border-gray-100 dark:border-slate-800 pt-3">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">License Validity</span>
                                                            <span className="font-black text-[#0F1E36] dark:text-white">24 Dec 2029 (Active)</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Medical Certificate</span>
                                                            <span className="font-black text-[#0F1E36] dark:text-white">Certified (Apr 2026)</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Penalty / Acc points</span>
                                                            <span className="font-black text-red-500">0 Points / Clean Record</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Leave Balance</span>
                                                            <span className="font-black text-[#0F1E36] dark:text-white">12 Days</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Contact Number</span>
                                                            <span className="font-black text-[#0F1E36] dark:text-white">+91 94820-20220</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 pt-4">
                                                        <button onClick={() => alert("Duty roster transfer sequence active")} className="w-full py-2 bg-[#FF9933] hover:bg-[#E07A00] text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer">
                                                            Transfer Assignment
                                                        </button>
                                                        <button onClick={() => alert("Downloading duty profile PDF...")} className="w-full py-2 border border-gray-250 dark:border-slate-700 hover:border-gray-400 text-[#0F1E36] dark:text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer">
                                                            Download Profile
                                                        </button>
                                                        <button onClick={() => alert("Crew suspension alert raised")} className="w-full py-2 text-red-500 hover:bg-red-500/5 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer">
                                                            Suspend Assignment
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 text-gray-400 text-xs font-bold uppercase tracking-widest">
                                                    Select an employee row to view their profile details
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ────────────────────────────────────────────────────────── */}
                            {/* MODULE 2: DEPOT STAFF & ADMINISTRATION WORKSPACE */}
                            {fleetSubPage === 'staff' && (
                                <div className="space-y-6">
                                    {/* Back Header */}
                                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-150 dark:border-slate-800">
                                        <button
                                            onClick={() => setFleetSubPage(null)}
                                            className="p-2 bg-gray-55 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-[#FF9933] rounded-xl text-gray-550 dark:text-gray-300 transition-colors cursor-pointer"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <div>
                                            <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                                                <span>Fleet Hub</span>
                                                <span>/</span>
                                                <span className="text-[#FF9933]">Depot Administration</span>
                                            </div>
                                            <h2 className="text-xl font-black text-[#0F1E36] dark:text-white uppercase tracking-wider leading-none">
                                                Staff Management
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Total Depot Employees', val: '384' },
                                            { label: 'Workshop Mechanics', val: '42' },
                                            { label: 'Administrative Schedulers', val: '18' },
                                            { label: 'Pending Leaves', val: '6 Requests' }
                                        ].map((st, i) => (
                                            <div key={i} className="bg-white dark:bg-[#0B1E36] p-4 border border-gray-200 dark:border-slate-800 rounded-xl">
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{st.label}</p>
                                                <h3 className="text-lg font-black text-[#0F1E36] dark:text-white mt-1">{st.val}</h3>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Staff Table & Directory */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                                        <div className="lg:col-span-2 bg-white dark:bg-[#0B1E36] border border-gray-150 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-[#0F1E36] dark:text-white mb-4">Depot Personnel Directory</h3>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-xs text-left">
                                                    <thead>
                                                        <tr className="border-b border-gray-100 dark:border-slate-800 text-[8px] font-black text-gray-450 uppercase tracking-widest">
                                                            <th className="pb-2">EMP ID</th>
                                                            <th className="pb-2">STAFF NAME</th>
                                                            <th className="pb-2">DEPARTMENT</th>
                                                            <th className="pb-2">DESIGNATION</th>
                                                            <th className="pb-2">STATUS</th>
                                                            <th className="pb-2 text-right">ACTION</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {[
                                                            { id: 'ST-0012', name: 'K. Narayanan', dept: 'Operations', role: 'Depot Supervisor', status: 'Active' },
                                                            { id: 'ST-0044', name: 'R. Srinivasan', dept: 'Workshop', role: 'Senior Diesel Mechanic', status: 'Active' },
                                                            { id: 'ST-0102', name: 'M. Karpagam', dept: 'Admin', role: 'Roster Clerk', status: 'Active' },
                                                            { id: 'ST-0118', name: 'P. Murugan', dept: 'Security', role: 'Gate Supervisor', status: 'On Leave' },
                                                            { id: 'ST-0125', name: 'G. Vasudevan', dept: 'Workshop', role: 'EV Systems Electrician', status: 'Active' },
                                                            { id: 'ST-0130', name: 'M. Anbarasan', dept: 'Operations', role: 'Shift Supervisor', status: 'Active' },
                                                            { id: 'ST-0142', name: 'S. Vijayalakshmi', dept: 'Admin', role: 'Accounts Assistant', status: 'Active' },
                                                            { id: 'ST-0150', name: 'V. Kumarvel', dept: 'Security', role: 'Gate Inspector', status: 'Active' },
                                                            { id: 'ST-0165', name: 'D. Rajaram', dept: 'Workshop', role: 'Chassis Welder', status: 'Active' },
                                                            { id: 'ST-0170', name: 'K. Chitra', dept: 'Admin', role: 'Personnel Manager', status: 'Active' },
                                                            { id: 'ST-0180', name: 'L. Ganesan', dept: 'Workshop', role: 'Tyre Technician', status: 'Active' },
                                                            { id: 'ST-0185', name: 'N. Subramani', dept: 'Operations', role: 'Dispatch Officer', status: 'Active' },
                                                            { id: 'ST-0190', name: 'R. Sreedevi', dept: 'Admin', role: 'Data Entry Operator', status: 'Active' },
                                                            { id: 'ST-0195', name: 'V. Bhaskaran', dept: 'Security', role: 'Night Guard', status: 'Active' },
                                                            { id: 'ST-0200', name: 'P. Selvakumar', dept: 'Workshop', role: 'Paint & Body Shop', status: 'Active' },
                                                            { id: 'ST-0205', name: 'M. Meenakshi', dept: 'Admin', role: 'Reception Clerk', status: 'Active' },
                                                            { id: 'ST-0210', name: 'T. Ramaswamy', dept: 'Operations', role: 'Depot Clerk', status: 'Active' },
                                                            { id: 'ST-0215', name: 'S. Murugesan', dept: 'Workshop', role: 'Brake Specialist', status: 'Active' },
                                                            { id: 'ST-0220', name: 'V. Lakshmi', dept: 'Admin', role: 'Cashier', status: 'Active' },
                                                            { id: 'ST-0225', name: 'K. Duraisamy', dept: 'Security', role: 'Gate Sentry', status: 'Active' },
                                                            { id: 'ST-0230', name: 'S. Senthil', dept: 'Workshop', role: 'AC Technician', status: 'Active' },
                                                            { id: 'ST-0235', name: 'R. Rajesh', dept: 'Operations', role: 'Duty Controller', status: 'Active' },
                                                            { id: 'ST-0240', name: 'M. Kokila', dept: 'Admin', role: 'Stenographer', status: 'Active' },
                                                            { id: 'ST-0245', name: 'G. Sundaram', dept: 'Workshop', role: 'Helper', status: 'Active' },
                                                            { id: 'ST-0250', name: 'S. Mani', dept: 'Operations', role: 'Yard Master', status: 'Active' }
                                                        ].map((staff, idx) => (
                                                            <tr key={idx} className="border-b border-gray-100 dark:border-slate-800/40 hover:bg-gray-50/50 dark:hover:bg-slate-850/20">
                                                                <td className="py-3 font-black text-[#0F1E36] dark:text-white">{staff.id}</td>
                                                                <td className="py-3 font-extrabold text-[#0F1E36] dark:text-white">{staff.name}</td>
                                                                <td className="py-3 font-bold text-gray-550 dark:text-gray-300">{staff.dept}</td>
                                                                <td className="py-3 text-gray-400 font-bold">{staff.role}</td>
                                                                <td className="py-3">
                                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${staff.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-450' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-450'}`}>
                                                                        {staff.status}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 text-right">
                                                                    <button onClick={() => alert(`Details query for ${staff.name}`)} className="text-[9px] font-black uppercase text-[#FF9933] cursor-pointer">
                                                                        Edit Profile
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Administration Actions Panel */}
                                        <div className="bg-white dark:bg-[#0B1E36] border border-gray-150 dark:border-slate-800 rounded-2xl p-6 shadow-sm font-bold space-y-4">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-[#0F1E36] dark:text-white mb-2">Administrative Commands</h3>
                                            
                                            <button onClick={() => alert("Opening Create Employee form")} className="w-full flex items-center justify-between p-3 bg-gray-55 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-wider text-gray-650 dark:text-gray-300 cursor-pointer">
                                                <span>Create Employee Profile</span>
                                                <Plus size={13} className="text-[#FF9933]" />
                                            </button>
                                            
                                            <button onClick={() => alert("Depot roster payroll export dispatch sequence active")} className="w-full flex items-center justify-between p-3 bg-gray-55 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-wider text-gray-650 dark:text-gray-300 cursor-pointer">
                                                <span>Generate Payroll</span>
                                                <Download size={13} className="text-blue-500" />
                                            </button>
                                            
                                            <button onClick={() => alert("Downloading complete personnel database list...")} className="w-full flex items-center justify-between p-3 bg-gray-55 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs font-black uppercase tracking-wider text-gray-650 dark:text-gray-300 cursor-pointer">
                                                <span>Export Employee List</span>
                                                <Download size={13} className="text-[#FF9933]" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ────────────────────────────────────────────────────────── */}
                            {/* MODULE 3: INTELLIGENT SCHEDULING & SPECIAL ROUTE DISPATCH */}
                            {fleetSubPage === 'schedules' && (
                                <div className="space-y-6">
                                    {/* Back Header */}
                                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-150 dark:border-slate-800">
                                        <button
                                            onClick={() => setFleetSubPage(null)}
                                            className="p-2 bg-gray-55 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-[#FF9933] rounded-xl text-gray-550 dark:text-gray-300 transition-colors cursor-pointer"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <div>
                                            <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                                                <span>Fleet Hub</span>
                                                <span>/</span>
                                                <span className="text-[#FF9933]">Scheduling & Duty</span>
                                            </div>
                                            <h2 className="text-xl font-black text-[#0F1E36] dark:text-white uppercase tracking-wider leading-none">
                                                Schedule & Deployment Management
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Active Specials */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-bold">
                                        {/* Card 1: Festival Special */}
                                        <div className="bg-white dark:bg-[#0B1E36] border border-[#FF9933]/30 rounded-2xl p-5 relative overflow-hidden shadow-sm">
                                            <div className="absolute right-3 top-3 w-7 h-7 rounded-full bg-[#FF9933]/10 text-[#FF9933] flex items-center justify-center">
                                                <Sparkles size={14} />
                                            </div>
                                            <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest">Festival Special Service</p>
                                            <h3 className="text-sm font-black text-[#0F1E36] dark:text-white mt-1">Salem Bypass Festival Extra</h3>
                                            <p className="text-xs text-gray-400 mt-2 leading-relaxed font-medium">Extra holiday service routes deployed between Salem Junction and Yercaud Hills bypass.</p>
                                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 text-[10px] uppercase font-black">
                                                <span className="text-[#0F1E36] dark:text-white">12 Buses Allocated</span>
                                                <span className="text-emerald-500">Active</span>
                                            </div>
                                        </div>
                                        {/* Card 2: Peak Hour Extras */}
                                        <div className="bg-white dark:bg-[#0B1E36] border border-gray-200 dark:border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-sm">
                                            <div className="absolute right-3 top-3 w-7 h-7 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                                <Clock size={14} />
                                            </div>
                                            <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Peak Hour Expansion</p>
                                            <h3 className="text-sm font-black text-[#0F1E36] dark:text-white mt-1">Outer Ring Road Peak Shuttle</h3>
                                            <p className="text-xs text-gray-400 mt-2 leading-relaxed font-medium">Frequent low floor electric transits allocated on high density ORR corridor routing.</p>
                                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 text-[10px] uppercase font-black">
                                                <span className="text-[#0F1E36] dark:text-white">6 Buses Deployed</span>
                                                <span className="text-emerald-500">Active</span>
                                            </div>
                                        </div>
                                        {/* Card 3: School duty */}
                                        <div className="bg-white dark:bg-[#0B1E36] border border-gray-200 dark:border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-sm">
                                            <div className="absolute right-3 top-3 w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                                <Home size={14} />
                                            </div>
                                            <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Temporary Deployment</p>
                                            <h3 className="text-sm font-black text-[#0F1E36] dark:text-white mt-1">Special School Transit Roster</h3>
                                            <p className="text-xs text-gray-400 mt-2 leading-relaxed font-medium">Assigned non-AC Deluxe buses for Corporation Public School students loop service.</p>
                                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 text-[10px] uppercase font-black">
                                                <span className="text-[#0F1E36] dark:text-white">4 Buses Scheduled</span>
                                                <span className="text-gray-400">Idle</span>
                                            </div>
                                        </div>
                                        {/* Card 4: VIP election duty */}
                                        <div className="bg-white dark:bg-[#0B1E36] border border-red-500/30 rounded-2xl p-5 relative overflow-hidden shadow-sm">
                                            <div className="absolute right-3 top-3 w-7 h-7 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center animate-pulse">
                                                <Flag size={14} />
                                            </div>
                                            <p className="text-[8px] font-black text-red-500 uppercase tracking-widest">VIP Election Duty</p>
                                            <h3 className="text-sm font-black text-[#0F1E36] dark:text-white mt-1">Legislative Assembly Polls</h3>
                                            <p className="text-xs text-gray-400 mt-2 leading-relaxed font-medium">Assigned pool transits to state election commission polling centers security dispatch.</p>
                                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 text-[10px] uppercase font-black">
                                                <span className="text-[#0F1E36] dark:text-white">18 Buses Assigned</span>
                                                <span className="text-red-500">Scheduled</span>
                                            </div>
                                        </div>
                                        {/* Card 5: Holiday Operations */}
                                        <div className="bg-white dark:bg-[#0B1E36] border border-blue-500/30 rounded-2xl p-5 relative overflow-hidden shadow-sm">
                                            <div className="absolute right-3 top-3 w-7 h-7 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                                <Calendar size={14} />
                                            </div>
                                            <p className="text-[8px] font-black text-blue-555 uppercase tracking-widest">Holiday Operations</p>
                                            <h3 className="text-sm font-black text-[#0F1E36] dark:text-white mt-1">Weekend Tourist Loop</h3>
                                            <p className="text-xs text-gray-400 mt-2 leading-relaxed font-medium">Rotational tourist buses navigating botanical garden, theme parks, and historic sites.</p>
                                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 text-[10px] uppercase font-black">
                                                <span className="text-[#0F1E36] dark:text-white">15 Buses Running</span>
                                                <span className="text-emerald-500">Active</span>
                                            </div>
                                        </div>
                                        {/* Card 6: Night Services */}
                                        <div className="bg-white dark:bg-[#0B1E36] border border-indigo-500/30 rounded-2xl p-5 relative overflow-hidden shadow-sm">
                                            <div className="absolute right-3 top-3 w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-550 flex items-center justify-center">
                                                <Moon size={14} />
                                            </div>
                                            <p className="text-[8px] font-black text-indigo-550 uppercase tracking-widest">Night Operations</p>
                                            <h3 className="text-sm font-black text-[#0F1E36] dark:text-white mt-1">Night Inter-City Express</h3>
                                            <p className="text-xs text-gray-400 mt-2 leading-relaxed font-medium">Express overnight sleeper services running on key Salem-Chennai transit grid routes.</p>
                                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 text-[10px] uppercase font-black">
                                                <span className="text-[#0F1E36] dark:text-white">10 Sleeper Units</span>
                                                <span className="text-emerald-500">Active</span>
                                            </div>
                                        </div>
                                    </div>
 
                                    {/* Master Schedules Directory */}
                                    <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-6 shadow-sm overflow-hidden text-left">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-[#0F1E36] dark:text-white mb-4">Master Duty & Trip Schedules (25 Operations)</h3>
                                        <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
                                            <table className="w-full text-xs text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-gray-100 dark:border-slate-800/80 text-[8px] font-black text-gray-405 uppercase tracking-widest sticky top-0 bg-white dark:bg-[#0B1E36] z-10">
                                                        <th className="pb-3 font-black">SCHEDULE ID</th>
                                                        <th className="pb-3 font-black">ROUTE</th>
                                                        <th className="pb-3 font-black">BUS NO</th>
                                                        <th className="pb-3 font-black">DRIVER</th>
                                                        <th className="pb-3 font-black">CONDUCTOR</th>
                                                        <th className="pb-3 font-black">FREQUENCY</th>
                                                        <th className="pb-3 font-black">STATUS</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[
                                                        { id: 'SCH-1001', route: '1C', bus: 'TN-37-N-8812', driver: 'R. Kuppusamy', conductor: 'M. Sivaraman', freq: '10 Mins Peak', status: 'Dispatched' },
                                                        { id: 'SCH-1002', route: '1A', bus: 'TN-37-N-1022', driver: 'S. Rajendran', conductor: 'K. Balu', freq: '15 Mins Ord', status: 'At Depot' },
                                                        { id: 'SCH-1003', route: '20A', bus: 'KL-01-A-4450', driver: 'V. Jayakumar', conductor: 'P. Harikrishnan', freq: '30 Mins EV', status: 'Maintenance' },
                                                        { id: 'SCH-1004', route: 'Chn Exp', bus: 'TN-37-N-3211', driver: 'A. Joseph', conductor: 'S. Kannan', freq: 'Daily Sleeper', status: 'Delayed' },
                                                        { id: 'SCH-1005', route: '500A', bus: 'TN-01-AN-9905', driver: 'K. Kathiravan', conductor: 'G. Selvam', freq: '8 Mins Fast', status: 'Active' },
                                                        { id: 'SCH-1006', route: '34', bus: 'TN-38-N-4421', driver: 'M. Palanisamy', conductor: 'A. Kumaran', freq: '20 Mins Hill', status: 'Active' },
                                                        { id: 'SCH-1007', route: '500C', bus: 'KA-57-F-9921', driver: 'H. Kempegowda', conductor: 'R. Gowda', status: 'Active', freq: '12 Mins EV' },
                                                        { id: 'SCH-1008', route: '10', bus: 'TN-40-B-1102', driver: 'A. Murugan', conductor: 'P. Arasu', freq: '15 Mins Ord', status: 'Maintenance' },
                                                        { id: 'SCH-1009', route: '2B', bus: 'KL-02-B-5561', driver: 'P. Sukumaran', conductor: 'M. Shaji', freq: '10 Mins City', status: 'Active' },
                                                        { id: 'SCH-1010', route: '5', bus: 'TN-37-N-6652', driver: 'V. Rangasamy', conductor: 'C. Devaraj', freq: '15 Mins Ord', status: 'Active' },
                                                        { id: 'SCH-1011', route: '15', bus: 'KL-14-E-1002', driver: 'T. Krishnakumar', conductor: 'J. Bobby', freq: '25 Mins EV', status: 'Active' },
                                                        { id: 'SCH-1012', route: '1C', bus: 'TN-38-F-8204', driver: 'K. Ramanujan', conductor: 'S. Muthu', freq: '10 Mins Peak', status: 'Active' },
                                                        { id: 'SCH-1013', route: '21G', bus: 'TN-01-AN-8899', driver: 'S. Rajendran', conductor: 'G. Selvam', freq: '8 Mins Metro', status: 'At Depot' },
                                                        { id: 'SCH-1014', route: 'KL-2', bus: 'KL-01-B-3322', driver: 'V. Jayakumar', conductor: 'P. Harikrishnan', freq: '15 Mins EV', status: 'Active' },
                                                        { id: 'SCH-1015', route: '500A', bus: 'KA-57-E-1244', driver: 'H. Kempegowda', conductor: 'R. Gowda', freq: '8 Mins EV', status: 'Maintenance' },
                                                        { id: 'SCH-1016', route: '11', bus: 'TN-37-N-5011', driver: 'M. Palanisamy', conductor: 'A. Kumaran', freq: '20 Mins Ord', status: 'Active' },
                                                        { id: 'SCH-1017', route: 'KL-8', bus: 'KL-15-D-9988', driver: 'M. Sebastian', conductor: 'K. Sunny', freq: '30 Mins Fast', status: 'At Depot' },
                                                        { id: 'SCH-1018', route: '45', bus: 'TN-40-A-4567', driver: 'A. Joseph', conductor: 'S. Kannan', freq: '15 Mins Deluxe', status: 'Active' },
                                                        { id: 'SCH-1019', route: '102', bus: 'TN-01-AM-5566', driver: 'K. Kathiravan', conductor: 'G. Selvam', freq: '12 Mins IT', status: 'Active' },
                                                        { id: 'SCH-1020', route: 'KL-10', bus: 'KL-02-C-1212', driver: 'P. Sukumaran', conductor: 'M. Shaji', freq: '20 Mins Airport', status: 'At Depot' },
                                                        { id: 'SCH-1021', route: '500C', bus: 'KA-03-F-7788', driver: 'R. Kuppusamy', conductor: 'M. Sivaraman', freq: '12 Mins EV', status: 'Active' },
                                                        { id: 'SCH-1022', route: 'S1', bus: 'TN-38-P-2024', driver: 'S. Muthu', conductor: 'K. Balu', freq: '10 Mins Shuttle', status: 'Active' },
                                                        { id: 'SCH-1023', route: 'KL-5', bus: 'KL-14-F-3001', driver: 'T. Krishnakumar', conductor: 'J. Bobby', freq: '25 Mins Sleep', status: 'Maintenance' },
                                                        { id: 'SCH-1024', route: 'Chn Exp', bus: 'TN-37-P-8800', driver: 'A. Joseph', conductor: 'S. Kannan', freq: 'Daily Sleeper', status: 'Delayed' },
                                                        { id: 'SCH-1025', route: '30', bus: 'TN-37-N-8812', driver: 'K. Ramanujan', conductor: 'M. Sivaraman', freq: '15 Mins Shuttle', status: 'Active' }
                                                    ].map((sch, idx) => (
                                                        <tr key={idx} className="border-b border-gray-100 dark:border-slate-800/40 text-xs hover:bg-gray-50/50 dark:hover:bg-slate-850/20">
                                                            <td className="py-2.5 font-black text-[#FF9933]">{sch.id}</td>
                                                            <td className="py-2.5 font-extrabold text-[#0F1E36] dark:text-white">Route {sch.route}</td>
                                                            <td className="py-2.5 font-bold text-gray-550 dark:text-gray-300">{sch.bus}</td>
                                                            <td className="py-2.5 text-gray-650 dark:text-gray-250 font-bold">{sch.driver}</td>
                                                            <td className="py-2.5 text-gray-450 font-medium">{sch.conductor}</td>
                                                            <td className="py-2.5 text-gray-400 font-bold">{sch.freq}</td>
                                                            <td className="py-2.5">
                                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${sch.status === 'Active' || sch.status === 'Dispatched' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-450' : sch.status === 'Maintenance' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-450' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-450'}`}>{sch.status}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Action row */}
                                    <div className="flex items-center justify-end space-x-3 bg-white dark:bg-[#0B1E36] border border-gray-150 dark:border-slate-800 p-4 rounded-xl shadow-sm">
                                        <button onClick={() => alert("Schedule creator active")} className="px-4 py-2 bg-[#FF9933] hover:bg-[#E07A00] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer">
                                            Create Special Schedule
                                        </button>
                                        <button onClick={() => alert("Publishing schedule to citizen panels")} className="px-4 py-2 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-slate-805 transition-colors cursor-pointer">
                                            Publish Schedule
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ────────────────────────────────────────────────────────── */}
                            {/* MODULE 4: WORKSHOP & MAINTENANCE LIFECYCLE MANAGEMENT */}
                            {fleetSubPage === 'maintenance' && (
                                <div className="space-y-6">
                                    {/* Back Header */}
                                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-150 dark:border-slate-800">
                                        <button
                                            onClick={() => setFleetSubPage(null)}
                                            className="p-2 bg-gray-55 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-[#FF9933] rounded-xl text-gray-550 dark:text-gray-300 transition-colors cursor-pointer"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <div>
                                            <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                                                <span>Fleet Hub</span>
                                                <span>/</span>
                                                <span className="text-[#FF9933]">Depot Workshop Queue</span>
                                            </div>
                                            <h2 className="text-xl font-black text-[#0F1E36] dark:text-white uppercase tracking-wider leading-none">
                                                Maintenance & Compliance Control
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Workshop KPI Bar */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Buses in Workshop', val: '8 Vehicles' },
                                            { label: 'Pending Routine Service', val: '12 Checks Today' },
                                            { label: 'AI Urgent Alerts', val: '3 Predictions' },
                                            { label: 'Maintenance Cost (MTD)', val: '₹1,84,500' }
                                        ].map((ma, i) => (
                                            <div key={i} className="bg-white dark:bg-[#0B1E36] p-4 border border-gray-200 dark:border-slate-800 rounded-xl">
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{ma.label}</p>
                                                <h3 className="text-lg font-black text-[#0F1E36] dark:text-white mt-1">{ma.val}</h3>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start font-bold">
                                        {/* Workshop list */}
                                        <div className="lg:col-span-2 bg-white dark:bg-[#0B1E36] border border-gray-150 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-[#0F1E36] dark:text-white mb-4">Active Repair Queue (25 Incidents)</h3>
                                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                                {[
                                                    { bus: 'KL-01-A-4450', issue: 'Battery Cell Temperature Warning', type: 'Battery Cell', workshop: 'Bay 2 (Trivandrum City)', status: 'In Workshop', cost: '₹45,000' },
                                                    { bus: 'TN-37-N-3211', issue: 'Brake Disc Alignment wear', type: 'Brake Inspection', workshop: 'Bay 1 (Hosur Road)', status: 'Awaiting Parts', cost: '₹12,000' },
                                                    { bus: 'TN-37-N-1022', issue: 'Engine Oil Filter replacement check', type: 'Oil Change', workshop: 'Central Depot Yard', status: 'Scheduled Check', cost: '₹3,400' },
                                                    { bus: 'TN-40-B-1102', issue: 'Engine Cylinder Overheating', type: 'Radiator check', workshop: 'Salem Depot Bay 3', status: 'In Workshop', cost: '₹18,500' },
                                                    { bus: 'KL-15-E-7021', issue: 'Commercial Fitness Inspection', type: 'RTO Clearance', workshop: 'Kochi Bay 4', status: 'Scheduled Check', cost: '₹5,000' },
                                                    { bus: 'TN-37-N-6652', issue: 'Passenger ETM Sync device issue', type: 'ETM re-flash', workshop: 'Central Workshop Bay 1', status: 'In Workshop', cost: '₹2,200' },
                                                    { bus: 'KL-14-E-1002', issue: 'AC Compressor Failure', type: 'AC Servicing', workshop: 'Kochi Workshop Bay 2', status: 'In Workshop', cost: '₹14,500' },
                                                    { bus: 'TN-38-F-8204', issue: 'Tyre burst replacement check', type: 'Tyre Change', workshop: 'Coimbatore Depot Yard', status: 'Scheduled Check', cost: '₹6,800' },
                                                    { bus: 'TN-01-AN-8899', issue: 'CNG Regulator Leakage check', type: 'CNG Valve replacement', workshop: 'Chennai CMBT Workshop', status: 'Awaiting Parts', cost: '₹9,200' },
                                                    { bus: 'KL-01-B-3322', issue: 'Steering Rack play alignment', type: 'Steering Calibration', workshop: 'Trivandrum Central', status: 'In Workshop', cost: '₹8,400' },
                                                    { bus: 'KA-57-E-1244', issue: 'EV Battery cells balancing check', type: 'EV Balancing', workshop: 'BMTC Electric Bay 1', status: 'Scheduled Check', cost: '₹15,000' },
                                                    { bus: 'TN-37-N-5011', issue: 'Clutch plate slip wear', type: 'Clutch replacement', workshop: 'Coimbatore Bay 3', status: 'Awaiting Parts', cost: '₹16,500' },
                                                    { bus: 'KL-15-D-9988', issue: 'Brake caliper sticky check', type: 'Brake Inspection', workshop: 'Kochi Bay 1', status: 'In Workshop', cost: '₹4,200' },
                                                    { bus: 'TN-40-A-4567', issue: 'Radiator coolant flush check', type: 'Coolant Service', workshop: 'Salem Central Depot', status: 'Scheduled Check', cost: '₹2,900' },
                                                    { bus: 'TN-01-AM-5566', issue: 'Front Wheel Bearing noise', type: 'Bearing Replacement', workshop: 'Chennai Bay 4', status: 'Awaiting Parts', cost: '₹7,400' },
                                                    { bus: 'KL-02-C-1212', issue: 'Air suspension leakage check', type: 'Bellows Replacement', workshop: 'Trivandrum Bay 2', status: 'In Workshop', cost: '₹22,000' },
                                                    { bus: 'KA-03-F-7788', issue: 'Fast charger handshake failure', type: 'OBC firmware re-flash', workshop: 'BMTC Charging Yard', status: 'Scheduled Check', cost: '₹1,500' },
                                                    { bus: 'TN-38-P-2024', issue: 'Wiper motor electrical failure', type: 'Motor Replacement', workshop: 'Coimbatore Bay 1', status: 'In Workshop', cost: '₹3,100' },
                                                    { bus: 'KL-14-F-3001', issue: 'Engine head gasket leak check', type: 'Gasket Overhaul', workshop: 'Kochi Central Yard', status: 'Awaiting Parts', cost: '₹38,000' },
                                                    { bus: 'TN-37-P-8800', issue: 'Rear axle leaf spring crack', type: 'Leaf Spring replacement', workshop: 'SETC Workshop Bay 3', status: 'In Workshop', cost: '₹28,500' },
                                                    { bus: 'TN-37-N-8812', issue: 'Oil pressure indicator warning', type: 'Sensor Replacement', workshop: 'Coimbatore Bay 2', status: 'Scheduled Check', cost: '₹1,800' },
                                                    { bus: 'TN-37-N-1022', issue: 'Alternator charging check', type: 'Alternator Carbon replace', workshop: 'Coimbatore Yard 1', status: 'In Workshop', cost: '₹4,800' },
                                                    { bus: 'KL-01-A-4450', issue: 'Door sensor calibration check', type: 'Pneumatic Valve repair', workshop: 'Trivandrum Bay 1', status: 'Scheduled Check', cost: '₹2,400' },
                                                    { bus: 'TN-37-N-3211', issue: 'Windshield glass chip crack', type: 'Windshield Replace', workshop: 'Central Workshop', status: 'Awaiting Parts', cost: '₹11,000' },
                                                    { bus: 'TN-01-AN-9905', issue: 'Rear bumper bracket alignment', type: 'Body repair workshop', workshop: 'Tambaram Depot', status: 'In Workshop', cost: '₹6,500' }
                                                ].map((w, idx) => (
                                                    <div key={idx} className="p-4 bg-gray-55 dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                                                        <div>
                                                            <p className="font-black text-sm text-[#0F1E36] dark:text-white">{w.bus}</p>
                                                            <p className="text-gray-400 mt-1">{w.issue}</p>
                                                            <p className="text-[9px] text-[#FF9933] mt-0.5 uppercase tracking-widest">{w.workshop}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[8px] font-black uppercase border bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-450">{w.status}</span>
                                                            <p className="text-xs font-black mt-2 text-[#0F1E36] dark:text-white">{w.cost}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Predictions & Actions */}
                                        <div className="bg-white dark:bg-[#0B1E36] border border-gray-150 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-[#0F1E36] dark:text-white mb-2">AI Diagnostics Forecast</h3>
                                            
                                            <div className="p-3.5 bg-gradient-to-br from-[#0B1F3A] to-[#0A4D3E] text-white border border-[#00B074]/30 rounded-xl space-y-2 text-xs">
                                                <div className="flex items-center space-x-1.5 text-rose-400 font-black uppercase text-[8px] tracking-widest">
                                                    <Zap size={11} className="animate-pulse" />
                                                    <span>Urgent Predictive Warning</span>
                                                </div>
                                                <p className="font-bold leading-relaxed text-[11px]">Tyre wear telemetry for **KL-01-A-4450** indicates alignment replacement within 12 days to prevent safety violation.</p>
                                            </div>

                                            <div className="p-3 bg-gray-55 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-xs font-bold text-gray-555 dark:text-gray-400">
                                                <p className="font-black text-[9px] text-gray-400 uppercase tracking-widest">Oil Viscosity Alert</p>
                                                <p className="text-[#0F1E36] dark:text-white mt-1 leading-normal">TN-37-N-8812 oil telemetry suggests oil filtration check in 350 km.</p>
                                            </div>

                                            <div className="space-y-2 pt-4">
                                                <button onClick={() => alert("Opening maintenance scheduler dialog")} className="w-full py-2.5 bg-[#FF9933] hover:bg-[#E07A00] text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer">
                                                    Schedule Maintenance
                                                </button>
                                                <button onClick={() => alert("Maintenance cost analytics generated")} className="w-full py-2.5 border border-gray-250 dark:border-slate-700 text-[#0F1E36] dark:text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer">
                                                    Generate Service Report
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ────────────────────────────────────────────────────────── */}
                            {/* MODULE 5: SPARE PARTS & DEPOT INVENTORY WORKSPACE */}
                            {fleetSubPage === 'inventory' && (
                                <div className="space-y-6">
                                    {/* Back Header */}
                                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-150 dark:border-slate-800">
                                        <button
                                            onClick={() => setFleetSubPage(null)}
                                            className="p-2 bg-gray-55 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-[#FF9933] rounded-xl text-gray-550 dark:text-gray-300 transition-colors cursor-pointer"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <div>
                                            <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                                                <span>Fleet Hub</span>
                                                <span>/</span>
                                                <span className="text-[#FF9933]">Depot Stock Inventory</span>
                                            </div>
                                            <h2 className="text-xl font-black text-[#0F1E36] dark:text-white uppercase tracking-wider leading-none">
                                                Inventory & Spare Parts Control
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Catalog spare parts', val: '240 Items' },
                                            { label: 'Low Stock Alerts', val: '4 items warning' },
                                            { label: 'Pending Purchase Orders', val: '2 Request' },
                                            { label: 'Depot Warehouse Manager', val: 'K. Narayanan' }
                                        ].map((inv, i) => (
                                            <div key={i} className="bg-white dark:bg-[#0B1E36] p-4 border border-gray-200 dark:border-slate-800 rounded-xl">
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{inv.label}</p>
                                                <h3 className="text-lg font-black text-[#0F1E36] dark:text-white mt-1">{inv.val}</h3>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Inventory log list */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start font-bold">
                                        <div className="lg:col-span-2 bg-white dark:bg-[#0B1E36] border border-gray-150 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-[#0F1E36] dark:text-white mb-4">Stock Ledger Catalog (25 Items)</h3>
                                            <div className="overflow-x-auto max-h-[500px] overflow-y-auto pr-2">
                                                <table className="w-full text-xs text-left">
                                                    <thead>
                                                        <tr className="border-b border-gray-100 dark:border-slate-800 text-[8px] font-black text-gray-450 uppercase tracking-widest">
                                                            <th className="pb-2">PART NAME</th>
                                                            <th className="pb-2">CATEGORY</th>
                                                            <th className="pb-2 text-right">STOCK LEVEL</th>
                                                            <th className="pb-2 text-right">THRESHOLD</th>
                                                            <th className="pb-2 text-right">PENDING ORDER</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {[
                                                             { name: 'Heavy Vehicle Tyres (10.00 R20)', cat: 'Tyres', stock: '18 Units', thresh: '20', order: '40 Units', low: true },
                                                             { name: 'Engine Oil (15W-40 Premium)', cat: 'Lubricants', stock: '420 Liters', thresh: '100', order: '0 Liters', low: false },
                                                             { name: 'ETM Ticket Roll Carton', cat: 'Consumables', stock: '14 Cases', thresh: '5', order: '0 Cases', low: false },
                                                             { name: 'Android ETM Ticket Dispenser', cat: 'Devices', stock: '15 Units', thresh: '10', order: '0 Units', low: false },
                                                             { name: 'Brake Fluid Dot 4 (Castrol)', cat: 'Lubricants', stock: '45 Liters', thresh: '15', order: '0 Liters', low: false },
                                                             { name: 'LED Destination Board Module', cat: 'Devices', stock: '3 Units', thresh: '5', order: '10 Units', low: true },
                                                             { name: 'Air Filter Element (Leyland)', cat: 'Filters', stock: '12 Units', thresh: '15', order: '30 Units', low: true },
                                                             { name: 'Oil Filter Element (TATA LPO)', cat: 'Filters', stock: '28 Units', thresh: '20', order: '0 Units', low: false },
                                                             { name: 'Diesel Fuel Filter Secondary', cat: 'Filters', stock: '14 Units', thresh: '10', order: '0 Units', low: false },
                                                             { name: 'Windshield Wiper Blades 24"', cat: 'Consumables', stock: '8 Pairs', thresh: '10', order: '20 Pairs', low: true },
                                                             { name: 'EV Battery Coolant Liquid', cat: 'Lubricants', stock: '85 Liters', thresh: '50', order: '0 Liters', low: false },
                                                             { name: 'Headlight Bulb 24V 70W', cat: 'Electrical', stock: '45 Units', thresh: '20', order: '0 Units', low: false },
                                                             { name: 'Taillight Assembly (Volvo)', cat: 'Electrical', stock: '6 Units', thresh: '5', order: '0 Units', low: false },
                                                             { name: 'Fan Belt (Gates V-Belt)', cat: 'Consumables', stock: '18 Units', thresh: '10', order: '0 Units', low: false },
                                                             { name: 'Wheel Hub Grease (EP3)', cat: 'Lubricants', stock: '25 Kg', thresh: '10', order: '0 Kg', low: false },
                                                             { name: 'Ticket Dispenser Battery Pack', cat: 'Electrical', stock: '12 Units', thresh: '15', order: '30 Units', low: true },
                                                             { name: 'Pneumatic Door Valve Kit', cat: 'Brakes', stock: '5 Units', thresh: '5', order: '10 Units', low: true },
                                                             { name: 'Seat Cover Vinyl Roll', cat: 'Consumables', stock: '2 Rolls', thresh: '3', order: '5 Rolls', low: true },
                                                             { name: 'Engine Mounting Rubber (Leyland)', cat: 'Consumables', stock: '6 Units', thresh: '4', order: '0 Units', low: false },
                                                             { name: 'Alternator Belt (TATA LPO)', cat: 'Electrical', stock: '15 Units', thresh: '10', order: '0 Units', low: false },
                                                             { name: 'RTO First Aid Kit Replacements', cat: 'Consumables', stock: '32 Kits', thresh: '15', order: '0 Kits', low: false },
                                                             { name: 'Front Brake Pads Set (Volvo/Leyland)', cat: 'Brakes', stock: '35 Units', thresh: '15', order: '0 Units', low: false },
                                                             { name: 'Commercial EV Battery Cell Module', cat: 'Electrical', stock: '4 Modules', thresh: '5', order: '12 Modules', low: true },
                                                             { name: 'Coolant Concentrate (Green)', cat: 'Consumables', stock: '125 Liters', thresh: '50', order: '0 Liters', low: false },
                                                             { name: 'Android ETM Ticket Dispenser', cat: 'Devices', stock: '15 Units', thresh: '10', order: '0 Units', low: false }
                                                         ].map((item, idx) => (
                                                            <tr key={idx} className="border-b border-gray-100 dark:border-slate-800/40 hover:bg-gray-50/50 dark:hover:bg-slate-850/20">
                                                                <td className="py-3 font-black text-[#0F1E36] dark:text-white">{item.name}</td>
                                                                <td className="py-3 font-bold text-gray-550 dark:text-gray-300">{item.cat}</td>
                                                                <td className={`py-3 text-right font-black ${item.low ? 'text-rose-500' : 'text-[#0F1E36] dark:text-white'}`}>{item.stock}</td>
                                                                <td className="py-3 text-right text-gray-400 font-bold">{item.thresh} Units</td>
                                                                <td className="py-3 text-right font-black text-blue-500">{item.order}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Purchase request panel */}
                                        <div className="bg-white dark:bg-[#0B1E36] border border-gray-150 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-[#0F1E36] dark:text-white mb-2">Raise Procurement Request</h3>
                                            
                                            <div>
                                                <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Select Spare Item</label>
                                                <select className="w-full px-3 py-2 bg-gray-55 dark:bg-slate-900 border border-gray-250 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white focus:outline-none focus:border-[#FF9933]">
                                                    <option>Heavy Vehicle Tyres (10.00 R20)</option>
                                                    <option>Replacement GPS Tracking Device</option>
                                                    <option>Brake Pads Set</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Quantity (Units)</label>
                                                <input type="number" defaultValue={20} className="w-full px-3 py-2 bg-gray-55 dark:bg-slate-900 border border-gray-250 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white focus:outline-none focus:border-[#FF9933]" />
                                            </div>

                                            <div className="pt-2">
                                                <button onClick={() => alert("Procurement purchase order sent to vendor")} className="w-full py-2.5 bg-[#FF9933] hover:bg-[#E07A00] text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer">
                                                    Request Purchase Order
                                                </button>
                                                <button onClick={() => alert("Downloading stock report...")} className="w-full py-2.5 border border-gray-250 dark:border-slate-700 text-[#0F1E36] dark:text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer mt-2">
                                                    Download Inventory Report
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ────────────────────────────────────────────────────────── */}
                            {/* MODULE 6: CENTRAL FLEET HUB NAVIGATION DASHBOARD */}
                            {fleetSubPage === null && (
                                <div className="space-y-6">
                                    
                                    {/* Header Intro */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between text-left pb-4 border-b border-gray-150 dark:border-slate-800">
                                        <div>
                                            <div className="flex items-center space-x-2 text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">
                                                <span>Operations Console</span>
                                                <span>/</span>
                                                <span className="text-[#FF9933]">Hub Overview</span>
                                            </div>
                                            <h2 className="text-2xl font-black text-[#0F1E36] dark:text-white uppercase tracking-wider leading-none">
                                                Fleet Management
                                            </h2>
                                        </div>
                                        <div className="mt-4 md:mt-0 flex items-center space-x-2.5 shrink-0">
                                            <button
                                                onClick={() => setShowRegisterBusModal(true)}
                                                className="flex items-center space-x-1.5 px-4 py-2.5 bg-[#FF9933] hover:bg-[#E07A00] text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                                            >
                                                <Plus size={14} />
                                                <span>Register Bus</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Top Statistics Cards (8 KPI Cards) */}
                                    <div className="grid grid-cols-2 lg:grid-cols-8 gap-4 text-left">
                                        {[
                                            { title: 'Total Fleet', val: '142', sub: '+3 New', color: 'text-gray-500 bg-gray-500/10', icon: Bus },
                                            { title: 'Active Fleet', val: '118', sub: '92% Active', color: 'text-emerald-500 bg-emerald-500/10', icon: Shield },
                                            { title: 'Running Buses', val: '48', sub: '100% capacity', color: 'text-blue-500 bg-blue-500/10', icon: MapPin },
                                            { title: 'Buses at Depot', val: '21', sub: 'Standby standby', color: 'text-indigo-500 bg-indigo-500/10', icon: Home },
                                            { title: 'In Maintenance', val: '8', sub: '3 servicing', color: 'text-amber-500 bg-amber-500/10', icon: Settings },
                                            { title: 'Breakdowns', val: '3', sub: 'Immediate fix', color: 'text-red-500 bg-red-500/10', icon: AlertTriangle },
                                            { title: 'Avg Fleet Health', val: '94%', sub: 'Optimal', color: 'text-rose-500 bg-rose-500/10', icon: CheckCircle },
                                            { title: 'Today\'s Ops', val: '98%', sub: 'Complete Dispatch', color: 'text-emerald-600 bg-emerald-600/10', icon: Activity }
                                        ].map((c, i) => (
                                            <div key={i} className="bg-white dark:bg-[#0B1E36] rounded-xl border border-gray-200 dark:border-slate-800/80 p-4 flex flex-col justify-between shadow-sm relative overflow-hidden hover:border-[#FF9933]/50 transition-colors">
                                                <div className="flex items-start justify-between">
                                                    <span className="text-[8px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-wider line-clamp-1">{c.title}</span>
                                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${c.color}`}>
                                                        <c.icon size={12} />
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <h3 className="text-lg font-black text-[#0F1E36] dark:text-white leading-none">{c.val}</h3>
                                                    <p className="text-[8px] font-bold text-gray-400 dark:text-slate-500 mt-1 uppercase tracking-wider">{c.sub}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Split Grid: Left (Registry Table & Module Cards) | Right (AI Insights Panel) */}
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                                        
                                        {/* Left Main (3/4 width) */}
                                        <div className="lg:col-span-3 space-y-6">
                                            
                                            {/* Registry Table */}
                                            <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-6 shadow-sm overflow-hidden">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-2">
                                                        <Bus className="w-5 h-5 text-[#FF9933]" />
                                                        <h3 className="text-sm font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">Depot Active Fleet Registry</h3>
                                                    </div>
                                                </div>

                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead>
                                                            <tr className="border-b border-gray-100 dark:border-slate-800/80 text-[8px] font-black text-gray-400 uppercase tracking-widest">
                                                                <th className="pb-3 font-black">BUS NUMBER</th>
                                                                <th className="pb-3 font-black">REG NO</th>
                                                                <th className="pb-3 font-black">ASSIGNED ROUTE</th>
                                                                <th className="pb-3 font-black">DRIVER / CONDUCTOR</th>
                                                                <th className="pb-3 font-black">CURRENT STATUS</th>
                                                                <th className="pb-3 font-black">FLEET HEALTH</th>
                                                                <th className="pb-3 font-black">NEXT SERVICE</th>
                                                                <th className="pb-3 font-black">ETM STATUS</th>
                                                                <th className="pb-3 text-right font-black">ACTION</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {[
                                                                 { busNo: 'TN-37-N-8812', regNo: 'TN37N8812', route: '1C', driver: 'R. Kuppusamy', conductor: 'M. Sivaraman', status: 'Running', health: 92, next: '25 Jul 2026', etm: 'Online', model: 'Leyland Viking', depot: 'Coimbatore Depot 1', fuelType: 'Diesel', chassis: 'CHAS-88120', engine: 'ENG-V6-88', location: 'Gandhipuram', speed: '42 km/h', mfgYear: 2022, capacity: 54, odometer: '142,350 km' },
                                                                 { busNo: 'TN-37-N-1022', regNo: 'TN37N1022', route: '1A', driver: 'S. Rajendran', conductor: 'K. Balu', status: 'At Depot', health: 88, next: '18 Jul 2026', etm: 'Online', model: 'TATA LPO', depot: 'Coimbatore Depot 2', fuelType: 'CNG', chassis: 'CHAS-10220', engine: 'ENG-CNG-10', location: 'Depot Yard', speed: '0 km/h', mfgYear: 2021, capacity: 52, odometer: '215,800 km' },
                                                                 { busNo: 'KL-01-A-4450', regNo: 'KL01A4450', route: '20A', driver: 'V. Jayakumar', conductor: 'P. Harikrishnan', status: 'Maintenance', health: 68, next: 'Today', etm: 'Offline', model: 'Eicher Electric', depot: 'Trivandrum City Depot', fuelType: 'Electric', chassis: 'CHAS-44500', engine: 'ENG-ELEC-44', location: 'Bay 2', speed: '0 km/h', mfgYear: 2023, capacity: 48, odometer: '48,200 km' },
                                                                 { busNo: 'TN-37-N-3211', regNo: 'TN37N3211', route: 'Chennai Exp', driver: 'A. Joseph', conductor: 'S. Kannan', status: 'Breakdown', health: 45, next: 'Immediate', etm: 'Offline', model: 'Volvo 9400', depot: 'SETC Coimbatore', fuelType: 'Diesel', chassis: 'CHAS-32110', engine: 'ENG-V8-32', location: 'NH81 Highway', speed: '0 km/h', mfgYear: 2020, capacity: 42, odometer: '385,420 km' },
                                                                 { busNo: 'TN-01-AN-9905', regNo: 'TN01AN9905', route: '500A', driver: 'K. Kathiravan', conductor: 'G. Selvam', status: 'Idle', health: 91, next: '02 Aug 2026', etm: 'Online', model: 'Leyland Viking', depot: 'Chennai Depot 3', fuelType: 'Diesel', chassis: 'CHAS-99050', engine: 'ENG-V6-99', location: 'Tambaram Depot', speed: '0 km/h', mfgYear: 2023, capacity: 54, odometer: '65,900 km' },
                                                                 { busNo: 'KL-15-E-7021', regNo: 'KL15E7021', route: 'Swift Spl', driver: 'M. Sebastian', conductor: 'K. Sunny', status: 'At Depot', health: 82, next: 'Expired', etm: 'Online', model: 'KSRTC Swift Leyland', depot: 'Kochi Central Depot', fuelType: 'Diesel', chassis: 'CHAS-70210', engine: 'ENG-V6-70', location: 'Kochi Depot', speed: '0 km/h', mfgYear: 2019, capacity: 50, odometer: '412,900 km' },
                                                                 { busNo: 'TN-38-N-4421', regNo: 'TN38N4421', route: '34', driver: 'M. Palanisamy', conductor: 'A. Kumaran', status: 'Running', health: 90, next: '10 Aug 2026', etm: 'Online', model: 'Leyland Viking', depot: 'Coimbatore Depot 1', fuelType: 'Diesel', chassis: 'CHAS-44210', engine: 'ENG-V6-44', location: 'New Bus Stand', speed: '48 km/h', mfgYear: 2022, capacity: 54, odometer: '112,400 km' },
                                                                 { busNo: 'KA-57-F-9921', regNo: 'KA57F9921', route: '500C', driver: 'H. Kempegowda', conductor: 'R. Gowda', status: 'Running', health: 93, next: '14 Aug 2026', etm: 'Online', model: 'Volvo Electric', depot: 'BMTC Depot 4', fuelType: 'Electric', chassis: 'CHAS-99210', engine: 'ENG-ELEC-99', location: 'Silk Board', speed: '35 km/h', mfgYear: 2023, capacity: 45, odometer: '32,100 km' },
                                                                 { busNo: 'TN-40-B-1102', regNo: 'TN40B1102', route: '10', driver: 'A. Murugan', conductor: 'P. Arasu', status: 'Maintenance', health: 72, next: 'Tomorrow', etm: 'Offline', model: 'TATA LPO', depot: 'Salem Depot 1', fuelType: 'Diesel', chassis: 'CHAS-11020', engine: 'ENG-V6-11', location: 'Salem Bay 3', speed: '0 km/h', mfgYear: 2020, capacity: 52, odometer: '280,500 km' },
                                                                 { busNo: 'KL-02-B-5561', regNo: 'KL02B5561', route: '2B', driver: 'P. Sukumaran', conductor: 'M. Shaji', status: 'Running', health: 89, next: '29 Jul 2026', etm: 'Online', model: 'Leyland Viking', depot: 'Trivandrum City Depot', fuelType: 'Diesel', chassis: 'CHAS-55610', engine: 'ENG-V6-55', location: 'East Fort', speed: '38 km/h', mfgYear: 2021, capacity: 54, odometer: '198,300 km' },
                                                                 { busNo: 'TN-37-N-6652', regNo: 'TN37N6652', route: '5', driver: 'V. Rangasamy', conductor: 'C. Devaraj', status: 'Running', health: 91, next: '05 Aug 2026', etm: 'Online', model: 'TATA Deluxe', depot: 'Coimbatore Depot 2', fuelType: 'CNG', chassis: 'CHAS-66520', engine: 'ENG-CNG-66', location: 'Salem Junction', speed: '55 km/h', mfgYear: 2022, capacity: 50, odometer: '95,700 km' },
                                                                 { busNo: 'KL-14-E-1002', regNo: 'KL14E1002', route: '15', driver: 'T. Krishnakumar', conductor: 'J. Bobby', status: 'Running', health: 95, next: '21 Aug 2026', etm: 'Online', model: 'Eicher Pro Electric', depot: 'Kochi Central Depot', fuelType: 'Electric', chassis: 'CHAS-10020', engine: 'ENG-ELEC-10', location: 'Aluva Flyover', speed: '40 km/h', mfgYear: 2023, capacity: 48, odometer: '29,400 km' },
                                                                 { busNo: 'TN-38-F-8204', regNo: 'TN38F8204', route: '1C', driver: 'K. Ramanujan', conductor: 'S. Muthu', status: 'Running', health: 94, next: '10 Aug 2026', etm: 'Online', model: 'Leyland Viking', depot: 'Coimbatore Depot 1', fuelType: 'Diesel', chassis: 'CHAS-82040', engine: 'ENG-V6-82', location: 'Peelamedu', speed: '40 km/h', mfgYear: 2022, capacity: 54, odometer: '124,500 km' },
                                                                 { busNo: 'TN-01-AN-8899', regNo: 'TN01AN8899', route: '21G', driver: 'S. Rajendran', conductor: 'G. Selvam', status: 'At Depot', health: 87, next: '28 Jul 2026', etm: 'Online', model: 'TATA LPO', depot: 'Chennai Depot 3', fuelType: 'CNG', chassis: 'CHAS-88990', engine: 'ENG-CNG-88', location: 'CMBT Yard', speed: '0 km/h', mfgYear: 2021, capacity: 52, odometer: '185,200 km' },
                                                                 { busNo: 'KL-01-B-3322', regNo: 'KL01B3322', route: 'KL-2', driver: 'V. Jayakumar', conductor: 'P. Harikrishnan', status: 'Running', health: 91, next: '05 Aug 2026', etm: 'Online', model: 'Eicher Electric', depot: 'Trivandrum City Depot', fuelType: 'Electric', chassis: 'CHAS-33220', engine: 'ENG-ELEC-33', location: 'Vyttila', speed: '32 km/h', mfgYear: 2023, capacity: 48, odometer: '38,100 km' },
                                                                 { busNo: 'KA-57-E-1244', regNo: 'KA57E1244', route: '500A', driver: 'H. Kempegowda', conductor: 'R. Gowda', status: 'Maintenance', health: 70, next: 'Tomorrow', etm: 'Offline', model: 'Volvo Electric', depot: 'BMTC Depot 4', fuelType: 'Electric', chassis: 'CHAS-12440', engine: 'ENG-ELEC-12', location: 'Workshop Bay 2', speed: '0 km/h', mfgYear: 2022, capacity: 45, odometer: '75,600 km' },
                                                                 { busNo: 'TN-37-N-5011', regNo: 'TN37N5011', route: '11', driver: 'M. Palanisamy', conductor: 'A. Kumaran', status: 'Running', health: 90, next: '12 Aug 2026', etm: 'Online', model: 'Leyland Viking', depot: 'Coimbatore Depot 2', fuelType: 'Diesel', chassis: 'CHAS-50110', engine: 'ENG-V6-50', location: 'Railway Station', speed: '30 km/h', mfgYear: 2021, capacity: 54, odometer: '210,400 km' },
                                                                 { busNo: 'KL-15-D-9988', regNo: 'KL15D9988', route: 'KL-8', driver: 'M. Sebastian', conductor: 'K. Sunny', status: 'Idle', health: 85, next: '14 Aug 2026', etm: 'Online', model: 'KSRTC Swift Leyland', depot: 'Kochi Central Depot', fuelType: 'Diesel', chassis: 'CHAS-99880', engine: 'ENG-V6-99', location: 'Standby Bay 3', speed: '0 km/h', mfgYear: 2020, capacity: 50, odometer: '325,400 km' },
                                                                 { busNo: 'TN-40-A-4567', regNo: 'TN40A4567', route: '45', driver: 'A. Joseph', conductor: 'S. Kannan', status: 'Running', health: 93, next: '18 Aug 2026', etm: 'Online', model: 'TATA Deluxe', depot: 'Salem Depot 1', fuelType: 'CNG', chassis: 'CHAS-45670', engine: 'ENG-CNG-45', location: 'Hasthampatti', speed: '45 km/h', mfgYear: 2022, capacity: 50, odometer: '88,900 km' },
                                                                 { busNo: 'TN-01-AM-5566', regNo: 'TN01AM5566', route: '102', driver: 'K. Kathiravan', conductor: 'G. Selvam', status: 'Running', health: 88, next: '22 Jul 2026', etm: 'Online', model: 'Leyland Viking', depot: 'Chennai Depot 3', fuelType: 'Diesel', chassis: 'CHAS-55660', engine: 'ENG-V6-55', location: 'Sholinganallur', speed: '36 km/h', mfgYear: 2019, capacity: 54, odometer: '290,100 km' },
                                                                 { busNo: 'KL-02-C-1212', regNo: 'KL02C1212', route: 'KL-10', driver: 'P. Sukumaran', conductor: 'M. Shaji', status: 'At Depot', health: 89, next: '05 Aug 2026', etm: 'Online', model: 'Leyland Viking', depot: 'Trivandrum City Depot', fuelType: 'Diesel', chassis: 'CHAS-12120', engine: 'ENG-V6-12', location: 'Main Terminal', speed: '0 km/h', mfgYear: 2021, capacity: 54, odometer: '148,900 km' },
                                                                 { busNo: 'KA-03-F-7788', regNo: 'KA03F7788', route: '500C', driver: 'R. Kuppusamy', conductor: 'M. Sivaraman', status: 'Running', health: 92, next: '10 Aug 2026', etm: 'Online', model: 'Volvo Electric', depot: 'BMTC Depot 4', fuelType: 'Electric', chassis: 'CHAS-77880', engine: 'ENG-ELEC-77', location: 'Silk Board', speed: '28 km/h', mfgYear: 2023, capacity: 45, odometer: '34,500 km' },
                                                                 { busNo: 'TN-38-P-2024', regNo: 'TN38P2024', route: 'S1', driver: 'S. Muthu', conductor: 'K. Balu', status: 'Running', health: 91, next: '20 Aug 2026', etm: 'Online', model: 'TATA LPO', depot: 'Coimbatore Depot 1', fuelType: 'CNG', chassis: 'CHAS-20240', engine: 'ENG-CNG-20', location: 'Gandhipuram', speed: '40 km/h', mfgYear: 2022, capacity: 52, odometer: '92,100 km' },
                                                                 { busNo: 'KL-14-F-3001', regNo: 'KL14F3001', route: 'KL-5', driver: 'T. Krishnakumar', conductor: 'J. Bobby', status: 'Maintenance', health: 65, next: 'Today', etm: 'Offline', model: 'KSRTC Swift Leyland', depot: 'Kochi Central Depot', fuelType: 'Diesel', chassis: 'CHAS-30010', engine: 'ENG-V6-30', location: 'Repair Bay 1', speed: '0 km/h', mfgYear: 2020, capacity: 50, odometer: '382,900 km' },
                                                                 { busNo: 'TN-37-P-8800', regNo: 'TN37P8800', route: 'Chennai Exp', driver: 'A. Joseph', conductor: 'S. Kannan', status: 'Breakdown', health: 40, next: 'Immediate', etm: 'Offline', model: 'Volvo 9400', depot: 'SETC Coimbatore', fuelType: 'Diesel', chassis: 'CHAS-88000', engine: 'ENG-V8-88', location: 'Attur bypass NH', speed: '0 km/h', mfgYear: 2019, capacity: 42, odometer: '412,500 km' }
                                                             ].map((bus) => {
                                                                let chipStyle = 'bg-gray-50 text-gray-650 border-gray-200';
                                                                if (bus.status === 'Running') chipStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40';
                                                                else if (bus.status === 'At Depot') chipStyle = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40';
                                                                else if (bus.status === 'Maintenance') chipStyle = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/40';
                                                                else if (bus.status === 'Breakdown') chipStyle = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/40';

                                                                return (
                                                                    <tr key={bus.busNo} onClick={() => setSelectedBus(bus)} className="border-b border-gray-100 dark:border-slate-800/40 text-xs hover:bg-gray-50/50 dark:hover:bg-slate-850/20 transition-all cursor-pointer">
                                                                        <td className="py-3 font-black text-[#0F1E36] dark:text-white flex items-center space-x-2">
                                                                            <Bus size={12} className="text-gray-400" />
                                                                            <span>{bus.busNo}</span>
                                                                        </td>
                                                                        <td className="py-3 font-extrabold uppercase text-[10px] tracking-wide text-gray-550 dark:text-slate-500">{bus.regNo}</td>
                                                                        <td className="py-3 font-extrabold text-[#0F1E36] dark:text-white">Route {bus.route}</td>
                                                                        <td className="py-3">
                                                                            <div className="font-extrabold text-[#0F1E36] dark:text-white">{bus.driver}</div>
                                                                            <div className="text-[8px] text-gray-400 font-bold mt-0.5">{bus.conductor}</div>
                                                                        </td>
                                                                        <td className="py-3 font-bold">
                                                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${chipStyle}`}>{bus.status}</span>
                                                                        </td>
                                                                        <td className="py-3 font-black text-gray-600 dark:text-gray-300">{bus.health}% Health</td>
                                                                        <td className="py-3 font-bold text-gray-400">{bus.next}</td>
                                                                        <td className="py-3">
                                                                            <span className={`inline-flex items-center space-x-1 text-[9px] font-black ${bus.etm === 'Online' ? 'text-emerald-500' : 'text-gray-400'}`}>
                                                                                <span className={`w-1.5 h-1.5 rounded-full ${bus.etm === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}></span>
                                                                                <span className="uppercase">{bus.etm}</span>
                                                                            </span>
                                                                        </td>
                                                                        <td className="py-3 text-right">
                                                                            <ChevronRight size={14} className="text-gray-400 inline" />
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* Fleet Operations Card Modules Grid */}
                                            <div className="space-y-4 text-left">
                                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Fleet Operations Modules</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-bold">
                                                    {[
                                                        { id: 'drivers', title: 'Driver & Conductor Management', desc: 'Manage drivers and conductors assigned to buses operating under this depot.', stats: '248 Active Crew members', icon: Users, theme: 'border-l-4 border-l-[#FF9933]' },
                                                        { id: 'staff', title: 'Staff Management', desc: 'Manage all depot employees and operational administrative staff.', stats: '384 Depot Employees registered', icon: User, theme: 'border-l-4 border-l-blue-500' },
                                                        { id: 'schedules', title: 'Schedule Management', desc: 'Manage operational schedules and special transport deployments.', stats: '842 Daily Schedules Dispatch', icon: Calendar, theme: 'border-l-4 border-l-indigo-500' },
                                                        { id: 'maintenance', title: 'Maintenance Management', desc: 'Monitor routine service, tyre changes, and predictive workshop checks.', stats: '8 Buses in Workshop Bay Queue', icon: Settings, theme: 'border-l-4 border-l-amber-500' },
                                                        { id: 'inventory', title: 'Depot Inventory', desc: 'Monitor and manage all depot inventory, spare parts, and ETM devices.', stats: '240 Catalog spares in stock', icon: Sliders, theme: 'border-l-4 border-l-emerald-500' }
                                                    ].map((mod) => (
                                                        <div
                                                            key={mod.id}
                                                            onClick={() => setFleetSubPage(mod.id)}
                                                            className={`bg-white dark:bg-[#0B1E36] p-5 rounded-2xl border border-gray-150 dark:border-slate-805 shadow-sm flex items-start space-x-4 cursor-pointer hover:border-[#FF9933] hover:shadow-md transition-all group ${mod.theme}`}
                                                        >
                                                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-[#FF9933] flex items-center justify-center shrink-0 group-hover:bg-[#FF9933]/10 transition-colors">
                                                                <mod.icon size={20} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-sm font-black text-[#0F1E36] dark:text-white uppercase tracking-wider group-hover:text-[#FF9933] transition-colors">{mod.title}</h4>
                                                                <p className="text-[11px] font-medium text-gray-400 mt-1 leading-normal">{mod.desc}</p>
                                                                <div className="flex items-center justify-between mt-3 text-[9px] uppercase font-black tracking-widest text-[#FF9933]">
                                                                    <span>{mod.stats}</span>
                                                                    <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                        </div>

                                        {/* Right Sidebar (1/4 width) AI Fleet Insights */}
                                        <div className="space-y-6 text-left">
                                            <div className="bg-gradient-to-br from-[#0B1F3A] to-[#0A4D3E] border border-[#00B074]/30 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group">
                                                <div className="flex items-center space-x-2 mb-4">
                                                    <Zap size={15} className="text-[#FF9933] animate-pulse" />
                                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#00B074]">AI Operations Insights</h3>
                                                </div>

                                                <div className="space-y-4 font-bold text-xs">
                                                    {/* Health gauge circular */}
                                                    <div className="flex items-center space-x-3 p-3 bg-white/5 border border-white/10 rounded-xl">
                                                        <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                                <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5" />
                                                                <circle cx="18" cy="18" r="16" fill="none" stroke="#00B074" strokeWidth="3.5" strokeDasharray="100 100" strokeDashoffset="6" />
                                                            </svg>
                                                            <span className="absolute text-[9px] font-black">94%</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-white uppercase tracking-wider text-[10px]">Average Fleet Health</p>
                                                            <p className="text-[8px] text-gray-300 font-medium">94/100 depot optimal score</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
                                                        <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-white/10 rounded text-rose-400">Renewal Alert</span>
                                                        <p className="text-[10px] text-gray-250 leading-relaxed font-bold">3 Vehicles (TN-37-N-3211, KL-15-E-7021, etc.) have Fitness Certificates (FC) due for renewal within 15 days.</p>
                                                    </div>

                                                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
                                                        <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-white/10 rounded text-amber-400">Inventory Alert</span>
                                                        <p className="text-[10px] text-gray-250 leading-relaxed font-bold">Spare tyres (10.00 R20) stock levels dropped below critical threshold. AI recommends procuring 40 units immediately.</p>
                                                    </div>

                                                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1.5">
                                                        <span className="text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-white/10 rounded text-blue-400">Driver Shift Limit</span>
                                                        <p className="text-[10px] text-gray-250 leading-relaxed font-bold">R. Kuppusamy is near shift limit (7.8 duty hours). Rotational assignment advised.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Administrative action drawer shortcuts */}
                                            <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-5 shadow-sm text-left font-bold">
                                                <h3 className="text-xs font-black uppercase tracking-widest text-[#0F1E36] dark:text-white mb-4 flex items-center">
                                                    <Sliders className="w-3.5 h-3.5 mr-1.5 text-[#FF9933]" />
                                                    Depot Dispatch Controls
                                                </h3>
                                                <div className="space-y-2.5">
                                                    <button onClick={() => setShowRegisterBusModal(true)} className="w-full flex items-center justify-between p-3 bg-gray-55 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all text-xs font-black uppercase tracking-wider text-gray-650 dark:text-gray-300 border border-gray-100 dark:border-slate-800 cursor-pointer">
                                                        <span>Register New Bus</span>
                                                        <Plus size={13} className="text-[#FF9933]" />
                                                    </button>
                                                    <button onClick={() => setFleetSubPage('staff')} className="w-full flex items-center justify-between p-3 bg-gray-55 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all text-xs font-black uppercase tracking-wider text-gray-650 dark:text-gray-300 border border-gray-100 dark:border-slate-800 cursor-pointer">
                                                        <span>Add Employee Profile</span>
                                                        <Plus size={13} className="text-blue-500" />
                                                    </button>
                                                    <button onClick={() => setFleetSubPage('maintenance')} className="w-full flex items-center justify-between p-3 bg-gray-55 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all text-xs font-black uppercase tracking-wider text-gray-650 dark:text-gray-300 border border-gray-100 dark:border-slate-800 cursor-pointer">
                                                        <span>Schedule Maintenance</span>
                                                        <Settings size={13} className="text-amber-500" />
                                                    </button>
                                                    <button onClick={() => setFleetSubPage('inventory')} className="w-full flex items-center justify-between p-3 bg-gray-55 dark:bg-slate-900 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all text-xs font-black uppercase tracking-wider text-gray-650 dark:text-gray-300 border border-gray-100 dark:border-slate-800 cursor-pointer">
                                                        <span>Add Stock Inventory</span>
                                                        <Plus size={13} className="text-emerald-500" />
                                                    </button>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                </div>
                            )}

                        </div>
                    )}

                    {/* Placeholder tabs */}
                    {['alerts', 'analytics', 'settings'].includes(activeTab) && (
                        <div className="bg-white dark:bg-[#0B1E36] rounded-2xl border border-gray-150 dark:border-slate-800 p-12 text-center shadow-sm">
                            <Activity className="w-12 h-12 text-[#00B074] mx-auto mb-4 animate-pulse" />
                            <h3 className="text-base font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">{activeTab} Control Section</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-1 uppercase tracking-widest">
                                Integration update scheduled under national transit management protocol
                            </p>
                        </div>
                    )}
                </main>

                {/* Direct Route Assignment Modal */}
                {showAssignModal && (
                    <div className="fixed inset-0 bg-[#0F1E36]/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 text-left">
                        <div className="bg-white dark:bg-[#0B1E36] border border-gray-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-left">
                            <button
                                onClick={() => {
                                    setShowAssignModal(false);
                                    setAssignBusNo('');
                                }}
                                className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={18} />
                            </button>

                            <div className="flex items-center space-x-2.5 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                    <Bus size={16} />
                                </div>
                                <h3 className="text-sm font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">Assign Bus & Activate Route</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest mb-1.5">Select Route</label>
                                    <select
                                        value={assignRouteId}
                                        onChange={(e) => setAssignRouteId(e.target.value)}
                                        className="w-full pl-3 pr-10 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white appearance-none cursor-pointer focus:outline-none focus:border-[#FF9933]"
                                    >
                                        <option value="">Select Route...</option>
                                        {(routes.length > 0 ? routes : [
                                            { id: '1A', name: 'Route 1A (Mettur - New Bus Stand)' },
                                            { id: '1C', name: 'Route 1C (Gandhipuram - Singanallur)' },
                                            { id: '10', name: 'Route 10 (Old Bus Stand - Attur)' },
                                            { id: '34', name: 'Route 34 (New Bus Stand - Yercaud)' },
                                            { id: '5', name: 'Route 5 (Salem Junction - Edappadi)' }
                                        ]).map((r) => (
                                            <option key={r.id} value={r.id}>{r.name || r.route}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest mb-1.5">Bus Number / ID</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. TN-37-AN-4421"
                                        value={assignBusNo}
                                        onChange={(e) => setAssignBusNo(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-gray-55 dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF9933]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-[#0F1E36] dark:text-gray-300 uppercase tracking-widest mb-1.5">Driver Assignment</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Ramesh Kumar"
                                        className="w-full px-3.5 py-2.5 bg-gray-55 dark:bg-slate-900 border border-gray-200 dark:border-slate-850 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF9933]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAssignModal(false);
                                        setAssignBusNo('');
                                    }}
                                    className="px-4 py-2.5 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl text-xs font-black text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleActivateRouteDirectly(assignRouteId || '1C', assignBusNo || 'TN-37-AN-4421');
                                    }}
                                    disabled={activating}
                                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-extrabold rounded-xl transition-all shadow-md text-xs uppercase tracking-wider cursor-pointer"
                                >
                                    {activating ? 'Assigning...' : 'Assign & Activate'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Fleet Details Drawer Panel */}
                {selectedBus && (
                    <div className="fixed inset-0 bg-[#0F1E36]/50 dark:bg-black/75 backdrop-blur-sm z-[99998] flex justify-end">
                        <div
                            className="bg-white dark:bg-[#0B1E36] border-l border-gray-200 dark:border-slate-800 w-full max-w-2xl h-full overflow-y-auto p-6 shadow-2xl relative text-left animate-slide-in"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedBus(null)}
                                className="absolute right-6 top-6 p-2 rounded-xl bg-gray-55 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-500 hover:text-gray-750 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={16} />
                            </button>

                            {/* Title & Status */}
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-[#FF9933]/15 text-[#FF9933] flex items-center justify-center">
                                    <Bus size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">{selectedBus.busNo}</h3>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{selectedBus.model} • {selectedBus.depot}</p>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 ml-auto">
                                    {selectedBus.status}
                                </span>
                            </div>

                            {/* Drawer Content Sections */}
                            <div className="space-y-6">
                                
                                {/* Section 1: Vehicle Information */}
                                <div className="border border-gray-150 dark:border-slate-850 rounded-2xl p-5 bg-gray-50/20 dark:bg-slate-900/10">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-[#0F1E36] dark:text-white mb-4">Vehicle Details Log</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs text-gray-550 dark:text-gray-300 font-bold">
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Registration No</p>
                                            <p className="font-extrabold text-[#0F1E36] dark:text-white uppercase">{selectedBus.regNo}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Mfg Year</p>
                                            <p className="font-extrabold text-[#0F1E36] dark:text-white">{selectedBus.mfgYear || 2022}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Fuel Type</p>
                                            <p className="font-extrabold text-[#0F1E36] dark:text-white">{selectedBus.fuelType || 'Diesel'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Capacity</p>
                                            <p className="font-extrabold text-[#0F1E36] dark:text-white">{selectedBus.capacity || 54} Seats</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Current Odometer</p>
                                            <p className="font-extrabold text-[#0F1E36] dark:text-white">{selectedBus.odometer || '142,350 km'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Current Speed</p>
                                            <p className="font-extrabold text-[#0F1E36] dark:text-white">{selectedBus.speed || '0 km/h'}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Chassis / Engine Number</p>
                                            <p className="font-extrabold text-[#0F1E36] dark:text-white">{selectedBus.chassis} / {selectedBus.engine}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Location Coordinates</p>
                                            <p className="font-extrabold text-[#0F1E36] dark:text-white flex items-center gap-1">
                                                <MapPin size={11} className="text-[#FF9933]" />
                                                <span>{selectedBus.location}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: AI Health Matrix */}
                                <div className="border border-gray-150 dark:border-slate-850 rounded-2xl p-5 bg-[#0B1F3A]/5 dark:bg-[#0B1E36]/30">
                                    <div className="flex items-center space-x-1.5 mb-4">
                                        <Zap size={14} className="text-[#FF9933] animate-pulse" />
                                        <h4 className="text-xs font-black uppercase tracking-widest text-[#0B1F3A] dark:text-white">AI Fleet Health Analysis</h4>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { label: 'Engine Health', val: selectedBus.health, color: 'bg-emerald-500' },
                                            { label: 'Brake Condition', val: selectedBus.health - 5, color: 'bg-emerald-500' },
                                            { label: 'Battery Health', val: 92, color: 'bg-emerald-500' },
                                            { label: 'Tyre Wear', val: 78, color: 'bg-amber-500' },
                                            { label: 'Transmission System', val: 89, color: 'bg-emerald-500' },
                                            { label: 'Cooling System', val: 94, color: 'bg-emerald-500' },
                                            { label: 'Electrical Wiring', val: selectedBus.health - 2, color: 'bg-emerald-500' }
                                        ].map((sys, idx) => (
                                            <div key={idx} className="space-y-1 text-xs font-bold text-gray-555 dark:text-gray-300">
                                                <div className="flex justify-between">
                                                    <span>{sys.label}</span>
                                                    <span className="font-black">{sys.val}%</span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div className={`h-full ${sys.color}`} style={{ width: `${sys.val}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 p-3 bg-[#FF9933]/10 border border-[#FF9933]/30 rounded-xl">
                                        <p className="text-[10px] font-black text-[#FF9933] uppercase tracking-widest">AI Actionable Recommendation</p>
                                        <p className="text-[11px] font-bold text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                                            {selectedBus.health >= 90 
                                                ? "Vehicle operating normally. Standard scheduled checkup in 320 km." 
                                                : "Brake telemetry indicates wear. Schedule preventive workshop checkup within 4 days."
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Section 3: Driver & Conductor Duty Staff */}
                                <div className="border border-gray-150 dark:border-slate-850 rounded-2xl p-5">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-[#0F1E36] dark:text-white mb-4">Assigned Duty Crew Staff</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-gray-555 dark:text-gray-300 font-bold">
                                        {/* Driver Card */}
                                        <div className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Primary Driver</p>
                                            <div className="flex items-center space-x-2.5">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                                    <User size={15} />
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-[#0F1E36] dark:text-white">{selectedBus.driver}</p>
                                                    <p className="text-[8px] text-gray-400 mt-0.5">License Status: Active</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-gray-200/60 dark:border-slate-800 text-[8px] uppercase tracking-widest text-gray-400 font-black">
                                                <span>Shift: 6.5 hrs</span>
                                                <span>Score: 92/100</span>
                                            </div>
                                        </div>
                                        {/* Conductor Card */}
                                        <div className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Conductor</p>
                                            <div className="flex items-center space-x-2.5">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                    <User size={15} />
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-[#0F1E36] dark:text-white">{selectedBus.conductor}</p>
                                                    <p className="text-[8px] text-gray-400 mt-0.5">Duty: Present</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-gray-200/60 dark:border-slate-800 text-[8px] uppercase tracking-widest text-gray-400 font-black">
                                                <span>ETM ID: #9822</span>
                                                <span>Complaints: 0</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end space-x-2.5 mt-4">
                                        <button onClick={() => alert("Crew assignment dispatcher loaded.")} className="px-3.5 py-1.5 bg-[#FF9933]/10 hover:bg-[#FF9933]/20 border border-[#FF9933]/30 rounded-xl text-[10px] font-black uppercase tracking-wider text-[#FF9933] cursor-pointer">
                                            Assign Staff
                                        </button>
                                    </div>
                                </div>

                                {/* Section 4: Compliance & Document Tracker */}
                                <div className="border border-gray-150 dark:border-slate-850 rounded-2xl p-5">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-[#0F1E36] dark:text-white mb-4">Compliance Status & Certificates</h4>
                                    <div className="space-y-2.5">
                                        {[
                                            { label: 'Fitness Certificate (FC)', expiry: '22 Dec 2026', status: 'Active' },
                                            { label: 'Commercial Road Insurance', expiry: '15 Sep 2026', status: 'Active' },
                                            { label: 'Stage Carriage Permit', expiry: '08 Jan 2027', status: 'Active' },
                                            { label: 'Pollution Under Control (PUC)', expiry: '10 Oct 2026', status: 'Active' }
                                        ].map((doc, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-2.5 bg-gray-55 dark:bg-slate-900 rounded-xl text-xs text-gray-650 dark:text-gray-300 font-bold border border-gray-100 dark:border-slate-800/40">
                                                <div>
                                                    <p className="font-extrabold text-[#0F1E36] dark:text-white">{doc.label}</p>
                                                    <p className="text-[8px] text-gray-400 mt-0.5">Expires: {doc.expiry}</p>
                                                </div>
                                                <button onClick={() => alert("Initiating government document renewal query...")} className="px-2.5 py-1 border border-gray-200 dark:border-slate-700 hover:border-[#FF9933] text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-[#FF9933] dark:text-gray-400 rounded-lg transition-colors cursor-pointer">
                                                    Renew
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}

                {/* Register Bus Modal overlay */}
                {showRegisterBusModal && (
                    <div className="fixed inset-0 bg-[#0F1E36]/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 text-left">
                        <div className="bg-white dark:bg-[#0B1E36] border border-gray-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-left">
                            <button
                                onClick={() => setShowRegisterBusModal(false)}
                                className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={18} />
                            </button>

                            <div className="flex items-center space-x-2.5 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                    <Bus size={16} />
                                </div>
                                <h3 className="text-sm font-black text-[#0F1E36] dark:text-white uppercase tracking-wider">Register New Fleet Bus</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest mb-1.5">Bus Number / Code</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. TN-37-N-2440"
                                        value={newBusNo}
                                        onChange={(e) => setNewBusNo(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF9933]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest mb-1.5">Registration Number</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. TN37N2440"
                                        value={newBusReg}
                                        onChange={(e) => setNewBusReg(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-gray-55 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF9933]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest mb-1.5">Vehicle Model / Maker</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Leyland Viking BS6"
                                        value={newBusModel}
                                        onChange={(e) => setNewBusModel(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-gray-55 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#FF9933]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[9px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest mb-1.5">Bus Type</label>
                                        <select
                                            value={newBusType}
                                            onChange={(e) => setNewBusType(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-gray-55 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white focus:outline-none focus:border-[#FF9933]"
                                        >
                                            <option value="AC Low Floor">AC Low Floor</option>
                                            <option value="Non-AC Deluxe">Non-AC Deluxe</option>
                                            <option value="Electric Transit">Electric Transit</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest mb-1.5">Assigned Depot</label>
                                        <select
                                            value={newBusDepot}
                                            onChange={(e) => setNewBusDepot(e.target.value)}
                                            className="w-full px-3.5 py-2.5 bg-gray-55 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white focus:outline-none focus:border-[#FF9933]"
                                        >
                                            <option value="Central Metro Depot">Central Metro Depot</option>
                                            <option value="Coimbatore Depot 1">Coimbatore Depot 1</option>
                                            <option value="KSRTC Depot">KSRTC Depot</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowRegisterBusModal(false)}
                                    className="px-4 py-2.5 border border-gray-200 dark:border-slate-700 hover:bg-gray-55 dark:hover:bg-slate-800 rounded-xl text-xs font-black text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        alert(`Bus ${newBusNo} registered successfully inside depot database!`);
                                        setShowRegisterBusModal(false);
                                    }}
                                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-650 text-white font-extrabold rounded-xl transition-all shadow-md text-xs uppercase tracking-wider cursor-pointer"
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Breakdown Emergency Modal overlay */}
                {showBreakdownModal && (
                    <div className="fixed inset-0 bg-[#0F1E36]/65 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 text-left">
                        <div className="bg-white dark:bg-[#0B1E36] border border-gray-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-left">
                            <button
                                onClick={() => setShowBreakdownModal(false)}
                                className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={18} />
                            </button>

                            <div className="flex items-center space-x-2.5 mb-5">
                                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center animate-pulse">
                                    <AlertTriangle size={16} />
                                </div>
                                <h3 className="text-sm font-black text-[#0F1E36] dark:text-white uppercase tracking-wider text-red-500">Report Vehicle Breakdown</h3>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest mb-1.5">Select Vehicle</label>
                                    <select
                                        value={breakdownBusNo}
                                        onChange={(e) => setBreakdownBusNo(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white focus:outline-none focus:border-red-500"
                                    >
                                        <option value="">Select bus...</option>
                                        <option value="TN-37-N-8812">TN-37-N-8812 (Running)</option>
                                        <option value="TN-37-N-1022">TN-37-N-1022 (At Depot)</option>
                                        <option value="KL-01-A-4450">KL-01-A-4450 (Under Service)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest mb-1.5">Select Issue Type</label>
                                    <select
                                        value={breakdownIssue}
                                        onChange={(e) => setBreakdownIssue(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-gray-55 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white focus:outline-none focus:border-red-500"
                                    >
                                        <option value="Engine">Engine Overheating / Failure</option>
                                        <option value="Brake">Brake Pressure Drop</option>
                                        <option value="Electrical">ETM / GPS Sync Offline</option>
                                        <option value="Tyre Burst">Tyre Burst</option>
                                        <option value="Accident">Accident Collision</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest mb-1.5">Assign Workshop</label>
                                    <select
                                        value={breakdownWorkshop}
                                        onChange={(e) => setBreakdownWorkshop(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-gray-55 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs font-bold text-[#0F1E36] dark:text-white focus:outline-none focus:border-red-500"
                                    >
                                        <option value="Hosur Road Workshop">Hosur Road Workshop</option>
                                        <option value="Coimbatore Central Depot Yard">Coimbatore Central Depot Yard</option>
                                        <option value="Trivandrum City Workshop">Trivandrum City Workshop</option>
                                    </select>
                                </div>

                                <div className="p-3 bg-red-500/[0.04] border border-red-500/20 rounded-xl font-bold">
                                    <p className="text-[9px] font-black text-red-500 dark:text-red-400 uppercase tracking-widest">AI Automated Suggestion</p>
                                    <p className="text-[10px] text-gray-550 dark:text-gray-400 mt-1 leading-relaxed">
                                        Deploy backup vehicle **TN-37-N-1022** currently on standby at Coimbatore Depot 2 to minimize route delay.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowBreakdownModal(false)}
                                    className="px-4 py-2.5 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl text-xs font-black text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        alert(`Breakdown logged. Passengers notified & backup vehicle dispatched successfully.`);
                                        setShowBreakdownModal(false);
                                    }}
                                    className="px-5 py-2.5 bg-red-500 hover:bg-red-650 text-white font-extrabold rounded-xl transition-all shadow-md text-xs uppercase tracking-wider cursor-pointer"
                                >
                                    Discharge Emergency Protocol
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <Footer lang={lang} region={region} />
            </div>
        </div>
    );
}
