"use client";

import { useEffect, useState } from "react";
import { TIME_ZONE } from "@/lib/site";

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    // Pengguna "kurangi gerakan": tampilkan menit saja dan perbarui tiap menit (tanpa detik yang berjalan).
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(r);
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, r ? 60_000 : 1000);
    return () => clearInterval(id);
  }, []);

  const time = now
    ? now.toLocaleTimeString("id-ID", {
        timeZone: TIME_ZONE,
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        ...(reduce ? {} : { second: "2-digit" }),
      })
    : reduce
      ? "--.--"
      : "--.--.--";
  const date = now
    ? now.toLocaleDateString("id-ID", {
        timeZone: TIME_ZONE,
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <div
      role="timer"
      aria-live="off"
      className="inline-flex items-center gap-3 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-bold tabular-nums text-accent">{time}</span>
      {date && (
        <>
          <span aria-hidden="true" className="h-4 w-px bg-primary/25" />
          <span className="text-sm text-ink/70">{date}</span>
        </>
      )}
    </div>
  );
}