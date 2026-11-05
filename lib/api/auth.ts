import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { UserRole } from "@/lib/types";
import { apiError } from "./response";

export type ApiAuth =
  | { ok: true; user: { id: string }; role: UserRole; supabase: SupabaseClient }
  | { ok: false; response: Response };

const JWT_SHAPE = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

/** Autentikasi API murni dari header Authorization. Tidak memakai cookie dan tidak memakai service_role. */
export async function authenticateRequest(request: Request): Promise<ApiAuth> {
  const unauthorized = (detail: string): ApiAuth => ({
    ok: false,
    response: apiError(request, {
      status: 401,
      code: "UNAUTHORIZED",
      detail,
      headers: { "WWW-Authenticate": "Bearer" },
    }),
  });

  const header = request.headers.get("authorization") ?? "";
  const match = /^Bearer\s+(\S+)$/i.exec(header);
  if (!match) return unauthorized("Header Authorization: Bearer <token> diperlukan.");
  const token = match[1];
  if (token.length > 4096 || !JWT_SHAPE.test(token)) return unauthorized("Token tidak valid.");

  const { url, key } = getSupabaseEnv();
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return unauthorized("Token tidak valid atau kedaluwarsa.");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
  if (!profile) {
    return { ok: false, response: apiError(request, { status: 403, code: "FORBIDDEN", detail: "Profil pengguna belum tersedia." }) };
  }
  return { ok: true, user: { id: data.user.id }, role: (profile as { role: UserRole }).role, supabase };
}
