import React, { useState } from 'react';
import { Upload, Camera, Volume2, ShieldAlert, CheckCircle2, RefreshCw, Sparkles, WifiOff, FileText, Play, Pause, Info, Leaf } from 'lucide-react';

const DetectDiseasePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Sample preset crop leaf images for quick testing
  const samplePresets = [
    {
      id: 'tomato-blight',
      name: 'Tomato Leaf (Early Blight)',
      crop: 'Tomato',
      img: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=600&q=80',
      disease: 'Tomato Early Blight (Alternaria solani)',
      confidence: 97.2,
      severity: 'Moderate',
      treatment: [
        'Prune lower infected foliage to prevent fungal spore splash.',
        'Apply copper-based fungicide or neem oil solution every 7-10 days.',
        'Ensure proper crop spacing for high airflow between plants.'
      ],
      voiceText: 'Diagnosis: Tomato Early Blight detected with 97 percent confidence. Recommendation: Prune infected lower leaves and apply copper fungicide.'
    },
    {
      id: 'corn-rust',
      name: 'Corn Leaf (Common Rust)',
      crop: 'Corn / Maize',
      img: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
      disease: 'Common Corn Rust (Puccinia sorghi)',
      confidence: 94.8,
      severity: 'Low',
      treatment: [
        'Plant rust-resistant hybrid corn seeds in upcoming season.',
        'Apply foliar fungicide if rust covers more than 10% of upper canopy leaves.',
        'Maintain balanced nitrogen fertilization.'
      ],
      voiceText: 'Diagnosis: Common Corn Rust detected. Severity is low. Maintain balanced fertilization and monitor upper leaves.'
    },
    {
      id: 'healthy-leaf',
      name: 'Healthy Crop Leaf',
      crop: 'General Crop',
      img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
      disease: 'Healthy Crop (No Disease Detected)',
      confidence: 99.1,
      severity: 'None',
      treatment: [
        'Maintain regular watering schedules.',
        'Keep up routine crop monitoring and weeding.',
        'No chemical application required.'
      ],
      voiceText: 'Great news! The leaf is completely healthy with 99 percent confidence. No treatment necessary.'
    }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      runMockAnalysis(imageURL, 'Uploaded Leaf Photo', 'Custom Crop', 'Leaf Spot Infection', 95.4, 'Moderate', [
        'Isolate infected crop section immediately.',
        'Apply organic bio-fungicide spray in early morning hours.',
        'Avoid overhead sprinkler irrigation to reduce moisture on leaves.'
      ], 'Uploaded leaf analysis complete. Moderate leaf spot detected. Recommended organic spray.');
    }
  };

  const handleSelectSample = (sample) => {
    runMockAnalysis(
      sample.img,
      sample.name,
      sample.crop,
      sample.disease,
      sample.confidence,
      sample.severity,
      sample.treatment,
      sample.voiceText
    );
  };

  const runMockAnalysis = (image, title, crop, disease, confidence, severity, treatment, voiceText) => {
    setSelectedImage(image);
    setIsAnalyzing(true);
    setDiagnosisResult(null);

    // Simulate instant offline model inference (700ms)
    setTimeout(() => {
      setIsAnalyzing(false);
      setDiagnosisResult({
        title,
        crop,
        disease,
        confidence,
        severity,
        treatment,
        voiceText
      });
    }, 750);
  };

  const toggleVoicePlayback = () => {
    if (!diagnosisResult) return;
    
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(diagnosisResult.voiceText);
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        setIsPlayingAudio(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      setIsPlayingAudio(!isPlayingAudio);
    }
  };

  return (
    <div className="py-12 bg-[#f6f8f5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <WifiOff className="w-3.5 h-3.5" /> 100% Offline Leaf Scanner
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Crop Disease <span className="text-emerald-700">Diagnosis Studio</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Upload or capture a photo of a diseased leaf to receive immediate offline AI diagnostic results, treatment steps, and voice guidance.
          </p>
        </div>

        {/* Main 2-Column Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Upload Dropzone & Sample Selector */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Image Upload Box */}
            <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-emerald-300 hover:border-emerald-500 transition-colors shadow-xs text-center relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              <div className="py-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                
                <div>
                  <p className="text-base font-bold text-slate-900">
                    Click to Upload or Drag Leaf Photo Here
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports PNG, JPG, JPEG up to 10MB
                  </p>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow-md">
                    <Camera className="w-4 h-4" /> Select Leaf Image
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Test Sample Leaf Presets */}
            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> Or Select Sample Demo Leaf:
                </h3>
                <span className="text-xs text-slate-400">Click to run diagnosis</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {samplePresets.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left group flex flex-col items-center sm:items-start text-center sm:text-left"
                  >
                    <img
                      src={sample.img}
                      alt={sample.name}
                      className="w-full h-24 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform"
                    />
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{sample.crop}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{sample.name}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Diagnostic Analysis & Voice Guidance Results */}
          <div className="lg:col-span-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-lg min-h-[500px] flex flex-col justify-between">
              
              {/* Case 1: Initial Empty State */}
              {!selectedImage && !isAnalyzing && (
                <div className="my-auto text-center py-16 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <Leaf className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No Leaf Selected Yet</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">
                    Upload a leaf photograph from your device or choose one of the sample presets to preview instant offline diagnosis.
                  </p>
                </div>
              )}

              {/* Case 2: Analyzing State */}
              {isAnalyzing && (
                <div className="my-auto text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-spin">
                    <RefreshCw className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Analyzing Leaf Patterns...</h3>
                  <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full inline-block">
                    Running Edge Neural Network Model locally
                  </p>
                </div>
              )}

              {/* Case 3: Diagnosis Result View */}
              {diagnosisResult && !isAnalyzing && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  
                  {/* Top Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedImage}
                        alt="Scanned Leaf"
                        className="w-14 h-14 object-cover rounded-xl border border-emerald-200"
                      />
                      <div>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                          {diagnosisResult.crop}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-1">
                          {diagnosisResult.disease}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Confidence & Severity Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                      <p className="text-xs font-semibold text-emerald-800">AI Confidence Score</p>
                      <p className="text-2xl font-black text-emerald-950 mt-0.5">
                        {diagnosisResult.confidence}%
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="text-xs font-semibold text-amber-900">Severity Status</p>
                      <p className="text-2xl font-black text-amber-900 mt-0.5">
                        {diagnosisResult.severity}
                      </p>
                    </div>
                  </div>

                  {/* Voice Guidance Audio Player Box */}
                  <div className="p-4 rounded-2xl bg-emerald-900 text-white space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                        <Volume2 className="w-4 h-4" />
                        <span>Voice Guidance Player</span>
                      </div>
                      <span className="text-[10px] bg-emerald-800 px-2 py-0.5 rounded text-emerald-200">
                        Browser Speech Synthesis
                      </span>
                    </div>

                    <p className="text-xs text-emerald-100 bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-800 leading-relaxed italic">
                      "{diagnosisResult.voiceText}"
                    </p>

                    <button
                      onClick={toggleVoicePlayback}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isPlayingAudio ? 'Stop Audio Guidance' : 'Play Voice Advisory Out Loud'}</span>
                    </button>
                  </div>

                  {/* Treatment Plan Section */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-700" /> Actionable Treatment Plan:
                    </h4>
                    
                    <ul className="space-y-2">
                      {diagnosisResult.treatment.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => { setSelectedImage(null); setDiagnosisResult(null); }}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-emerald-800"
                    >
                      Scan Another Leaf
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DetectDiseasePage;
