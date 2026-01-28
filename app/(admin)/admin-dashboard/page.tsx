import { db } from "@/lib/db";
import AdminDashboardClient from "./client";

export default async function AdminDashboardPage() {
  
  // 1. Fetch Real Counts in Parallel for performance
  const [
    userCount, 
    deptCount, 
    serviceTypeCount, 
    requestCount
  ] = await Promise.all([
    db.users.count({ where: { is_active: true } }), // Only active users
    db.service_department.count(),
    db.service_request_type.count(),
    db.service_request.count(), // Total requests in the system
  ]);

  // 2. Prepare data object
  const stats = {
    totalUsers: userCount,
    departments: deptCount,
    activeServices: serviceTypeCount,
    totalRequests: requestCount
  };

  return <AdminDashboardClient stats={stats} />;
}