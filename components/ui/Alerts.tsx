export function ErrorBanner({ children }: { children: React.ReactNode }) {
  return (
    <div role="alert" className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
      {children}
    </div>
  );
}

export function SuccessBanner({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" className="rounded-xl border border-success/30 bg-success/10 p-3 text-sm text-success">
      {children}
    </div>
  );
}
