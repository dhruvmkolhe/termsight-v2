import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  type LanguageCode,
  type LanguageInfo,
  SUPPORTED_LANGUAGES,
  translations,
} from '../i18n/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  supportedLanguages: LanguageInfo[];
  currentLanguageInfo: LanguageInfo;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'termsight_preferred_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as LanguageCode;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
      const browserLang = navigator.language.slice(0, 2).toLowerCase() as LanguageCode;
      if (SUPPORTED_LANGUAGES.some((l) => l.code === browserLang)) {
        return browserLang;
      }
    } catch {
      // Fallback
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const currentLanguageInfo = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === language) ||
      SUPPORTED_LANGUAGES[0]
    );
  }, [language]);

  const t = React.useCallback(
    (key: string, fallback?: string): string => {
      const langDict = translations[language] || translations.en;
      if (langDict[key]) return langDict[key];
      if (translations.en[key]) return translations.en[key];
      return fallback || key;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      supportedLanguages: SUPPORTED_LANGUAGES,
      currentLanguageInfo,
    }),
    [language, currentLanguageInfo, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
