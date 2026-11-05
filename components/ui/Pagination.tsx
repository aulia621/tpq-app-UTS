import Link from "next/link";
import { qs } from "@/lib/query";

export function Pagination({
  basePath,
  page,
  totalPages,
  params,
}: {
  basePath: string;
  page: number;
  totalPages: number;
  params: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;
  const href = (p: number) => `${basePath}${qs({ ...params, page: p > 1 ? String(p) : undefined })}`;
  const linkCls =
    "inline-flex min-h-11 items-center rounded-xl border border-primary/25 bg-surface px-4 text-sm font-semibold text-heading hover:bg-primary/10";
  const offCls =
    "inline-flex min-h-11 items-center rounded-xl border border-ink/10 bg-ink/5 px-4 text-sm font-semibold text-ink/40";

  return (
    <nav aria-label="Navigasi halaman" className="flex items-center justify-between gap-3">
      {page > 1 ? (
        <Link href={href(page - 1)} className={linkCls}>
          ← Sebelumnya
        </Link>
      ) : (
        <span aria-disabled="true" className={offCls}>
          ← Sebelumnya
        </span>
      )}
      <span className="text-sm text-ink/70">
        Halaman {page} dari {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} className={linkCls}>
          Berikutnya →
        </Link>
      ) : (
        <span aria-disabled="true" className={offCls}>
          Berikutnya →
        </span>
      )}
    </nav>
  );
}