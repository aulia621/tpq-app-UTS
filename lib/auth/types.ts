export type AuthState = {
  error?: string;
  success?: string;
  fieldErrors?: Partial<Record<"identifier" | "password" | "fullName", string>>;
  values?: { identifier?: string; fullName?: string };
};

export type MagicLinkState = {
  status: "idle" | "sent" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"email" | "fullName", string>>;
  values?: { email?: string; fullName?: string };
};
