import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET: List all departments
export async function GET() {
  try {
    const departments = await db.service_department.findMany();
    return NextResponse.json(departments);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// POST: Create a new department
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const department = await db.service_department.create({
      data: {
        dept_name: body.dept_name,
        campus_id: Number(body.campus_id),
        description: body.description,
        cc_email_to_csv: body.cc_email_to_csv,
        is_request_title_disable: body.is_request_title_disable ?? false,
        user_id: Number(body.user_id) || 1, // fallback to 1 if not provided
        created: new Date(),
        modified: new Date()
      }
    });
    return NextResponse.json(department);
  } catch (error) {
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}
