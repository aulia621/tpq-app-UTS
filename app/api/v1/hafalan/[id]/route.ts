import { apiError, apiPreflight, apiSuccess, internalError, readJsonBody, validationError } from "@/lib/api/response";
import { authenticateRequest } from "@/lib/api/auth";
import { apiUpdateHafalanSchema, idSchema } from "@/lib/schemas";

const SELECT = "id, tanggal, jenis, materi, nilai, status, catatan, guru_id, santri_id, santri(nama)";
type Ctx = { params: Promise<{ id: string }> };

const notFound = (request: Request) =>
  apiError(request, { status: 404, code: "NOT_FOUND", detail: "Data tidak ditemukan." });

export function OPTIONS(request: Request) {
  return apiPreflight(request);
}

export async function GET(request: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    if (!idSchema.safeParse(id).success) {
      return apiError(request, { status: 400, code: "BAD_REQUEST", detail: "ID harus berupa UUID." });
    }
    const auth = await authenticateRequest(request);
    if (!auth.ok) return auth.response;

    const { data, error } = await auth.supabase.from("hafalan").select(SELECT).eq("id", id).maybeSingle();
    if (error) return internalError(request, "get", error);
    if (!data) return notFound(request);
    return apiSuccess(request, data);
  } catch (err) {
    return internalError(request, "GET /hafalan/:id", err);
  }
}

export async function PUT(request: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    if (!idSchema.safeParse(id).success) {
      return apiError(request, { status: 400, code: "BAD_REQUEST", detail: "ID harus berupa UUID." });
    }
    const auth = await authenticateRequest(request);
    if (!auth.ok) return auth.response;
    if (auth.role !== "guru" && auth.role !== "admin") {
      return apiError(request, { status: 403, code: "FORBIDDEN", detail: "Hanya guru atau admin yang boleh mengubah hafalan." });
    }

    const body = await readJsonBody(request);
    if (!body.ok) return body.response;
    const parsed = apiUpdateHafalanSchema.safeParse(body.body);
    if (!parsed.success) return validationError(request, parsed.error);

    const { data, error } = await auth.supabase
      .from("hafalan")
      .update(parsed.data)
      .eq("id", id)
      .eq("guru_id", auth.user.id)
      .select(SELECT);
    if (error) return internalError(request, "update", error);
    // RLS/filter menolak tanpa error: nol baris berarti tidak ada atau bukan milik pengguna
    if (!data || data.length === 0) return notFound(request);
    return apiSuccess(request, data[0]);
  } catch (err) {
    return internalError(request, "PUT /hafalan/:id", err);
  }
}

export async function DELETE(request: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    if (!idSchema.safeParse(id).success) {
      return apiError(request, { status: 400, code: "BAD_REQUEST", detail: "ID harus berupa UUID." });
    }
    const auth = await authenticateRequest(request);
    if (!auth.ok) return auth.response;
    if (auth.role !== "guru" && auth.role !== "admin") {
      return apiError(request, { status: 403, code: "FORBIDDEN", detail: "Hanya guru atau admin yang boleh menghapus hafalan." });
    }

    let q = auth.supabase.from("hafalan").delete().eq("id", id);
    if (auth.role === "guru") q = q.eq("guru_id", auth.user.id);
    const { data, error } = await q.select("id");
    if (error) return internalError(request, "delete", error);
    if (!data || data.length === 0) return notFound(request);
    return apiSuccess(request, { id, deleted: true });
  } catch (err) {
    return internalError(request, "DELETE /hafalan/:id", err);
  }
}
