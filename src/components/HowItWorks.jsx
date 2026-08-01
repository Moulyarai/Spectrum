import React from 'react';
import { Camera, Cpu, Volume2, CheckCircle2, ArrowRight } from 'lucide-react';

const HowItWorks = ({ onNavigate }) => {
  const steps = [
    {
      number: '01',
      title: 'Upload or Capture Leaf',
      description: 'Take a clear photograph of the affected crop leaf using your phone or choose an image file from storage.',
      icon: Camera,
    },
    {
      number: '02',
      title: 'Instant AI Neural Analysis',
      description: 'Our deep learning neural vision model analyzes leaf spots, coloration, and vein patterns with high precision.',
      icon: Cpu,
    },
    {
      number: '03',
      title: 'Voice & Visual Advisory',
      description: 'View the disease diagnosis with confidence level and tap to play spoken audio guidance in local language.',
      icon: Volume2,
    },
    {
      number: '04',
      title: 'Apply Recommended Treatment',
      description: 'Follow step-by-step organic or chemical treatment plans to cure the crop and prevent field contamination.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-20 bg-[#f6f8f5] border-b border-emerald-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Simple 4-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How <span className="text-emerald-700">AgriVision Works</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Fast, accurate, and user-friendly. Designed for quick, intuitive operation in farming conditions.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs hover:shadow-md transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-emerald-200">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-emerald-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-emerald-800 to-green-900 p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-bold">Ready to test your crop leaves now?</h3>
            <p className="text-emerald-200 text-sm max-w-xl">
              Upload any sample leaf image to test our smart AI diagnosis engine in action immediately.
            </p>
          </div>
          <button
            onClick={() => onNavigate('detect')}
            className="px-6 py-3.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 font-bold text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            Start Leaf Scanner Now
          </button>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
