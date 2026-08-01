/**
 * AgriVision Hybrid Offline TTS Frontend Service
 * 1. Tries local Python Piper TTS server (http://localhost:5000/api/tts)
 * 2. Seamlessly falls back to Browser Web Speech API (window.speechSynthesis)
 */

const PIPER_SERVER_URL = "http://localhost:5000/api/tts";

let currentAudio = null;

const langLocaleMap = {
  en: 'en-US',
  hi: 'hi-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN'
};

/**
 * Fallback Browser SpeechSynthesis engine
 */
const speakWebSpeech = ({ text, lang = 'en', onStart, onEnd, onError }) => {
  if (!('speechSynthesis' in window)) {
    const err = new Error('Browser SpeechSynthesis API not supported.');
    if (onError) onError(err, true);
    return { success: false, error: err.message, fallbackUsed: true };
  }

  window.speechSynthesis.cancel();

  const locale = langLocaleMap[lang] || 'en-US';
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const matchingVoice = voices.find(v => v.lang === locale || v.lang.startsWith(lang));
  let fallbackUsed = false;

  if (matchingVoice) {
    utterance.voice = matchingVoice;
  } else if (lang !== 'en') {
    const enVoice = voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;
    fallbackUsed = true;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (event) => {
    if (event.error !== 'interrupted' && event.error !== 'canceled') {
      console.warn('WebSpeech API notice:', event.error);
      if (onError) onError(event, fallbackUsed);
    } else {
      if (onEnd) onEnd();
    }
  };

  if (onStart) onStart();
  window.speechSynthesis.speak(utterance);

  return {
    success: true,
    fallbackUsed,
    engine: 'browser-web-speech'
  };
};

export const synthesizeAndPlayPiper = async ({
  text,
  lang = "en",
  onStart,
  onEnd,
  onError
}) => {
  stopPiperAudio();

  // Tier 1: Try local Python Piper TTS server if available
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const response = await fetch(PIPER_SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text, lang }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const fallbackUsed = response.headers.get("X-Fallback-Used") === "true";
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      currentAudio = new Audio(audioUrl);

      currentAudio.onended = () => {
        if (onEnd) onEnd();
        currentAudio = null;
      };

      currentAudio.onerror = () => {
        currentAudio = null;
        speakWebSpeech({ text, lang, onStart, onEnd, onError });
      };

      if (onStart) onStart();
      await currentAudio.play();

      return {
        success: true,
        fallbackUsed,
        audioUrl,
        engine: 'piper-python'
      };
    }
  } catch (err) {
    // Piper server unreachable -> proceed silently to WebSpeech API fallback
  }

  // Tier 2: Seamless Browser Web Speech API Fallback
  return speakWebSpeech({ text, lang, onStart, onEnd, onError });
};

export const stopPiperAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

