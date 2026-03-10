import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await db.service_request_reply.create({
      data: {
        request_id: Number(body.request_id),
        replied_by_user_id: Number(body.user_id),
        reply_text: body.reply_text,
        status_id: Number(body.status_id),
        user_id: Number(body.user_id),
        service_request_status_by_user_id: Number(body.user_id),
        created: new Date(),
        modified: new Date()
      }
    });
    return NextResponse.json(res);
  } catch (e) { return NextResponse.json({ error: "Reply failed" }, { status: 500 }); }
}


// GET: List all request replies
export async function GET() {
  try {
    const replies = await db.service_request_reply.findMany({
      include: { users: true, service_request_status: true }
    });
    return NextResponse.json(replies);
  } catch (e) { return NextResponse.json({ error: "Fetch failed" }, { status: 500 }); }
}

// PATCH: Update a reply by id
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.reply_id) return NextResponse.json({ error: "Missing reply_id for update" }, { status: 400 });
    const res = await db.service_request_reply.update({
      where: { reply_id: Number(body.reply_id) },
      data: {
        reply_text: body.reply_text,
        status_id: body.status_id ? Number(body.status_id) : undefined,
        modified: new Date()
      }
    });
    return NextResponse.json(res);
  } catch (e) { return NextResponse.json({ error: "Update failed" }, { status: 500 }); }
}

// DELETE: Remove a reply by id
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
      if (body && body.reply_id) id = Number(body.reply_id);
    }
    if (!id) return NextResponse.json({ error: "Missing reply_id for delete" }, { status: 400 });
    await db.service_request_reply.delete({ where: { reply_id: id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (e) { return NextResponse.json({ error: "Delete failed" }, { status: 500 }); }
}