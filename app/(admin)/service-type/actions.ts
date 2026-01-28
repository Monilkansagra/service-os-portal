"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. CREATE
export async function createServiceType(formData: any) {
  try {
    if (!formData.service_type_name) throw new Error("Service Name is required");

    await db.service_type.create({
      data: {
        service_type_name: formData.service_type_name,
        description: formData.description || null,
        is_for_staff: formData.is_for_staff,
        is_for_student: formData.is_for_student,
        
        // MANDATORY FIELDS (Based on your schema)
        user_id: 1, // Default System User ID (Change this if you have auth)
        created: new Date(),
        modified: new Date(),
        sequence: 0,
      },
    });

    revalidatePath("/service-type");
    return { success: true, message: "Created Successfully" };
  } catch (error: any) {
    console.error("Create Error:", error);
    return { success: false, message: error.message || "Database Error" };
  }
}

// 2. UPDATE
export async function updateServiceType(service_type_id: number, formData: any) {
  try {
    if (!formData.service_type_name) throw new Error("Service Name is required");

    await db.service_type.update({
      where: { service_type_id: Number(service_type_id) },
      data: {
        service_type_name: formData.service_type_name,
        description: formData.description || null,
        is_for_staff: formData.is_for_staff,
        is_for_student: formData.is_for_student,
        
        // Update Modified Date
        modified: new Date(),
      },
    });

    revalidatePath("/service-type");
    return { success: true, message: "Updated Successfully" };
  } catch (error: any) {
    console.error("Update Error:", error);
    return { success: false, message: error.message || "Database Error" };
  }
}

// 3. DELETE
export async function deleteServiceType(service_type_id: number) {
  try {
    await db.service_type.delete({
      where: { service_type_id: Number(service_type_id) },
    });
    revalidatePath("/service-type");
    return { success: true, message: "Deleted Successfully" };
  } catch (error: any) {
    if (error.code === 'P2003') {
      return { success: false, message: "Cannot delete: This Service Type is being used." };
    }
    return { success: false, message: "Delete failed: " + error.message };
  }
}