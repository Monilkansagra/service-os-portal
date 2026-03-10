"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Creates or updates a department directly using Prisma.
 * Bypassing the local fetch ensures reliability across different environments.
 */
export async function upsertDepartment(id: number | null, data: any) {
  try {
    const departmentData = {
      dept_name: data.dept_name,
      campus_id: Number(data.campus_id),
      description: data.description,
      cc_email_to_csv: data.cc_email_to_csv,
      is_request_title_disable: data.is_request_title_disable ?? false,
      user_id: Number(data.user_id) || 1,
      modified: new Date(),
    };

    if (id) {
      // Update existing
      await db.service_department.update({
        where: { dept_id: Number(id) },
        data: departmentData,
      });
    } else {
      // Create new
      await db.service_department.create({
        data: {
          ...departmentData,
          created: new Date(),
        },
      });
    }

    revalidatePath("/dept-master");
    return { success: true };
  } catch (error) {
    console.error("UPSERT_DEPARTMENT_ERROR:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Deletes a department directly using Prisma.
 */
export async function deleteDepartment(id: number) {
  try {
    await db.service_department.delete({
      where: { dept_id: Number(id) },
    });

    revalidatePath("/dept-master");
    return { success: true };
  } catch (error) {
    console.error("DELETE_DEPARTMENT_ERROR:", error);
    return { success: false, error: error instanceof Error ? error.message : "Likely has linked records." };
  }
}
