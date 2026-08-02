import { Upload, ArrowRight, Sparkles } from 'lucide-react';

const Hero = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden agri-hero-bg pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-emerald-100">
      
      {/* Decorative background elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-emerald-200/20 via-green-300/10 to-teal-200/20 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-center">
          
          {/* Left Column: Headline & Action Buttons */}
          <div className="max-w-3xl space-y-8 text-center">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-emerald-200/80 shadow-xs text-xs sm:text-sm font-semibold text-emerald-900 animate-pulse-subtle">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Next-Gen AI Vision Engine • Instant Crop Health Diagnostics</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Protect Your Crops With <br className="hidden sm:inline" />
                <span className="agri-gradient-text">Smart AI Diagnosis</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
                Empower your farm with instant AI crop disease detection. Simply upload a leaf image to receive precise treatment recommendations and localized spoken voice guidance.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('detect')}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-base shadow-xl shadow-emerald-700/25 hover:shadow-emerald-700/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
              >
                <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Upload Leaf Image</span>
              </button>

              <button
                onClick={() => onNavigate('about')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-emerald-50/80 text-emerald-900 border border-emerald-200 font-bold text-base shadow-sm hover:border-emerald-300 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-emerald-200/60 grid grid-cols-3 gap-4 text-center max-w-xl mx-auto">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-900">98%</p>
                <p className="text-xs text-slate-500 font-medium">Diagnostic Accuracy</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-900">&lt; 1s</p>
                <p className="text-xs text-slate-500 font-medium">Instant AI Analysis</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-900">100%</p>
                <p className="text-xs text-slate-500 font-medium">Secure & Confidential</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
