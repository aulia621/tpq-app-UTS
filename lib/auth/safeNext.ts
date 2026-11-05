/**
 * Mencegah open redirect: hanya path internal yang diterima.
 * Contoh ditolak: "https://x.com", "//x.com", "/\\x.com", "javascript:..."
 */
export function sanitizeNext(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string") return fallback;
  const v = value.trim();
  if (v.length === 0 || v.length > 200) return fallback;
  if (!v.startsWith("/")) return fallback;
  if (v.startsWith("//") || v.startsWith("/\\")) return fallback;
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(v)) return fallback;
  if (/^\/[a-zA-Z][a-zA-Z0-9+.-]*:/.test(v)) return fallback;
  return v;
}
