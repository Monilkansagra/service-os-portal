import { db } from "@/lib/db";
import AutoAssignmentClient from "./client";

export default async function AutoAssignmentPage() {
  
  // 1. Fetch Existing Mappings (Joined with User, Type, and Department)
  const assignmentsRaw = await db.service_request_type_person.findMany({
    include: {
      users: true, // To get Technician Name
      service_request_type: {
        include: {
          service_department: true // To get Department Name
        }
      }
    },
    orderBy: { id: 'desc' }
  });

  // 2. Fetch Options for Dropdowns
  const requestTypes = await db.service_request_type.findMany({
    select: { request_type_id: true, request_type_name: true }
  });

  const technicians = await db.users.findMany({
    where: { is_active: true }, // Only show active users
    select: { user_id: true, full_name: true, email: true }
  });

  // 3. Format Data for Client
  const formattedAssignments = assignmentsRaw.map(item => ({
    id: item.id,
    technician: item.users.full_name,
    email: item.users.email,
    requestType: item.service_request_type.request_type_name,
    dept: item.service_request_type.service_department?.dept_name || 'General',
    active: true // The table doesn't have an 'active' column, so existence implies active
  }));

  return (
    <AutoAssignmentClient 
      initialData={formattedAssignments} 
      requestTypes={requestTypes}
      technicians={technicians}
    />
  );
}