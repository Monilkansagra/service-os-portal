export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import RequestDetailClient from "./RequestDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RequestDetailPage({ params }: PageProps) {
  const { id } = await params;
  const requestId = Number(id);

  if (!requestId || isNaN(requestId)) {
    notFound();
  }

  const headersList = await headers();
  const userId = Number(headersList.get("x-user-id")) || 1;

  const request = await db.service_request.findUnique({
    where: { request_id: requestId },
    include: {
      service_request_status: true,
      service_request_reply: {
        include: { users: { select: { full_name: true } } },
        orderBy: { created: "asc" },
      },
    },
  });

  if (!request || request.created_by_user_id !== userId) {
    notFound();
  }

  const serialized = {
    request_id: request.request_id,
    request_no: request.request_no,
    request_title: request.request_title,
    request_description: request.request_description,
    status_id: request.status_id,
    service_request_status: request.service_request_status,
    service_request_reply: request.service_request_reply.map((r) => ({
      reply_text: r.reply_text,
      created: r.created?.toISOString?.() || "",
      replied_by_user_id: r.replied_by_user_id,
      users: r.users,
    })),
  };

  return (
    <RequestDetailClient
      request={serialized}
      requestId={id}
      userId={userId}
    />
  );
}
