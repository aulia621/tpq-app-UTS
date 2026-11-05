"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "theme";

function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains("dark"));
    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

function readStored(): string | null {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const isDark = useIsDark();

  // Selama pengguna belum memilih manual, ikuti perubahan tema sistem operasi.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (readStored() === null) applyTheme(e.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      // penyimpanan diblokir: tema tetap berubah untuk sesi ini
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label="Mode gelap"
      title={isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-primary/20 bg-surface/80 text-heading transition hover:bg-primary/10 ${className}`}
    >
      {/* Kedua ikon selalu dirender; CSS memilih yang tampil, jadi tidak ada ketidakcocokan hidrasi. */}
      <svg viewBox="0 0 24 24" className="h-5 w-5 dark:hidden" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      <svg viewBox="0 0 24 24" className="hidden h-5 w-5 dark:block" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}