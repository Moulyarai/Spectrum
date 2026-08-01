import React, { useState } from 'react';
import { 
  Leaf, Menu, X, LayoutDashboard, Info, PhoneCall, Scan, 
  CloudRain, Calendar 
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { getTranslation } from '../data/translations';

const Navbar = ({ activeTab, setActiveTab, currentLang, setCurrentLang }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeLang = currentLang === 'hi' ? 'hi' : 'en';
  const t = getTranslation(activeLang);

  const navLinks = [
    { id: 'home', label: t.nav.home || 'Home', icon: Leaf },
    { id: 'detect', label: t.nav.detect || 'Detect Disease', icon: Scan },
    { id: 'dashboard', label: t.nav.dashboard || 'Dashboard', icon: LayoutDashboard },
    { id: 'weather', label: t.nav.weather || 'Weather Advisory', icon: CloudRain },
    { id: 'calendar', label: t.nav.calendar || 'Crop Calendar', icon: Calendar },
    { id: 'about', label: t.nav.about || 'About', icon: Info },
    { id: 'contact', label: t.nav.contact || 'Contact', icon: PhoneCall },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-tight text-emerald-950 font-sans">
                  Agri<span className="text-emerald-600">Vision</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                AI Crop Diagnostics & Multilingual Voice Guidance
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action CTA & Multilingual Language Selector */}
          <div className="hidden xl:flex items-center gap-3">
            <LanguageSelector selectedLang={activeLang} onChangeLang={setCurrentLang} />

            <button
              onClick={() => handleNavClick('detect')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-800/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Scan className="w-4 h-4" />
              <span>Scan Crop</span>
            </button>
          </div>

          {/* Mobile / Tablet Toggle Button */}
          <div className="flex xl:hidden items-center gap-2">
            <LanguageSelector selectedLang={activeLang} onChangeLang={setCurrentLang} compact />
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

export default Navbar;
