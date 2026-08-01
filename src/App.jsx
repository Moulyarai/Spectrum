import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

// Standalone Page Views
import DetectDiseasePage from './pages/DetectDiseasePage';
import DashboardPage from './pages/DashboardPage';
import WeatherPage from './pages/WeatherPage';
import CropCalendarPage from './pages/CropCalendarPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentLang, setCurrentLang] = useState('en');

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f6f8f5] text-slate-800">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
      />

      {/* Main View Area */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <>
            <Hero onNavigate={handleNavigate} />
            <Features onNavigate={handleNavigate} />
            <HowItWorks onNavigate={handleNavigate} />
            <AboutSection onNavigate={handleNavigate} />
            <ContactSection />
          </>
        )}

        {activeTab === 'detect' && (
          <DetectDiseasePage
            currentLang={currentLang}
            setCurrentLang={setCurrentLang}
          />
        )}
        {activeTab === 'dashboard' && <DashboardPage onNavigate={handleNavigate} currentLang={currentLang} />}
        {activeTab === 'weather' && <WeatherPage currentLang={currentLang} />}
        {activeTab === 'calendar' && <CropCalendarPage currentLang={currentLang} />}
        {activeTab === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {activeTab === 'contact' && <ContactPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;