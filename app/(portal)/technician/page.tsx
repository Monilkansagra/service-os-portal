export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import TechnicianDashboardClient from "./client";
import { headers } from "next/headers";

export default async function TechnicianPage() {
  const headersList = await headers();
  const loggedInTechId = Number(headersList.get("x-user-id")) || 4;

  let tasks: any[] = [];
  try {
    const raw = await db.service_request.findMany({
      where: { assigned_to_user_id: loggedInTechId },
      include: {
        service_request_status: true,
        service_request_type: true,
        users_service_request_created_by_user_idTousers: true
      },
      orderBy: { request_datetime: 'desc' }
    });

    tasks = raw.map(t => ({
      id: t.request_no || `REQ-${t.request_id}`,
      realId: t.request_id,
      status_id: t.status_id,
      status: t.service_request_status?.status_name || 'Assigned',
      type: t.service_request_type?.request_type_name || 'Service',
      desc: t.request_description,
      user: t.users_service_request_created_by_user_idTousers?.full_name || 'User',
      date: t.request_datetime?.toLocaleDateString() || 'N/A'
    }));
  } catch (e) {
    console.error("Tech fetch error:", e);
  }

  return (
    <TechnicianDashboardClient
      initialTasks={tasks}
      currentUserId={loggedInTechId}
    />
  );
}