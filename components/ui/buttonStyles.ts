// Tanpa "use client": aman dipakai di Server Component maupun Client Component.
export const buttonVariants = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  gold: "bg-gold text-primary-dark hover:brightness-95",
  outline: "border border-primary text-accent hover:bg-primary/10",
  danger: "bg-danger-solid text-white hover:brightness-90",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

export function buttonClass(variant: ButtonVariant = "primary", extra = ""): string {
  return `inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${buttonVariants[variant]} ${extra}`;
}