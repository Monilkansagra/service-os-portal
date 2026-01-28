"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. CREATE
export async function createMapping(formData: any) {
  try {
    await db.service_department_person.create({
      data: {
        dept_id: Number(formData.dept_id),
        user_id: Number(formData.user_id),
        is_hod: formData.is_hod,
        active_from: new Date(formData.active_from),
        active_to: formData.active_to ? new Date(formData.active_to) : null,
      },
    });
    revalidatePath("/dept-person-mapping"); // Make sure this path matches your folder name exactly
    return { success: true, message: "Mapping Created" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to create mapping" };
  }
}

// 2. UPDATE (Changed id -> dept_person_id)
export async function updateMapping(dept_person_id: number, formData: any) {
  try {
    await db.service_department_person.update({
      where: { dept_person_id: dept_person_id }, // FIX HERE
      data: {
        dept_id: Number(formData.dept_id),
        user_id: Number(formData.user_id),
        is_hod: formData.is_hod,
        active_from: new Date(formData.active_from),
        active_to: formData.active_to ? new Date(formData.active_to) : null,
      },
    });
    revalidatePath("/dept-person-mapping");
    return { success: true, message: "Mapping Updated" };
  } catch (error) {
    return { success: false, message: "Failed to update" };
  }
}

// 3. DELETE (Changed id -> dept_person_id)
export async function deleteMapping(dept_person_id: number) {
  try {
    await db.service_department_person.delete({
      where: { dept_person_id: dept_person_id }, // FIX HERE
    });
    revalidatePath("/dept-person-mapping");
    return { success: true, message: "Mapping Deleted" };
  } catch (error) {
    return { success: false, message: "Failed to delete" };
  }
}