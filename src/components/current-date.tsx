"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/hooks/use-i18n";

export function CurrentDate() {
  const [date, setDate] = useState("");
  const { locale } = useI18n();

  useEffect(() => {
    const localeString = locale === 'am' ? 'am-ET-u-ca-ethiopic' : 'en-US';
    setDate(new Date().toLocaleDateString(localeString, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, [locale]);

  if (!date) {
    return <div className="h-6 w-64 mx-auto bg-muted rounded-md animate-pulse" />;
  }

  return <p className="text-lg text-muted-foreground">{date}</p>;
}
