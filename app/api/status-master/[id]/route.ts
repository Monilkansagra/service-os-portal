import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const res = await db.service_request_status.update({
      where: { status_id: Number(id) },
      data: {
        status_name: body.status_name || body.name,
        status_system_name: body.status_system_name || (body.status_name || body.name)?.toLowerCase().replace(/ /g, "_"),
        sequence: Number(body.sequence),
        status_css_class: body.status_css_class || body.color,
        description: body.description,
        is_open: body.is_open,
        modified: new Date(),
      }
    });
    return NextResponse.json(res);
  } catch (e: any) {
    console.error("STATUS_PATCH_ERROR:", e);
    return NextResponse.json({ error: "Update failed: " + e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.service_request_status.delete({ where: { status_id: Number(id) } });
    return NextResponse.json({ message: "Deleted" });
  } catch (e: any) {
    if (e.code === 'P2003') {
      return NextResponse.json({ error: "Cannot delete: This status is linked to requests." }, { status: 400 });
    }
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
