"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useOptimistic, useTransition } from "react";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { pillTransition } from "@/lib/animations";

export type FilterOption = { value: string; label: string; count?: number };

export function FilterTabs({
  param,
  active,
  options,
  ariaLabel,
}: {
  param: string;
  active: string;
  options: FilterOption[];
  ariaLabel: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const uid = useId();
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(active);

  function select(value: string) {
    if (value === optimistic) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value === options[0]?.value) params.delete(param);
    else params.set(param, value);
    params.set("page", "1");
    const q = params.toString();
    startTransition(() => {
      setOptimistic(value);
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    });
  }

  return (
    <MotionProvider>
      <div
        role="group"
        aria-label={ariaLabel}
        aria-busy={pending}
        className={`inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-primary/15 bg-surface p-1 ${
          pending ? "opacity-80" : ""
        }`}
      >
        {options.map((o) => {
          const on = optimistic === o.value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={on}
              onClick={() => select(o.value)}
              className={`relative min-h-11 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                on ? "text-white" : "text-heading hover:bg-primary/10"
              }`}
            >
              {on && (
                <motion.span
                  layoutId={`filter-pill-${uid}`}
                  transition={pillTransition}
                  className="absolute inset-0 rounded-full bg-primary"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {o.label}
                {o.count !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${on ? "bg-white/20" : "bg-primary/10"}`}
                  >
                    {o.count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </MotionProvider>
  );
}