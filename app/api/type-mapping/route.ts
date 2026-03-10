import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.service_request_type_person.findMany({
    include: { service_request_type: true, users: true }
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await db.service_request_type_person.create({
      data: {
        request_type_id: Number(body.request_type_id),
        user_id: Number(body.user_id)
      }
    });
    return NextResponse.json(res);
  } catch (e) { return NextResponse.json({ error: "Mapping failed" }, { status: 500 }); }
}


// PATCH: Update a type-mapping (by id)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "Missing id for update" }, { status: 400 });
    const res = await db.service_request_type_person.update({
      where: { id: Number(body.id) },
      data: {
        request_type_id: body.request_type_id ? Number(body.request_type_id) : undefined,
        user_id: body.user_id ? Number(body.user_id) : undefined
      }
    });
    return NextResponse.json(res);
  } catch (e) { return NextResponse.json({ error: "Update failed" }, { status: 500 }); }
}

// DELETE: Remove a type-mapping (by id)
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
      if (body && body.id) id = Number(body.id);
    }
    if (!id) return NextResponse.json({ error: "Missing id for delete" }, { status: 400 });
    await db.service_request_type_person.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (e) { return NextResponse.json({ error: "Delete failed" }, { status: 500 }); }
}