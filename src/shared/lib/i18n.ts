import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Default language resources to be used before loading from public/locales
const resources = {
  ru: {
    common: {
      "app.name": "NIStego",
      "landing.hero.title": "Преврати цели в победы",
      "landing.hero.subtitle": "Учись умно. Достигай — не мучайся.",
      "landing.cta.start": "Начать",
      "landing.cta.demo": "Смотреть демо",
      // Add more keys as needed
    }
  },
  kk: {
    common: {
      "app.name": "NIStego",
      "landing.hero.title": "Мақсаттарды жеңіске айналдыр",
      "landing.hero.subtitle": "Ақылмен оқы. Қиналмай жетістікке жет.",
      "landing.cta.start": "Бастау",
      "landing.cta.demo": "Демо көру",
      // Add more keys as needed
    }
  }
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'ru', // Default language
    fallbackLng: 'ru',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Function to change the language
export const changeLanguage = (lng: string) => {
  localStorage.setItem('language', lng);
  return i18n.changeLanguage(lng);
};

export default i18n; 