"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { MotionProvider } from "@/components/motion/MotionProvider";

type Icon = "login" | "user-plus" | "dashboard" | "info";

const ICONS: Record<Icon, React.ReactNode> = {
  login: <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />,
  "user-plus": <path d="M15 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM20 8v6M23 11h-6" />,
  dashboard: <path d="M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z" />,
  info: <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01" />,
};

export function HeroCta({
  href,
  label,
  variant = "solid",
  icon,
}: {
  href: string;
  label: string;
  variant?: "solid" | "outline";
  icon?: Icon;
}) {
  const reduce = useReducedMotion() === true;
  const style =
    variant === "solid"
      ? "bg-primary text-white border border-emerald-300/40 shadow-lg shadow-black/30 hover:bg-primary-dark"
      : "border-2 border-emerald-300/70 bg-white/5 text-white hover:bg-white/15";

  return (
    <MotionProvider>
      <motion.div
        className="inline-block"
        whileHover={reduce ? undefined : { scale: 1.03, y: -2 }}
        whileTap={reduce ? undefined : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        <Link
          href={href}
          className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-7 font-bold transition-colors ${style}`}
        >
          {icon && (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {ICONS[icon]}
            </svg>
          )}
          {label}
        </Link>
      </motion.div>
    </MotionProvider>
  );
}