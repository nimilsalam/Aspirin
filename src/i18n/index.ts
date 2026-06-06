import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ml from './ml.json';
import { getStoredLanguage } from '../lib/storage';

export const SUPPORTED_LANGUAGES = ['en', 'ml'] as const;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ml: { translation: ml },
  },
  lng: getStoredLanguage() ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
