import { useState } from 'react';
import { 
  Activity, CheckCircle2, AlertTriangle, Sparkles, Trash2, 
  Eye, Layers, Leaf
} from 'lucide-react';
import { deleteScanRecord, clearScanHistory, getDashboardStats } from '../utils/scanStorage';
import { getTranslation } from '../data/translations';

const DashboardPage = ({ onNavigate, currentLang }) => {
  const activeLang = currentLang === 'hi' ? 'hi' : 'en';
  const t = getTranslation(activeLang);

  const [stats, setStats] = useState(getDashboardStats());
  const [selectedModalScan, setSelectedModalScan] = useState(null);

  const refreshStats = () => {
    setStats(getDashboardStats());
  };

  const handleDeleteScan = (id) => {
    deleteScanRecord(id);
    refreshStats();
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all local scan history?")) {
      clearScanHistory();
      refreshStats();
    }
  };

  return (
    <div className="py-12 bg-[#f6f8f5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Farmer Analytics & History
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Farm Health Dashboard
            </h1>
            <p className="text-slate-600 text-sm">
              Overview of crop scan logs, disease diagnostic history, and field analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {stats.recentHistory.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2.5 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-700 font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t.ui.clearHistory}</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('detect')}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              + New Crop Scan
            </button>
          </div>
        </div>

        {/* Requirements #3: 4 Dashboard Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Card 1: Total Scans */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">{t.ui.totalScans}</span>
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{stats.totalScans}</p>
            <p className="text-xs text-emerald-700 font-medium mt-1">Stored in farm record</p>
          </div>

          {/* Card 2: Healthy Plants */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">{t.ui.healthyPlants}</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{stats.healthyCount}</p>
            <p className="text-xs text-emerald-700 font-medium mt-1">Healthy crop logs</p>
          </div>

          {/* Card 3: Diseased Plants */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">{t.ui.diseasedPlants}</span>
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{stats.diseasedCount}</p>
            <p className="text-xs text-amber-700 font-medium mt-1">Infected crop logs</p>
          </div>

          {/* Card 4: Most Common Disease */}
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">{t.ui.mostCommonDisease}</span>
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-lg font-extrabold text-slate-900 mt-2 line-clamp-1">{stats.mostCommonDisease}</p>
            <p className="text-xs text-emerald-700 font-medium mt-1">Frequent pattern</p>
          </div>

        </div>

        {/* Scan History Table & Advisory Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Table */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-700" />
                <span>{t.ui.scanHistory}</span>
              </h3>
              <span className="text-xs text-slate-400 font-normal">Local Storage Sync</span>
            </div>

            {stats.recentHistory.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Leaf className="w-10 h-10 text-emerald-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-500">{t.ui.noHistory}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                      <th className="py-3 px-2">Image</th>
                      <th className="py-3 px-2">Date & Time</th>
                      <th className="py-3 px-2">Crop</th>
                      <th className="py-3 px-2">Disease Name</th>
                      <th className="py-3 px-2">Confidence</th>
                      <th className="py-3 px-2 text-right">{t.ui.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stats.recentHistory.map((scan) => (
                      <tr key={scan.id} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="py-3 px-2">
                          <img src={scan.img} alt={scan.crop} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                        </td>
                        <td className="py-3 px-2 text-xs font-medium text-slate-500">{scan.date}</td>
                        <td className="py-3 px-2 font-bold text-slate-800">{scan.crop}</td>
                        <td className="py-3 px-2 text-xs text-slate-700 font-medium">{scan.diseaseName}</td>
                        <td className="py-3 px-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                            {scan.confidence}%
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right space-x-2">
                          <button
                            onClick={() => setSelectedModalScan(scan)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            title={t.ui.view}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteScan(scan.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                            title={t.ui.delete}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sync & Advisory Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-md space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Sparkles className="w-4 h-4" />
                <span>AI Analytics Platform</span>
              </div>
              <h4 className="text-lg font-bold">Crop Health Records</h4>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Your AI diagnostic scans and localized crop advisory logs are securely managed for instant retrieval and field monitoring.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('detect')}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 text-emerald-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                >
                  Open Disease Detection
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* View Modal */}
        {selectedModalScan && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl relative animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-bold text-slate-900">{selectedModalScan.diseaseName}</h3>
                <button
                  onClick={() => setSelectedModalScan(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-sm"
                >
                  ✕
                </button>
              </div>

              <img src={selectedModalScan.img} alt="Scan Detail" className="w-full h-56 object-cover rounded-2xl border" />

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-bold block">{t.ui.cropName}</span>
                  <span className="text-slate-900 font-extrabold">{selectedModalScan.crop}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-500 font-bold block">{t.ui.confidence}</span>
                  <span className="text-emerald-700 font-extrabold">{selectedModalScan.confidence}%</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl col-span-2">
                  <span className="text-slate-500 font-bold block">Date & Time Recorded</span>
                  <span className="text-slate-800 font-semibold">{selectedModalScan.date}</span>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedModalScan(null)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;
