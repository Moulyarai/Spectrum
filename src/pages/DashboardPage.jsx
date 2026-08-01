import React from 'react';
import { LayoutDashboard, Activity, HardDrive, WifiOff, FileText, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

const DashboardPage = ({ onNavigate }) => {
  const recentScans = [
    { id: 1, date: 'Today, 10:24 AM', crop: 'Tomato', disease: 'Early Blight', severity: 'Moderate', status: 'Treatment Applied' },
    { id: 2, date: 'Yesterday', crop: 'Corn', disease: 'Common Rust', severity: 'Low', status: 'Monitored' },
    { id: 3, date: 'Jul 29, 2026', crop: 'Wheat', disease: 'Powdery Mildew', severity: 'High', status: 'Fungicide Sprayed' },
    { id: 4, date: 'Jul 26, 2026', crop: 'Potato', disease: 'Healthy Leaf', severity: 'None', status: 'Healthy' }
  ];

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
              Overview of local scan logs, crop disease history, and offline storage state.
            </p>
          </div>

          <button
            onClick={() => onNavigate('detect')}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors cursor-pointer self-start sm:self-auto"
          >
            + New Crop Scan
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Scans Done</span>
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">24</p>
            <p className="text-xs text-emerald-700 font-medium mt-1">Saved locally on device</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Healthy Crop Ratio</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">78%</p>
            <p className="text-xs text-emerald-700 font-medium mt-1">18 healthy scans</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Active Diseases</span>
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">2</p>
            <p className="text-xs text-amber-700 font-medium mt-1">Early Blight, Corn Rust</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Offline Model Storage</span>
              <HardDrive className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">12.4 MB</p>
            <p className="text-xs text-emerald-700 font-medium mt-1">IndexedDB Sync Ready</p>
          </div>
        </div>

        {/* Scan History Table & Advisory Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Table */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span>Recent Crop Disease Scans</span>
              <span className="text-xs text-slate-400 font-normal">Last 30 Days</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Crop</th>
                    <th className="py-3 px-2">Diagnosed Disease</th>
                    <th className="py-3 px-2">Severity</th>
                    <th className="py-3 px-2">Action Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-emerald-50/40 transition-colors">
                      <td className="py-3.5 px-2 text-xs font-medium text-slate-500">{scan.date}</td>
                      <td className="py-3.5 px-2 font-bold text-slate-800">{scan.crop}</td>
                      <td className="py-3.5 px-2 text-xs text-slate-700">{scan.disease}</td>
                      <td className="py-3.5 px-2">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          scan.severity === 'High' ? 'bg-red-100 text-red-800' :
                          scan.severity === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                          scan.severity === 'Low' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {scan.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-xs text-emerald-800 font-medium">{scan.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sync & Advisory Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-md space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <WifiOff className="w-4 h-4" />
                <span>Offline Model Database</span>
              </div>
              <h4 className="text-lg font-bold">Local Storage Status</h4>
              <p className="text-xs text-emerald-200 leading-relaxed">
                Your AI diagnostic models and offline advisory guidelines are stored locally inside IndexedDB. No cellular connection required.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('detect')}
                  className="w-full py-2.5 rounded-xl bg-emerald-500 text-emerald-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                >
                  Test Offline Detection Engine
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
