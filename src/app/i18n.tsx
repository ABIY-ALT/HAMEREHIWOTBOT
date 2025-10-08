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

const polyglot = new Polyglot();

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale | null;
    if (savedLocale) {
      setLocaleState(savedLocale);
    }
  }, []);
  
  useEffect(() => {
    const phrases = locale === 'am' ? am : en;
    polyglot.replace(phrases);
    polyglot.locale(locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    localStorage.setItem('locale', newLocale);
    setLocaleState(newLocale);
  };

  const t = useCallback((phrase: string, options?: Polyglot.InterpolationOptions) => {
    return polyglot.t(phrase, options);
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
};
