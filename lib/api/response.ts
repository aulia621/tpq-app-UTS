import { zodRecord } from "@/lib/schemas";
import type { z } from "zod";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "PAYLOAD_TOO_LARGE"
  | "INTERNAL_ERROR";

export type ApiMeta = { page: number; limit: number; total: number; totalPages: number };

const TITLES: Record<ApiErrorCode, string> = {
  BAD_REQUEST: "Permintaan tidak valid",
  UNAUTHORIZED: "Tidak terautentikasi",
  FORBIDDEN: "Akses ditolak",
  NOT_FOUND: "Data tidak ditemukan",
  VALIDATION_ERROR: "Validasi gagal",
  UNSUPPORTED_MEDIA_TYPE: "Tipe konten tidak didukung",
  PAYLOAD_TOO_LARGE: "Isi permintaan terlalu besar",
  INTERNAL_ERROR: "Kesalahan server",
};

export function getCorsHeaders(request: Request): Record<string, string> {
  const base: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  const allowed = (process.env.API_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  if (allowed.length === 0) {
    base["Access-Control-Allow-Origin"] = "*";
  } else {
    base["Vary"] = "Origin";
    const origin = request.headers.get("origin");
    if (origin && allowed.includes(origin)) base["Access-Control-Allow-Origin"] = origin;
  }
  // Sengaja TIDAK ada Access-Control-Allow-Credentials: API memakai Bearer token, bukan cookie.
  return base;
}

export function apiPreflight(request: Request): Response {
  return new Response(null, { status: 204, headers: getCorsHeaders(request) });
}

export function apiSuccess<T>(request: Request, data: T, meta?: ApiMeta, status = 200, extra?: Record<string, string>): Response {
  return new Response(JSON.stringify(meta ? { data, meta } : { data }), {
    status,
    headers: { ...getCorsHeaders(request), "Content-Type": "application/json; charset=utf-8", ...extra },
  });
}

export function apiError(
  request: Request,
  opts: { status: number; code: ApiErrorCode; detail: string; errors?: Record<string, string[]>; headers?: Record<string, string> },
): Response {
  const body = {
    type: `urn:tpq:error:${opts.code.toLowerCase().replace(/_/g, "-")}`,
    title: TITLES[opts.code],
    status: opts.status,
    detail: opts.detail,
    ...(opts.errors ? { errors: opts.errors } : {}),
  };
  return new Response(JSON.stringify(body), {
    status: opts.status,
    headers: { ...getCorsHeaders(request), "Content-Type": "application/problem+json; charset=utf-8", ...opts.headers },
  });
}

export function validationError(request: Request, error: z.ZodError): Response {
  return apiError(request, {
    status: 422,
    code: "VALIDATION_ERROR",
    detail: "Data yang dikirim tidak valid.",
    errors: zodRecord(error),
  });
}

export function internalError(request: Request, where: string, err: unknown): Response {
  console.error(`[api] ${where}`, err instanceof Error ? err.name : "unknown");
  return apiError(request, { status: 500, code: "INTERNAL_ERROR", detail: "Terjadi kesalahan pada server." });
}

export async function readJsonBody(
  request: Request,
  maxBytes = 10_000,
): Promise<{ ok: true; body: unknown } | { ok: false; response: Response }> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.toLowerCase().includes("application/json")) {
    return {
      ok: false,
      response: apiError(request, { status: 415, code: "UNSUPPORTED_MEDIA_TYPE", detail: "Content-Type harus application/json." }),
    };
  }
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > maxBytes) {
    return { ok: false, response: apiError(request, { status: 413, code: "PAYLOAD_TOO_LARGE", detail: `Maksimal ${maxBytes} byte.` }) };
  }
  const text = await request.text();
  if (new TextEncoder().encode(text).length > maxBytes) {
    return { ok: false, response: apiError(request, { status: 413, code: "PAYLOAD_TOO_LARGE", detail: `Maksimal ${maxBytes} byte.` }) };
  }
  try {
    return { ok: true, body: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, response: apiError(request, { status: 400, code: "BAD_REQUEST", detail: "Body bukan JSON yang valid." }) };
  }
}
