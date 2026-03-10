import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const res = await db.service_type.update({
      where: { service_type_id: Number(id) },
      data: {
        service_type_name: body.service_type_name,
        description: body.description,
        is_for_staff: body.is_for_staff,
        is_for_student: body.is_for_student,
        modified: new Date(),
      }
    });
    return NextResponse.json(res);
  } catch (e: any) {
    console.error("SERVICE_TYPE_PATCH_ERROR:", e);
    return NextResponse.json({ error: "Update failed: " + e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.service_type.delete({ where: { service_type_id: Number(id) } });
    return NextResponse.json({ message: "Deleted" });
  } catch (e: any) {
    if (e.code === 'P2003') {
      return NextResponse.json({ error: "Cannot delete: This Service Type is in use." }, { status: 400 });
    }
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
