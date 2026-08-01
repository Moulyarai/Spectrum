import React, { useState } from 'react';
import ContactSection from '../components/ContactSection';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const ContactPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How does AgriVision AI disease detection work?',
      a: 'AgriVision uses advanced computer vision models to analyze uploaded leaf photographs, identifying crop diseases and offering detailed treatment guides and voice advisories.'
    },
    {
      q: 'How does the Voice Guidance feature work?',
      a: 'After an image is analyzed, you can tap the "Play Voice Advisory" button. AgriVision uses browser text-to-speech engine to read the diagnosis and recommended remedies out loud.'
    },
    {
      q: 'Which crop varieties are supported in this version?',
      a: 'This MVP version supports common crops including Tomato, Corn/Maize, Potato, Wheat, and Apple leaf diseases. Additional crop models will be packaged in future updates.'
    },
    {
      q: 'Are my uploaded leaf photos saved to external servers?',
      a: 'No. AgriVision prioritizes farmer privacy. All image analysis takes place directly on your device inside browser memory, ensuring your location and farm data remain private.'
    }
  ];

  return (
    <div className="bg-[#f6f8f5] min-h-screen">
      
      {/* Primary Contact Section */}
      <ContactSection />

      {/* FAQ Section */}
      <section className="pb-20 pt-8 bg-white border-t border-emerald-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Farmer Help & Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#f6f8f5] rounded-2xl border border-emerald-100 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:text-emerald-700"
                >
                  <span className="text-base">{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {openFaq === idx && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

export default ContactPage;
