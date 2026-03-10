import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.service_request_type.findMany({
      include: { service_department: true, service_type: true }
    });
    return NextResponse.json(data);
  } catch (e) { return NextResponse.json({ error: "Fetch failed" }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Ensure we have a valid service_type_id
    let stId = Number(body.service_type_id);
    if (!stId || isNaN(stId)) {
      const first = await db.service_type.findFirst();
      stId = first?.service_type_id || 1;
    }

    const res = await db.service_request_type.create({
      data: {
        dept_id: Number(body.dept_id),
        service_type_id: stId,
        request_type_name: body.request_type_name,
        description: body.description || body.request_category || null,
        default_priority: body.default_priority || body.priority || 'Medium',
        user_id: Number(body.user_id) || 1,
        created: new Date(),
        modified: new Date()
      }
    });
    return NextResponse.json(res);
  } catch (e: any) {
    console.error("REQUEST_TYPE_POST_ERROR:", e);
    return NextResponse.json({ error: "Create failed: " + e.message }, { status: 500 });
  }
}