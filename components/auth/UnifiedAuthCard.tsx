import { GithubLoginButton } from "./GithubLoginButton";
import { LoginMethods } from "./LoginMethods";
import { ErrorBanner } from "@/components/ui/Alerts";
import { SITE_NAME } from "@/lib/site";

export function UnifiedAuthCard({
  next,
  errorMessage,
  initialMode = "login",
}: {
  next: string;
  errorMessage?: string;
  initialMode?: "login" | "register";
}) {
  return (
    <div className="w-full max-w-md rounded-card border border-white/40 bg-white/85 p-6 shadow-xl backdrop-blur-md transition">
      <div className="mb-5 text-center">
        <h1 className="text-2xl font-bold text-primary-dark">{SITE_NAME}</h1>
        <p className="mt-1 text-sm text-ink/70">Masuk untuk melanjutkan</p>
      </div>

      {errorMessage && (
        <div className="mb-4">
          <ErrorBanner>{errorMessage}</ErrorBanner>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-primary">Login 1-klik</p>
        <GithubLoginButton next={next} />
      </div>

      <div className="my-5 flex items-center gap-3" role="separator" aria-label="atau">
        <span className="h-px flex-1 bg-primary/20" />
        <span className="text-xs text-ink/60">Atau pilih metode login</span>
        <span className="h-px flex-1 bg-primary/20" />
      </div>

      <LoginMethods next={next} />

      <p className="mt-5 text-center text-xs text-ink/60">
        Wali tanpa email? Masuk dengan NIS anak kamu.
      </p>
    </div>
  );
}