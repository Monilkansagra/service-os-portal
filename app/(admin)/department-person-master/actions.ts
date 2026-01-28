"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. CREATE OR UPDATE STAFF
export async function upsertStaff(formData: FormData) {
  try {
    const id = formData.get("id") ? Number(formData.get("id")) : null;
    const full_name = formData.get("full_name") as string;
    const email = formData.get("email") as string;
    const phone_number = formData.get("phone_number") as string;
    const role_id = Number(formData.get("role_id"));
    const dept_id = Number(formData.get("dept_id"));

    if (!full_name || !email || !role_id || !dept_id) {
      return { success: false, message: "Missing required fields" };
    }

    // Use a transaction to ensure User and Department Link happen together
    await db.$transaction(async (tx) => {
      let userId = id;

      // A. Manage User Record
      if (userId) {
        // Update existing user
        await tx.users.update({
          where: { user_id: userId },
          data: { full_name, email, phone_number, role_id }
        });
      } else {
        // Create new user
        const newUser = await tx.users.create({
          data: { 
            full_name, 
            email, 
            phone_number, 
            role_id,
            password: "DefaultPassword123!", // You might want to handle this differently
            is_active: true
          }
        });
        userId = newUser.user_id;
      }

      // B. Manage Department Link (service_department_person)
      // 1. Remove old links for this user
      await tx.service_department_person.deleteMany({
        where: { user_id: userId! }
      });

      // 2. Create new link
      await tx.service_department_person.create({
        data: {
          user_id: userId!,
          service_department_id: dept_id
        }
      });
    });

    // Refresh the specific page you are working on
    revalidatePath("/department-person-master");
    return { success: true, message: "Staff record saved successfully" };

  } catch (error: any) {
    console.error("Upsert Error:", error);
    return { success: false, message: "Database Error: " + error.message };
  }
}

// 2. DELETE STAFF (Soft Delete)
export async function deleteStaff(id: number) {
  try {
    await db.users.update({
      where: { user_id: id },
      data: { is_active: false }
    });
    revalidatePath("/department-person-master");
    return { success: true, message: "Staff member deactivated" };
  } catch (error: any) {
    return { success: false, message: "Error: " + error.message };
  }
}