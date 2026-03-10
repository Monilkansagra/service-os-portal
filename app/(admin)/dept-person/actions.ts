"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Creates a new mapping between a user and a department.
 */
export async function createMapping(formData: any) {
  try {
    await db.service_department_person.create({
      data: {
        dept_id: Number(formData.dept_id),
        user_id: Number(formData.user_id),
        is_hod: !!formData.is_hod,
        active_from: formData.active_from ? new Date(formData.active_from) : new Date(),
        active_to: formData.active_to ? new Date(formData.active_to) : null,
      },
    });
    revalidatePath("/dept-person");
    return { success: true, message: "Mapping Created" };
  } catch (error: any) {
    console.error("CREATE_MAPPING_ERROR:", error);
    return { success: false, message: error.message || "Failed to create mapping" };
  }
}

/**
 * Updates an existing mapping.
 */
export async function updateMapping(dept_person_id: number, formData: any) {
  try {
    await db.service_department_person.update({
      where: { dept_person_id: Number(dept_person_id) },
      data: {
        dept_id: Number(formData.dept_id),
        user_id: Number(formData.user_id),
        is_hod: !!formData.is_hod,
        active_from: formData.active_from ? new Date(formData.active_from) : new Date(),
        active_to: formData.active_to ? new Date(formData.active_to) : null,
      },
    });
    revalidatePath("/dept-person");
    return { success: true, message: "Mapping Updated" };
  } catch (error: any) {
    console.error("UPDATE_MAPPING_ERROR:", error);
    return { success: false, message: error.message || "Failed to update mapping" };
  }
}

/**
 * Deletes a mapping.
 */
export async function deleteMapping(dept_person_id: number) {
  try {
    await db.service_department_person.delete({
      where: { dept_person_id: Number(dept_person_id) },
    });
    revalidatePath("/dept-person");
    return { success: true, message: "Mapping Deleted" };
  } catch (error: any) {
    console.error("DELETE_MAPPING_ERROR:", error);
    return { success: false, message: "Failed to delete mapping" };
  }
}
