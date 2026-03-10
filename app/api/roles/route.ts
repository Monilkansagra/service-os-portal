import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const roles = await db.roles.findMany();
  return NextResponse.json(roles);
}


// POST: Create a new role
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await db.roles.create({
      data: {
        role_name: body.role_name
      }
    });
    return NextResponse.json(res);
  } catch (e) { return NextResponse.json({ error: "Role creation failed" }, { status: 500 }); }
}

// PATCH: Update a role by id
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.role_id) return NextResponse.json({ error: "Missing role_id for update" }, { status: 400 });
    const res = await db.roles.update({
      where: { role_id: Number(body.role_id) },
      data: {
        role_name: body.role_name
      }
    });
    return NextResponse.json(res);
  } catch (e) { return NextResponse.json({ error: "Update failed" }, { status: 500 }); }
}

// DELETE: Remove a role by id
export async function DELETE(req: Request) {
  try {
    let id: number | undefined;
    // Try to get id from query param
    const url = new URL(req.url);
    if (url.searchParams.has('id')) {
      id = Number(url.searchParams.get('id'));
    } else {
      // Try to get id from body
      const body = await req.json().catch(() => undefined);
      if (body && body.role_id) id = Number(body.role_id);
    }
    if (!id) return NextResponse.json({ error: "Missing role_id for delete" }, { status: 400 });
    await db.roles.delete({ where: { role_id: id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (e) { return NextResponse.json({ error: "Delete failed" }, { status: 500 }); }
}