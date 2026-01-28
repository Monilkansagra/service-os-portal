"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. READ (Fetch All)
// We don't export this because we use it in page.tsx directly, 
// but we keep actions here for mutations.

// 2. CREATE
export async function createDepartment(formData: any) {
  try {
    await db.service_department.create({
      data: {
        dept_name: formData.dept_name,
        campus_id: Number(formData.campus_id),
        description: formData.description,
        cc_email_to_csv: formData.cc_email_to_csv,
        is_request_title_disable: formData.is_request_title_disable,
        // Hardcoded System Fields (Since we don't have Auth yet)
        user_id: 1, 
        created: new Date(),
        modified: new Date(),
      },
    });
    revalidatePath("/dept-master"); // Refresh the UI
    return { success: true, message: "Department Created Successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to create department" };
  }
}

// 3. UPDATE
export async function updateDepartment(dept_id: number, formData: any) {
  try {
    await db.service_department.update({
      where: { dept_id: dept_id },
      data: {
        dept_name: formData.dept_name,
        campus_id: Number(formData.campus_id),
        description: formData.description,
        cc_email_to_csv: formData.cc_email_to_csv,
        is_request_title_disable: formData.is_request_title_disable,
        modified: new Date(), // Update modified time
      },
    });
    revalidatePath("/dept-master");
    return { success: true, message: "Department Updated" };
  } catch (error) {
    return { success: false, message: "Failed to update" };
  }
}

// 4. DELETE
export async function deleteDepartment(dept_id: number) {
  try {
    await db.service_department.delete({
      where: { dept_id: dept_id },
    });
    revalidatePath("/dept-master");
    return { success: true, message: "Department Deleted" };
  } catch (error) {
    return { success: false, message: "Failed to delete" };
  }
}