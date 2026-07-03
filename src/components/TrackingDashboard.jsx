import React, { useState } from 'react';
import { Search, MapPin, Navigation, ArrowRight, Loader2, Bus, AlertCircle, CheckCircle, Info, Calendar, ShieldCheck, TrendingUp, Users, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '../translations';
import { districtStops } from '../data/districtStops';
import { api } from '../api';

export default function TrackingDashboard({ navigateTo, setGlobalRouteDetails, lang }) {
    const [loading, setLoading] = useState(false);
    const [routeNo, setRouteNo] = useState('');
    const [boarding, setBoarding] = useState(() => sessionStorage.getItem('savedBoarding') || '');
    const [destination, setDestination] = useState(() => sessionStorage.getItem('savedDestination') || '');

    // States: 'idle', 'results', 'empty', 'nearby'
    const [searchState, setSearchState] = useState(() => sessionStorage.getItem('savedSearchState') || 'idle');
    const [routes, setRoutes] = useState(() => {
        const saved = sessionStorage.getItem('savedRoutes');
        return saved ? JSON.parse(saved) : [];
    });
    const [userContextDistrict, setUserContextDistrict] = useState('');

    const generateDistrictRoutes = (district) => {
        if (!district) return [];

        const routeMap = {
            'Salem': [
                { id: '1A', from: 'New Bus Stand', to: 'Mettur', route: '1A-Fast' },
                { id: '10', from: 'Old Bus Stand', to: 'Attur', route: '10-City' },
                { id: '34', from: 'New Bus Stand', to: 'Yercaud', route: '34-Hill' },
                { id: '5', from: 'Salem Junction', to: 'Edappadi', route: '5-Ordinary' }
            ],
            'Chennai': [
                { id: '500A', from: 'Koyambedu CMBT', to: 'Guindy', route: '500A' },
                { id: '47D', from: 'Anna Nagar Circle', to: 'T. Nagar', route: '47D' },
                { id: '21G', from: 'Broadway', to: 'Tambaram', route: '21G' },
                { id: '11G', from: 'Central Railway Station', to: 'K.K. Nagar', route: '11G' },
            ],
            'Coimbatore': [
                { id: '1C', from: 'Gandhipuram Bus Stand', to: 'Singanallur', route: '1C' },
                { id: 'S1', from: 'Peelamedu', to: 'Thudiyalur', route: 'S1' },
                { id: '70', from: 'Ukkadam', to: 'Marudhamalai', route: '70' },
                { id: '11', from: 'Railway Station', to: 'Saravanampatti', route: '11' },
            ],
            'Ernakulam': [
                { id: 'KL-1', from: 'Vyttila Hub', to: 'Aluva', route: 'KSRTC-Fast' },
                { id: 'KL-2', from: 'Ernakulam South', to: 'Kakkanad', route: 'City-Circular' },
                { id: 'KL-3', from: 'High Court', to: 'Fort Kochi', route: 'Ferry-Bus' },
                { id: 'KL-4', from: 'Edappally', to: 'Muvattupuzha', route: 'Mofussil' },
            ]
        };

        let baseRoutes = routeMap[district];
        if (!baseRoutes) {
            baseRoutes = [
                { id: `${district.substring(0, 2).toUpperCase()}-1`, from: `${district} Old Bus Stand`, to: `${district} New Bus Stand`, route: 'City-1' },
                { id: `${district.substring(0, 2).toUpperCase()}-2`, from: `${district} Junction`, to: `${district} Market`, route: 'City-2' }
            ];
        }

        return baseRoutes.map((br, index) => ({
            id: `${br.id}-${index + 1}X`,
            route: br.route,
            status: index % 2 === 0 ? 'running' : 'delayed',
            currentLocation: br.from,
            expectedArrival: `${(index + 1) * 5} - ${(index + 2) * 5} Minutes`,
            etaRange: `${(index + 1) * 5} - ${(index + 2) * 5}`,
            confidence: 85 + index,
            delayReason: index % 2 === 0 ? null : 'Traffic Congestion',
            lastConfirmedTime: '10:00 AM',
            source: 'GPS Sync',
            currentStop: br.from,
            nextStop: `${br.from} Checkpost`,
            destination: br.to,
            arrivalStop: br.to,
            district: district
        }));
    };

    const activeDistrict = userContextDistrict || 'Coimbatore';
    const genericStops = [`${activeDistrict} New Bus Stand`, `${activeDistrict} Old Bus Stand`, `${activeDistrict} Junction`, `${activeDistrict} Hospital`, `${activeDistrict} Market`];
    const availableStops = districtStops[activeDistrict] || genericStops;

    React.useEffect(() => {
        const localDistrict = localStorage.getItem('userDistrict');
        const savedDistrict = sessionStorage.getItem('savedDistrict');

        if (localDistrict) {
            setUserContextDistrict(localDistrict);
        } else {
            setUserContextDistrict('Coimbatore');
        }

        if (localDistrict !== savedDistrict && savedDistrict !== null) {
            setSearchState('idle');
            setRoutes([]);
            setBoarding('');
            setDestination('');
            sessionStorage.removeItem('savedBoarding');
            sessionStorage.removeItem('savedDestination');
            sessionStorage.removeItem('savedRoutes');
            sessionStorage.setItem('savedSearchState', 'idle');
        }
        if (localDistrict) sessionStorage.setItem('savedDistrict', localDistrict);

        if (!sessionStorage.getItem('savedRoutes') || sessionStorage.getItem('savedRoutes') === '[]') {
            loadActiveBuses();
        }
    }, []);

    const loadActiveBuses = async () => {
        setLoading(true);
        const buses = await api.getActiveBuses();
        if (Array.isArray(buses) && buses.length > 0) {
            setRoutes(buses);
            setSearchState('results');
        }
        setLoading(false);
    };

    React.useEffect(() => {
        sessionStorage.setItem('savedBoarding', boarding);
        sessionStorage.setItem('savedDestination', destination);
        sessionStorage.setItem('savedSearchState', searchState);
        sessionStorage.setItem('savedRoutes', JSON.stringify(routes));
    }, [boarding, destination, searchState, routes]);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!boarding || !destination) return;

        setLoading(true);

        if (boarding === destination && boarding !== '') {
            setLoading(false);
            setSearchState('empty');
            setRoutes([]);
            return;
        }

        const result = await api.searchRoutes(boarding, destination, activeDistrict);

        if (result && result.routes && result.routes.length > 0) {
            setRoutes(result.routes);
            setSearchState('results');
            setLoading(false);
        } else {
            setRoutes([]);
            setSearchState('unavailable');
            setLoading(false);
        }
    };

    const handleRouteClick = (routeData) => {
        setGlobalRouteDetails(routeData);
        navigateTo('routeDetails');
    };

    const handlePopularRouteClick = (routeId) => {
        setRouteNo(routeId);
        // Autosearch mock for Coimbatore popular routes
        if (routeId === '1C') {
            setBoarding('Gandhipuram Bus Stand');
            setDestination('Singanallur');
            // Trigger search deferred
            setTimeout(() => {
                setBoarding('Gandhipuram Bus Stand');
                setDestination('Singanallur');
                handleSearch();
            }, 100);
        }
    };

    const isSearchDisabled = loading || (!boarding || !destination);

    return (
        <div className="space-y-8 pb-10">
            
            {/* Top Main Hero Banner Card with uncropped background image */}
            <div 
                className="w-full aspect-[10/3] rounded-3xl overflow-hidden relative transition-colors duration-300"
                style={{ 
                    backgroundImage: "url('/banner_bg.png')", 
                    backgroundSize: '100% 100%', 
                    backgroundPosition: 'center', 
                    backgroundRepeat: 'no-repeat' 
                }}
            >
                {/* Dark edge-blending vignette overlays matching the dark image colors */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_8px_rgba(11,27,45,0.85)] z-20"></div>
                {/* Left side center-aligned text with a black gradient fade background */}
                <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-black/85 via-black/35 to-transparent z-10 flex flex-col justify-center pl-8 text-left">
                    <div className="inline-flex items-center space-x-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/30 w-fit mb-3">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                        <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">{t('allSystemsOperational', lang)}</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-2">
                        {t('smarterJourneys', lang)} <br/>
                        <span className="bg-gradient-to-r from-green-400 to-[#FF9933] bg-clip-text text-transparent">{t('strongerIndia', lang)}</span>
                    </h2>

                    <p className="text-[10px] text-gray-300 font-bold max-w-xs leading-relaxed hidden sm:block">
                        {t('heroDescription', lang)}
                    </p>
                </div>

                {/* "Powered by" branding with Tamil Nadu State Seal PNG */}
                <div className="absolute right-6 bottom-4 flex items-center space-x-2.5 z-10 select-none">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">{t('poweredBy', lang)}</span>
                    <img 
                        src="/tn_seal.png" 
                        alt="State Seal of Tamil Nadu" 
                        className="h-10 w-auto object-contain shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]" 
                    />
                </div>
            </div>

            {/* Route Search Finder Card */}
            <div className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 sm:p-8">
                <form onSubmit={handleSearch} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Route Number Search Input */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-550 uppercase tracking-widest mb-2.5">
                                {t('routeNo', lang)}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                    <Search className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    placeholder={t('searchRoutePlaceholder', lang)}
                                    value={routeNo}
                                    onChange={(e) => setRouteNo(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#070F1E] border-2 border-gray-200 dark:border-slate-800 rounded-2xl focus:border-[#12820B] focus:ring-0 text-sm font-bold text-[#0F1E36] dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Boarding Point Dropdown select */}
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 dark:text-gray-550 uppercase tracking-widest mb-2.5">
                                {t('boardingPoint', lang)}
                            </label>
                            <div className="relative">
                                <select
                                    value={boarding}
                                    onChange={(e) => setBoarding(e.target.value)}
                                    className="w-full px-4 py-3 bg-white dark:bg-[#070F1E] border-2 border-gray-200 dark:border-slate-800 rounded-2xl focus:border-[#12820B] focus:ring-0 appearance-none text-xs font-bold text-[#0F1E36] dark:text-white cursor-pointer"
                                >
                                    <option value="">{t('selectBoardingPlaceholder', lang)}</option>
                                    {availableStops.map(stop => (
                                        <option key={stop} value={stop}>{stop}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#12820B]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Destination Point Dropdown select */}
                        <div className="flex items-end space-x-3">
                            <div className="flex-grow relative">
                                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest mb-2.5">
                                    {t('destinationPoint', lang)}
                                </label>
                                <select
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="w-full px-4 py-3 bg-white dark:bg-[#070F1E] border-2 border-gray-200 dark:border-slate-800 rounded-2xl focus:border-[#12820B] focus:ring-0 appearance-none text-xs font-bold text-[#0F1E36] dark:text-white cursor-pointer"
                                >
                                    <option value="">{t('selectDestinationPlaceholder', lang)}</option>
                                    {availableStops.map(stop => (
                                        <option key={stop} value={stop}>{stop}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-[#12820B]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>

                            {/* Get Bus Status Button */}
                            <button
                                type="submit"
                                disabled={isSearchDisabled}
                                className="h-[46px] w-[140px] bg-[#12820B] hover:bg-green-700 disabled:opacity-50 text-white font-extrabold rounded-2xl flex items-center justify-center space-x-1.5 uppercase tracking-widest text-[9px] shadow-sm transform active:scale-95 shrink-0 transition-all"
                            >
                                {loading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : (
                                    <>
                                        <span className="truncate">{t('getBusStatus', lang)}</span>
                                        <ArrowRight className="w-4.5 h-4.5 shrink-0" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Popular Routes list & Current Location tools */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-550 uppercase tracking-wider mr-2">{t('popularRoutes', lang)}:</span>
                            {['1A', '1C', '2C', '3D', '5E', '12X'].map((route) => (
                                <button
                                    key={route}
                                    type="button"
                                    onClick={() => handlePopularRouteClick(route)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                                        routeNo === route || (route === '1C' && boarding === 'Gandhipuram Bus Stand')
                                            ? 'bg-[#12820B] text-white'
                                            : 'bg-gray-50 dark:bg-[#070F1E] text-gray-550 dark:text-gray-300 border border-gray-200 dark:border-slate-800 hover:border-[#12820B]'
                                    }`}
                                >
                                    {route}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center space-x-6 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            <button
                                type="button"
                                onClick={() => {
                                    setBoarding('Gandhipuram Bus Stand');
                                }}
                                className="flex items-center space-x-1.5 hover:text-[#12820B]"
                            >
                                <MapPin size={13} className="text-[#12820B]" />
                                <span>{t('useCurrentLocation', lang)}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Results Section */}
            <AnimatePresence mode="wait">
                {searchState === 'empty' && (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="mt-8"
                    >
                        <div className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-lg border-2 border-red-500/20 p-10 max-w-2xl mx-auto text-center relative overflow-hidden transition-colors">
                            <div className="w-20 h-20 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Bus className="w-10 h-10 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-black text-[#0F1E36] dark:text-white mb-4">{t('noRoutesAvailable', lang)}</h3>
                            <p className="text-gray-600 dark:text-gray-300 font-bold leading-relaxed mb-8 max-w-lg mx-auto">
                                {t('noRoutesAvailableDesc', lang)}
                            </p>
                            <button
                                onClick={() => {
                                    setDestination('');
                                    setSearchState('idle');
                                }}
                                className="px-6 py-3 bg-[#12820B] hover:bg-green-700 text-white font-extrabold rounded-xl shadow-md transition-all"
                            >
                                {t('modifySearch', lang)}
                            </button>
                        </div>
                    </motion.div>
                )}

                {searchState === 'unavailable' && (
                    <motion.div
                        key="unavailable"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="mt-8"
                    >
                        <div className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-lg border-2 border-[#12820B]/20 p-10 max-w-2xl mx-auto text-center relative overflow-hidden">
                            <div className="w-16 h-16 bg-[#12820B]/10 dark:bg-[#12820B]/5 rounded-full flex items-center justify-center mx-auto mb-5 border border-[#12820B]/30">
                                <Bus className="w-8 h-8 text-[#12820B]" />
                            </div>
                             <h3 className="text-xl font-black text-[#0F1E36] dark:text-white mb-3">{t('routeTrackingComingSoon', lang)}</h3>
                            <p className="text-gray-555 dark:text-gray-300 font-bold leading-relaxed mb-3 max-w-md mx-auto">
                                {t('routeTrackingComingSoonDesc', lang)}
                            </p>
                            <div className="bg-[#12820B]/10 dark:bg-[#12820B]/5 rounded-xl px-5 py-3.5 inline-block mb-6 border border-[#12820B]/20">
                                <p className="text-xs font-bold text-[#12820B]">
                                    {t('telemetryOnboardingText', lang)}
                                </p>
                            </div>
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={() => {
                                        setBoarding('');
                                        setDestination('');
                                        setSearchState('idle');
                                    }}
                                    className="px-6 py-3 bg-[#12820B] hover:bg-green-700 text-white font-extrabold rounded-xl shadow-md transition-all w-full sm:w-auto"
                                >
                                    {t('tryAnotherRoute', lang)}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {(searchState === 'results' || searchState === 'nearby') && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-8"
                    >
                        <div className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-xl border border-gray-150 dark:border-slate-800 overflow-hidden relative z-10 w-full mb-12">
                            {/* Results Header */}
                            <div className="px-6 py-5 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
                                <h4 className="text-[#0F1E36] dark:text-white font-black flex items-center text-lg tracking-wide uppercase">
                                    <Bus className="w-5 h-5 mr-3 text-[#12820B]" />
                                    {t('activeTelemetryResults', lang)}
                                </h4>
                                <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700">{routes.length} {t('activeServices', lang)}</span>
                            </div>

                            {/* Route Cards Grid (Redesigned as modern Boarding Passes) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-150 dark:divide-slate-800 place-items-stretch">
                                {routes.map((route, i) => {
                                    const isDelay = route.status === 'delayed';
                                    const confVal = route.confidence || 85;

                                    return (
                                        <div
                                            key={route.id}
                                            className="p-6 hover:bg-[#12820B]/5 dark:hover:bg-[#12820B]/5 transition-all duration-300 cursor-pointer flex flex-col group relative h-full overflow-hidden border-b border-gray-100 dark:border-slate-900/20"
                                            onClick={() => handleRouteClick(route)}
                                        >
                                            <div className="absolute inset-x-0 bottom-0 h-1 bg-[#12820B] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                            {/* Ashoka Chakra background watermark */}
                                            <div className="absolute -right-4 -bottom-4 opacity-[0.03] dark:opacity-[0.02] text-[#0F1E36] dark:text-white group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none">
                                                <svg className="w-28 h-28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                                    <circle cx="12" cy="12" r="9" />
                                                    {Array.from({ length: 24 }).map((_, idx) => (
                                                        <line 
                                                            key={idx} 
                                                            x1="12" 
                                                            y1="12" 
                                                            x2={12 + 9 * Math.cos((idx * Math.PI) / 12)} 
                                                            y2={12 + 9 * Math.sin((idx * Math.PI) / 12)} 
                                                        />
                                                    ))}
                                                </svg>
                                            </div>

                                            <div className="flex justify-between items-start mb-6 w-full">
                                                <div className="text-2xl font-black text-[#0F1E36] dark:text-white tracking-tight">{route.id}</div>
                                                <div className="flex flex-col items-end gap-1.5">
                                                    {!isDelay ? (
                                                        <span className="px-2 py-0.5 bg-[#12820B] text-white text-[8px] font-black rounded-md tracking-wider leading-none">{t('onTime', lang)}</span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 bg-red-650 text-white text-[8px] font-black rounded-md tracking-wider leading-none">{t('delayed', lang)}</span>
                                                    )}
                                                    <span className="px-2 py-0.5 bg-[#12820B]/10 text-[#12820B] text-[8px] font-black rounded-md tracking-wider leading-none border border-[#12820B]/20">
                                                        {t('running', lang)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex-grow flex flex-col justify-end space-y-5">
                                                {/* Current Station details */}
                                                <div className="text-center w-full">
                                                    <div className="text-[9px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-widest mb-1.5">{t('currentLocation', lang)}</div>
                                                    <div className="w-full py-2 px-3 rounded-xl text-xs font-black shadow-inner border bg-[#12820B]/5 text-[#12820B] border-[#12820B]/10 dark:bg-green-950/20 dark:text-green-300">
                                                        {route.currentLocation}
                                                    </div>
                                                </div>

                                                {/* Expected Arrival Window */}
                                                <div className="text-center">
                                                    <div className="text-[9px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-widest mb-1">{t('eta', lang)}</div>
                                                    <div className="text-base font-extrabold text-[#12820B] tracking-tight bg-gradient-to-r from-[#12820B] to-[#FF9933] bg-clip-text text-transparent">
                                                        {route.expectedArrival}
                                                    </div>
                                                </div>

                                                {/* Confidence Indicator */}
                                                <div className="pt-2 border-t border-gray-150 dark:border-slate-800/80">
                                                    <div className="flex justify-between items-center text-[9px] font-extrabold text-gray-400 dark:text-gray-550 mb-1">
                                                        <span>{t('confidence', lang)}</span>
                                                        <span className="text-[#12820B] dark:text-green-400">{confVal}%</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-850 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full transition-all duration-500 ${
                                                                confVal >= 80 ? 'bg-[#12820B]' : confVal >= 50 ? 'bg-[#FF9933]' : 'bg-red-500'
                                                            }`} 
                                                            style={{ width: `${confVal}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Real-time Statistics Counter Bar */}
            <div className="bg-[#0B1B2D] text-white rounded-3xl p-6 sm:p-8 border border-[#15293E] grid grid-cols-2 md:grid-cols-6 gap-6 text-left relative overflow-hidden">
                
                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 bg-[#12820B]/10 rounded-lg flex items-center justify-center border border-[#12820B]/30 text-green-400">
                            <Bus size={14} />
                        </div>
                        <span className="text-xl font-black tracking-tight text-white">2,453</span>
                    </div>
                    <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">{t('busesActive', lang)}</p>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 bg-[#FF9933]/10 rounded-lg flex items-center justify-center border border-[#FF9933]/30 text-[#FF9933]">
                            <TrendingUp size={14} />
                        </div>
                        <span className="text-xl font-black tracking-tight text-white">842</span>
                    </div>
                    <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">{t('routesListed', lang)}</p>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/30 text-blue-400">
                            <MapPin size={14} />
                        </div>
                        <span className="text-xl font-black tracking-tight text-white">18,765</span>
                    </div>
                    <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">{t('stopsConnected', lang)}</p>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/30 text-purple-400">
                            <Users size={14} />
                        </div>
                        <span className="text-xl font-black tracking-tight text-white">2.4M+</span>
                    </div>
                    <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">{t('dailyRiders', lang)}</p>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/30 text-red-400">
                            <Clock size={14} />
                        </div>
                        <span className="text-xl font-black tracking-tight text-white">3.2 min</span>
                    </div>
                    <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">{t('averageDelay', lang)}</p>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/30 text-green-400">
                            <ShieldCheck size={14} />
                        </div>
                        <span className="text-xl font-black tracking-tight text-white">98.6%</span>
                    </div>
                    <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">{t('onTimeAccuracy', lang)}</p>
                </div>
            </div>

            {/* Live Updates Ticker feed */}
            <div className="bg-white dark:bg-[#0B1E36] rounded-3xl border border-gray-150 dark:border-slate-800 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                        <h3 className="text-xs font-black text-[#0F1E36] dark:text-white uppercase tracking-widest">{t('liveUpdatesAlerts', lang)}</h3>
                    </div>
                    <button onClick={() => navigateTo('alerts')} className="text-[10px] font-black text-[#12820B] uppercase tracking-widest hover:underline">
                        {t('viewAllAlerts', lang)}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-orange-50/50 dark:bg-orange-950/10 p-4 rounded-2xl border border-orange-100 dark:border-orange-950/20 text-left flex items-start space-x-3.5">
                        <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                        <div>
                            <h5 className="text-[10px] font-black text-orange-850 dark:text-orange-300 uppercase tracking-wider mb-1">{t('diverstionAnnaSalaiTitle', lang)}</h5>
                            <p className="text-[10px] text-gray-550 dark:text-gray-400 font-bold leading-normal">{t('diverstionAnnaSalaiDesc', lang)}</p>
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest block mt-2">10 {t('minsAgo', lang)}</span>
                        </div>
                    </div>

                    <div className="bg-green-50/50 dark:bg-green-950/10 p-4 rounded-2xl border border-green-150 dark:border-green-950/20 text-left flex items-start space-x-3.5">
                        <CheckCircle className="w-5 h-5 text-[#12820B] shrink-0 mt-0.5" />
                        <div>
                            <h5 className="text-[10px] font-black text-[#12820B] dark:text-green-400 uppercase tracking-wider mb-1">{t('route1CNormalTitle', lang)}</h5>
                            <p className="text-[10px] text-gray-550 dark:text-gray-400 font-bold leading-normal">{t('route1CNormalDesc', lang)}</p>
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest block mt-2">15 {t('minsAgo', lang)}</span>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 dark:bg-blue-950/10 p-4 rounded-2xl border border-blue-150 dark:border-blue-950/20 text-left flex items-start space-x-3.5">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                            <h5 className="text-[10px] font-black text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-1">{t('route5EDelayTitle', lang)}</h5>
                            <p className="text-[10px] text-gray-550 dark:text-gray-400 font-bold leading-normal">{t('route5EDelayDesc', lang)}</p>
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest block mt-2">25 {t('minsAgo', lang)}</span>
                        </div>
                    </div>

                    <div className="bg-purple-50/50 dark:bg-purple-950/10 p-4 rounded-2xl border border-purple-150 dark:border-purple-950/20 text-left flex items-start space-x-3.5">
                        <Bus className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                        <div>
                            <h5 className="text-[10px] font-black text-purple-800 dark:text-purple-300 uppercase tracking-wider mb-1">{t('newExpress12XTitle', lang)}</h5>
                            <p className="text-[10px] text-gray-550 dark:text-gray-400 font-bold leading-normal">{t('newExpress12XDesc', lang)}</p>
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest block mt-2">1 {t('hourAgo', lang)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
