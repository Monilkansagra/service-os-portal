"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- Helpers ---

async function getTypeId(name: string) {
  // FIX: Using snake_case 'service_request_type' to match your DB
  const type = await db.service_request_type.findFirst({
    where: { request_type_name: { contains: name } }
  });
  return type?.request_type_id;
}

async function getStatusId(name: string) {
  // FIX: Using snake_case 'service_request_status' to match your DB
  const status = await db.service_request_status.findFirst({
    where: { status_name: { contains: name } }
  });
  return status?.status_id;
}

// --- Actions ---

export async function getUserRequests(userId: number) {
  try {
    // FIX: Using snake_case 'service_request'
    const requests = await db.service_request.findMany({
      where: { created_by_user_id: userId },
      include: {
        // Ensure these match your schema relations. usually they match the table name.
        service_request_type: true,
        service_request_status: true,
      },
      orderBy: { request_datetime: 'desc' }
    });

    return requests.map((r: any) => ({
      id: `REQ-${r.request_id}`,
      realId: r.request_id,
      title: r.request_title,
      // Handle potential nulls safely with '?.'
      type: r.service_request_type?.request_type_name || "General",
      status: r.service_request_status?.status_name || "Pending",
      priority: r.priority_level || "Medium",
      date: new Date(r.request_datetime).toLocaleDateString(),
      replies: []
    }));
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

export async function submitRequest(userId: number, formData: any) {
  try {
    const typeId = await getTypeId(formData.category) || 1;
    const statusId = await getStatusId("New") || 1;

    // FIX: Using snake_case 'service_request'
    await db.service_request.create({
      data: {
        request_no: "REQ-" + Math.floor(Math.random() * 1000000),
        request_title: formData.title,
        request_description: formData.description,
        priority_level: formData.priority,
        request_type_id: typeId,
        status_id: statusId,
        created_by_user_id: userId,
        user_id: userId,
        request_datetime: new Date(),
        created: new Date(),
        modified: new Date()
      }
    });

    revalidatePath("/(portal)/requestor-dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Create Error:", error);
    return { success: false, message: error.message };
  }
}

export async function postUserReply(requestId: number, message: string) {
  try {
    console.log(`💬 User Reply on #${requestId}: ${message}`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}