import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// PATCH: Update department
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log('PATCH /api/departments/[id] called with id:', id);
    const rawBody = await req.text();
    console.log('PATCH raw body:', rawBody);
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (jsonErr) {
      console.error('PATCH JSON parse error:', jsonErr);
      return NextResponse.json({ error: "Update failed", details: "Invalid JSON body" }, { status: 400 });
    }
    console.log('PATCH body:', body);
    const updated = await db.service_department.update({
      where: { dept_id: Number(id) },
      data: {
        dept_name: body.dept_name,
        campus_id: Number(body.campus_id),
        description: body.description,
        cc_email_to_csv: body.cc_email_to_csv,
        is_request_title_disable: body.is_request_title_disable ?? false,
        user_id: Number(body.user_id) || 1,
        modified: new Date(),
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json({ error: "Update failed", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

// DELETE: Remove department
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log('DELETE /api/departments/[id] called with id:', id);
    await db.service_department.delete({
      where: { dept_id: Number(id) }
    });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: "Delete failed", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
