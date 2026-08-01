import React from 'react';
import { Globe, Check } from 'lucide-react';
import { availableLanguages } from '../data/translations';

const LanguageSelector = ({ selectedLang, onChangeLang, compact = false }) => {
  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-emerald-700" />
        <select
          value={selectedLang}
          onChange={(e) => onChangeLang(e.target.value)}
          aria-label="Select Language"
          className="bg-emerald-50/90 hover:bg-emerald-100/80 text-emerald-950 font-bold text-xs sm:text-sm py-2 px-3 pr-8 rounded-xl border border-emerald-200/80 outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer appearance-none shadow-xs"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%230F2E1C%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.7rem top 50%',
            backgroundSize: '0.65rem auto'
          }}
        >
          {availableLanguages.map((lang) => (
            <option key={lang.code} value={lang.code} className="py-1 text-slate-900 font-medium">
              {lang.flag} {lang.nativeName} ({lang.name})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;
