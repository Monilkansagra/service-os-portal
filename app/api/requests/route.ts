import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if database is connected
    await db.$connect();

    const requests = await db.service_request.findMany({
      include: {
        service_request_status: true,
        // This is the relation name Prisma generated during 'db pull'
        // If this gives an error, check your schema.prisma for the exact name
        users_service_request_created_by_user_idTousers: {
          select: {
            full_name: true,
          }
        }
      }
    });

    return NextResponse.json(requests);
  } catch (error: any) {
    // THIS LINE IS CRITICAL: Look at your terminal/command prompt to see the real error
    console.error("DETAILED API ERROR:", error.message);

    return NextResponse.json({
      error: "Database Error",
      details: error.message
    }, { status: 500 });
  }
}


// POST: Create a new service request
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Generate simple Ticket Number if missing
    const ticketNo = body.request_no || `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const res = await db.service_request.create({
      data: {
        request_no: ticketNo,
        request_datetime: body.request_datetime ? new Date(body.request_datetime) : new Date(),
        request_type_id: Number(body.request_type_id) || 1,
        request_title: body.request_title,
        request_description: body.request_description,
        status_id: Number(body.status_id) || 1, // Default to 'New' status
        service_request_status_datetime: new Date(),
        priority_level: body.priority_level || 'Medium',
        assigned_to_user_id: body.assigned_to_user_id ? Number(body.assigned_to_user_id) : undefined,
        created_by_user_id: Number(body.created_by_user_id) || Number(body.user_id),
        service_request_status_by_user_id: Number(body.user_id),
        user_id: Number(body.user_id),
        created: new Date(),
        modified: new Date()
      }
    });

    console.log(`✅ Request Created: ${ticketNo}`);
    return NextResponse.json(res);
  } catch (error: any) {
    console.error("POST_REQUEST_ERROR:", error);
    return NextResponse.json({ error: "Create failed", details: error.message }, { status: 500 });
  }
}

// DELETE: Remove a service request by id (expects id in query param or body)
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
    await db.service_request.delete({ where: { request_id: id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: "Delete failed", details: error.message }, { status: 500 });
  }
}