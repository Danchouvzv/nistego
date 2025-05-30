import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Импорт переводов
import enCommon from './locales/en/common.json';
import ruCommon from './locales/ru/common.json';
import kkCommon from './locales/kk/common.json';

const resources = {
  en: {
    common: enCommon
  },
  ru: {
    common: ruCommon
  },
  kk: {
    common: kkCommon
  }
};

i18n
  // Определение языка пользователя
  .use(LanguageDetector)
  // Передача i18n в react-i18next
  .use(initReactI18next)
  // Инициализация i18next
  .init({
    resources,
    fallbackLng: 'ru',
    debug: true,
    
    // Пространства имен
    ns: ['common'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false // Не нужно экранировать для React
    },
    
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    },
    
    react: {
      useSuspense: true,
    },
    
    initImmediate: false
  });

// Функция для изменения языка
export const changeLanguage = (lng: string) => {
  localStorage.setItem('i18nextLng', lng);
  return i18n.changeLanguage(lng);
};

export default i18n; 