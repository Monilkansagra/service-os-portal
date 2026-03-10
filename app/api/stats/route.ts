import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [userCount, deptCount, serviceTypeCount, requestCount] = await Promise.all([
            db.users.count({ where: { is_active: true } }),
            db.service_department.count(),
            db.service_request_type.count(),
            db.service_request.count(),
        ]);

        return NextResponse.json({
            totalUsers: userCount,
            departments: deptCount,
            activeServices: serviceTypeCount,
            totalRequests: requestCount
        });
    } catch (error) {
        return NextResponse.json({ error: "Stats fetch failed" }, { status: 500 });
    }
}
