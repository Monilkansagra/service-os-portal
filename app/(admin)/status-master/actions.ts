"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. CREATE STATUS
export async function createStatus(formData: any) {
  try {
    const sequence = Number(formData.sequence);

    // Check if Status Name already exists (Unique Constraint)
    const existing = await db.service_request_status.findUnique({
      where: { status_name: formData.name }
    });
    if (existing) throw new Error("Status Name already exists.");

    await db.service_request_status.create({
      data: {
        status_name: formData.name,
        status_system_name: formData.status_system_name,
        sequence: isNaN(sequence) ? 0 : sequence,
        description: formData.description || null,
        status_css_class: formData.color, // Storing Tailwind class here
        is_open: formData.is_open,
        
        // Default System Fields
        user_id: 1, // Default System User
        created: new Date(),
        modified: new Date(),
        
        // Optional Booleans (Defaults)
        is_allowed_for_technician: true,
        is_no_further_action_required: false
      }
    });

    revalidatePath("/status");
    return { success: true, message: "Status Created Successfully" };
  } catch (error: any) {
    console.error("Create Status Error:", error);
    return { success: false, message: error.message || "Database Error" };
  }
}

// 2. UPDATE STATUS
export async function updateStatus(status_id: number, formData: any) {
  try {
    const sequence = Number(formData.sequence);

    await db.service_request_status.update({
      where: { status_id: Number(status_id) },
      data: {
        status_name: formData.name,
        status_system_name: formData.status_system_name,
        sequence: isNaN(sequence) ? 0 : sequence,
        description: formData.description || null,
        status_css_class: formData.color,
        is_open: formData.is_open,
        modified: new Date(),
      }
    });

    revalidatePath("/status");
    return { success: true, message: "Status Updated Successfully" };
  } catch (error: any) {
    console.error("Update Status Error:", error);
    return { success: false, message: error.message };
  }
}

// 3. DELETE STATUS
export async function deleteStatus(status_id: number) {
  try {
    await db.service_request_status.delete({
      where: { status_id: Number(status_id) },
    });
    revalidatePath("/status");
    return { success: true, message: "Status Deleted Successfully" };
  } catch (error: any) {
    if (error.code === 'P2003') {
      return { success: false, message: "Cannot delete: This status is assigned to requests." };
    }
    return { success: false, message: "Delete failed: " + error.message };
  }
}