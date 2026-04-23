import React from 'react';
import { strings } from '../i18n/strings';
import type { Language, StringKey } from '../i18n/strings';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: StringKey) => string;
}

const STORAGE_KEY = 'lenslab.language';
const LanguageContext = React.createContext<LanguageContextValue | undefined>(undefined);

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'ja' || stored === 'en') return stored;

  return window.navigator.language.startsWith('ja') ? 'ja' : 'en';
};

export const LanguageProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [language, setLanguageState] = React.useState<Language>(getInitialLanguage);

  const setLanguage = React.useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(STORAGE_KEY, nextLanguage);
  }, []);

  const t = React.useCallback(
    (key: StringKey) => strings[language][key],
    [language]
  );

  const value = React.useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const value = React.useContext(LanguageContext);
  if (!value) {
    throw new Error('useLanguage must be used inside LanguageProvider.');
  }

  return value;
};
