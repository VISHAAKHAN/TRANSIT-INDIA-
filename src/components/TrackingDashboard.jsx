import React, { useState } from 'react';
import { Search, MapPin, Navigation, ArrowRight, Loader2, Bus, AlertCircle, CheckCircle, Info, Calendar, ShieldCheck, TrendingUp, Users, Clock, Cpu, AlertTriangle, ArrowLeft, Flag, ChevronDown, ChevronRight, Compass, Star, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '../translations';
import { districtStops } from '../data/districtStops';
import { api } from '../api';

export default function TrackingDashboard({ navigateTo, setGlobalRouteDetails, lang, region = localStorage.getItem('userRegion') || 'Tamil Nadu' }) {
    const [loading, setLoading] = useState(false);
    const [routeNo, setRouteNo] = useState('');
    const [boarding, setBoarding] = useState(() => sessionStorage.getItem('savedBoarding') || '');
    const [destination, setDestination] = useState(() => sessionStorage.getItem('savedDestination') || '');

    // States: 'idle', 'results', 'empty', 'nearby'
    const [searchState, setSearchState] = useState('idle');
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [showAllBuses, setShowAllBuses] = useState(false);
    const [userContextDistrict, setUserContextDistrict] = useState('');

    const generateDistrictRoutes = (district) => {
        if (!district) return [];

        const routeMap = {
            'Salem': [
                { id: '1A', from: 'New Bus Stand', to: 'Mettur', route: '1A-Fast' },
                { id: '10', from: 'Old Bus Stand', to: 'Attur', route: '10-City' },
                { id: '34', from: 'New Bus Stand', to: 'Yercaud', route: '34-Hill' },
                { id: '5', from: 'Salem Junction', to: 'Edappadi', route: '5-Ordinary' },
                { id: '2A', from: 'Old Bus Stand', to: 'Mettur Dam', route: '2A-Deluxe' },
                { id: '12', from: 'New Bus Stand', to: 'Omalur', route: '12-City' },
                { id: '15', from: 'Salem Junction', to: 'Rasipuram', route: '15-Intercity' },
                { id: '18', from: 'Old Bus Stand', to: 'Elampillai', route: '18-Ordinary' },
                { id: '22', from: 'New Bus Stand', to: 'Sankagiri', route: '22-Fast' },
                { id: '25', from: 'Salem Junction', to: 'Tiruchengode', route: '25-Ordinary' },
                { id: '30', from: 'Old Bus Stand', to: 'Kondalampatti', route: '30-Shuttle' },
                { id: '33', from: 'New Bus Stand', to: 'Vazhapadi', route: '33-Ordinary' },
                { id: '40', from: 'Old Bus Stand', to: 'Mecheri', route: '40-City' },
                { id: '45', from: 'Salem Junction', to: 'Dharmapuri', route: '45-Express' },
                { id: '50', from: 'New Bus Stand', to: 'Namakkal', route: '50-Express' },
                { id: '55', from: 'Old Bus Stand', to: 'Steel Plant', route: '55-Shuttle' },
                { id: '60', from: 'Salem Junction', to: 'Ayothiapattinam', route: '60-Ordinary' },
                { id: '65', from: 'New Bus Stand', to: 'Valapady', route: '65-Express' },
                { id: '70', from: 'Old Bus Stand', to: 'Karuppur', route: '70-City' },
                { id: '75', from: 'Salem Junction', to: 'Sona College', route: '75-Shuttle' },
                { id: '80', from: 'New Bus Stand', to: 'Salem GGH', route: '80-Ordinary' },
                { id: '85', from: 'Old Bus Stand', to: 'Kitchipalayam', route: '85-City' },
                { id: '90', from: 'Salem Junction', to: 'Ammapet', route: '90-Shuttle' },
                { id: '95', from: 'New Bus Stand', to: 'Hasthampatti', route: '95-City' },
                { id: '100', from: 'Old Bus Stand', to: 'Seelanaickenpatti', route: '100-Ordinary' }
            ],
            'Chennai': [
                { id: '500A', from: 'Koyambedu CMBT', to: 'Guindy', route: '500A' },
                { id: '47D', from: 'Anna Nagar Circle', to: 'T. Nagar', route: '47D' },
                { id: '21G', from: 'Broadway', to: 'Tambaram', route: '21G' },
                { id: '11G', from: 'Central Railway Station', to: 'K.K. Nagar', route: '11G' },
                { id: '102', from: 'Broadway', to: 'Kelambakkam', route: '102-IT' },
                { id: '570', from: 'Koyambedu CMBT', to: 'Siruseri IT Park', route: '570-Express' },
                { id: '19B', from: 'Saidapet', to: 'Kelambakkam', route: '19B-Ordinary' },
                { id: '23C', from: 'Ayanavaram', to: 'Besant Nagar', route: '23C-City' },
                { id: '29C', from: 'Perambur', to: 'Besant Nagar', route: '29C-Deluxe' },
                { id: 'A1', from: 'Central Railway Station', to: 'Thiruvanmiyur', route: 'A1-Express' },
                { id: 'E18', from: 'Broadway', to: 'Guduvanchery', route: 'E18-Ordinary' },
                { id: '18A', from: 'Broadway', to: 'Tambaram', route: '18A-Fast' },
                { id: 'M70', from: 'Guindy TVK Estate', to: 'Koyambedu CMBT', route: 'M70-Metro' },
                { id: '54', from: 'Broadway', to: 'Poonamallee', route: '54-City' },
                { id: '88K', from: 'Koyambedu CMBT', to: 'Kundrathur', route: '88K-Ordinary' },
                { id: '159A', from: 'Broadway', to: 'Thiruvottiyur', route: '159A-City' },
                { id: '568', from: 'Koyambedu CMBT', to: 'Mahabalipuram', route: '568-Express' },
                { id: 'V51', from: 'Tambaram West', to: 'Velachery', route: 'V51-Shuttle' },
                { id: '91', from: 'Tambaram East', to: 'Thiruvanmiyur', route: '91-Express' },
                { id: '570S', from: 'Koyambedu CMBT', to: 'Siruseri SIPCOT', route: '570S-Deluxe' },
                { id: 'D70', from: 'Velachery', to: 'Ambattur OT', route: 'D70-Ordinary' },
                { id: '47C', from: 'Koyambedu CMBT', to: 'Kotturpuram', route: '47C-City' },
                { id: '17D', from: 'Broadway', to: 'KK Nagar', route: '17D-Ordinary' },
                { id: '21H', from: 'Broadway', to: 'Tambaram West', route: '21H-Deluxe' },
                { id: '500C', from: 'Chengalpattu', to: 'Koyambedu CMBT', route: '500C-Express' }
            ],
            'Coimbatore': [
                { id: '1C', from: 'Gandhipuram Bus Stand', to: 'Singanallur', route: '1C' },
                { id: 'S1', from: 'Peelamedu', to: 'Thudiyalur', route: 'S1' },
                { id: '70', from: 'Ukkadam', to: 'Marudhamalai', route: '70' },
                { id: '11', from: 'Railway Station', to: 'Saravanampatti', route: '11' },
                { id: '12', from: 'Gandhipuram Bus Stand', to: 'Kovaipudur', route: '12-City' },
                { id: '20', from: 'Ukkadam', to: 'Ondipudur', route: '20-Ordinary' },
                { id: '33', from: 'Gandhipuram Bus Stand', to: 'Sulur', route: '33-Express' },
                { id: '45', from: 'Railway Station', to: 'Vadavalli', route: '45-City' },
                { id: '50', from: 'Gandhipuram Bus Stand', to: 'Karunya Nagar', route: '50-Express' },
                { id: '90A', from: 'Ukkadam', to: 'Pollachi', route: '90A-Express' },
                { id: '100', from: 'Gandhipuram Bus Stand', to: 'Anaikatti', route: '100-Ordinary' },
                { id: '3', from: 'Ukkadam', to: 'Railway Station', route: '3-Shuttle' },
                { id: '14', from: 'Singanallur', to: 'Thudiyalur', route: '14-City' },
                { id: '25', from: 'Gandhipuram Bus Stand', to: 'Mettupalayam', route: '25-Express' },
                { id: '34', from: 'Singanallur', to: 'Gandhipuram Bus Stand', route: '34-Ordinary' },
                { id: '44', from: 'Ukkadam', to: 'Saravanampatti', route: '44-City' },
                { id: '55', from: 'Railway Station', to: 'Singanallur', route: '55-Shuttle' },
                { id: '62', from: 'Gandhipuram Bus Stand', to: 'Peelamedu', route: '62-City' },
                { id: '88', from: 'Ukkadam', to: 'Thudiyalur', route: '88-Ordinary' },
                { id: '92', from: 'Singanallur', to: 'Marudhamalai', route: '92-Express' },
                { id: '102', from: 'Gandhipuram Bus Stand', to: 'Railway Station', route: '102-Shuttle' },
                { id: '105', from: 'Ukkadam', to: 'Vadavalli', route: '105-City' },
                { id: '110', from: 'Singanallur', to: 'Kovaipudur', route: '110-Express' },
                { id: '115', from: 'Railway Station', to: 'Pollachi', route: '115-Express' },
                { id: '120', from: 'Gandhipuram Bus Stand', to: 'Saravanampatti', route: '120-Deluxe' }
            ],
            'Ernakulam': [
                { id: 'KL-1', from: 'Vyttila Hub', to: 'Aluva', route: 'KSRTC-Fast' },
                { id: 'KL-2', from: 'Ernakulam South', to: 'Kakkanad', route: 'City-Circular' },
                { id: 'KL-3', from: 'High Court', to: 'Fort Kochi', route: 'Ferry-Bus' },
                { id: 'KL-4', from: 'Edappally', to: 'Muvattupuzha', route: 'Mofussil' },
                { id: 'KL-5', from: 'Vyttila Hub', to: 'Fort Kochi', route: 'KL-5-Express' },
                { id: 'KL-6', from: 'Ernakulam Town', to: 'Kalamassery', route: 'KL-6-Circular' },
                { id: 'KL-7', from: 'High Court', to: 'Angamaly', route: 'KL-7-Fast' },
                { id: 'KL-8', from: 'Vyttila Hub', to: 'Kakkanad Infopark', route: 'KL-8-Metro' },
                { id: 'KL-9', from: 'Ernakulam South', to: 'Tripunithura', route: 'KL-9-City' },
                { id: 'KL-10', from: 'Aluva', to: 'Nedumbassery Airport', route: 'KL-10-Express' },
                { id: 'KL-11', from: 'Vyttila Hub', to: 'Cherthala', route: 'KL-11-Fast' },
                { id: 'KL-12', from: 'High Court', to: 'Vypeen', route: 'KL-12-Ordinary' },
                { id: 'KL-13', from: 'Ernakulam South', to: 'Paravur', route: 'KL-13-Ordinary' },
                { id: 'KL-14', from: 'Edappally', to: 'Aluva', route: 'KL-14-Shuttle' },
                { id: 'KL-15', from: 'Vyttila Hub', to: 'Perumbavoor', route: 'KL-15-Express' },
                { id: 'KL-16', from: 'High Court', to: 'Chittoor', route: 'KL-16-City' },
                { id: 'KL-17', from: 'Ernakulam Town', to: 'Kakkanad', route: 'KL-17-Shuttle' },
                { id: 'KL-18', from: 'Vyttila Hub', to: 'Kaloor', route: 'KL-18-Circular' },
                { id: 'KL-19', from: 'Aluva', to: 'Kalamassery', route: 'KL-19-City' },
                { id: 'KL-20', from: 'High Court', to: 'Ernakulam South', route: 'KL-20-Shuttle' },
                { id: 'KL-21', from: 'Vyttila Hub', to: 'Kochi Airport', route: 'KL-21-Deluxe' },
                { id: 'KL-22', from: 'Ernakulam South', to: 'Aluva', route: 'KL-22-Express' },
                { id: 'KL-23', from: 'High Court', to: 'Tripunithura', route: 'KL-23-City' },
                { id: 'KL-24', from: 'Vyttila Hub', to: 'Kakkanad', route: 'KL-24-Ordinary' },
                { id: 'KL-25', from: 'Kalamassery', to: 'Infopark', route: 'KL-25-Express' }
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
            setSelectedRoute(null);
            sessionStorage.removeItem('savedBoarding');
            sessionStorage.removeItem('savedDestination');
            sessionStorage.removeItem('savedRoutes');
            sessionStorage.setItem('savedSearchState', 'idle');
        }
        if (localDistrict) sessionStorage.setItem('savedDistrict', localDistrict);
    }, []);

    React.useEffect(() => {
        sessionStorage.setItem('savedBoarding', boarding);
        sessionStorage.setItem('savedDestination', destination);
    }, [boarding, destination]);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!boarding || !destination) return;

        setLoading(true);
        setSelectedRoute(null);
        setShowAllBuses(false);

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
            // Fallback mock buses!
            const mockBuses = Array.from({ length: 25 }, (_, i) => {
                const statuses = ['running', 'delayed', 'running', 'scheduled'];
                const sources = ['GPS Sync', 'ETM Login', 'Telematics OBD'];
                const delays = [null, 'Traffic Congestion', null, 'Depot Holdover', null];
                const status = statuses[i % statuses.length];
                const source = sources[i % sources.length];
                const delayReason = status === 'delayed' ? delays[i % delays.length] : null;
                const eta = status === 'scheduled' ? 'Scheduled' : `${(i + 1) * 3} - ${(i + 2) * 3} Mins`;
                const progress = Math.min(95, Math.max(5, (i + 1) * 4));

                return {
                    id: `${routeNo || '500A'}-${i + 1}`,
                    route: routeNo || '500A',
                    status: status,
                    currentLocation: `${boarding} Corridor Sec ${i + 1}`,
                    expectedArrival: eta,
                    confidence: 85 + (i % 15),
                    delayReason: delayReason,
                    lastConfirmedTime: `08:${40 + (i % 20)} AM`,
                    source: source,
                    currentStop: boarding,
                    nextStop: `Transit Stop ${i + 2}`,
                    destination: destination,
                    arrivalStop: destination,
                    district: activeDistrict,
                    progress: progress
                };
            });
            setRoutes(mockBuses);
            setSearchState('results');
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

                {/* "Powered by" branding with Kerala/Tamil Nadu State Seal PNG */}
                <div className="absolute right-6 bottom-4 flex items-center space-x-2.5 z-10 select-none">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">{t('poweredBy', lang)}</span>
                    <img 
                        src={region === 'Kerala' ? '/kerala_seal.png' : '/tn_seal.png'} 
                        alt={region === 'Kerala' ? 'State Seal of Kerala' : 'State Seal of Tamil Nadu'} 
                        className={region === 'Kerala' ? "h-24 w-auto object-contain shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]" : "h-10 w-auto object-contain shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]"} 
                    />
                </div>
            </div>

            {/* Route Search Finder Card */}
            <div className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-lg border border-gray-150 dark:border-slate-800 p-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                    
                    {/* Route Number Search Input */}
                    <div className="flex flex-col space-y-2 text-left justify-between h-full lg:pr-6 lg:border-r border-gray-150 dark:border-slate-800 pb-5 lg:pb-0 border-b border-gray-100 dark:border-slate-850 lg:border-b-0">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-550 uppercase tracking-widest flex items-center mb-2">
                                <Bus className="w-3.5 h-3.5 mr-1.5 text-gray-450 dark:text-gray-550" />
                                {t('routeNo', lang) || "Route Number"}
                            </label>
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-450 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder={t('searchRoutePlaceholder', lang) || "Search by route number"}
                                    value={routeNo}
                                    onChange={(e) => setRouteNo(e.target.value)}
                                    className="w-full pl-9 pr-9 py-2.5 bg-white dark:bg-[#070F1E] border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#008055] focus:ring-0 text-xs font-bold text-[#0F1E36] dark:text-white placeholder-gray-400 dark:placeholder-slate-600"
                                />
                                <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-[#008055]" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-1.5 pt-1.5 flex-wrap gap-y-1">
                            <span className="text-[9px] font-black text-gray-400 dark:text-gray-550 uppercase">{t('popularRoutes', lang) || "Popular Routes"}:</span>
                            <div className="flex items-center space-x-1">
                                {['1A', '1C', '2C', '3D', '5E', '12X'].map((route) => {
                                    const isActive = routeNo === route || (route === '1C' && boarding === 'Gandhipuram Bus Stand' && routeNo === '');
                                    return (
                                        <button
                                            key={route}
                                            type="button"
                                            onClick={() => handlePopularRouteClick(route)}
                                            className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider transition-colors ${
                                                isActive 
                                                    ? 'bg-[#008055] text-white' 
                                                    : 'bg-gray-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-850 text-gray-555 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            {route}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Boarding Point Dropdown select */}
                    <div className="flex flex-col space-y-2 text-left justify-between h-full lg:px-6 lg:border-r border-gray-150 dark:border-slate-800 pb-5 lg:pb-0 border-b border-gray-100 dark:border-slate-850 lg:border-b-0">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest flex items-center mb-2">
                                <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#008055]" />
                                {t('boardingPoint', lang) || "Boarding Point"}
                            </label>
                            <div className="relative">
                                <select
                                    value={boarding}
                                    onChange={(e) => setBoarding(e.target.value)}
                                    className="w-full pl-3.5 pr-10 py-2.5 bg-white dark:bg-[#070F1E] border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#008055] focus:ring-0 appearance-none text-xs font-bold text-[#0F1E36] dark:text-white cursor-pointer"
                                >
                                    <option value="">{t('selectBoardingPlaceholder', lang) || "Select boarding point"}</option>
                                    {availableStops.map(stop => (
                                        <option key={stop} value={stop}>{stop}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-[#008055]">
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setBoarding(availableStops[0] || 'Gandhipuram Bus Stand');
                            }}
                            className="flex items-center space-x-1.5 text-[#008055] dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-[10px] font-bold self-start transition-colors pt-1.5 cursor-pointer"
                        >
                            <Compass className="w-3.5 h-3.5" />
                            <span>{t('useCurrentLocation', lang) || "Use my current location"}</span>
                        </button>
                    </div>

                    {/* Destination Point Dropdown select */}
                    <div className="flex flex-col space-y-2 text-left justify-between h-full lg:px-6 lg:border-r border-gray-150 dark:border-slate-800 pb-5 lg:pb-0 border-b border-gray-100 dark:border-slate-850 lg:border-b-0">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 dark:text-gray-555 uppercase tracking-widest flex items-center mb-2">
                                <Flag className="w-3.5 h-3.5 mr-1.5 text-[#008055]" />
                                {t('destinationPoint', lang) || "Destination Point"}
                            </label>
                            <div className="relative">
                                <select
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="w-full pl-3.5 pr-10 py-2.5 bg-white dark:bg-[#070F1E] border border-gray-200 dark:border-slate-800 rounded-xl focus:border-[#008055] focus:ring-0 appearance-none text-xs font-bold text-[#0F1E36] dark:text-white cursor-pointer"
                                >
                                    <option value="">{t('selectDestinationPlaceholder', lang) || "Select destination point"}</option>
                                    {availableStops.map(stop => (
                                        <option key={stop} value={stop}>{stop}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-[#008055]">
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setDestination(availableStops[availableStops.length - 1] || 'Singanallur');
                            }}
                            className="flex items-center space-x-1.5 text-[#008055] dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-[10px] font-bold self-start transition-colors pt-1.5 cursor-pointer"
                        >
                            <Star className="w-3.5 h-3.5" />
                            <span>{t('viewPopularDestinations', lang) || "View popular destinations"}</span>
                        </button>
                    </div>

                    {/* Submit Button Block */}
                    <div className="lg:pl-6 h-full flex items-center w-full">
                        <button
                            type="submit"
                            disabled={isSearchDisabled}
                            className="w-full relative h-[78px] rounded-2xl bg-gradient-to-br from-[#008055] to-[#004D40] hover:from-[#009462] hover:to-[#005c4c] disabled:opacity-50 text-white flex items-center justify-between px-5 text-left transition-all active:scale-[0.98] shadow-md cursor-pointer overflow-hidden group select-none"
                        >
                            <div className="flex flex-col justify-center">
                                {/* LIVE badge */}
                                <div className="inline-flex items-center space-x-1 px-1.5 py-0.5 bg-white/15 rounded-full text-[7px] font-black tracking-widest uppercase mb-1.5 self-start">
                                    <Globe className="w-2 h-2 animate-pulse" />
                                    <span>LIVE</span>
                                </div>
                                <span className="text-sm font-black tracking-wide">{t('getBusStatus', lang) || "Get Bus Status"}</span>
                                <span className="text-[8px] text-white/70 font-bold mt-0.5">Real-time updates in one click</span>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#008055] group-hover:scale-105 transition-transform shadow shrink-0 ml-2">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#008055]" /> : <ArrowRight className="w-4.5 h-4.5 text-[#008055]" />}
                            </div>
                        </button>
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
                        {/* Mockup Results Container */}
                        {!selectedRoute && (
                            <div className="bg-white dark:bg-[#0B1E36] rounded-3xl shadow-xl border border-gray-150 dark:border-slate-800 overflow-hidden relative z-10 w-full mb-8">
                                {/* Results Header */}
                                <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
                                    <h4 className="text-[#0F1E36] dark:text-white font-black flex items-center text-sm tracking-wide uppercase">
                                        <Bus className="w-4 h-4 mr-2 text-[#0F1E36] dark:text-white" />
                                        {t('availableBus', lang) || 'Available Bus :'}
                                    </h4>
<span className="text-[10px] font-black text-gray-550 dark:text-gray-400 uppercase tracking-widest">
                                        {routes.length} {t('busesActive', lang) || 'BUSES ACTIVE'}
                                    </span>
                                </div>

                                 {(() => {
                                     const getArrivalSortValue = (r) => {
                                         const text = r.expectedArrival || '';
                                         if (text.toLowerCase() === 'scheduled') return 9999;
                                         const match = text.match(/(\d+)/);
                                         if (match) {
                                             return parseInt(match[1], 10);
                                         }
                                         return 8888;
                                     };
                                     const sorted = [...routes].sort((a, b) => getArrivalSortValue(a) - getArrivalSortValue(b));
                                     const topBuses = sorted.slice(0, 4);
                                     const remainingBuses = sorted.slice(4);

                                     return (
                                         <>
                                             {/* Route Cards Grid */}
                                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                                                 {topBuses.map((route, i) => {
                                                     const isDelay = route.status === 'delayed';
                                                     const isSelected = selectedRoute?.id === route.id;
                                                     const locationBg = i === 0 
                                                         ? 'bg-[#FFF5E6] dark:bg-orange-950/20 border-orange-105 dark:border-orange-900/10' 
                                                         : 'bg-[#E6F0FF] dark:bg-blue-950/20 border-blue-105 dark:border-blue-900/10';

                                                     return (
                                                         <div
                                                             key={route.id}
                                                             className={`p-6 bg-white dark:bg-[#070F1E] rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden border-2 ${
                                                                 isSelected 
                                                                     ? 'border-[#FF9933] shadow-lg scale-[1.02]' 
                                                                     : 'border-gray-200 dark:border-slate-800 hover:border-[#FF9933]/50 shadow-sm'
                                                             }`}
                                                             onClick={() => setSelectedRoute(route)}
                                                         >
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
                                                             {/* Card Top: Bus ID and Status Badges */}
                                                             <div className="flex justify-between items-start mb-6 w-full relative z-10">
                                                                 <div className="text-xl font-black text-[#0F1E36] dark:text-white tracking-tight">{route.id}</div>
                                                                 <div className="flex flex-col items-end gap-1">
                                                                     {!isDelay ? (
                                                                         <span className="px-1.5 py-0.5 bg-[#12820B] text-white text-[7px] font-black rounded tracking-wider uppercase leading-none">{t('onTime', lang)}</span>
                                                                     ) : (
                                                                         <span className="px-1.5 py-0.5 bg-red-600 text-white text-[7px] font-black rounded tracking-wider uppercase leading-none">{t('delayed', lang)}</span>
                                                                     )}
                                                                     <span className="px-1.5 py-0.5 bg-[#12820B] text-white text-[7px] font-black rounded tracking-wider uppercase leading-none">
                                                                         {t('runningToday', lang) || 'RUNNING TODAY'}
                                                                     </span>
                                                                 </div>
                                                             </div>

                                                             {/* Card Middle: Current Location */}
                                                             <div className="space-y-4 mb-4 relative z-10">
                                                                 <div className="text-left">
                                                                     <div className="text-[8px] font-black text-gray-450 dark:text-gray-550 uppercase tracking-widest mb-1">{t('currentLocation', lang)}</div>
                                                                     <div className={`py-2 px-3 rounded-lg text-xs font-black border text-center text-[#0F1E36] dark:text-white ${locationBg}`}>
                                                                         {route.currentLocation}
                                                                     </div>
                                                                 </div>

                                                                 {/* Card Bottom: Expected Arrival */}
                                                                 <div className="text-left">
                                                                     <div className="text-[8px] font-black text-gray-450 dark:text-gray-550 uppercase tracking-widest mb-0.5">{t('expectedArrival', lang) || 'EXPECTED ARRIVAL'}</div>
                                                                     <div className="text-sm font-black text-[#12820B] dark:text-green-400">
                                                                         {route.expectedArrival}
                                                                     </div>
                                                                 </div>
                                                             </div>
                                                         </div>
                                                     );
                                                 })}
                                             </div>

                                             {/* Remaining Buses List (Conditional rendering based on view more toggle) */}
                                             {remainingBuses.length > 0 && showAllBuses && (
                                                 <div className="mt-2 border-t border-gray-150 dark:border-slate-800/80 pt-6 px-6 pb-2 text-left">
                                                     <h5 className="text-[10px] font-black uppercase tracking-widest text-[#0F1E36] dark:text-white mb-4 flex items-center">
                                                         <span className="w-2 h-2 rounded-full bg-[#FF9933] mr-2 animate-pulse"></span>
                                                         Other Available Transits ({remainingBuses.length} Buses)
                                                     </h5>
                                                     <div className="space-y-2">
                                                         {remainingBuses.map((r, idx) => {
                                                             const isSelected = selectedRoute?.id === r.id;
                                                             const rowBg = idx % 2 === 0
                                                                 ? 'bg-gray-50/50 dark:bg-slate-900/30'
                                                                 : 'bg-white dark:bg-[#070F1E]';

                                                             return (
                                                                 <div
                                                                     key={r.id}
                                                                     onClick={() => setSelectedRoute(r)}
                                                                     className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 group ${
                                                                         isSelected
                                                                             ? 'border-[#FF9933] bg-[#FFF9F2] dark:bg-[#FF9933]/5 shadow-sm'
                                                                             : `border-gray-205 dark:border-slate-800 hover:border-[#FF9933]/50 ${rowBg}`
                                                                     }`}
                                                                 >
                                                                     {/* Left: Bus ID & Source Badge */}
                                                                     <div className="flex items-center space-x-3 shrink-0">
                                                                         <div className="w-10 h-10 rounded-xl bg-[#0B1E36] dark:bg-slate-900 flex items-center justify-center font-black text-white text-xs border border-gray-200 dark:border-slate-800 group-hover:border-[#FF9933]/40 transition-colors">
                                                                             {r.id.split('-')[0]}
                                                                         </div>
                                                                         <div>
                                                                             <div className="font-black text-[#0F1E36] dark:text-white text-sm">
                                                                                 {r.id}
                                                                             </div>
                                                                             <div className="text-[8px] text-gray-405 font-bold uppercase tracking-wider">
                                                                                 {r.source} • {r.status.toUpperCase()}
                                                                             </div>
                                                                         </div>
                                                                     </div>

                                                                     {/* Location & Progress Bar */}
                                                                     <div className="flex-1 text-left min-w-0">
                                                                         <div className="text-[9px] font-bold text-gray-500 dark:text-slate-400 truncate">
                                                                             {r.currentLocation}
                                                                         </div>
                                                                         <div className="w-full bg-gray-150 dark:bg-slate-800 h-1 rounded-full overflow-hidden mt-1.5 max-w-[200px]">
                                                                             <div 
                                                                                 className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                                                                                 style={{ width: `${r.progress}%` }}
                                                                             />
                                                                         </div>
                                                                     </div>

                                                                     {/* Destination stop info */}
                                                                     <div className="text-left sm:text-right shrink-0">
                                                                         <div className="text-[8px] font-black text-gray-455 uppercase tracking-widest">Arrival Terminal</div>
                                                                         <div className="text-xs font-extrabold text-[#0F1E36] dark:text-white truncate max-w-[150px]">
                                                                             {r.destination}
                                                                         </div>
                                                                     </div>

                                                                     {/* ETA / Confidence badge */}
                                                                     <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0">
                                                                         <div className="text-right">
                                                                             <div className="text-xs font-black text-[#12820B] dark:text-green-400">
                                                                                 {r.expectedArrival}
                                                                             </div>
                                                                             <div className="text-[8px] text-gray-455 font-bold uppercase">
                                                                                 {r.confidence}% Conf
                                                                             </div>
                                                                         </div>
                                                                         <button className="px-3.5 py-2 bg-[#0B1E36] dark:bg-slate-800 hover:bg-[#FF9933] hover:text-white dark:hover:bg-[#FF9933] border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-205 font-black text-[9px] uppercase tracking-wider rounded-xl transition-all flex items-center space-x-1">
                                                                             <span>TRACK</span>
                                                                             <ChevronRight size={10} />
                                                                         </button>
                                                                     </div>
                                                                 </div>
                                                             );
                                                         })}
                                                     </div>
                                                 </div>
                                             )}

                                             {/* View More / View Less Toggle Button */}
                                             {remainingBuses.length > 0 && (
                                                 <div className="flex justify-center p-6 border-t border-gray-100 dark:border-slate-800">
                                                     <button
                                                         type="button"
                                                         onClick={() => setShowAllBuses(!showAllBuses)}
                                                         className="px-6 py-2.5 bg-[#0F1E36] dark:bg-slate-800 hover:bg-[#FF9933] dark:hover:bg-[#FF9933] text-white font-black rounded-xl text-xs uppercase tracking-widest shadow-sm transition-all flex items-center space-x-2 border border-gray-200 dark:border-slate-700 cursor-pointer"
                                                     >
                                                         <span>{showAllBuses ? 'Show Fewer Buses' : `View More Available Buses (${remainingBuses.length})`}</span>
                                                         <ChevronDown size={14} className={`transform transition-transform duration-300 ${showAllBuses ? 'rotate-180' : ''}`} />
                                                     </button>
                                                 </div>
                                             )}
                                         </>
                                     );
                                 })()}
                             </div>
                        )}

                        {/* Selected Bus AI Arrival Prediction details Section */}
                        {selectedRoute && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 border-2 border-[#FF9933]/20 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0B1E36] shadow-xl relative overflow-hidden"
                            >
                                {/* Back button */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedRoute(null)}
                                    className="mb-6 flex items-center text-gray-500 hover:text-[#FF9933] dark:text-gray-400 dark:hover:text-[#FF9933] font-black text-[10px] tracking-widest uppercase transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    {t('backToAvailableBuses', lang) || 'Back to Available Buses'}
                                </button>
                                {/* Status Strip */}
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <span className="px-3 py-1 bg-[#12820B] text-white text-[10px] font-black rounded-full uppercase tracking-wider flex items-center">
                                        <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></span>
                                        {t('runningToday', lang) || 'Running Today'}
                                    </span>
                                    
                                    <div className="flex items-center text-xs font-bold text-gray-555 dark:text-gray-400">
                                        <CheckCircle className="w-4 h-4 mr-1.5 text-[#12820B]" />
                                        <span>
                                            {t('tripConfirmedAt', lang) || 'Trip confirmed via ETM login at'} {selectedRoute.lastConfirmedTime || '08:42 AM'}
                                        </span>
                                    </div>

                                    {selectedRoute.status === 'delayed' && selectedRoute.delayReason && (
                                        <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-full uppercase tracking-wider flex items-center">
                                            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                                            {t('delayReasonLabel', lang) || 'Delay Reason'}: {selectedRoute.delayReason}
                                        </span>
                                    )}
                                </div>

                                {/* AI Prediction Box */}
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                                    
                                    {/* Left Column: ETA + Next Stop */}
                                    <div className="md:col-span-7 flex flex-col justify-between space-y-6">
                                        <div>
                                            <h5 className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center mb-4">
                                                <Cpu className="w-4.5 h-4.5 text-[#FF9933] mr-2" />
                                                AI ARRIVAL PREDICTION FOR BUS {selectedRoute.id}
                                            </h5>
                                            
                                            <div className="space-y-1">
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    EXPECTED ARRIVAL:
                                                </div>
                                                <div className="text-5xl sm:text-6xl font-black text-[#FF9933] tracking-tight">
                                                    {selectedRoute.expectedArrival}
                                                </div>
                                            </div>

                                            <div className="space-y-1 mt-4">
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    ARRIVAL STOP:
                                                </div>
                                                <div className="text-2xl font-black text-[#0F1E36] dark:text-white tracking-tight">
                                                    {selectedRoute.destination}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Next Stop Pill */}
                                        <div className="bg-[#FFF5E6] dark:bg-orange-950/20 rounded-2xl p-4 flex items-center space-x-3.5 border border-orange-100 dark:border-orange-900/10">
                                            <div className="w-8 h-8 rounded-full bg-[#FF9933] flex items-center justify-center shadow-md">
                                                <Navigation className="w-4.5 h-4.5 text-white rotate-45" />
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-black text-[#FF9933] uppercase tracking-wider">
                                                    NEXT STOP
                                                </div>
                                                <div className="text-sm font-black text-[#0F1E36] dark:text-white">
                                                    {selectedRoute.nextStop || 'Central Silk Board Junction'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Confidence + Actions */}
                                    <div className="md:col-span-5 flex flex-col justify-between bg-gray-50/50 dark:bg-slate-900/40 rounded-2xl p-6 border border-gray-100 dark:border-slate-800">
                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between items-center text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">
                                                    <span>RELIABILITY METRIC / AI CONFIDENCE</span>
                                                    <span className="text-[#0F1E36] dark:text-white font-extrabold">{selectedRoute.confidence || 88}%</span>
                                                </div>
                                                {/* Progress Bar */}
                                                <div className="w-full h-2.5 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-[#0F1E36] dark:bg-green-500 rounded-full transition-all duration-500" 
                                                        style={{ width: `${selectedRoute.confidence || 88}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <p className="text-[9px] font-extrabold text-gray-400 dark:text-gray-555 leading-relaxed uppercase">
                                                MODEL OPTIMIZED FOR LOCAL {activeDistrict.toUpperCase()} TERRAIN AND REAL-TIME TRANSIT DENSITY AT PEAK HOURS
                                            </p>
                                        </div>

                                        <div className="space-y-4 mt-6">
                                            <div className="flex gap-3">
                                                <button 
                                                    type="button"
                                                    onClick={() => navigateTo('service-reporting')}
                                                    className="flex-1 py-2.5 border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-[#0F1E36] dark:text-white rounded-xl text-xs font-black transition-colors"
                                                >
                                                    Submit Feedback
                                                </button>
                                                <button 
                                                    type="button"
                                                    onClick={() => navigateTo('service-reporting')}
                                                    className="flex-1 py-2.5 border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-[#0F1E36] dark:text-white rounded-xl text-xs font-black transition-colors"
                                                >
                                                    Report Issue
                                                </button>
                                            </div>

                                            <div className="flex items-center text-[9px] font-black text-green-500 uppercase tracking-widest">
                                                <CheckCircle className="w-3.5 h-3.5 mr-1 text-green-500" />
                                                REAL-TIME GPS SYNC ACTIVE
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Dynamic Trip Progress Line Map */}
                                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-800">
                                    <h6 className="text-[10px] font-black text-gray-400 dark:text-gray-550 uppercase tracking-widest mb-6 flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></span>
                                        LIVE WHOLE ROUTE PROGRESS TRACKER (POINT A TO Z)
                                    </h6>

                                    {(() => {
                                        const p = selectedRoute.progress || 40;
                                        const routeOrigin = activeDistrict === 'Coimbatore' ? 'Coimbatore Central Terminal' : 'Kochi Marine Drive Terminal';
                                        const routeTerminus = activeDistrict === 'Coimbatore' ? 'Coimbatore Bypass Terminus' : 'Aluva KSRTC Terminal';

                                        // Dynamic segments width calculation
                                        let greenWidth = p;
                                        let orangeWidth = 0;
                                        let dashedWidth = 0;
                                        let orangeLeft = p;
                                        let dashedLeft = 100;

                                        if (p < 33.33) {
                                            // Bus is approaching boarding stop D
                                            orangeWidth = 33.33 - p;
                                            dashedWidth = 66.67;
                                            dashedLeft = 33.33;
                                        } else if (p < 66.66) {
                                            // Bus is carrying user between boarding D and destination G
                                            orangeWidth = 66.66 - p;
                                            dashedWidth = 33.34;
                                            dashedLeft = 66.66;
                                        } else {
                                            // Bus is past destination G, heading to terminus Z
                                            orangeWidth = 100 - p;
                                            dashedWidth = 0;
                                            dashedLeft = 100;
                                        }

                                        return (
                                            <div className="relative px-6 py-10 bg-gray-50/50 dark:bg-slate-900/25 rounded-2xl border border-gray-150 dark:border-slate-800/80 mt-2">
                                                {/* The Progress Line Container */}
                                                <div className="relative h-1 w-full bg-gray-250 dark:bg-slate-800 rounded-full">
                                                    
                                                    {/* Segment 1: Green (0% to Bus Position) */}
                                                    <div 
                                                        className="absolute h-full bg-green-500 rounded-l-full transition-all duration-1000"
                                                        style={{ 
                                                            left: '0%', 
                                                            width: `${greenWidth}%` 
                                                        }}
                                                    ></div>

                                                    {/* Segment 2: Saffron (Bus Position to next milestone) */}
                                                    <div 
                                                        className="absolute h-full bg-[#FF9933] transition-all duration-1000"
                                                        style={{ 
                                                            left: `${orangeLeft}%`, 
                                                            width: `${orangeWidth}%` 
                                                        }}
                                                    ></div>

                                                    {/* Segment 3: Gray Dashed (Remaining future path) */}
                                                    {dashedWidth > 0 && (
                                                        <div 
                                                            className="absolute h-0 border-t-2 border-dashed border-gray-400 dark:border-slate-700 transition-all duration-1000"
                                                            style={{ 
                                                                left: `${dashedLeft}%`, 
                                                                width: `${dashedWidth}%`,
                                                                top: '50%',
                                                                transform: 'translateY(-50%)'
                                                            }}
                                                        ></div>
                                                    )}

                                                    {/* Circular indicators for stops */}
                                                    {/* Stop 1 (0%): Route Origin - Always active green */}
                                                    <div 
                                                        className="absolute w-3 h-3 rounded-full border-2 bg-white dark:bg-[#070F1E] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center top-1/2 border-green-500"
                                                        style={{ left: '0%' }}
                                                    >
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                    </div>

                                                    {/* Stop 2 (33.33%): Your Boarding Stop D */}
                                                    <div 
                                                        className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center top-1/2 transition-all duration-300 ${
                                                            p < 33.33 
                                                                ? 'w-4 h-4 rounded-full border-2 border-[#FF9933] bg-white dark:bg-[#070F1E] shadow-sm'
                                                                : 'w-3 h-3 rounded-full border-2 border-green-500 bg-white dark:bg-[#070F1E]'
                                                        }`}
                                                        style={{ left: '33.33%' }}
                                                    >
                                                        {p < 33.33 ? (
                                                            <div className="w-2.5 h-2.5 rounded-full border border-[#FF9933] flex items-center justify-center">
                                                                <div className="w-1 h-1 rounded-full bg-[#FF9933]"></div>
                                                            </div>
                                                        ) : (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                        )}
                                                    </div>

                                                    {/* Stop 3 (66.66%): Your Get-down Stop G */}
                                                    <div 
                                                        className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center top-1/2 transition-all duration-300 ${
                                                            p < 33.33 
                                                                ? 'w-3 h-3 rounded-full border-2 border-gray-300 dark:border-slate-700 bg-white dark:bg-[#070F1E]'
                                                                : p < 66.66
                                                                    ? 'w-4 h-4 rounded-full border-2 border-[#FF9933] bg-white dark:bg-[#070F1E] shadow-sm'
                                                                    : 'w-3 h-3 rounded-full border-2 border-green-500 bg-white dark:bg-[#070F1E]'
                                                        }`}
                                                        style={{ left: '66.66%' }}
                                                    >
                                                        {p < 33.33 ? (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-slate-700"></div>
                                                        ) : p < 66.66 ? (
                                                            <div className="w-2.5 h-2.5 rounded-full border border-[#FF9933] flex items-center justify-center">
                                                                <div className="w-1 h-1 rounded-full bg-[#FF9933]"></div>
                                                            </div>
                                                        ) : (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                        )}
                                                    </div>

                                                    {/* Stop 4 (100%): Route Terminus Z */}
                                                    <div 
                                                        className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center top-1/2 transition-all duration-300 ${
                                                            p < 66.66
                                                                ? 'w-3 h-3 rounded-full border-2 border-gray-300 dark:border-slate-700 bg-white dark:bg-[#070F1E]'
                                                                : 'w-4 h-4 rounded-full border-2 border-[#FF9933] bg-white dark:bg-[#070F1E] shadow-sm'
                                                        }`}
                                                        style={{ left: '100%' }}
                                                    >
                                                        {p < 66.66 ? (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-slate-700"></div>
                                                        ) : (
                                                            <div className="w-2.5 h-2.5 rounded-full border border-[#FF9933] flex items-center justify-center">
                                                                <div className="w-1 h-1 rounded-full bg-[#FF9933]"></div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* The Moving Bus Icon */}
                                                    <div 
                                                        className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out z-20 flex flex-col items-center pointer-events-none top-1/2"
                                                        style={{ 
                                                            left: `${p}%`
                                                        }}
                                                    >
                                                        {/* Float Active Pill */}
                                                        <div className="bg-[#12820B] text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow-md uppercase tracking-wider mb-2.5 animate-pulse whitespace-nowrap relative">
                                                            BUS {selectedRoute.id} ({p}%)
                                                            {/* Small green pointer line downwards */}
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-[#12820B]"></div>
                                                        </div>
                                                        {/* Bus Round Wrapper & Pointer Shape */}
                                                        <div className="relative flex flex-col items-center">
                                                            <div className="w-7 h-7 rounded-full bg-[#FF9933] border-2 border-[#FAF6ED] dark:border-[#0B1E36] flex items-center justify-center shadow-lg text-white z-10">
                                                                <Bus className="w-3.5 h-3.5" />
                                                            </div>
                                                            {/* Pointer hook triangle at bottom of circle */}
                                                            <div className="w-2.5 h-2.5 bg-[#FF9933] rotate-45 -mt-2 border-r border-b border-[#FAF6ED] dark:border-[#0B1E36] z-0"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Stop Labels under the line */}
                                                <div className="relative w-full mt-6 flex justify-between text-left text-xs">
                                                    
                                                    {/* Stop 1: Route Origin */}
                                                    <div className="w-1/4 pr-2">
                                                        <span className="block text-[8px] font-black text-green-500 uppercase tracking-widest mb-0.5">ROUTE ORIGIN (0%)</span>
                                                        <span className="block text-[10px] font-black text-[#0F1E36] dark:text-white uppercase leading-tight line-clamp-1">
                                                            {routeOrigin}
                                                        </span>
                                                        <span className="block text-[8px] font-bold text-gray-500 mt-0.5">
                                                            DEP 08:00 AM
                                                        </span>
                                                    </div>

                                                    {/* Stop 2: Boarding Stop */}
                                                    <div className="w-1/4 px-1 text-center">
                                                        <span className={`block text-[8px] font-black uppercase tracking-widest mb-0.5 ${p < 33.33 ? 'text-[#FF9933]' : 'text-green-500'}`}>
                                                            YOUR BOARDING (33%)
                                                        </span>
                                                        <span className="block text-[10px] font-black text-[#0F1E36] dark:text-white uppercase leading-tight line-clamp-1">
                                                            {boarding || 'Singanallur'}
                                                        </span>
                                                        <span className="block text-[8px] font-bold text-gray-500 mt-0.5">
                                                            SCH 08:30 AM
                                                        </span>
                                                    </div>

                                                    {/* Stop 3: Get-Down Stop */}
                                                    <div className="w-1/4 px-1 text-center">
                                                        <span className={`block text-[8px] font-black uppercase tracking-widest mb-0.5 ${(p >= 33.33 && p < 66.66) ? 'text-[#FF9933] font-bold' : 'text-gray-400'}`}>
                                                            YOUR GET-DOWN (66%)
                                                        </span>
                                                        <span className="block text-[10px] font-black text-[#0F1E36] dark:text-white uppercase leading-tight line-clamp-1">
                                                            {destination || 'Edappally Bypass Junction'}
                                                        </span>
                                                        <span className="block text-[8px] font-bold text-gray-500 mt-0.5">
                                                            ETA 09:10 AM
                                                        </span>
                                                    </div>

                                                    {/* Stop 4: Route Terminus */}
                                                    <div className="w-1/4 pl-2 text-right">
                                                        <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">ROUTE TERMINUS (100%)</span>
                                                        <span className="block text-[10px] font-black text-[#0F1E36] dark:text-white uppercase leading-tight line-clamp-1">
                                                            {routeTerminus}
                                                        </span>
                                                        <span className="block text-[8px] font-bold text-[#0F1E36] dark:text-gray-300 mt-0.5">
                                                            ETA 09:45 AM
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>

                            </motion.div>
                        )}
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
                            <h5 className="text-[10px] font-black text-orange-850 dark:text-orange-300 uppercase tracking-wider mb-1">
                                {region === 'Kerala' ? t('diverstionMGRoadTitle', lang) : t('diverstionAnnaSalaiTitle', lang)}
                            </h5>
                            <p className="text-[10px] text-gray-550 dark:text-gray-400 font-bold leading-normal">
                                {region === 'Kerala' ? t('diverstionMGRoadDesc', lang) : t('diverstionAnnaSalaiDesc', lang)}
                            </p>
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest block mt-2">10 {t('minsAgo', lang)}</span>
                        </div>
                    </div>

                    <div className="bg-green-50/50 dark:bg-green-950/10 p-4 rounded-2xl border border-green-150 dark:border-green-950/20 text-left flex items-start space-x-3.5">
                        <CheckCircle className="w-5 h-5 text-[#12820B] shrink-0 mt-0.5" />
                        <div>
                            <h5 className="text-[10px] font-black text-[#12820B] dark:text-green-400 uppercase tracking-wider mb-1">
                                {region === 'Kerala' ? t('ksrtcFPOnScheduleTitle', lang) : t('route1CNormalTitle', lang)}
                            </h5>
                            <p className="text-[10px] text-gray-550 dark:text-gray-400 font-bold leading-normal">
                                {region === 'Kerala' ? t('ksrtcFPOnScheduleDesc', lang) : t('route1CNormalDesc', lang)}
                            </p>
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest block mt-2">15 {t('minsAgo', lang)}</span>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 dark:bg-blue-950/10 p-4 rounded-2xl border border-blue-150 dark:border-blue-950/20 text-left flex items-start space-x-3.5">
                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                            <h5 className="text-[10px] font-black text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-1">
                                {region === 'Kerala' ? t('routeKL4DelayTitle', lang) : t('route5EDelayTitle', lang)}
                            </h5>
                            <p className="text-[10px] text-gray-550 dark:text-gray-400 font-bold leading-normal">
                                {region === 'Kerala' ? t('routeKL4DelayDesc', lang) : t('route5EDelayDesc', lang)}
                            </p>
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest block mt-2">25 {t('minsAgo', lang)}</span>
                        </div>
                    </div>

                    <div className="bg-purple-50/50 dark:bg-purple-950/10 p-4 rounded-2xl border border-purple-150 dark:border-purple-950/20 text-left flex items-start space-x-3.5">
                        <Bus className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                        <div>
                            <h5 className="text-[10px] font-black text-purple-800 dark:text-purple-300 uppercase tracking-wider mb-1">
                                {region === 'Kerala' ? t('newSwiftElectricTitle', lang) : t('newExpress12XTitle', lang)}
                            </h5>
                            <p className="text-[10px] text-gray-550 dark:text-gray-400 font-bold leading-normal">
                                {region === 'Kerala' ? t('newSwiftElectricDesc', lang) : t('newExpress12XDesc', lang)}
                            </p>
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest block mt-2">1 {t('hourAgo', lang)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
