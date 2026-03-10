import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const statuses = await db.service_request_status.findMany({
      orderBy: { sequence: 'asc' }
    });
    return NextResponse.json(statuses);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching status master" }, { status: 500 });
  }
}