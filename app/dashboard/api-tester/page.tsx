import type { Metadata } from "next";
import { ApiTester } from "@/components/api/ApiTester";
import { PageHeader } from "@/components/ui/Card";
import { requireRole } from "@/lib/auth/session";

export const metadata: Metadata = { title: "API Tester" };

export default async function ApiTesterPage() {
  await requireRole(["admin"]);
  return (
    <>
      <PageHeader
        title="REST API Tester"
        description="Uji endpoint /api/v1/hafalan seperti klien mobile. Gunakan tombol token untuk memakai sesimu."
      />
      <ApiTester />
    </>
  );
}
