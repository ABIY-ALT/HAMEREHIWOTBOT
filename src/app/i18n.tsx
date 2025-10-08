"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
import Polyglot from 'polyglot';

import en from '@/locales/en.json';
import am from '@/locales/am.json';

type Locale = 'en' | 'am';

type I18nContextType = {
  locale: Locale;
  t: (phrase: string, options?: Polyglot.InterpolationOptions) => string;
  setLocale: (locale: Locale) => void;
};

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

let polyglotInstance: Polyglot;

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale | null;
    if (savedLocale) {
      setLocaleState(savedLocale);
    }
    // Initialize polyglot on the client side
    polyglotInstance = new Polyglot();
    setIsLoaded(true);
  }, []);
  
  useEffect(() => {
    if (isLoaded) {
      const phrases = locale === 'am' ? am : en;
      polyglotInstance.replace(phrases);
      polyglotInstance.locale(locale);
      document.documentElement.lang = locale;
    }
  }, [locale, isLoaded]);

  const setLocale = (newLocale: Locale) => {
    localStorage.setItem('locale', newLocale);
    setLocaleState(newLocale);
  };

  const t = useCallback((phrase: string, options?: Polyglot.InterpolationOptions) => {
    if (!isLoaded) return phrase; // Return key or a loading state
    return polyglotInstance.t(phrase, options);
  }, [isLoaded]);

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
};
