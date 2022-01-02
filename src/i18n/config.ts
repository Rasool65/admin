import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEn from './locales/en/translation.json';
import translationFa from './locales/fa/translation.json';
import translationAr from './locales/ar/translation.json';

export const resources = {
  en: {
    translation: {
      ...translationEn,
    },
  },
  fa: {
    translation: {
      ...translationFa,
    },
  },
  ar: {
    translation: {
      ...translationAr,
    },
  },
} as const;

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    debug: true,
    fallbackLng: 'fa',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    react: {
      useSuspense: false,
    },
    resources,
  });
