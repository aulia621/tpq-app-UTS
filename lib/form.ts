export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
  ts?: number;
};

export type RowActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

export function pick(fd: FormData, keys: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of keys) out[k] = str(fd, k);
  return out;
}
