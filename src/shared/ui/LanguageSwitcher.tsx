import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../i18n';

export const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = i18n.language;

  const languages = [
    { code: 'ru', name: 'Русский' },
    { code: 'kk', name: 'Қазақша' },
    { code: 'en', name: 'English' }
  ];

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center space-x-1 text-sm py-1 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark/40 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('settings.language')}
      >
        <span className="text-lg">🌐</span>
        <span>{currentLanguage.name}</span>
        <svg 
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 rounded-md shadow-lg bg-white dark:bg-dark border border-gray-200 dark:border-gray-700 z-10">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                className={`w-full text-left px-4 py-2 text-sm ${
                  currentLang === language.code 
                    ? 'bg-gray-100 dark:bg-dark/40 text-primary' 
                    : 'hover:bg-gray-100 dark:hover:bg-dark/40'
                }`}
                onClick={() => handleLanguageChange(language.code)}
              >
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 