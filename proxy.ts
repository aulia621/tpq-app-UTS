import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Konvensi Next.js 16: proxy.ts menggantikan middleware.ts
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
