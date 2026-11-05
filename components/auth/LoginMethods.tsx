"use client";

import { useRef, useState } from "react";
import { EmailPasswordForm } from "./EmailPasswordForm";
import { MagicLinkForm } from "./MagicLinkForm";

const TABS = [
  { id: "password", label: "Password (Email / NIS)" },
  { id: "magic", label: "Tautan Email" },
] as const;

export function LoginMethods({ next, initialMode = "login" }: { next: string; initialMode?: "login" | "register" }) {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("password");
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    let target = index;
    if (e.key === "ArrowRight") target = (index + 1) % TABS.length;
    else if (e.key === "ArrowLeft") target = (index - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") target = 0;
    else if (e.key === "End") target = TABS.length - 1;
    else return;
    e.preventDefault();
    setActive(TABS[target].id);
    refs.current[target]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Metode masuk" className="grid grid-cols-2 gap-1 rounded-xl bg-primary/10 p-1">
        {TABS.map((t, i) => {
          const on = active === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={`panel-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`min-h-11 rounded-lg px-2 text-sm font-semibold transition-colors ${
                on ? "bg-primary text-white shadow" : "text-primary-dark hover:bg-white/60"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div
        id={`panel-${active}`}
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
        className="mt-4"
      >
        {active === "password" ? <EmailPasswordForm next={next} /> : <MagicLinkForm next={next} />}
      </div>
    </div>
  );
}