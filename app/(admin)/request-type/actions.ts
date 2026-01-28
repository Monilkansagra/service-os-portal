"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. CREATE
export async function createRequestType(formData: any) {
  try {
    await db.service_request_type.create({
      data: {
        request_type_name: formData.request_type_name,
        request_category: formData.request_category,
        priority: formData.priority,
        dept_id: Number(formData.dept_id), // Link to Department
      },
    });
    revalidatePath("/request-type"); // Ensure this matches your folder name
    return { success: true, message: "Request Type Created" };
  } catch (error) {
    console.error("Create Error:", error);
    return { success: false, message: "Failed to create request type" };
  }
}

// 2. UPDATE
export async function updateRequestType(request_type_id: number, formData: any) {
  try {
    await db.service_request_type.update({
      where: { request_type_id: request_type_id },
      data: {
        request_type_name: formData.request_type_name,
        request_category: formData.request_category,
        priority: formData.priority,
        dept_id: Number(formData.dept_id),
      },
    });
    revalidatePath("/request-type");
    return { success: true, message: "Request Type Updated" };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, message: "Failed to update" };
  }
}

// 3. DELETE
export async function deleteRequestType(request_type_id: number) {
  try {
    await db.service_request_type.delete({
      where: { request_type_id: request_type_id },
    });
    revalidatePath("/request-type");
    return { success: true, message: "Request Type Deleted" };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, message: "Failed to delete" };
  }
}