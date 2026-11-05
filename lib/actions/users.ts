"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/session";
import { idSchema, roleSchema } from "@/lib/schemas";
import { str, type RowActionState } from "@/lib/form";

export async function setUserRoleAction(_prev: RowActionState, formData: FormData): Promise<RowActionState> {
  const id = idSchema.safeParse(str(formData, "id"));
  const role = roleSchema.safeParse(str(formData, "role"));
  if (!id.success || !role.success) return { status: "error", message: "Data tidak valid." };

  const profile = await getProfile();
  if (!profile || profile.role !== "admin") return { status: "error", message: "Hanya admin yang boleh mengubah peran." };
  if (id.data === profile.id) return { status: "error", message: "Kamu tidak bisa mengubah peranmu sendiri." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_set_user_role", { p_user: id.data, p_role: role.data });
  if (error) {
    console.error("setUserRole", error.code);
    return { status: "error", message: "Gagal mengubah peran." };
  }
  revalidatePath("/dashboard", "layout");
  return { status: "success", message: "Peran diperbarui." };
}
