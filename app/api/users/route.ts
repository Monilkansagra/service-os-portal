import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET: List all users with their roles
export async function GET() {
  try {
    const data = await db.users.findMany({
      include: { roles: true },
      orderBy: { full_name: 'asc' }
    });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// POST: Create a new user (Staff)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    return await db.$transaction(async (tx) => {
      // 1. Create the user
      const user = await tx.users.create({
        data: {
          full_name: body.full_name || body.name,
          email: body.email,
          password: body.password || "changeme123",
          role_id: Number(body.role_id),
          is_active: body.is_active ?? true,
          created_at: new Date()
        }
      });

      // 2. Create department mapping if dept_id is provided
      if (body.dept_id && Number(body.dept_id) > 0) {
        await tx.service_department_person.create({
          data: {
            user_id: user.user_id,
            dept_id: Number(body.dept_id),
            active_from: new Date(),
          }
        });
      }

      return NextResponse.json(user);
    });
  } catch (e: any) {
    console.error("USER_POST_ERROR:", e);
    return NextResponse.json({ error: "User creation failed. " + e.message }, { status: 500 });
  }
}