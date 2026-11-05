import { signOutAction } from "@/lib/actions/auth";

export function SignOutButton({ className = "" }: { className?: string }) {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className={`inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold ${className}`}
      >
        Keluar
      </button>
    </form>
  );
}
