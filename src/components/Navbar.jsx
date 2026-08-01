import React, { useState } from 'react';
import { Leaf, WifiOff, Menu, X, ShieldCheck, Cpu, LayoutDashboard, Info, PhoneCall, Scan } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home', icon: Leaf },
    { id: 'detect', label: 'Detect Disease', icon: Scan },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact', icon: PhoneCall },
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
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Cpu className="w-3 h-3" /> MVP v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                Offline AI Crop Health Assistance
              </p>
            </div>
          </div>

          {/* Offline Ready Badge (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <WifiOff className="w-3.5 h-3.5 text-emerald-700" />
            <span>100% Offline AI Ready</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
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

          {/* Action CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('detect')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-800/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Scan className="w-4 h-4" />
              <span>Scan Crop</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('detect')}
              className="p-2 rounded-lg bg-emerald-600 text-white"
              title="Scan Crop"
            >
              <Scan className="w-5 h-5" />
            </button>
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
        <div className="md:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="mb-3 px-3 py-2 rounded-lg bg-emerald-50 flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span className="flex items-center gap-1.5">
              <WifiOff className="w-4 h-4 text-emerald-600" />
              Offline Mode Enabled
            </span>
            <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded text-[10px]">Active</span>
          </div>

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
