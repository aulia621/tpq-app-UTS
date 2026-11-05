"use client";

import { MotionConfig } from "framer-motion";

/** Menghormati pengaturan "kurangi gerakan" milik pengguna. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
