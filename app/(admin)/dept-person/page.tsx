import { db } from "@/lib/db";
import DeptPersonClient from "./client";

export default async function DeptPersonPage() {
  
  // 1. Fetch mappings with Correct Primary Key in Sort
  const mappings = await db.service_department_person.findMany({
    include: {
      users: {
        include: { roles: true } // Fetched roles to show in dropdown/table
      },
      service_department: true
    },
    orderBy: { 
      dept_person_id: 'desc' // FIX: Changed 'id' to 'dept_person_id' 
    }
  });

  // 2. Fetch Departments
  const departments = await db.service_department.findMany({
    select: { dept_id: true, dept_name: true }
  });

  // 3. Fetch Users
  const users = await db.users.findMany({
    select: { 
        user_id: true, 
        full_name: true, 
        roles: { select: { role_name: true } } 
    }
  });

  return (
    // @ts-ignore
    <DeptPersonClient 
      initialData={mappings} 
      departments={departments} 
      users={users} 
    />
  );
}