import React, { useState } from 'react';
import Hero from './components/Hero';
import TrackingDashboard from './components/TrackingDashboard';
import EmergencyDashboard from './components/EmergencyDashboard';
import ServiceReporting from './components/ServiceReporting';
import Footer from './components/Footer';
import BusAnimation from './components/BusAnimation';
import Login from './components/Login';
import OTP from './components/OTP';
import RouteDetails from './components/RouteDetails';
import Profile from './components/Profile';
import LogoutSuccess from './components/LogoutSuccess';
import AboutAI from './components/AboutAI';
import OperatorDashboard from './components/OperatorDashboard';

function App() {
    const [currentPage, setCurrentPage] = useState('track');
    const [isAdmin, setIsAdmin] = useState(false);
    const [lang, setLang] = useState('English');
    const [globalRouteDetails, setGlobalRouteDetails] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('transitIndiaTheme');
        return saved === 'dark';
    });

    React.useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('transitIndiaTheme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('transitIndiaTheme', 'light');
        }
    }, [isDarkMode]);

    const renderContent = () => {
        switch (currentPage) {
            case 'login':
                return <Login navigateTo={setCurrentPage} lang={lang} />;
            case 'otp':
                return <OTP navigateTo={setCurrentPage} lang={lang} />;
            case 'track':
                return <TrackingDashboard navigateTo={setCurrentPage} setGlobalRouteDetails={setGlobalRouteDetails} lang={lang} />;
            case 'routeDetails':
                return <RouteDetails routeData={globalRouteDetails} navigateTo={setCurrentPage} setGlobalRouteDetails={setGlobalRouteDetails} lang={lang} />;
            case 'emergency':
                return <EmergencyDashboard routeData={globalRouteDetails} navigateTo={setCurrentPage} lang={lang} />;
            case 'service-reporting':
                return <ServiceReporting routeData={globalRouteDetails} navigateTo={setCurrentPage} lang={lang} />;
            case 'operatorDashboard':
                return <OperatorDashboard navigateTo={setCurrentPage} lang={lang} />;
            case 'about':
                return <AboutAI lang={lang} />;
            case 'profile':
                return <Profile navigateTo={setCurrentPage} lang={lang} />;
            case 'logoutSuccess':
                return <LogoutSuccess navigateTo={setCurrentPage} lang={lang} />;
            default:
                return <Login navigateTo={setCurrentPage} lang={lang} />;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 flex flex-col font-sans relative transition-colors duration-300">
            {currentPage !== 'service-reporting' && (
                <Hero
                    activeTab={currentPage}
                    setActiveTab={setCurrentPage}
                    lang={lang}
                    setLang={setLang}
                    navigateTo={setCurrentPage}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                />
            )}

            <main className={`flex-grow w-full relative ${currentPage !== 'service-reporting' ? 'z-20 mb-16 px-4 md:px-8 pt-4' : ''}`}>
                {renderContent()}
            </main>

            <BusAnimation />
            <Footer />
        </div>
    );
}

export default App;
