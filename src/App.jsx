import React, { useState } from 'react';
import Hero from './components/Hero';
import TrackingDashboard from './components/TrackingDashboard';
import EmergencyDashboard from './components/EmergencyDashboard';
import FeedbackSection from './components/FeedbackSection';
import AboutAI from './components/AboutAI';
import Footer from './components/Footer';

function App() {
    const [activeTab, setActiveTab] = useState('track');
    const [lang, setLang] = useState('English');

    const renderContent = () => {
        switch (activeTab) {
            case 'track':
                return <TrackingDashboard />;
            case 'emergency':
                return <EmergencyDashboard />;
            case 'feedback':
                return <FeedbackSection />;
            case 'about':
                return <AboutAI />;
            default:
                return <TrackingDashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative">
            <Hero activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} setLang={setLang} />

            <main className="flex-grow w-full relative z-20 -mt-8 mb-16 px-4 md:px-8">
                {renderContent()}
            </main>

            <Footer />
        </div>
    );
}

export default App;
