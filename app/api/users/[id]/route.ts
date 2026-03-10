import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// PATCH: Update user details (Staff)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = Number(id);
    const body = await req.json();

    return await db.$transaction(async (tx) => {
      // 1. Update user core details
      const user = await tx.users.update({
        where: { user_id: userId },
        data: {
          full_name: body.full_name || body.name,
          email: body.email,
          role_id: body.role_id ? Number(body.role_id) : undefined,
          is_active: body.is_active,
          ...(body.password && { password: body.password })
        }
      });

      // 2. Update or Create Department Mapping
      if (body.dept_id && Number(body.dept_id) > 0) {
        const existing = await tx.service_department_person.findFirst({
          where: { user_id: userId }
        });

        if (existing) {
          await tx.service_department_person.update({
            where: { dept_person_id: existing.dept_person_id },
            data: { dept_id: Number(body.dept_id) }
          });
        } else {
          await tx.service_department_person.create({
            data: {
              user_id: userId,
              dept_id: Number(body.dept_id),
              active_from: new Date()
            }
          });
        }
      }

      return NextResponse.json(user);
    });
  } catch (e: any) {
    console.error("USER_PATCH_ERROR:", e);
    return NextResponse.json({ error: "Update failed: " + e.message }, { status: 500 });
  }
}

// DELETE: Remove a user
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = Number(id);

    return await db.$transaction(async (tx) => {
      // 1. Delete relations first
      await tx.service_department_person.deleteMany({
        where: { user_id: userId }
      });

      await tx.service_request_type_person.deleteMany({
        where: { user_id: userId }
      });

      // 2. Delete the user
      await tx.users.delete({
        where: { user_id: userId }
      });

      return NextResponse.json({ message: "User deleted successfully" });
    });
  } catch (e: any) {
    console.error("USER_DELETE_ERROR:", e);
    if (e.code === 'P2003') {
      return NextResponse.json({
        error: "Delete failed. This user has historical data (requests, replies) that cannot be deleted."
      }, { status: 400 });
    }
    return NextResponse.json({ error: "Delete failed: " + e.message }, { status: 500 });
  }
}
