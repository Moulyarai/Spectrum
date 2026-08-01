import { useState } from 'react';
import { CloudRain, Thermometer, Droplets, MapPin, Search, Sparkles, ShieldAlert } from 'lucide-react';
import { sampleCitiesWeather, getWeatherAdvisory } from '../data/weatherData';
import { getTranslation } from '../data/translations';

const WeatherPage = ({ currentLang }) => {
  const activeLang = currentLang === 'hi' ? 'hi' : 'en';
  const t = getTranslation(activeLang);

  const [locationInput, setLocationInput] = useState('New Delhi');
  const [activeWeather, setActiveWeather] = useState(sampleCitiesWeather['new delhi']);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = locationInput.trim().toLowerCase();
    const result = sampleCitiesWeather[query] || {
      temp: "29°C",
      humidity: "72%",
      rainfall: "14 mm",
      condition: "Partly Cloudy"
    };
    setActiveWeather(result);
  };

  const advisory = getWeatherAdvisory(activeWeather.humidity, activeWeather.rainfall, activeLang);

  return (
    <div className="py-12 bg-[#f6f8f5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {t.nav.weather}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              {t.ui.weatherPageTitle}
            </h1>
            <p className="text-slate-600 text-sm">
              Real-time weather insights, rain alerts, and tailored crop protection advice.
            </p>
          </div>

          {/* Location Input Form */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder={t.ui.enterLocation}
                className="pl-9 pr-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{t.ui.searchWeather}</span>
            </button>
          </form>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase">{t.ui.temperature}</span>
              <p className="text-3xl font-black text-slate-900 mt-1">{activeWeather.temp}</p>
              <span className="text-xs text-emerald-700 font-medium mt-1 inline-block">{activeWeather.condition}</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Thermometer className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase">{t.ui.humidity}</span>
              <p className="text-3xl font-black text-slate-900 mt-1">{activeWeather.humidity}</p>
              <span className="text-xs text-emerald-700 font-medium mt-1 inline-block">Moisture Index</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplets className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase">{t.ui.rainfall}</span>
              <p className="text-3xl font-black text-slate-900 mt-1">{activeWeather.rainfall}</p>
              <span className="text-xs text-emerald-700 font-medium mt-1 inline-block">Precipitation</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <CloudRain className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Farming Advice Box */}
        <div className="bg-gradient-to-br from-emerald-900 to-green-950 text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Farming Weather Advisory</span>
          </div>

          <div className="flex items-start gap-4">
            <ShieldAlert className="w-8 h-8 text-amber-400 shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white">{advisory.title}</h3>
              <p className="text-sm text-emerald-100 leading-relaxed max-w-3xl">
                {advisory.advice}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WeatherPage;
