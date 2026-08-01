import React from 'react';
import { ShieldCheck, Cpu, HeartHandshake, Award } from 'lucide-react';

const AboutSection = ({ onNavigate }) => {
  return (
    <section className="py-20 bg-white border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Image Showcase Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-emerald-100">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
                alt="Green agricultural field"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Our Core Mission</span>
                <p className="text-xl font-bold">Empowering Smallholder Farmers Everywhere</p>
              </div>
            </div>
          </div>

          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              About AgriVision
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Bridging AI Innovation & <span className="text-emerald-700">Rural Farming Realities</span>
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              AgriVision was founded with a singular purpose: making advanced crop health diagnostics accessible to every farmer, regardless of internet connectivity or literacy barriers. Millions of smallholder farmers suffer yield losses due to delayed disease identification.
            </p>

            <p className="text-base text-slate-600 leading-relaxed">
              By running optimized neural networks directly inside the web browser on affordable mobile devices, AgriVision provides zero-latency crop diagnosis without sending sensitive field data to external servers.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Privacy First</h4>
                  <p className="text-xs text-slate-600">All image processing stays on your device.</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
                <Cpu className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Edge AI Engine</h4>
                  <p className="text-xs text-slate-600">Optimized for low-bandwidth mobile phones.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                Read Full Story
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
