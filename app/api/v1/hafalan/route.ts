import { apiError, apiPreflight, apiSuccess, internalError, readJsonBody, validationError } from "@/lib/api/response";
import { authenticateRequest } from "@/lib/api/auth";
import { escapeLike } from "@/lib/query";
import { apiCreateHafalanSchema, apiListQuerySchema } from "@/lib/schemas";

const SELECT = "id, tanggal, jenis, materi, nilai, status, catatan, guru_id, santri_id, santri(nama)";

export function OPTIONS(request: Request) {
  return apiPreflight(request);
}

export async function GET(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.ok) return auth.response;

    const params: Record<string, string> = {};
    new URL(request.url).searchParams.forEach((v, k) => {
      if (v !== "") params[k] = v;
    });
    const parsed = apiListQuerySchema.safeParse(params);
    if (!parsed.success) return validationError(request, parsed.error);
    const { search, page, limit, status, santri_id } = parsed.data;

    let q = auth.supabase.from("hafalan").select(SELECT, { count: "exact" });
    if (search) q = q.ilike("materi", `%${escapeLike(search)}%`);
    if (status) q = q.eq("status", status);
    if (santri_id) q = q.eq("santri_id", santri_id);
    const from = (page - 1) * limit;
    const { data, count, error } = await q
      .order("tanggal", { ascending: false })
      .order("created_at", { ascending: false })
      .order("id")
      .range(from, from + limit - 1);
    if (error) return internalError(request, "list", error);

    const total = count ?? 0;
    return apiSuccess(request, data ?? [], { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) });
  } catch (err) {
    return internalError(request, "GET /hafalan", err);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await authenticateRequest(request);
    if (!auth.ok) return auth.response;
    if (auth.role !== "guru" && auth.role !== "admin") {
      return apiError(request, { status: 403, code: "FORBIDDEN", detail: "Hanya guru atau admin yang boleh mencatat hafalan." });
    }

    const body = await readJsonBody(request);
    if (!body.ok) return body.response;
    const parsed = apiCreateHafalanSchema.safeParse(body.body);
    if (!parsed.success) return validationError(request, parsed.error);

    const { data: santri } = await auth.supabase
      .from("santri")
      .select("id")
      .eq("id", parsed.data.santri_id)
      .eq("aktif", true)
      .maybeSingle();
    if (!santri) {
      return apiError(request, {
        status: 422,
        code: "VALIDATION_ERROR",
        detail: "Data yang dikirim tidak valid.",
        errors: { santri_id: ["Santri tidak ditemukan atau nonaktif"] },
      });
    }

    // guru_id SELALU dari token
    const { data, error } = await auth.supabase
      .from("hafalan")
      .insert({
        santri_id: parsed.data.santri_id,
        jenis: parsed.data.jenis,
        materi: parsed.data.materi,
        nilai: parsed.data.nilai,
        status: parsed.data.status,
        catatan: parsed.data.catatan ?? null,
        ...(parsed.data.tanggal ? { tanggal: parsed.data.tanggal } : {}),
        guru_id: auth.user.id,
      })
      .select(SELECT)
      .single();
    if (error || !data) return internalError(request, "insert", error);

    return apiSuccess(request, data, undefined, 201, { Location: `/api/v1/hafalan/${(data as { id: string }).id}` });
  } catch (err) {
    return internalError(request, "POST /hafalan", err);
  }
}
