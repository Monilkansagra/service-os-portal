import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const res = await db.service_request_type.update({
      where: { request_type_id: Number(id) },
      data: {
        request_type_name: body.request_type_name,
        dept_id: Number(body.dept_id),
        service_type_id: Number(body.service_type_id),
        description: body.description || body.request_category || null,
        default_priority: body.default_priority || body.priority || 'Medium',
        modified: new Date(),
      }
    });
    return NextResponse.json(res);
  } catch (e: any) {
    console.error("REQUEST_TYPE_PATCH_ERROR:", e);
    return NextResponse.json({ error: "Update failed: " + e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.service_request_type.delete({ where: { request_type_id: Number(id) } });
    return NextResponse.json({ message: "Deleted" });
  } catch (e: any) {
    if (e.code === 'P2003') {
      return NextResponse.json({ error: "Cannot delete: This Request Type is in use." }, { status: 400 });
    }
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
