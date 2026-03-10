export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import DepartmentClient from "./client";

export default async function DepartmentPage() {
  // Fetch directly from database (Server Component)
  const departments = await db.service_department.findMany({
    orderBy: { modified: 'desc' }
  });

  return <DepartmentClient initialData={departments} />;
}
