export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import RequestTypeClient from "./client";

export default async function RequestTypePage() {

  // 1. Fetch Request Types with Department Name (Join)
  const [requestTypesRaw, departments, serviceTypes] = await Promise.all([
    db.service_request_type.findMany({
      include: {
        service_department: true
      },
      orderBy: {
        request_type_id: 'desc'
      }
    }),
    db.service_department.findMany({
      select: { dept_id: true, dept_name: true },
      orderBy: { dept_name: 'asc' }
    }),
    db.service_type.findMany({
      select: { service_type_id: true, service_type_name: true },
      orderBy: { service_type_name: 'asc' }
    })
  ]);

  // 2. Format DB data for UI
  const requestTypes = requestTypesRaw.map((rt: any) => ({
    ...rt,
    request_category: rt.description || '',
    priority: rt.default_priority || 'Medium'
  }));

  // 3. Pass to Client
  return (
    <RequestTypeClient
      initialData={requestTypes}
      departments={departments}
      serviceTypes={serviceTypes}
    />
  );
}