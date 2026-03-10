"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Creates or updates a staff member and their department mapping.
 */
export async function upsertStaff(formData: FormData) {
  try {
    const rawId = formData.get("id");
    const id = rawId && rawId !== "undefined" && rawId !== "null" ? Number(rawId) : null;

    const full_name = formData.get("full_name") as string;
    const email = formData.get("email") as string;
    const role_id = Number(formData.get("role_id"));
    const dept_id = Number(formData.get("dept_id"));

    if (!full_name || !email || !role_id) {
      return { success: false, message: "Name, Email and Role are required." };
    }

    // 1. Prepare User Metadata
    const userData = {
      full_name,
      email,
      role_id,
      is_active: true,
    };

    return await db.$transaction(async (tx) => {
      let user;

      if (id && !isNaN(id)) {
        // Update User
        user = await tx.users.update({
          where: { user_id: id },
          data: userData
        });

        // Update/Create Department Mapping
        if (dept_id && dept_id > 0) {
          const existingMapping = await tx.service_department_person.findFirst({
            where: { user_id: id }
          });

          if (existingMapping) {
            await tx.service_department_person.update({
              where: { dept_person_id: existingMapping.dept_person_id },
              data: { dept_id: dept_id }
            });
          } else {
            await tx.service_department_person.create({
              data: {
                user_id: id,
                dept_id: dept_id,
                active_from: new Date()
              }
            });
          }
        }
      } else {
        // Create User
        user = await tx.users.create({
          data: {
            ...userData,
            password: "changeme123", // Default password for new users
            created_at: new Date(),
          }
        });

        // Create Department Mapping
        if (dept_id && dept_id > 0) {
          await tx.service_department_person.create({
            data: {
              user_id: user.user_id,
              dept_id: dept_id,
              active_from: new Date()
            }
          });
        }
      }

      revalidatePath("/department-person-master");
      return { success: true };
    });
  } catch (error: any) {
    console.error("UPSERT_STAFF_ERROR:", error);
    if (error.code === 'P2002') {
      return { success: false, message: "Email already exists in the system." };
    }
    return { success: false, message: error.message || "Failed to save staff information." };
  }
}

/**
 * Deletes a staff member and their related records.
 */
export async function deleteStaff(id: number) {
  try {
    if (!id || isNaN(id)) throw new Error("Invalid Staff ID");

    return await db.$transaction(async (tx) => {
      // 1. Delete relations first
      await tx.service_department_person.deleteMany({
        where: { user_id: id }
      });

      // 2. Delete from request type person mapping
      await tx.service_request_type_person.deleteMany({
        where: { user_id: id }
      });

      // 3. Delete the user
      await tx.users.delete({
        where: { user_id: id }
      });

      revalidatePath("/department-person-master");
      return { success: true };
    });
  } catch (error: any) {
    console.error("DELETE_STAFF_ERROR:", error);

    // Handle foreign key constraint error (Prisma P2003)
    if (error.code === 'P2003' || error.message?.includes('foreign key constraint')) {
      return {
        success: false,
        message: "Could not delete staff member. They have active service requests, replies, or other historical data linked to them. Consider deactivating them instead."
      };
    }

    return {
      success: false,
      message: "Failed to delete: " + (error.message || "Unknown error")
    };
  }
}
