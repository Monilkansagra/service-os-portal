"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. CREATE ASSIGNMENT
export async function createAssignment(formData: FormData) {
  try {
    const request_type_id = Number(formData.get("request_type_id"));
    const user_id = Number(formData.get("user_id"));

    if (!request_type_id || !user_id) {
      return { success: false, message: "Please select both Request Type and Technician" };
    }

    // Check if mapping already exists to prevent duplicates
    const existing = await db.service_request_type_person.findFirst({
      where: {
        request_type_id: request_type_id,
        user_id: user_id
      }
    });

    if (existing) {
      return { success: false, message: "This technician is already assigned to this request type." };
    }

    // Create the link
    await db.service_request_type_person.create({
      data: {
        request_type_id,
        user_id
      }
    });

    revalidatePath("/auto-assignment");
    return { success: true, message: "Assignment Created Successfully" };
  } catch (error: any) {
    console.error("Assignment Error:", error);
    return { success: false, message: "Database Error: " + error.message };
  }
}

// 2. DELETE ASSIGNMENT
export async function deleteAssignment(id: number) {
  try {
    await db.service_request_type_person.delete({
      where: { id: Number(id) },
    });
    revalidatePath("/auto-assignment");
    return { success: true, message: "Assignment Removed" };
  } catch (error: any) {
    return { success: false, message: "Delete failed: " + error.message };
  }
}