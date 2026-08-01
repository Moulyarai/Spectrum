import { useState, useRef, useEffect } from 'react';
import { 
  Upload, Camera, Volume2, ShieldAlert, CheckCircle2, RefreshCw, 
  Play, Square, AlertCircle, Leaf, Sparkles, X, Droplets,
  Sprout, HelpCircle, Info
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
  const [unsupportedCropWarning, setUnsupportedCropWarning] = useState(false);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const activeLang = currentLang === 'hi' ? 'hi' : 'en';
  const t = getTranslation(activeLang);

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
      id: 'arecanut-spot',
      diseaseKey: 'arecanut_leaf_spot',
      name: activeLang === 'hi' ? 'सुपारी (Yellow Spot)' : 'Arecanut (Yellow Spot)',
      img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
      confidence: 93.5
    },
    {
      id: 'unsupported-sample',
      diseaseKey: 'unsupported_crop',
      name: activeLang === 'hi' ? 'असमर्थित फसल (Mango)' : 'Unsupported Crop (Mango)',
      img: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
      confidence: 40.0
    }
  ];

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    stopOfflineSpeech();
    setTimeout(() => {
      setIsPlayingAudio(false);
      setFallbackWarning(null);
    }, 0);
  }, [activeLang]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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

      canvas.toBlob((blob) => {
        if (blob) {
          analyzeUploadedImage(blob, dataUrl);
        }
      }, 'image/jpeg');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      analyzeUploadedImage(file, imageURL);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const imageURL = URL.createObjectURL(file);
      analyzeUploadedImage(file, imageURL);
    }
  };

  const handleSelectSample = async (sample) => {
    try {
      const res = await fetch(sample.img);
      const blob = await res.blob();
      analyzeUploadedImage(blob, sample.img);
    } catch {
      analyzeUploadedImage(null, sample.img);
    }
  };

  const analyzeUploadedImage = async (fileOrBlob, previewUrl) => {
    stopOfflineSpeech();
    setIsPlayingAudio(false);
    setFallbackWarning(null);
    setSelectedImage(previewUrl);
    setIsAnalyzing(true);
    setProgress(20);
    setLowConfidenceWarning(false);
    setUnsupportedCropWarning(false);

    const interval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? 90 : prev + 20));
    }, 150);

    try {
      const formData = new FormData();
      if (fileOrBlob) {
        formData.append('file', fileOrBlob, 'leaf_upload.jpg');
      }

      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        body: formData
      });

      clearInterval(interval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error ${response.status}`);
      }

      const result = await response.json();
      setIsAnalyzing(false);

      if (result.is_supported === false || result.crop === 'Unknown') {
        setUnsupportedCropWarning(true);
        return;
      }

      // The backend owns the configurable threshold. Do not apply a second,
      // hard-coded 60% check that can turn a valid prediction into a warning.
      if (result.low_confidence) {
        setLowConfidenceWarning(true);
        setConfidenceScore(result.confidence);
        return;
      }

      const dKey = result.disease_key || 'healthy_crop';
      setActiveDiseaseKey(dKey);
      setConfidenceScore(result.confidence);

      const info = diseaseDb[dKey] || {
        crop: result.crop,
        name: result.disease,
        status: 'Diseased'
      };

      saveScanRecord({
        id: 'scan-' + Date.now(),
        date: new Date().toLocaleString(activeLang === 'hi' ? 'hi-IN' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        timestamp: Date.now(),
        crop: result.crop || info.crop,
        diseaseName: result.disease || info.name,
        diseaseKey: dKey,
        confidence: result.confidence,
        status: info.status || 'Diseased',
        img: previewUrl
      });

    } catch (err) {
      clearInterval(interval);
      setIsAnalyzing(false);
      console.error('Prediction error:', err);
      alert(`AI Prediction Error: ${err.message}\nMake sure backend Python server is running on http://localhost:5000`);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setActiveDiseaseKey(null);
    setIsAnalyzing(false);
    setLowConfidenceWarning(false);
    setUnsupportedCropWarning(false);
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
              <Sparkles className="w-3.5 h-3.5" /> Multi-Crop Vision & Voice Advisory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {activeLang === 'hi' ? 'बहु-फसल बीमारी निदान' : 'Multi-Crop Disease Diagnostics'}
            </h1>
            <p className="text-slate-600 text-sm">
              Upload crop foliage for automatic crop species recognition and disease classification.
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
              <p className="font-bold">Voice Notice:</p>
              <p>{fallbackWarning}</p>
            </div>
          </div>
        )}

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Upload, Camera, Preview, Presets */}
          <div className="lg:col-span-5 space-y-6">
            
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
                      Supports Tomato, Potato, Corn, Pepper, Arecanut, Grape, Apple, etc.
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

            {/* Presets */}
            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Multi-Crop Sample Presets:
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {samplePresets.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`p-2 rounded-xl border transition-all text-left group flex flex-col items-center text-center ${
                      activeDiseaseKey === sample.diseaseKey
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

          {/* Right Column: Results without Scientific Name */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-lg min-h-[520px] flex flex-col justify-between">
              
              {!selectedImage && !isAnalyzing && (
                <div className="my-auto text-center py-16 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <Leaf className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">No Leaf Scanned Yet</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">
                    Upload a leaf photograph to analyze crop species and diagnose disease.
                  </p>
                </div>
              )}

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

              {/* Unsupported Crop Message (Requirement #7) */}
              {unsupportedCropWarning && !isAnalyzing && (
                <div className="my-auto p-8 rounded-3xl bg-red-50 border-2 border-red-200 text-red-900 space-y-4 text-center">
                  <AlertCircle className="w-14 h-14 text-red-600 mx-auto" />
                  <div>
                    <h4 className="text-xl font-extrabold text-red-950">Crop Recognition Notice</h4>
                    <p className="text-base font-bold text-red-800 mt-2">
                      This crop is currently not supported by the trained model.
                    </p>
                    <p className="text-xs text-red-600 mt-2">
                      This trained model currently supports Tomato, Potato, and Corn leaf classes.
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveImage}
                    className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-md"
                  >
                    Upload Supported Crop Leaf
                  </button>
                </div>
              )}

              {/* Low Confidence Warning */}
              {lowConfidenceWarning && !isAnalyzing && !unsupportedCropWarning && (
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

              {/* Exact Fields Requested: Crop Name, Disease Name, Confidence, Symptoms, Causes, Treatment, Prevention, Fertilizer, Water */}
              {diseaseData && !isAnalyzing && !unsupportedCropWarning && !lowConfidenceWarning && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  
                  {/* Top Result Banner (Scientific Name Removed) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedImage}
                        alt="Scanned Leaf"
                        className="w-16 h-16 object-cover rounded-2xl border border-emerald-200 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                            {t.ui.cropName}: {diseaseData.crop}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mt-1">
                          {diseaseData.name}
                        </h3>
                      </div>
                    </div>

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
                        <span className="text-[11px] text-emerald-700 font-semibold">High Certainty</span>
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

                  {/* Requested Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    
                    {/* Symptoms */}
                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
                      <span className="font-bold text-amber-900 uppercase block flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-amber-600" /> {t.ui.symptoms}
                      </span>
                      <ul className="list-disc list-inside text-amber-800 space-y-1 mt-1">
                        {diseaseData.symptoms.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                    </div>

                    {/* Causes */}
                    <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 space-y-1">
                      <span className="font-bold text-purple-900 uppercase block flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-purple-600" /> {t.ui.causes}
                      </span>
                      <ul className="list-disc list-inside text-purple-800 space-y-1 mt-1">
                        {diseaseData.causes.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                    </div>

                    {/* Treatment */}
                    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1 md:col-span-2">
                      <span className="font-bold text-emerald-900 uppercase block flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Treatment
                      </span>
                      <ul className="list-disc list-inside text-emerald-800 space-y-1 mt-1">
                        {diseaseData.treatment.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                    </div>

                    {/* Prevention */}
                    <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-1">
                      <span className="font-bold text-blue-900 uppercase block flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-blue-600" /> {t.ui.prevention}
                      </span>
                      <ul className="list-disc list-inside text-blue-800 space-y-1 mt-1">
                        {diseaseData.prevention.map((item, idx) => <li key={idx}>{item}</li>)}
                      </ul>
                    </div>

                    {/* Fertilizer Recommendation */}
                    <div className="p-4 rounded-2xl bg-lime-50/80 border border-lime-200 space-y-1">
                      <span className="font-bold text-lime-900 uppercase block flex items-center gap-1.5">
                        <Sprout className="w-4 h-4 text-lime-600" /> {t.ui.recommendedFertilizer}
                      </span>
                      <p className="text-lime-800 mt-1">{diseaseData.recommendedFertilizer}</p>
                    </div>

                    {/* Water Requirement */}
                    <div className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200 space-y-1 md:col-span-2">
                      <span className="font-bold text-cyan-900 uppercase block flex items-center gap-1.5">
                        <Droplets className="w-4 h-4 text-cyan-600" /> {t.ui.waterRequirement}
                      </span>
                      <p className="text-cyan-800 mt-1">{diseaseData.waterRequirement}</p>
                    </div>

                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleRemoveImage}
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
