import type { Transition, Variants } from "framer-motion";

/** Kontainer daftar: anak-anaknya muncul bergantian. Pakai: initial="hidden" animate="visible". */
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
} satisfies Variants;

/** Kartu (santri, hafalan, pengumuman): masuk dengan pegas, keluar mengecil ke kiri. */
export const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 350, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.85, x: -30, transition: { duration: 0.2 } },
} satisfies Variants;

/** Versi tanpa gerakan (hanya opasitas) untuk pengguna "kurangi gerakan". */
export const cardVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
} satisfies Variants;

export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
} satisfies Variants;

export const modalDialogVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
} satisfies Variants;

export const pillTransition: Transition = { type: "spring", stiffness: 500, damping: 35 };
export const modalSpringTransition: Transition = { type: "spring", stiffness: 400, damping: 30 };
