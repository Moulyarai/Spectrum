import { synthesizeAndPlayPiper, stopPiperAudio } from '../services/piperTtsService';

/**
 * AgriVision Speech Controller using Piper TTS
 */
export const speakOfflineText = async ({
  text,
  langCode = 'en',
  onStart,
  onEnd,
  onError
}) => {
  return await synthesizeAndPlayPiper({
    text,
    lang: langCode,
    onStart,
    onEnd,
    onError
  });
};

export const stopOfflineSpeech = () => {
  stopPiperAudio();
};
