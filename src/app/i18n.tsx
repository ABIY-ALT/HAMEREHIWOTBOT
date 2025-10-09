"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';

import en from '@/locales/en.json';
import am from '@/locales/am.json';

type Locale = 'en' | 'am';

type I18nContextType = {
  locale: Locale;
  t: (phrase: string, options?: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
};

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: Record<Locale, any> = { en, am };

// A simple replacement for polyglot.t()
function translate(phrase: string, locale: Locale, options?: Record<string, string | number>): string {
  const lang = translations[locale];
  let translation = phrase.split('.').reduce((o, i) => o?.[i], lang);

  if (typeof translation !== 'string') {
    return phrase; // Fallback to the key if not found
  }

  if (options) {
    for (const key in options) {
      translation = translation.replace(`%{${key}}`, String(options[key]));
    }
  }

  return translation;
}

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // This effect now only runs on the client
    const savedLocale = localStorage.getItem('locale') as Locale | null;
    if (savedLocale) {
      setLocaleState(savedLocale);
    }
    setIsLoaded(true);
  }, []);
  
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.lang = locale;
    }
  }, [locale, isLoaded]);

  const setLocale = (newLocale: Locale) => {
    localStorage.setItem('locale', newLocale);
    setLocaleState(newLocale);
  };

  const t = useCallback((phrase: string, options?: Record<string, string | number>) => {
    if (!isLoaded) return ''; // Return empty string or a placeholder while loading
    return translate(phrase, locale, options);
  }, [isLoaded, locale]);

  if (!isLoaded) {
    return null; // Or a loading spinner, prevents hydration mismatch
  }

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
};
