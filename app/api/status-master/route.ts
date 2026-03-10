import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.service_request_status.findMany({ orderBy: { sequence: 'asc' } });
    return NextResponse.json(data);
  } catch (e) { return NextResponse.json({ error: "Fetch failed" }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const statusName = body.status_name || body.name;

    if (!statusName) {
      return NextResponse.json({ error: "Status name is required" }, { status: 400 });
    }

    const res = await db.service_request_status.create({
      data: {
        status_name: statusName,
        status_system_name: (body.status_system_name || statusName).toLowerCase().replace(/ /g, "_"),
        sequence: Number(body.sequence) || 0,
        status_css_class: body.status_css_class || body.color || "bg-gray-100 text-gray-800",
        description: body.description || null,
        is_open: body.is_open ?? true,
        user_id: Number(body.user_id) || 1,
        created: new Date(),
        modified: new Date()
      }
    });
    return NextResponse.json(res);
  } catch (e: any) {
    console.error("STATUS_POST_ERROR:", e);
    return NextResponse.json({ error: "Create failed: " + e.message }, { status: 500 });
  }
}