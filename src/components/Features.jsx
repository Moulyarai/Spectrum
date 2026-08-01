import { Sparkles, Volume2, Scan, Stethoscope, ArrowUpRight } from 'lucide-react';

const Features = ({ onNavigate }) => {
  const featuresList = [
    {
      id: 'ai-detection',
      icon: Sparkles,
      badge: 'Deep Vision AI',
      title: 'Advanced AI Diagnostics',
      description: 'Leverages neural vision models to analyze plant leaf health, identifying crop diseases with precision and speed.',
      color: 'emerald',
      actionText: 'Explore AI Engine'
    },
    {
      id: 'voice-guidance',
      icon: Volume2,
      badge: 'Accessibility First',
      title: 'Voice Guidance & Audio Advisory',
      description: 'Reads diagnosis reports out loud in regional spoken languages so farmers can hear clear step-by-step instructions directly.',
      color: 'green',
      actionText: 'Listen Demo'
    },
    {
      id: 'disease-detection',
      icon: Scan,
      badge: 'High Accuracy',
      title: 'Instant Disease Detection',
      description: 'Identifies blight, rust, mildew, leaf spot, and pest infestations across 30+ crop varieties in under one second.',
      color: 'teal',
      actionText: 'Try Disease Scanner'
    },
    {
      id: 'treatment-recommendations',
      icon: Stethoscope,
      badge: 'Actionable Insights',
      title: 'Treatment Recommendations',
      description: 'Provides organic remedies, bio-pesticide choices, chemical dosages, and preventive cultural farming practices.',
      color: 'amber',
      actionText: 'View Sample Remedies'
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-emerald-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Key Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed Specifically For <span className="text-emerald-700">Farmers in the Field</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            AgriVision combines cutting-edge computer vision with accessibility features to protect crop yields everywhere.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresList.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="agri-card agri-card-hover rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Subtle top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600 opacity-80 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-4">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                {/* Bottom CTA link */}
                <div className="pt-6 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate('detect')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors group-hover:translate-x-0.5"
                  >
                    <span>{feat.actionText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Features;
