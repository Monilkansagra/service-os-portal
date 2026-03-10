"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- HELPER: Get Status ID ---
// This safely finds the ID for "Assigned", "Approved", etc.
async function getStatusId(name: string) {
  const status = await db.service_request_status.findFirst({
    where: { status_name: { contains: name } } 
  });
  return status?.status_id;
}

// 1. Assign a Technician
export async function assignRequest(requestId: number, technicianId: number) {
  console.log(`➡️ ACTION START: Assigning Request #${requestId} to Tech #${technicianId}`);
  
  try {
    // Find correct status ID for 'Assigned' (Fallback to 2 if missing)
    const statusId = await getStatusId("Assigned") || 2;
    console.log(`   - Status 'Assigned' mapped to ID: ${statusId}`);

    // Perform Update
    await db.service_request.update({
      where: { request_id: requestId },
      data: {
        assigned_to_user_id: technicianId,
        status_id: statusId,
        assigned_datetime: new Date(),
        modified: new Date()
      }
    });

    console.log("✅ SUCCESS: Technician assigned.");
    revalidatePath("/hod-dashboard");
    return { success: true, message: "Technician assigned successfully" };

  } catch (error: any) {
    console.error("❌ ERROR in assignRequest:", error);
    return { success: false, message: error.message || "Database assignment failed" };
  }
}

// 2. Approve a Request
export async function approveRequest(requestId: number, userId: number) {
  console.log(`➡️ ACTION START: Approving Request #${requestId} by User #${userId}`);

  try {
    // Find correct status ID for 'Approved' (Fallback to 3 if missing)
    const statusId = await getStatusId("Approved") || 3; 
    console.log(`   - Status 'Approved' mapped to ID: ${statusId}`);

    // Perform Update
    await db.service_request.update({
      where: { request_id: requestId },
      data: {
        status_id: statusId,
        approval_status_datetime: new Date(),
        approval_status_by_user_id: userId,
        // Note: We use 'approval_status_description' if it exists in your DB. 
        // If this line causes an error, remove it.
        approval_status_description: "Approved by HOD", 
        modified: new Date()
      }
    });

    console.log("✅ SUCCESS: Request Approved.");
    revalidatePath("/hod-dashboard");
    return { success: true, message: "Request approved successfully" };

  } catch (error: any) {
    console.error("❌ ERROR in approveRequest:", error);
    return { success: false, message: error.message || "Database approval failed" };
  }
}