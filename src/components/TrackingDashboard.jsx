import React, { useState } from 'react';
import { Search, MapPin, Navigation, ArrowRight, Loader2, Bus } from 'lucide-react';
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
            ],
            'Thiruvananthapuram': [
                { id: 'TVM-1', from: 'Thampanoor Central', to: 'Technopark', route: 'City-Circular' },
                { id: 'TVM-2', from: 'East Fort', to: 'Kovalam', route: 'Ordinary' },
                { id: 'TVM-3', from: 'Medical College', to: 'Attingal', route: 'Fast-Pass' },
                { id: 'TVM-4', from: 'Pappanamcode', to: 'Nedumangad', route: 'Super-Fast' },
            ]
        };

        let baseRoutes = routeMap[district];
        if (!baseRoutes) {
            // Generic dynamic fallback
            baseRoutes = [
                { id: `${district.substring(0, 2).toUpperCase()}-1`, from: `${district} Old Bus Stand`, to: `${district} New Bus Stand`, route: 'City-1' },
                { id: `${district.substring(0, 2).toUpperCase()}-2`, from: `${district} Junction`, to: `${district} Market`, route: 'City-2' },
                { id: `${district.substring(0, 2).toUpperCase()}-3`, from: `${district} North Point`, to: `${district} Industrial Estate`, route: 'City-3' },
                { id: `${district.substring(0, 2).toUpperCase()}-4`, from: `${district} Medical College`, to: `${district} South Gate`, route: 'City-4' }
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

        // Only clear if district actually changed, thus preserving state upon backward navigation
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

        // Auto-load active buses on page load
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

    // Auto-save form and search states to preserve them during navigation
    React.useEffect(() => {
        sessionStorage.setItem('savedBoarding', boarding);
        sessionStorage.setItem('savedDestination', destination);
        sessionStorage.setItem('savedSearchState', searchState);
        sessionStorage.setItem('savedRoutes', JSON.stringify(routes));
    }, [boarding, destination, searchState, routes]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!boarding || !destination) return;

        setLoading(true);

        if (boarding === destination && boarding !== '') {
            setLoading(false);
            setSearchState('empty');
            setRoutes([]);
            return;
        }

        // Call real API
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

    const isSearchDisabled = loading || (!boarding || !destination || boarding === 'Select Stop' || destination === 'Select Stop');

    return (
        <div className="max-w-5xl mx-auto w-full pt-12 transition-colors">
            {/* Search Card */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden relative z-20 transition-colors">

                {/* Orange Banner Header */}
                <div className="bg-[#f97316] dark:bg-orange-600 px-8 py-5 flex items-center transition-colors">
                    <Bus className="mr-3 text-white w-6 h-6" />
                    <h3 className="text-xl font-bold text-[#0f172a] dark:text-white transition-colors">{t('liveTransitRadar', lang)}</h3>
                </div>

                <form onSubmit={handleSearch} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Route Number */}
                        <div>
                            <label className="block text-sm font-bold text-[#0f172a] dark:text-gray-200 mb-2 flex items-center transition-colors">
                                <Navigation className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" /> {t('routeNo', lang) || 'Route Number'}
                            </label>
                            <input
                                type="text"
                                placeholder={t('searchBuses', lang)}
                                value={routeNo}
                                onChange={(e) => setRouteNo(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] transition-colors text-base text-[#0f172a] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
                            />
                            {routeNo && !/^[A-Za-z0-9]+$/.test(routeNo) && (
                                <p className="text-xs text-red-500 mt-1 font-semibold">Invalid Route Number</p>
                            )}
                        </div>

                        {/* Boarding */}
                        <div>
                            <label className="block text-sm font-bold text-[#0f172a] dark:text-gray-200 mb-2 flex items-center transition-colors">
                                <MapPin className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" /> {t('boardingPoint', lang)}
                            </label>
                            <div className="relative">
                                <select
                                    value={boarding}
                                    onChange={(e) => setBoarding(e.target.value)}
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] appearance-none text-[#0f172a] dark:text-white shadow-sm transition-colors cursor-pointer"
                                >
                                    <option value="" className="text-gray-400 dark:text-gray-500">{t('selectBoarding', lang)}</option>

                                    <optgroup label={`${activeDistrict} Locations`}>
                                        {availableStops.map(stop => (
                                            <option key={stop} value={stop}>{stop}</option>
                                        ))}
                                    </optgroup>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500 dark:text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Destination */}
                        <div>
                            <label className="block text-sm font-bold text-[#0f172a] dark:text-gray-200 mb-2 flex items-center transition-colors">
                                <MapPin className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" /> {t('destinationPoint', lang)}
                            </label>
                            <div className="relative">
                                <select
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316] appearance-none text-[#0f172a] dark:text-white shadow-sm transition-colors cursor-pointer"
                                >
                                    <option value="" className="text-gray-400 dark:text-gray-500">{t('selectDestination', lang)}</option>

                                    <optgroup label={`${activeDistrict} Locations`}>
                                        {availableStops.map(stop => (
                                            <option key={stop} value={stop}>{stop}</option>
                                        ))}
                                    </optgroup>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500 dark:text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button (Left Aligned) */}
                    <div>
                        <button
                            type="submit"
                            disabled={isSearchDisabled}
                            className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-lg px-6 py-3.5 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <span className="bg-[#0f172a] dark:bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded mr-3 font-bold tracking-wider transition-colors">LIVE</span>
                                    <span>{t('getBusStatus', lang)}</span>
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Empty State / No Routes Available */}
            <AnimatePresence mode="wait">
                {searchState === 'empty' && (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="mt-8 relative z-10"
                    >
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 p-10 max-w-2xl mx-auto text-center relative overflow-hidden transition-colors">
                            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm transition-colors">
                                <Bus className="w-10 h-10 text-gray-400 dark:text-gray-500 drop-shadow-[0_2px_4px_rgba(245,158,11,0.2)]" style={{ filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.4))' }} />
                            </div>

                            <h3 className="text-2xl font-bold text-ti-navy dark:text-white mb-4 transition-colors">No Routes Available</h3>

                            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-8 max-w-lg mx-auto transition-colors">
                                "We currently do not have active buses operating between the selected boarding point and destination. Please try a different route combination."
                            </p>

                            <button
                                onClick={() => {
                                    setDestination('');
                                    setSearchState('idle');
                                }}
                                className="px-6 py-3 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
                            >
                                Modify Search
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Service Not Available State */}
                {searchState === 'unavailable' && (
                    <motion.div
                        key="unavailable"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        className="mt-8 relative z-10"
                    >
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-orange-100 dark:border-orange-900/30 p-10 max-w-2xl mx-auto text-center relative overflow-hidden transition-colors">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#f97316]"></div>

                            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/30 rounded-full flex items-center justify-center mx-auto mb-5">
                                <Bus className="w-8 h-8 text-[#f97316]" />
                            </div>

                            <h3 className="text-xl font-extrabold text-[#0f172a] dark:text-white mb-3 transition-colors">
                                Service Not Available Yet
                            </h3>

                            <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-3 max-w-md mx-auto transition-colors">
                                Buses on this route are not currently tracked in our system.
                            </p>

                            <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg px-5 py-3 inline-block mb-6">
                                <p className="text-sm font-bold text-[#ea580c] dark:text-orange-400">
                                    We will update you once live tracking is available for this route.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                                <button
                                    onClick={() => {
                                        setBoarding('');
                                        setDestination('');
                                        setSearchState('idle');
                                    }}
                                    className="px-6 py-3 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                                >
                                    Try Another Route
                                </button>
                            </div>

                            <p className="text-[10px] text-gray-400 dark:text-gray-600 font-bold uppercase tracking-widest mt-6">
                                Coimbatore Public Bus Network
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Results Section */}
                {(searchState === 'results' || searchState === 'nearby') && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-8"
                    >
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden relative z-10 w-full mb-12 transition-colors">
                            {/* Results Header */}
                            <div className="px-6 py-5 bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center transition-colors">
                                <h4 className="text-[#0f172a] dark:text-white font-bold flex items-center text-lg transition-colors">
                                    <Bus className="w-5 h-5 mr-3 text-gray-700 dark:text-gray-300 transition-colors" />
                                    {searchState === 'nearby' && userContextDistrict
                                        ? `Buses operating in ${userContextDistrict} District :`
                                        : searchState === 'nearby'
                                            ? 'Nearby Alternative Routes :'
                                            : t('liveStatusResults', lang)}
                                </h4>
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest transition-colors">{routes.length} BUSES ACTIVE</span>
                            </div>

                            {/* Route Cards Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 dark:divide-slate-700 place-items-stretch transition-colors">
                                {routes.map((route, i) => (
                                    <div
                                        key={route.id}
                                        className="p-6 hover:bg-orange-50/30 dark:hover:bg-slate-700/50 transition-colors cursor-pointer flex flex-col group relative h-full"
                                        onClick={() => handleRouteClick(route)}
                                    >
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-[#f97316] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                        <div className="flex justify-between items-start mb-6 w-full">
                                            <div className="text-xl font-bold text-[#0f172a] dark:text-white tracking-tight transition-colors">{route.id}</div>
                                            <div className="flex flex-col items-end gap-1.5 align-top">
                                                {route.status === 'running' ? (
                                                    <span className="px-2.5 py-1 bg-green-500 text-white text-[9px] font-bold rounded uppercase tracking-wider leading-none">ON TIME</span>
                                                ) : (
                                                    <span className="px-2.5 py-1 bg-[#ef4444] text-white text-[9px] font-bold rounded uppercase tracking-wider leading-none">DELAYED</span>
                                                )}
                                                <span className="px-2 py-1 bg-green-700 text-white text-[9px] font-bold rounded uppercase tracking-wider leading-none">
                                                    RUNNING TODAY
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-grow flex flex-col justify-end space-y-6">
                                            <div className="text-center w-full">
                                                <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 transition-colors">{t('currentLocation', lang) || 'CURRENT LOCATION'}</div>
                                                <div className={`w-full py-2.5 rounded text-sm font-bold shadow-sm border border-transparent transition-colors ${i === 0 ? 'bg-[#ffedcc] dark:bg-[#4a2b0d] text-[#9a4d00] dark:text-orange-300 border-orange-100 dark:border-orange-900/50' : i === 1 ? 'bg-[#e2e8f0] dark:bg-slate-700 text-[#0f172a] dark:text-white border-gray-200 dark:border-slate-600' : 'bg-[#f1f5f9] dark:bg-slate-700/50 text-[#334155] dark:text-gray-200 border-gray-100 dark:border-slate-600/50'}`}>
                                                    {route.currentLocation}
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 transition-colors">{t('eta', lang)}</div>
                                                <div className="text-base font-extrabold text-[#0f172a] dark:text-white tracking-tight transition-colors">
                                                    {route.expectedArrival}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

