import { Calendar, Sprout, Droplet, Clock } from 'lucide-react';
import { cropCalendarData } from '../data/cropCalendarData';
import { getTranslation } from '../data/translations';

const CropCalendarPage = ({ currentLang }) => {
  const activeLang = currentLang === 'hi' ? 'hi' : 'en';
  const t = getTranslation(activeLang);
  const crops = cropCalendarData[activeLang] || cropCalendarData.en;

  return (
    <div className="py-12 bg-[#f6f8f5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {t.nav.calendar}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              {t.ui.cropCalendarTitle}
            </h1>
            <p className="text-slate-600 text-sm">
              Sowing seasons, fertilizer schedules, irrigation timelines, and harvesting milestones for major crops.
            </p>
          </div>
        </div>

        {/* Crop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {crops.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-5 hover:shadow-md transition-shadow">
              
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{item.crop}</h3>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Seasonal Guide
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                
                {/* Sowing Season */}
                <div className="flex items-start gap-3 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
                  <Calendar className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs uppercase">{t.ui.sowingSeason}</span>
                    <p className="text-slate-700 mt-0.5">{item.sowingSeason}</p>
                  </div>
                </div>

                {/* Fertilizer Schedule */}
                <div className="flex items-start gap-3 bg-amber-50/50 p-3 rounded-2xl border border-amber-100">
                  <Sprout className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs uppercase">{t.ui.fertilizerSchedule}</span>
                    <p className="text-slate-700 mt-0.5">{item.fertilizerSchedule}</p>
                  </div>
                </div>

                {/* Irrigation Schedule */}
                <div className="flex items-start gap-3 bg-blue-50/50 p-3 rounded-2xl border border-blue-100">
                  <Droplet className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs uppercase">{t.ui.irrigationSchedule}</span>
                    <p className="text-slate-700 mt-0.5">{item.irrigationSchedule}</p>
                  </div>
                </div>

                {/* Harvest Time */}
                <div className="flex items-start gap-3 bg-purple-50/50 p-3 rounded-2xl border border-purple-100">
                  <Clock className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 block text-xs uppercase">{t.ui.harvestTime}</span>
                    <p className="text-slate-700 mt-0.5">{item.harvestTime}</p>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CropCalendarPage;
