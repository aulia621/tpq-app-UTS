export const PAGE_SIZE = 10;

export type RawParams = Record<string, string | string[] | undefined>;

export function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export function parseListParams(raw: RawParams): { search: string; page: number } {
  const search = (first(raw.search) ?? "").trim().slice(0, 100);
  const n = Number.parseInt(first(raw.page) ?? "1", 10);
  const page = Number.isFinite(n) && n >= 1 && n <= 10000 ? n : 1;
  return { search, page };
}

export function parseEnum<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.find((a) => a === value) ?? fallback;
}

/** Escape karakter wildcard LIKE agar input pengguna tidak jadi pola. */
export function escapeLike(term: string): string {
  return term.replace(/[\\%_]/g, (c) => `\\${c}`);
}

export function qs(params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export function formatTanggal(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function initials(name: string, fallback = "?"): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
