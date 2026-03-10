import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.service_department_person.findMany({
      include: { service_department: true, users: true }
    });
    return NextResponse.json(data);
  } catch (e) { return NextResponse.json({ error: "Fetch failed" }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await db.service_department_person.create({
      data: {
        dept_id: Number(body.dept_id),
        user_id: Number(body.user_id),
        is_hod: body.is_hod === true,
        active_from: new Date(),
      }
    });
    return NextResponse.json(res);
  } catch (e) { return NextResponse.json({ error: "Mapping failed" }, { status: 500 }); }
}