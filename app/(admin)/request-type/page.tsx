import { db } from "@/lib/db";
import RequestTypeClient from "./client";

export default async function RequestTypePage() {
  
  // 1. Fetch Request Types with Department Name (Join)
  const requestTypes = await db.service_request_type.findMany({
    include: {
      service_department: true // Join to get dept_name
    },
    orderBy: {
      request_type_id: 'desc' // Use correct primary key
    }
  });

  // 2. Fetch Departments for the Dropdown
  const departments = await db.service_department.findMany({
    select: { dept_id: true, dept_name: true },
    orderBy: { dept_name: 'asc' }
  });

  // 3. Pass to Client
  return (
    <RequestTypeClient 
      initialData={requestTypes} 
      departments={departments} 
    />
  );
}