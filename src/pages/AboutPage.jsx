import { Sparkles, Volume2, Target } from 'lucide-react';

const AboutPage = ({ onNavigate }) => {
  return (
    <div className="py-12 bg-[#f6f8f5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            About AgriVision
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Democratizing <span className="text-emerald-700">Smart AI Tech</span> For Farmers
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Empowering smallholder farmers to diagnose crop leaf diseases easily—no expensive hardware, no language barriers.
          </p>
        </div>

        {/* Vision & Mission Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Eliminate crop yield loss caused by late disease detection by delivering high-speed AI diagnostic software straight to farmers' mobile browsers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Deep Neural AI</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Designed explicitly for agricultural precision. AgriVision uses computer vision neural networks to detect leaf pathologies instantly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Voice Inclusion</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Text instructions can be difficult to read in the field. Our voice guidance system reads treatment plans out loud in regional dialects.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-emerald-100 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why We Built AgriVision
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Over 500 million smallholder farmers produce up to 80% of the food consumed in developing regions. Yet up to 40% of global crop yields are lost annually to plant pests and diseases.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Traditional diagnostic channels often take days to deliver results. AgriVision solves this bottleneck by bringing fast, intelligent AI diagnosis directly into the farmer's hands.
            </p>
            <div className="pt-4">
              <button
                onClick={() => onNavigate('detect')}
                className="px-6 py-3 rounded-xl bg-emerald-700 text-white font-bold text-sm shadow-md"
              >
                Try Disease Detection
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden shadow-md border border-emerald-200">
              <img
                src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80"
                alt="Farmer looking at crop"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
