import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
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
import AlertsPage from './components/AlertsPage';

function App() {
    const [currentPage, setCurrentPage] = useState('track');
    const [lang, setLang] = useState('English');
    const [globalRouteDetails, setGlobalRouteDetails] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

    // Font & lang attribute switching per selected language
    React.useEffect(() => {
        const fontMap = {
            English: "'Inter', 'Noto Sans', sans-serif",
            Hindi:   "'Noto Sans Devanagari', 'Noto Sans', sans-serif",
            Tamil:   "'Noto Sans Tamil', 'Noto Sans', sans-serif",
            Malayalam: "'Noto Sans Malayalam', 'Noto Sans', sans-serif",
        };
        const langAttr = { English: 'en', Hindi: 'hi', Tamil: 'ta', Malayalam: 'ml' };
        document.documentElement.style.fontFamily = fontMap[lang] || fontMap.English;
        document.documentElement.lang = langAttr[lang] || 'en';
    }, [lang]);

    const renderContent = () => {
        switch (currentPage) {
            case 'login':
                return <Login navigateTo={setCurrentPage} lang={lang} setLang={setLang} />;
            case 'otp':
                return <OTP navigateTo={setCurrentPage} lang={lang} setLang={setLang} />;
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
                return <Profile navigateTo={setCurrentPage} lang={lang} setLang={setLang} />;
            case 'logoutSuccess':
                return <LogoutSuccess navigateTo={setCurrentPage} lang={lang} />;
            case 'alerts':
                return <AlertsPage navigateTo={setCurrentPage} lang={lang} />;
            default:
                return <TrackingDashboard navigateTo={setCurrentPage} setGlobalRouteDetails={setGlobalRouteDetails} lang={lang} />;
        }
    };

    if (currentPage === 'login' || currentPage === 'otp' || currentPage === 'operatorDashboard') {
        return (
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070F1E] flex flex-col font-sans transition-colors duration-300">
                {renderContent()}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070F1E] flex font-sans transition-colors duration-300">
            {/* Sidebar Left panel */}
            <Sidebar
                currentPage={currentPage}
                navigateTo={setCurrentPage}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                lang={lang}
                setLang={setLang}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            {/* Main Content Area Right panel */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
                <TopHeader 
                    navigateTo={setCurrentPage} 
                    lang={lang} 
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                    currentPage={currentPage}
                />
                
                <main className="flex-grow p-6">
                    {renderContent()}
                </main>

                <BusAnimation />
                <Footer lang={lang} />
            </div>
        </div>
    );
}

export default App;
