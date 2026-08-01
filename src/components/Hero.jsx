import React from 'react';
import { Upload, ArrowRight, ShieldCheck, Volume2, WifiOff, Sparkles, CheckCircle2, Leaf, Cpu } from 'lucide-react';

const Hero = ({ onNavigate }) => {
  return (
    <section className="relative overflow-hidden agri-hero-bg pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-emerald-100">
      
      {/* Decorative background elements */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-emerald-200/20 via-green-300/10 to-teal-200/20 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Action Buttons */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-emerald-200/80 shadow-xs text-xs sm:text-sm font-semibold text-emerald-900 animate-pulse-subtle">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <WifiOff className="w-4 h-4 text-emerald-600" />
              <span>Zero Internet Required • Works Anywhere in the Field</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Protect Your Crops With <br className="hidden sm:inline" />
                <span className="agri-gradient-text">Offline AI Diagnosis</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Empower your farm with instant crop disease detection. Simply upload a leaf image to receive instant treatment recommendations and spoken voice guidance—even without cellular coverage.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
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
            <div className="pt-6 border-t border-emerald-200/60 grid grid-cols-3 gap-4 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-900">98%</p>
                <p className="text-xs text-slate-500 font-medium">Diagnostic Accuracy</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-900">&lt; 1s</p>
                <p className="text-xs text-slate-500 font-medium">Offline Scan Speed</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-900">100%</p>
                <p className="text-xs text-slate-500 font-medium">Privacy & Local Storage</p>
              </div>
            </div>

          </div>

          {/* Right Column: Agriculture Visual & Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Decorative Card Wrapper */}
              <div className="relative rounded-3xl p-4 sm:p-6 bg-gradient-to-b from-white/90 to-emerald-50/90 backdrop-blur-xl border border-emerald-200/80 shadow-2xl shadow-emerald-900/10">
                
                {/* Image Header Showcase */}
                <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=800&q=80"
                    alt="Farmer inspecting corn leaf health"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/20 to-transparent" />
                  
                  {/* Floating AI Scanning Overlay */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-emerald-900/80 backdrop-blur-md text-emerald-200 text-xs font-semibold flex items-center gap-1.5 border border-emerald-700/50">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    <span>AI Scanner Active</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 text-xs font-medium text-emerald-300 mb-1">
                      <Leaf className="w-3.5 h-3.5" />
                      <span>Sample Scan Preview</span>
                    </div>
                    <p className="font-bold text-lg leading-tight text-white">Early Blight (Alternaria solani)</p>
                  </div>
                </div>

                {/* Instant Diagnostic Card Details */}
                <div className="mt-4 p-4 rounded-xl bg-white border border-emerald-100 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2.5 py-1 rounded-md">
                      Confidence: 96.4%
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Moderate Severity
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-slate-700">Recommended Treatment:</p>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200/60 leading-relaxed">
                      Apply copper-based fungicide every 7-10 days. Ensure crop rotation and prune infected lower leaves.
                    </p>
                  </div>

                  {/* Audio Voice Guidance Bar */}
                  <div className="flex items-center gap-3 p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200/70">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-emerald-950">Voice Guidance Ready</p>
                      <p className="text-[11px] text-emerald-700 truncate">Spoken instructions in regional languages</p>
                    </div>
                    <button 
                      onClick={() => onNavigate('detect')}
                      className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-300 transition-colors"
                    >
                      Listen
                    </button>
                  </div>
                </div>

              </div>

              {/* Decorative Leaf Badge */}
              <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 p-4 rounded-2xl bg-white shadow-xl border border-emerald-100 max-w-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Zero Cloud Dependency</p>
                  <p className="text-[11px] text-slate-500">Models run natively inside your browser</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
