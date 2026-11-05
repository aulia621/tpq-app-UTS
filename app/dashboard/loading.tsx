export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-primary/15" />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-24 animate-pulse rounded-card bg-primary/10" />
        <div className="h-24 animate-pulse rounded-card bg-primary/10" />
        <div className="h-24 animate-pulse rounded-card bg-primary/10" />
      </div>
      <span className="sr-only">Memuat...</span>
    </div>
  );
}
