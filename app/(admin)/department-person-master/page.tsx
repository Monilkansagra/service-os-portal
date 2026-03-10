export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import DepartmentPersonClient from "./client";

export default async function DepartmentPersonMasterPage() {
  try {
    // 1. Fetch data in parallel directly from DB
    const [users, roles, departments] = await Promise.all([
      db.users.findMany({
        include: {
          roles: true,
          service_department_person: {
            include: {
              service_department: true
            }
          }
        },
        orderBy: { full_name: 'asc' }
      }),
      db.roles.findMany({ orderBy: { role_name: 'asc' } }),
      db.service_department.findMany({ orderBy: { dept_name: 'asc' } })
    ]);

    // 2. Format data for the client component
    const formattedStaff = users.map((u: any) => ({
      id: u.user_id,
      name: u.full_name,
      email: u.email,
      roleId: u.role_id,
      roleName: u.roles?.role_name || 'Staff',
      deptId: u.service_department_person?.[0]?.dept_id || 0,
      deptName: u.service_department_person?.[0]?.service_department?.dept_name || 'Unassigned'
    }));

    return <DepartmentPersonClient initialStaff={formattedStaff} roles={roles} departments={departments} />;
  } catch (error) {
    console.error("PERSONNEL_PAGE_ERROR:", error);
    return <div className="p-10 text-red-500 font-bold">Error loading data. Please check database connection.</div>;
  }
}
