import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const res = await db.service_department_person.update({
      where: { dept_person_id: Number(id) },
      data: {
        dept_id: Number(body.dept_id),
        user_id: Number(body.user_id),
        is_hod: body.is_hod,
      }
    });
    return NextResponse.json(res);
  } catch (e) { return NextResponse.json({ error: "Update failed" }, { status: 500 }); }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.service_department_person.delete({ where: { dept_person_id: Number(id) } });
    return NextResponse.json({ message: "Deleted" });
  } catch (e) { return NextResponse.json({ error: "Delete failed" }, { status: 500 }); }
}
