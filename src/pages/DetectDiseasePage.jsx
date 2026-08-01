import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Camera, Volume2, ShieldAlert, CheckCircle2, RefreshCw, 
  FileText, Play, Square, AlertCircle, Leaf, Sparkles, X, Droplets, 
  Sprout, HelpCircle, Activity, Info
} from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';
import { getTranslation } from '../data/translations';
import { speakOfflineText, stopOfflineSpeech } from '../utils/speechUtils';
import { saveScanRecord } from '../utils/scanStorage';
import enDiseaseData from '../data/diseases/en.json';
import hiDiseaseData from '../data/diseases/hi.json';

const DetectDiseasePage = ({ currentLang, setCurrentLang }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeDiseaseKey, setActiveDiseaseKey] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(97.4);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [fallbackWarning, setFallbackWarning] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [lowConfidenceWarning, setLowConfidenceWarning] = useState(false);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const activeLang = currentLang === 'hi' ? 'hi' : 'en';
  const t = getTranslation(activeLang);

  // Disease database based on language
  const diseaseDb = activeLang === 'hi' ? hiDiseaseData : enDiseaseData;

  const samplePresets = [
    {
      id: 'tomato-blight',
      diseaseKey: 'tomato_early_blight',
      name: activeLang === 'hi' ? 'टमाटर (Early Blight)' : 'Tomato Leaf (Early Blight)',
      img: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=600&q=80',
      confidence: 97.4
    },
    {
      id: 'corn-rust',
      diseaseKey: 'corn_common_rust',
      name: activeLang === 'hi' ? 'मक्का (Common Rust)' : 'Corn Leaf (Common Rust)',
      img: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
      confidence: 94.8
    },
    {
      id: 'potato-blight',
      diseaseKey: 'potato_late_blight',
      name: activeLang === 'hi' ? 'आलू (Late Blight)' : 'Potato Leaf (Late Blight)',
      img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
      confidence: 96.1
    },
    {
      id: 'healthy-leaf',
      diseaseKey: 'healthy_crop',
      name: activeLang === 'hi' ? 'स्वस्थ पत्ती (Healthy Leaf)' : 'Healthy Leaf',
      img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
      confidence: 99.2
    },
    {
      id: 'low-conf-sample',
      diseaseKey: 'tomato_early_blight',
      name: activeLang === 'hi' ? 'धुंधली फोटो (कम कॉन्फिडेंस 52%)' : 'Blurry Image (Low 52%)',
      img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
      confidence: 52.0
    }
  ];

  useEffect(() => {
    stopOfflineSpeech();
    setIsPlayingAudio(false);
    setFallbackWarning(null);
  }, [activeLang]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      alert("Unable to access camera: " + err.message);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      stopCamera();
      runMockAnalysis(dataUrl, 'tomato_early_blight', 96.5);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      runMockAnalysis(imageURL, 'tomato_early_blight', 95.8);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const imageURL = URL.createObjectURL(file);
      runMockAnalysis(imageURL, 'tomato_early_blight', 95.8);
    }
  };

  const handleSelectSample = (sample) => {
    runMockAnalysis(sample.img, sample.diseaseKey, sample.confidence);
  };

  const runMockAnalysis = (image, diseaseKey, confidence) => {
    stopOfflineSpeech();
    setIsPlayingAudio(false);
    setFallbackWarning(null);
    setSelectedImage(image);
    setIsAnalyzing(true);
    setProgress(15);
    setLowConfidenceWarning(false);

    // Progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsAnalyzing(false);
      setActiveDiseaseKey(diseaseKey);
      setConfidenceScore(confidence);

      if (confidence < 60) {
        setLowConfidenceWarning(true);
      } else {
        // Record scan into localStorage history
        const info = diseaseDb[diseaseKey] || diseaseDb['healthy_crop'];
        saveScanRecord({
          id: 'scan-' + Date.now(),
          date: new Date().toLocaleString(activeLang === 'hi' ? 'hi-IN' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }),
          timestamp: Date.now(),
          crop: info.crop,
          diseaseName: info.name,
          diseaseKey: diseaseKey,
          confidence: confidence,
          status: info.status,
          img: image
        });
      }
    }, 900);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setActiveDiseaseKey(null);
    setIsAnalyzing(false);
    setLowConfidenceWarning(false);
    stopOfflineSpeech();
    setIsPlayingAudio(false);
  };

  const handleSpeakResult = async () => {
    if (!activeDiseaseKey) return;

    if (isPlayingAudio) {
      stopOfflineSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const diseaseData = diseaseDb[activeDiseaseKey];
    if (!diseaseData) return;

    const speechString = diseaseData.speechText;

    setIsPlayingAudio(true);
    setFallbackWarning(null);

    const result = await speakOfflineText({
      text: speechString,
      langCode: activeLang,
      onStart: () => setIsPlayingAudio(true),
      onEnd: () => setIsPlayingAudio(false),
      onError: (err, fallbackUsed) => {
        setIsPlayingAudio(false);
        if (fallbackUsed) {
          setFallbackWarning(t.ui.fallbackNotice);
        }
      }
    });

    if (result && result.fallbackUsed) {
      setFallbackWarning(t.ui.fallbackNotice);
    }
  };

  const diseaseData = activeDiseaseKey ? diseaseDb[activeDiseaseKey] : null;

  return (
    <div className="py-12 bg-[#f6f8f5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-emerald-100">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> AI Crop Vision & Voice Advisory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {activeLang === 'hi' ? 'फसल बीमारी पहचान' : 'Crop Disease Diagnostics'}
            </h1>
            <p className="text-slate-600 text-sm">
              Upload or capture a crop leaf image for immediate AI diagnosis, detailed recommendations, and voice guidance.
            </p>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-xs flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">{t.ui.selectLanguage}:</span>
            <LanguageSelector selectedLang={activeLang} onChangeLang={setCurrentLang} />
          </div>
        </div>

        {/* Fallback Notice */}
        {fallbackWarning && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 shadow-xs animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-medium">
              <p className="font-bold">Voice Synthesis Notice:</p>
              <p>{fallbackWarning}</p>
            </div>
          </div>
        )}

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Upload, Camera, Preview, Presets */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Camera View Modal / Container */}
            {isCameraActive ? (
              <div className="bg-slate-900 p-4 rounded-3xl text-white shadow-lg space-y-4 relative">
                <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover rounded-2xl bg-black" />
                <div className="flex items-center justify-between">
                  <button
                    onClick={capturePhoto}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 text-emerald-950 font-bold text-xs flex items-center gap-2 hover:bg-emerald-400"
                  >
                    <Camera className="w-4 h-4" /> Capture Photo
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-4 py-2.5 rounded-xl bg-slate-700 text-white font-bold text-xs hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : selectedImage ? (
              /* Image Preview Box with Remove Button */
              <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm relative text-center space-y-4">
                <div className="relative inline-block w-full">
                  <img
                    src={selectedImage}
                    alt="Selected Leaf Preview"
                    className="w-full h-64 object-cover rounded-2xl border border-emerald-100"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-white hover:bg-red-600 transition-colors shadow-md"
                    title={t.ui.removeImage}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleRemoveImage}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-colors"
                  >
                    {t.ui.removeImage}
                  </button>
                </div>
              </div>
            ) : (
              /* Drag & Drop Upload Zone */
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`bg-white p-6 rounded-3xl border-2 border-dashed transition-all shadow-xs text-center relative group ${
                  dragOver ? 'border-emerald-600 bg-emerald-50/50' : 'border-emerald-300 hover:border-emerald-500'
                }`}
              >
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
                      {t.ui.dragDropText}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports PNG, JPG, JPEG up to 10MB
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-center gap-3 relative z-20">
                    <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow-md">
                      <Upload className="w-4 h-4" /> {t.ui.scanLeaf}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); startCamera(); }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs shadow-md hover:bg-slate-700 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" /> {t.ui.cameraCapture}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Test Sample Presets */}
            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" /> {t.ui.samplePreset}:
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {samplePresets.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`p-2 rounded-xl border transition-all text-left group flex flex-col items-center text-center ${
                      activeDiseaseKey === sample.diseaseKey && confidenceScore === sample.confidence
                        ? 'border-emerald-600 bg-emerald-50 shadow-sm'
                        : 'border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40'
                    }`}
                  >
                    <img
                      src={sample.img}
                      alt={sample.name}
                      className="w-full h-16 object-cover rounded-lg mb-1.5 group-hover:scale-105 transition-transform"
                    />
                    <p className="text-[11px] font-bold text-slate-800 line-clamp-1">{sample.name}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Prediction UI & Detailed Report */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-lg min-h-[520px] flex flex-col justify-between">
              
              {/* Empty State */}
              {!selectedImage && !isAnalyzing && (
                <div className="my-auto text-center py-16 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <Leaf className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No Leaf Scanned Yet</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">
                    Upload a leaf photograph or select a sample preset on the left to view full diagnostics and recommendations.
                  </p>
                </div>
              )}

              {/* Loading & Progress Animation */}
              {isAnalyzing && (
                <div className="my-auto text-center py-16 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-spin">
                    <RefreshCw className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-xl font-bold text-slate-900">{t.ui.analyzing}</h3>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                      <div 
                        className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-emerald-800 font-bold">{progress}% Completed</span>
                  </div>
                </div>
              )}

              {/* Low Confidence Warning (<60%) */}
              {lowConfidenceWarning && !isAnalyzing && (
                <div className="my-auto p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-900 space-y-4 text-center">
                  <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
                  <div>
                    <h4 className="text-lg font-bold text-amber-950">Low Confidence Warning ({confidenceScore}%)</h4>
                    <p className="text-sm font-medium text-amber-800 mt-1 max-w-md mx-auto">
                      "{t.ui.lowConfidenceWarning}"
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveImage}
                    className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-md"
                  >
                    Try Another Photo
                  </button>
                </div>
              )}

              {/* Full Detailed Report & Recommendations */}
              {diseaseData && !isAnalyzing && !lowConfidenceWarning && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  
                  {/* Top Result Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedImage}
                        alt="Scanned Leaf"
                        className="w-16 h-16 object-cover rounded-2xl border border-emerald-200 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            {diseaseData.crop}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            diseaseData.status === 'Healthy' || diseaseData.diseaseKey === 'healthy_crop' 
                              ? 'bg-emerald-100 text-emerald-900' 
                              : 'bg-red-100 text-red-900'
                          }`}>
                            {diseaseData.status === 'Healthy' ? t.ui.healthy : t.ui.diseased}
                          </span>
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                          {diseaseData.name}
                        </h3>
                        <p className="text-xs text-slate-500 italic">{diseaseData.scientificName}</p>
                      </div>
                    </div>

                    {/* Confidence Meter Circular / Animated Progress */}
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center gap-3 shrink-0">
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-14 h-14 transform -rotate-90">
                          <circle cx="28" cy="28" r="22" stroke="#d1fae5" strokeWidth="5" fill="transparent" />
                          <circle 
                            cx="28" cy="28" r="22" 
                            stroke="#047857" 
                            strokeWidth="5" 
                            fill="transparent"
                            strokeDasharray={138}
                            strokeDashoffset={138 - (138 * confidenceScore) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-xs font-black text-emerald-950">{confidenceScore}%</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">{t.ui.confidence}</span>
                        <span className="text-[11px] text-emerald-700 font-semibold">High Accuracy</span>
                      </div>
                    </div>
                  </div>

                  {/* Voice Advisory Listen Button */}
                  <div className="p-4 rounded-2xl bg-emerald-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-6 h-6 text-emerald-400" />
                      <div>
                        <span className="text-xs font-bold text-emerald-300 block uppercase">Voice Guidance (Piper TTS)</span>
                        <p className="text-xs text-emerald-100">Click listen to read diagnosis, symptoms & treatments aloud.</p>
                      </div>
                    </div>

                    <button
                      onClick={handleSpeakResult}
                      className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                        isPlayingAudio
                          ? 'bg-amber-400 text-amber-950 hover:bg-amber-300'
                          : 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950'
                      }`}
                    >
                      {isPlayingAudio ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                      <span>{isPlayingAudio ? t.ui.stopSpeaking : t.ui.speakResult}</span>
                    </button>
                  </div>

                  {/* Disease Description */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {diseaseData.description}
                    </p>
                  </div>

                  {/* Detailed Disease Report Tabs / Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Symptoms */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-amber-600" /> {t.ui.symptoms}:
                      </h4>
                      <ul className="space-y-1.5">
                        {diseaseData.symptoms.map((item, idx) => (
                          <li key={idx} className="text-xs text-slate-700 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Causes */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-purple-600" /> {t.ui.causes}:
                      </h4>
                      <ul className="space-y-1.5">
                        {diseaseData.causes.map((item, idx) => (
                          <li key={idx} className="text-xs text-slate-700 bg-purple-50/70 p-2.5 rounded-xl border border-purple-200/70 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Farmer Recommendations Section */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <Sprout className="w-5 h-5 text-emerald-700" /> {t.ui.farmerRecommendations}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Immediate Action */}
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                        <span className="text-xs font-bold text-amber-900 uppercase block">{t.ui.immediateAction}</span>
                        <p className="text-xs text-amber-800">{diseaseData.immediateAction}</p>
                      </div>

                      {/* Organic Treatment */}
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                        <span className="text-xs font-bold text-emerald-900 uppercase block">{t.ui.organicTreatment}</span>
                        <ul className="list-disc list-inside text-xs text-emerald-800 space-y-1">
                          {diseaseData.organicTreatment.map((opt, i) => <li key={i}>{opt}</li>)}
                        </ul>
                      </div>

                      {/* Chemical Treatment */}
                      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                        <span className="text-xs font-bold text-blue-900 uppercase block">{t.ui.chemicalTreatment}</span>
                        <ul className="list-disc list-inside text-xs text-blue-800 space-y-1">
                          {diseaseData.chemicalTreatment.map((opt, i) => <li key={i}>{opt}</li>)}
                        </ul>
                      </div>

                      {/* Recommended Fertilizer */}
                      <div className="p-4 rounded-2xl bg-lime-50 border border-lime-200 space-y-1">
                        <span className="text-xs font-bold text-lime-900 uppercase block">{t.ui.recommendedFertilizer}</span>
                        <p className="text-xs text-lime-800">{diseaseData.recommendedFertilizer}</p>
                      </div>

                      {/* Water Requirement */}
                      <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 space-y-1">
                        <span className="text-xs font-bold text-cyan-900 uppercase block">{t.ui.waterRequirement}</span>
                        <p className="text-xs text-cyan-800">{diseaseData.waterRequirement}</p>
                      </div>

                      {/* Prevention Tips */}
                      <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
                        <span className="text-xs font-bold text-purple-900 uppercase block">{t.ui.prevention}</span>
                        <ul className="list-disc list-inside text-xs text-purple-800 space-y-1">
                          {diseaseData.preventionTips.map((opt, i) => <li key={i}>{opt}</li>)}
                        </ul>
                      </div>

                    </div>
                  </div>

                  {/* Footer buttons */}
                  <div className="pt-4 flex justify-between items-center border-t border-slate-100">
                    <span className="text-xs text-slate-400">Scan automatically saved to local history.</span>
                    <button
                      onClick={handleRemoveImage}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-emerald-800"
                    >
                      {t.ui.scanAnother}
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
