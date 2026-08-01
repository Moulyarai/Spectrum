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
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const handleNavigate = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f6f8f5] text-slate-800">
      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

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

        {activeTab === 'detect' && <DetectDiseasePage />}
        {activeTab === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
        {activeTab === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {activeTab === 'contact' && <ContactPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;