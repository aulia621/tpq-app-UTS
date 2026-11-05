"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Ref } from "react";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { cardVariants, cardVariantsReduced, containerVariants } from "@/lib/animations";

/** listKey berubah saat filter/halaman berganti: stagger diputar ulang. Menghapus satu item TIDAK mengubahnya. */
export function AnimatedList({
  listKey,
  children,
  className = "sm:grid-cols-2",
}: {
  listKey: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <MotionProvider>
      <motion.ul
        key={listKey}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`relative grid gap-4 ${className}`}
      >
        <AnimatePresence mode="popLayout">{children}</AnimatePresence>
      </motion.ul>
    </MotionProvider>
  );
}

export function AnimatedItem({
  children,
  className = "",
  ref,
}: {
  children: React.ReactNode;
  className?: string;
  ref?: Ref<HTMLLIElement>;
}) {
  const reduce = useReducedMotion() === true;
  return (
    <motion.li
      ref={ref}
      layout={!reduce}
      variants={reduce ? cardVariantsReduced : cardVariants}
      exit="exit"
      whileHover={reduce ? undefined : { y: -3 }}
      className={`rounded-card border border-primary/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-primary/30 ${className}`}
    >
      {children}
    </motion.li>
  );
}
