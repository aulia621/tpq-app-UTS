import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeNext } from "@/lib/auth/safeNext";

function baseUrl(request: Request): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (site && /^https?:\/\//.test(site)) return site;
  const url = new URL(request.url);
  const host = request.headers.get("x-forwarded-host") ?? url.host;
  const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  return `${proto === "http" ? "http" : "https"}://${host}`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const base = baseUrl(request);
  const next = sanitizeNext(url.searchParams.get("next"));

  if (url.searchParams.get("error")) return NextResponse.redirect(`${base}/login?error=oauth_denied`);

  const code = url.searchParams.get("code");
  if (!code) return NextResponse.redirect(`${base}/login?error=oauth_callback_failed`);

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${base}/login?error=oauth_callback_failed`);

  return NextResponse.redirect(`${base}${next}`);
}
