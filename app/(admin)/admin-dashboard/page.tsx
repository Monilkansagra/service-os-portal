export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import AdminDashboardClient from "./client";

export default async function AdminDashboardPage() {

  // 1. Fetch Real Counts in Parallel for performance
  const [
    userCount,
    deptCount,
    serviceTypeCount,
    requestCount,
    allRequests
  ] = await Promise.all([
    db.users.count({ where: { is_active: true } }), // Only active users
    db.service_department.count(),
    db.service_request_type.count(),
    db.service_request.count(), // Total requests in the system
    db.service_request.findMany({
      include: {
        service_request_type: {
          include: {
            service_department: true
          }
        }
      }
    })
  ]);

  // Process data for charts
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  const lineChartMap = new Map();
  // Initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    lineChartMap.set(days[d.getDay()], { name: days[d.getDay()], value: 0, prev: 0 });
  }

  const pieMap = new Map<string, number>();
  const responseTimeMap = new Map<string, { totalHours: number, count: number }>();

  allRequests.forEach(req => {
    // Line Chart (Past 7 Days)
    if (req.request_datetime) {
      const diffTime = today.getTime() - req.request_datetime.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      if (diffDays >= 0 && diffDays <= 7) {
        const dayName = days[req.request_datetime.getDay()];
        if (lineChartMap.has(dayName)) {
          lineChartMap.get(dayName).value += 1;
        }
      }
    }

    // Pie Chart
    const deptName = req.service_request_type?.service_department?.dept_name || 'Unknown';
    pieMap.set(deptName, (pieMap.get(deptName) || 0) + 1);

    // Bar Chart
    if (req.request_datetime && req.assigned_datetime) {
      const diffHours = (req.assigned_datetime.getTime() - req.request_datetime.getTime()) / (1000 * 60 * 60);
      if (diffHours >= 0) {
        if (!responseTimeMap.has(deptName)) responseTimeMap.set(deptName, { totalHours: 0, count: 0 });
        const entry = responseTimeMap.get(deptName)!;
        entry.totalHours += diffHours;
        entry.count += 1;
      }
    }
  });

  const lineChartData = Array.from(lineChartMap.values());
  const pieData = Array.from(pieMap.entries()).map(([name, value]) => ({ name, value }));
  const barData = Array.from(responseTimeMap.entries()).map(([name, data]) => ({
    name: name.length > 12 ? name.substring(0, 12) + "..." : name,
    time: Number((data.totalHours / data.count).toFixed(2))
  }));

  if (pieData.length === 0) pieData.push({ name: 'No Data', value: 1 });
  if (barData.length === 0) barData.push({ name: 'No Data', time: 0 });

  // 2. Prepare data object
  const stats = {
    totalUsers: userCount,
    departments: deptCount,
    activeServices: serviceTypeCount,
    totalRequests: requestCount
  };

  return <AdminDashboardClient stats={stats} initialLineData={lineChartData} initialPieData={pieData} initialBarData={barData} />;
}