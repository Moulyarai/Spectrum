import { en } from './en';
import { hi } from './hi';

export const translations = {
  en,
  hi
};

export const availableLanguages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', locale: 'en-US' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', locale: 'hi-IN' }
];

export const getTranslation = (langCode = 'en') => {
  return translations[langCode] || translations.en;
};
