import type { HafalanStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: HafalanStatus }) {
  const lulus = status === "lulus";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        lulus ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
      }`}
    >
      <span aria-hidden="true">{lulus ? "✓" : "↻"}</span>
      {lulus ? "Lulus" : "Perlu diulang"}
    </span>
  );
}

export function Badge({
  children,
  tone = "primary",
}: {
  children: React.ReactNode;
  tone?: "primary" | "gold" | "muted" | "danger";
}) {
  const tones = {
    primary: "bg-primary/10 text-heading",
    gold: "bg-gold/25 text-heading",
    muted: "bg-ink/10 text-ink/80",
    danger: "bg-danger/10 text-danger",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}