import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/lib/types";

export const getUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, avatar_url")
    .eq("id", user.id)
    .maybeSingle();
  return (data as Profile | null) ?? null;
});

/** Guard halaman: tidak login -> /login; peran tidak sesuai atau profil kosong -> /dashboard. */
export async function requireRole(allowed: UserRole[]): Promise<Profile> {
  const user = await getUser();
  if (!user) redirect("/login");
  const profile = await getProfile();
  if (!profile || !allowed.includes(profile.role)) redirect("/dashboard");
  return profile;
}
