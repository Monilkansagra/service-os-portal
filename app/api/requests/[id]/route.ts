import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await db.service_request.findUnique({
      where: { request_id: Number(id) },
      include: {
        service_request_status: true,
        service_request_type: true,
        service_request_reply: {
          include: { users: { select: { full_name: true } } },
          orderBy: { created: 'desc' }
        },
        service_request_attachment: true,
        users_service_request_created_by_user_idTousers: { select: { full_name: true, email: true } }
      }
    });
    return NextResponse.json(data);
  } catch (e) { return NextResponse.json({ error: "Fetch failed" }, { status: 500 }); }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Mapping from body to DB fields
    const updateData: any = {
      modified: new Date()
    };

    if (body.status_id) updateData.status_id = Number(body.status_id);

    // If status_name is provided, we try to find the ID
    if (body.status_name) {
      const status = await db.service_request_status.findFirst({
        where: { status_name: { contains: body.status_name } }
      });
      if (status) updateData.status_id = status.status_id;
    }

    if (body.assigned_to_user_id) {
      updateData.assigned_to_user_id = Number(body.assigned_to_user_id);
      updateData.assigned_datetime = new Date();
    }

    if (body.approval_status_by_user_id) {
      updateData.approval_status_by_user_id = Number(body.approval_status_by_user_id);
      updateData.approval_status_datetime = new Date();
      updateData.approval_status_description = body.approval_status_description || "Updated via API";
    }

    const res = await db.service_request.update({
      where: { request_id: Number(id) },
      data: updateData
    });

    return NextResponse.json(res);
  } catch (e: any) {
    console.error("REQUEST_PATCH_ERROR:", e);
    return NextResponse.json({ error: "Update failed: " + e.message }, { status: 500 });
  }
}
