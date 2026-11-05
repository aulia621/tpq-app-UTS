"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { MotionProvider } from "@/components/motion/MotionProvider";
import {
  modalBackdropVariants,
  modalDialogVariants,
  modalSpringTransition,
} from "@/lib/animations";

const subscribe = () => () => {};

export function AnimatedConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Ya, Hapus",
  cancelLabel = "Batal",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const titleId = useId();
  const descId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      if (!nodes || nodes.length === 0) return;
      const firstEl = nodes[0];
      const lastEl = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (previous && document.contains(previous)) previous.focus();
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <MotionProvider>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              variants={modalBackdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={onClose}
              aria-hidden="true"
              className="absolute inset-0 bg-primary-dark/40 backdrop-blur-sm"
            />
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descId}
              variants={modalDialogVariants}
              transition={modalSpringTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-card border border-primary/10 bg-white p-6 shadow-xl"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-danger/10 text-danger">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 id={titleId} className="mt-4 text-lg font-bold text-primary-dark">
                {title}
              </h2>
              <p id={descId} className="mt-2 wrap-break-word text-sm text-ink/70">
                {description}
              </p>
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  ref={cancelRef}
                  type="button"
                  onClick={onClose}
                  className="min-h-11 rounded-xl border border-primary px-4 text-sm font-semibold text-primary hover:bg-primary/10"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="min-h-11 rounded-xl bg-danger px-4 text-sm font-semibold text-white hover:brightness-90"
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </MotionProvider>,
    document.body,
  );
}
