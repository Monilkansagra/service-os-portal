export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import RequestorDashboardClient from "./client";
import { headers } from "next/headers";

export default async function RequestorPage() {
  const headersList = await headers();
  const currentUserId = Number(headersList.get("x-user-id")) || 1;

  let requests: any[] = [];
  try {
    const raw = await db.service_request.findMany({
      where: { created_by_user_id: currentUserId },
      include: {
        service_request_status: true,
        service_request_type: true,
        service_request_reply: true
      },
      orderBy: { request_datetime: 'desc' }
    });

    requests = raw.map(r => ({
      id: r.request_no || `REQ-${r.request_id}`,
      realId: r.request_id,
      title: r.request_title,
      date: r.request_datetime?.toLocaleDateString() || 'N/A',
      status: r.service_request_status?.status_name || 'Unknown',
      status_id: r.status_id,
      priority: r.priority_level,
      type: r.service_request_type?.request_type_name || 'General',
      replies: r.service_request_reply.map(rep => ({
        from: rep.replied_by_user_id === currentUserId ? 'You' : 'Technician',
        msg: rep.reply_text,
        time: rep.created?.toLocaleTimeString() || ''
      }))
    }));
  } catch (e) {
    console.error("Portal fetch error:", e);
  }

  return (
    <RequestorDashboardClient
      initialRequests={requests}
      userId={currentUserId}
    />
  );
}