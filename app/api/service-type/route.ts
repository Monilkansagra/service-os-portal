import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.service_type.findMany();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await db.service_type.create({
      data: {
        service_type_name: body.service_type_name,
        description: body.description || null,
        is_for_staff: body.is_for_staff ?? true,
        is_for_student: body.is_for_student ?? true,
        user_id: Number(body.user_id) || 1,
        created: new Date(),
        modified: new Date(),
        sequence: 0,
      }
    });
    return NextResponse.json(res);
  } catch (e: any) {
    console.error("SERVICE_TYPE_POST_ERROR:", e);
    return NextResponse.json({ error: "Create failed: " + e.message }, { status: 500 });
  }
}