export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import ReportsClient from "./client";

export default async function ReportsPage() {
  const allRequests = await db.service_request.findMany({
    include: {
      service_request_type: {
        include: {
          service_department: true
        }
      },
      service_request_status: true,
      users_service_request_created_by_user_idTousers: true,
      users_service_request_assigned_to_user_idTousers: true
    },
    orderBy: {
      request_datetime: 'desc'
    }
  });

  const formattedRequests = allRequests.map(req => ({
    request_no: req.request_no,
    request_title: req.request_title,
    request_datetime: req.request_datetime ? req.request_datetime.toISOString() : null,
    assigned_datetime: req.assigned_datetime ? req.assigned_datetime.toISOString() : null,
    dept_name: req.service_request_type?.service_department?.dept_name || 'Unknown',
    status: req.service_request_status?.status_name || 'Unknown',
    priority: req.priority_level || 'Normal',
    created_by: req.users_service_request_created_by_user_idTousers?.full_name || 'System',
    assigned_to: req.users_service_request_assigned_to_user_idTousers?.full_name || 'Unassigned'
  }));

  const departments = await db.service_department.findMany({
    select: { dept_name: true }
  });
  
  const statuses = await db.service_request_status.findMany({
    select: { status_name: true }
  });

  return <ReportsClient requests={formattedRequests} departments={departments.map(d => d.dept_name)} statuses={statuses.map(s => s.status_name)} />;
}
