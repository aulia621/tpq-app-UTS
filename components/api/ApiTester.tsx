"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/SubmitButton";
import { buttonClass } from "@/components/ui/buttonStyles";

type Method = "GET" | "POST" | "PUT" | "DELETE";
const METHODS: Method[] = ["GET", "POST", "PUT", "DELETE"];

const SAMPLE_BODY = JSON.stringify(
  { santri_id: "UUID-SANTRI", jenis: "iqro", materi: "Iqro 2 halaman 5", nilai: 85, status: "lulus" },
  null,
  2,
);

const PRESETS: { label: string; method: Method; path: string; body: string }[] = [
  { label: "Daftar hafalan", method: "GET", path: "/api/v1/hafalan?limit=5", body: "" },
  { label: "Buat hafalan contoh", method: "POST", path: "/api/v1/hafalan", body: SAMPLE_BODY },
  { label: "Ubah hafalan", method: "PUT", path: "/api/v1/hafalan/UUID-HAFALAN", body: JSON.stringify({ nilai: 90 }, null, 2) },
  { label: "Hapus hafalan", method: "DELETE", path: "/api/v1/hafalan/UUID-HAFALAN", body: "" },
];

type Result = { status: number; ms: number; contentType: string; text: string } | { error: string };

function validatePath(path: string): URL | null {
  try {
    const url = new URL(path, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    if (!url.pathname.startsWith("/api/v1/")) return null;
    if (url.pathname.split("/").includes("..")) return null;
    return url;
  } catch {
    return null;
  }
}

function tokenize(json: string): React.ReactNode[] {
  const re = /("(?:\\.|[^"\\])*"(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of json.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(json.slice(last, idx));
    const tok = m[0];
    let cls = "text-amber-700";
    if (tok.startsWith('"')) cls = m[2] ? "text-primary-dark font-semibold" : "text-emerald-700";
    else if (/true|false|null/.test(tok)) cls = "text-purple-700";
    out.push(
      <span key={i++} className={cls}>
        {tok}
      </span>,
    );
    last = idx + tok.length;
  }
  if (last < json.length) out.push(json.slice(last));
  return out;
}

function statusTone(status: number): string {
  if (status >= 200 && status < 300) return "bg-success/15 text-success";
  if (status >= 400 && status < 500) return "bg-warning/15 text-warning";
  return "bg-danger/15 text-danger";
}

export function ApiTester() {
  const [method, setMethod] = useState<Method>("GET");
  const [path, setPath] = useState("/api/v1/hafalan?limit=5");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [tokenMsg, setTokenMsg] = useState("");

  async function useMyToken() {
    const supabase = createClient();
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setToken(data.session.access_token);
      setTokenMsg("Token sesi dimuat. Berlaku sekitar satu jam.");
    } else {
      setTokenMsg("Tidak ada sesi aktif. Silakan login ulang.");
    }
  }

  async function send() {
    setResult(null);
    const url = validatePath(path);
    if (!url) {
      setResult({ error: "Path harus diawali /api/v1/ pada situs ini. URL luar tidak diizinkan." });
      return;
    }
    const hasBody = method === "POST" || method === "PUT";
    if (hasBody) {
      try {
        JSON.parse(body);
      } catch {
        setResult({ error: "Request body bukan JSON yang valid." });
        return;
      }
    }
    setLoading(true);
    const started = performance.now();
    try {
      const headers: Record<string, string> = {};
      if (token.trim()) headers.Authorization = `Bearer ${token.trim()}`;
      if (hasBody) headers["Content-Type"] = "application/json";
      const res = await fetch(url.pathname + url.search, {
        method,
        headers,
        body: hasBody ? body : undefined,
        credentials: "omit",
      });
      const text = await res.text();
      setResult({
        status: res.status,
        ms: Math.round(performance.now() - started),
        contentType: res.headers.get("content-type") ?? "-",
        text,
      });
    } catch {
      setResult({ error: "Permintaan gagal dikirim. Periksa koneksi." });
    } finally {
      setLoading(false);
    }
  }

  let pretty: React.ReactNode = null;
  if (result && "text" in result) {
    try {
      pretty = tokenize(JSON.stringify(JSON.parse(result.text), null, 2));
    } catch {
      pretty = result.text;
    }
  }

  const input = "min-h-11 w-full rounded-xl border border-primary/25 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" aria-label="Contoh cepat" role="group">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            className={buttonClass("outline")}
            onClick={() => {
              setMethod(p.method);
              setPath(p.path);
              setBody(p.body);
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div role="group" aria-label="Method HTTP" className="inline-flex gap-1 rounded-full border border-primary/15 bg-white p-1">
        {METHODS.map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={method === m}
            onClick={() => setMethod(m)}
            className={`min-h-11 rounded-full px-4 text-sm font-bold ${method === m ? "bg-primary text-white" : "text-primary-dark hover:bg-primary/10"}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div>
        <label htmlFor="api-path" className="mb-1 block text-sm font-semibold text-primary-dark">
          Endpoint
        </label>
        <input id="api-path" value={path} onChange={(e) => setPath(e.target.value)} className={input} spellCheck={false} />
      </div>

      <div>
        <label htmlFor="api-token" className="mb-1 block text-sm font-semibold text-primary-dark">
          Bearer token
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            id="api-token"
            type={showToken ? "text" : "password"}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            className={`${input} flex-1`}
          />
          <button type="button" className={buttonClass("outline")} onClick={() => setShowToken((s) => !s)}>
            {showToken ? "Sembunyikan" : "Tampilkan"}
          </button>
          <button type="button" className={buttonClass("gold")} onClick={useMyToken}>
            Gunakan Token Sesi Saya
          </button>
        </div>
        {tokenMsg && (
          <p role="status" className="mt-1 text-xs text-ink/70">
            {tokenMsg}
          </p>
        )}
        <p className="mt-1 text-xs text-ink/60">Token hanya disimpan di memori halaman ini dan hilang saat halaman dimuat ulang.</p>
      </div>

      {(method === "POST" || method === "PUT") && (
        <div>
          <label htmlFor="api-body" className="mb-1 block text-sm font-semibold text-primary-dark">
            Request body (JSON)
          </label>
          <textarea
            id="api-body"
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            spellCheck={false}
            className="w-full rounded-xl border border-primary/25 bg-white p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      )}

      <button type="button" onClick={send} disabled={loading} className={buttonClass("primary")}>
        {loading && <Spinner />}
        {loading ? "Mengirim..." : "Kirim Request"}
      </button>

      {result && (
        <section aria-label="Respons" className="space-y-2 rounded-card border border-primary/10 bg-white p-4">
          {"error" in result ? (
            <p role="alert" className="text-sm font-medium text-danger">
              {result.error}
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className={`rounded-full px-3 py-1 font-bold ${statusTone(result.status)}`}>HTTP {result.status}</span>
                <span className="text-ink/70">{result.ms} ms</span>
                <span className="break-all text-xs text-ink/60">{result.contentType}</span>
              </div>
              <pre className="max-h-96 overflow-auto rounded-xl bg-cream p-3 text-xs leading-relaxed whitespace-pre-wrap break-words">
                <code>{pretty}</code>
              </pre>
            </>
          )}
        </section>
      )}
    </div>
  );
}
