export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import PortalRequestListClient from "./client";
import { headers } from "next/headers";

export default async function RequestDetailsPage() {
  const headersList = await headers();
  const currentUserId = Number(headersList.get("x-user-id")) || 1;

  let requests: any[] = [];
  try {
    const raw = await db.service_request.findMany({
      where: { created_by_user_id: currentUserId },
      include: {
        service_request_status: true,
        service_request_type: { include: { service_department: true } }
      },
      orderBy: { request_datetime: 'desc' }
    });

    requests = raw.map(r => ({
      id: r.request_no || `REQ-${r.request_id}`,
      realId: r.request_id,
      title: r.request_title,
      dept: r.service_request_type?.service_department?.dept_name || 'General',
      type: r.service_request_type?.request_type_name || 'Service',
      status: r.service_request_status?.status_name || 'Pending',
      date: r.request_datetime?.toLocaleDateString() || 'N/A'
    }));
  } catch (e) {
    console.error("Fetch error:", e);
  }

  return (
    <PortalRequestListClient
      initialRequests={requests}
      userId={currentUserId}
    />
  );
}