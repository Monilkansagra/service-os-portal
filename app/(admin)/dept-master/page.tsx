import { db } from "@/lib/db";
import DepartmentClient from "./client";

// This is a Server Component (fetches data securely)
export default async function DepartmentPage() {
  
  // 1. Fetch data from MySQL
  const departments = await db.service_department.findMany({
    orderBy: { dept_id: 'desc' } // Newest first
  });

  // 2. Pass data to the Client Component
  return <DepartmentClient initialData={departments} />;
}