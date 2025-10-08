"use client";

import { useState, useEffect } from "react";

export function CurrentDate() {
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, []);

  if (!date) {
    return <div className="h-6 w-64 mx-auto bg-muted rounded-md animate-pulse" />;
  }

  return <p className="text-lg text-muted-foreground">{date}</p>;
}
