export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-card border border-primary/10 bg-surface p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-heading">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink/70">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Metric({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <Card>
      <p className="text-sm text-ink/70">{label}</p>
      <p className="mt-1 text-3xl font-bold text-accent">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink/60">{hint}</p>}
    </Card>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-primary/30 bg-surface/60 p-8 text-center">
      <p className="font-semibold text-heading">{title}</p>
      {children && <div className="mt-2 text-sm text-ink/70">{children}</div>}
    </div>
  );
}