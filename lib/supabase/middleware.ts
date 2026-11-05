import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { sanitizeNext } from "@/lib/auth/safeNext";
import { readSupabaseEnv } from "./env";

function redirectWithCookies(url: URL, from: NextResponse): NextResponse {
  const res = NextResponse.redirect(url);
  from.cookies.getAll().forEach((c) => res.cookies.set(c));
  return res;
}

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  const env = readSupabaseEnv();
  if (!env) return supabaseResponse; // env belum diisi: biarkan halaman menampilkan pesan

  const supabase = createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Dual-cookie: tulis ke request DAN response
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // WAJIB getUser() (validasi ke server Supabase), bukan getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  const isPrivate = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isLogin = pathname === "/login" || pathname.startsWith("/login/");

  if (!user && isPrivate) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(sanitizeNext(pathname + search))}`;
    return redirectWithCookies(url, supabaseResponse);
  }

  if (user && isLogin) {
    const next = sanitizeNext(request.nextUrl.searchParams.get("next"));
    const url = request.nextUrl.clone();
    url.pathname = next.split("?")[0];
    url.search = next.includes("?") ? `?${next.split("?").slice(1).join("?")}` : "";
    return redirectWithCookies(url, supabaseResponse);
  }

  return supabaseResponse;
}
