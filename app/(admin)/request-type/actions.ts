"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. CREATE
export async function createRequestType(formData: any) {
  try {
    // Ensure we have a valid service_type_id. 
    // If not provided in formData, we'll try to find the first one or default to 1.
    let service_type_id = Number(formData.service_type_id);
    if (isNaN(service_type_id) || service_type_id === 0) {
      const firstServiceType = await db.service_type.findFirst();
      service_type_id = firstServiceType?.service_type_id || 1;
    }

    await db.service_request_type.create({
      data: {
        request_type_name: formData.request_type_name,
        description: formData.request_category, // Mapping UI category to DB description
        default_priority: formData.priority,
        dept_id: Number(formData.dept_id),
        service_type_id: service_type_id,
        user_id: 1, // Default System User
        created: new Date(),
        modified: new Date(),
      },
    });
    revalidatePath("/request-type");
    return { success: true, message: "Request Type Created" };
  } catch (error: any) {
    console.error("Create Error:", error);
    return { success: false, message: "Failed to create: " + (error.message || "Database Error") };
  }
}

// 2. UPDATE
export async function updateRequestType(request_type_id: number, formData: any) {
  try {
    let service_type_id = Number(formData.service_type_id);
    if (isNaN(service_type_id) || service_type_id === 0) {
      const existing = await db.service_request_type.findUnique({
        where: { request_type_id }
      });
      service_type_id = existing?.service_type_id || 1;
    }

    await db.service_request_type.update({
      where: { request_type_id: Number(request_type_id) },
      data: {
        request_type_name: formData.request_type_name,
        description: formData.request_category,
        default_priority: formData.priority,
        dept_id: Number(formData.dept_id),
        service_type_id: service_type_id,
        modified: new Date(),
      },
    });
    revalidatePath("/request-type");
    return { success: true, message: "Request Type Updated" };
  } catch (error: any) {
    console.error("Update Error:", error);
    return { success: false, message: "Failed to update: " + (error.message || "Database Error") };
  }
}

// 3. DELETE
export async function deleteRequestType(request_type_id: number) {
  try {
    await db.service_request_type.delete({
      where: { request_type_id: Number(request_type_id) },
    });
    revalidatePath("/request-type");
    return { success: true, message: "Request Type Deleted" };
  } catch (error: any) {
    console.error("Delete Error:", error);
    if (error.code === 'P2003') {
      return { success: false, message: "Cannot delete: This request type is already in use by service requests." };
    }
    return { success: false, message: "Failed to delete" };
  }
}