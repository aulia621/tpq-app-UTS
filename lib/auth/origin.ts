import { headers } from "next/headers";

/** Origin ditentukan di server, tidak pernah dari input klien. */
export async function getOrigin(): Promise<string> {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (site && /^https?:\/\//.test(site)) return site;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
