import { db } from "@/lib/db";
import DepartmentPersonClient from "./client";

export default async function DepartmentPersonMasterPage() {
  
  // 1. Fetch Users with Role and Department Info
  const staffRaw = await db.users.findMany({
    where: { is_active: true },
    include: {
      roles: true,
      service_department_person: {
        include: {
          service_department: true
        }
      }
    },
    orderBy: { user_id: 'desc' }
  });

  // 2. Fetch Dropdown Options
  const roles = await db.roles.findMany({
    orderBy: { role_name: 'asc' }
  });
  
  const departments = await db.service_department.findMany({
    orderBy: { dept_name: 'asc' }
  });

  // 3. Format Data for Client
  const formattedStaff = staffRaw.map(u => {
    // Get the first assigned department, if any
    const assignedDept = u.service_department_person[0]?.service_department;

    return {
      id: u.user_id,
      name: u.full_name,
      email: u.email,
      phone: u.phone_number || '',
      roleId: u.role_id,
      roleName: u.roles?.role_name || 'Staff',
      deptId: assignedDept?.service_department_id || 0,
      deptName: assignedDept?.dept_name || 'Unassigned'
    };
  });

  return (
    <DepartmentPersonClient 
      initialStaff={formattedStaff} 
      roles={roles} 
      departments={departments} 
    />
  );
}