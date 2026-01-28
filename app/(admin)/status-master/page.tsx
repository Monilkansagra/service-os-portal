import { db } from "@/lib/db";
import StatusMasterClient from "./client";

export default async function StatusPage() {
  // Fetch statuses sorted by Sequence
  const statusesRaw = await db.service_request_status.findMany({
    orderBy: { sequence: 'asc' }
  });

  // Transform DB fields to UI fields
  const statuses = statusesRaw.map((s) => ({
    id: s.status_id,
    name: s.status_name,
    status_system_name: s.status_system_name,
    sequence: Number(s.sequence),
    color: s.status_css_class || 'bg-slate-500', // Default fallback
    description: s.description || '',
    is_open: s.is_open ?? true
  }));

  return (
    <StatusMasterClient initialData={statuses} />
  );
}