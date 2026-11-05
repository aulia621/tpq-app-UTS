import { z } from "zod";

const NIS_DOMAIN = process.env.NIS_EMAIL_DOMAIN || "santri.tpq-nurhijau.local";
const NIS_REGEX = /^[A-Za-z0-9]{3,20}$/;

/** Hanya dipakai di server. Memetakan Email atau NIS menjadi email. */
export function normalizeIdentifier(raw: string): { kind: "email" | "nis"; email: string } {
  const v = raw.trim();
  if (v.includes("@")) return { kind: "email", email: v.toLowerCase() };
  return { kind: "nis", email: `${v.toLowerCase()}@${NIS_DOMAIN}` };
}

export const identifierSchema = z
  .string()
  .trim()
  .min(3, "Email atau NIS minimal 3 karakter")
  .max(254, "Terlalu panjang")
  .superRefine((val, ctx) => {
    if (val.includes("@")) {
      if (!z.string().email().safeParse(val).success) {
        ctx.addIssue({ code: "custom", message: "Format email tidak valid" });
      }
    } else if (!NIS_REGEX.test(val)) {
      ctx.addIssue({
        code: "custom",
        message: "NIS hanya boleh huruf dan angka, 3-20 karakter",
      });
    }
  });

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "Terlalu panjang")
  .email("Format email tidak valid");

export const passwordSignupSchema = z
  .string()
  .min(8, "Password minimal 8 karakter")
  .max(72, "Password maksimal 72 karakter");
