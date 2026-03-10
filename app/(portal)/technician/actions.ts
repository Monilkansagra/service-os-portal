"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- Helpers ---

// Helper to find Status ID by name (e.g. "Pending" -> 1)
async function getStatusId(name: string) {
  const status = await db.service_request_status.findFirst({
    where: { status_name: { contains: name } }
  });
  return status?.status_id;
}

// --- Actions ---

// 1. Fetch Tasks for the Technician
export async function getTechnicianTasks(technicianId: number) {
  try {
    const tasks = await db.service_request.findMany({
      where: {
        assigned_to_user_id: technicianId, // Only show tasks assigned to this tech
      },
      include: {
        service_request_type: true,
        service_request_status: true,
        users_service_request_created_by_user_idTousers: true
      },
      orderBy: { request_datetime: 'desc' }
    });

    // Map Database fields to your UI fields
    return tasks.map(t => ({
      id: `SR-${t.request_id}`, // Format: SR-101
      realId: t.request_id,     // Actual DB ID for updates
      type: t.service_request_type?.request_type_name || "General Request",
      priority: t.priority_level || "Medium",
      status: t.service_request_status?.status_name || "Pending",
      date: t.request_datetime?.toLocaleDateString() || "N/A",
      user: t.users_service_request_created_by_user_idTousers?.full_name || "Unknown User",
      desc: t.request_title || "No description provided",
    }));
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return [];
  }
}

// 2. Update Status (Pending -> In Progress -> Completed)
export async function updateTaskStatus(requestId: number, newStatusName: string) {
  try {
    const statusId = await getStatusId(newStatusName);

    if (!statusId) throw new Error(`Status ID for '${newStatusName}' not found`);

    await db.service_request.update({
      where: { request_id: requestId },
      data: {
        status_id: statusId,
        modified: new Date(),
        // Optional: If completing, set resolution time
        ...(newStatusName === "Completed" ? { service_request_status_datetime: new Date() } : {})
      }
    });

    revalidatePath("/(portal)/technician-dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Update failed:", error);
    return { success: false, message: error.message };
  }
}

// 3. Post Reply / Update
export async function postTaskReply(requestId: number, message: string) {
  try {
    // Ideally save to a 'logs' table here. 
    // For now, we just log to console and return success.
    console.log(`📝 Log for Req #${requestId}: ${message}`);

    // Example: 
    // await db.service_request_log.create({ data: { ... } })

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}