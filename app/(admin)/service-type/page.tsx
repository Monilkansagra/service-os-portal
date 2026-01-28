import { db } from "@/lib/db";
import ServiceTypeClient from "./client";

export default async function ServiceTypePage() {
  
  // Fetch data matching your schema
  const serviceTypes = await db.service_type.findMany({
    orderBy: { service_type_id: 'desc' }
  });

  // Transform for Client (Ensure no Dates/Decimals break serialization)
  const formattedData = serviceTypes.map((item) => ({
    service_type_id: item.service_type_id,
    service_type_name: item.service_type_name,
    description: item.description || "",
    is_for_staff: item.is_for_staff ?? true,   // Default to true if null
    is_for_student: item.is_for_student ?? true // Default to true if null
  }));

  return (
    <ServiceTypeClient initialData={formattedData} />
  );
}