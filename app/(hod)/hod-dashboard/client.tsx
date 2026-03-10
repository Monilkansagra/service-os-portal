"use client";

import React, { useState, useEffect } from 'react';
import {
  Users, CheckCircle, Clock,
  UserPlus, Search, Filter, X, AlertCircle, BarChart3,
  ThumbsUp, Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy
} from "@dnd-kit/sortable";

import { DashboardCard } from '@/components/DashboardCard';
import { Input } from '@/components/ui/input';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';

interface Props {
  deptName: string;
  currentUserId: number;
  initialRequests: any[];
  initialTechnicians: any[];
}

export default function HODDashboardClient({ deptName, currentUserId, initialRequests, initialTechnicians }: Props) {
  const router = useRouter();
  const [requests] = useState(initialRequests);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Widget State
  const [widgetIds, setWidgetIds] = useState(["stats-row", "performance-chart", "active-requests"]);

  useEffect(() => {
    setIsMounted(true);
    const savedLayout = localStorage.getItem("hod-dashboard-layout");
    if (savedLayout) {
      try { setWidgetIds(JSON.parse(savedLayout)); } catch (e) { }
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = widgetIds.indexOf(active.id);
      const newIndex = widgetIds.indexOf(over.id);
      const newLayout = arrayMove(widgetIds, oldIndex, newIndex);
      setWidgetIds(newLayout);
      localStorage.setItem("hod-dashboard-layout", JSON.stringify(newLayout));
    }
  };

  // --- Actions ---
  const handleApprove = async (id: number) => {
    if (!confirm("Are you sure you want to approve this request via API?")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status_name: 'Approved',
          approval_status_by_user_id: currentUserId,
          approval_status_description: 'Approved by HOD'
        })
      });
      if (response.ok) router.refresh();
      else alert("Error approving request");
    } catch (e) {
      alert("System Error: Unable to connect to server.");
    }
    setLoading(false);
  };

  const handleAssign = async (techId: number) => {
    if (!selectedRequest) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/requests/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status_name: 'Assigned',
          assigned_to_user_id: techId
        })
      });
      if (response.ok) {
        setIsAssignModalOpen(false);
        router.refresh();
      } else alert("Error assigning request");
    } catch (e) {
      alert("System Error: Unable to connect to server.");
    }
    setLoading(false);
  };

  const barChartData = initialTechnicians.map(t => ({
    name: t.name.split(' ')[0], // First name
    resolved: t.resolved ?? 0
  }));

  if (!isMounted) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto font-sans dark:text-slate-100">
      {/* Header Slide-in */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm"
      >
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            HOD Control Center <span className="inline-flex items-center justify-center px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] rounded-full font-black uppercase tracking-wider">{deptName}</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage departmental requests and staff performance</p>
        </div>
      </motion.div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={widgetIds} strategy={rectSortingStrategy}>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          >
            {widgetIds.map((id) => {
              if (id === "stats-row") {
                return (
                  <DashboardCard key={id} id={id} title="Department Stats" className="lg:col-span-3 min-h-[140px]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center mr-4"><AlertCircle size={20} /></div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{requests.filter(r => r.status.includes('Pending') || r.status.includes('New')).length}</h3>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Awaiting</p>
                        </div>
                      </motion.div>
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mr-4"><Clock size={20} /></div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{requests.filter(r => r.status.includes('Assigned')).length}</h3>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Assigned</p>
                        </div>
                      </motion.div>
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center mr-4"><CheckCircle size={20} /></div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{requests.filter(r => r.status.includes('Closed') || r.status.includes('Resolved')).length}</h3>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Resolved</p>
                        </div>
                      </motion.div>
                    </div>
                  </DashboardCard>
                );
              }

              if (id === "performance-chart") {
                return (
                  <DashboardCard key={id} id={id} title="Staff Performance" className="lg:col-span-1 min-h-[400px]">
                    <div className="w-full h-full min-h-[300px] flex flex-col justify-center -ml-4">
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={barChartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                          <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="resolved" fill="#4f46e5" radius={[4, 4, 0, 0]} animationDuration={1500} />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="mt-4 px-4">
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2"><BarChart3 size={16} className="text-indigo-500" /> Active Technicians ({initialTechnicians.length})</h4>
                      </div>
                    </div>
                  </DashboardCard>
                );
              }

              if (id === "active-requests") {
                return (
                  <DashboardCard key={id} id={id} title="Department Requests" className="lg:col-span-2 min-h-[400px]">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-4">
                      <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <Input className="pl-9 w-full sm:w-64 bg-slate-50 dark:bg-slate-900 border-none" placeholder="Search ID or Requester..." />
                      </div>
                      <button className="p-2 w-full sm:w-auto flex justify-center bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-500 transition-colors"><Filter size={18} /></button>
                    </div>

                    <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl custom-scrollbar">
                      <table className="w-full min-w-[600px] text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                          <tr>
                            <th className="px-6 py-4">Details</th>
                            <th className="px-6 py-4">Status & Tech</th>
                            <th className="px-6 py-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          <AnimatePresence>
                            {requests.map((req, i) => (
                              <motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex flex-col items-center justify-center font-bold text-xs">
                                      #{req.id}
                                    </div>
                                    <div>
                                      <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 block">{req.subject}</span>
                                      <span className="text-xs text-slate-500">By {req.requester} • {req.date}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col gap-1.5 items-start">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${req.status.includes('Pending') ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : req.status.includes('Closed') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{req.status}</span>
                                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1"><Users size={12} /> {req.technician || 'Unassigned'}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                  {req.status.includes('Pending') && (
                                    <button onClick={() => handleApprove(req.id)} disabled={loading} className="p-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-800/40 text-emerald-600 dark:text-emerald-400 rounded-lg transition-colors" title="Approve"><ThumbsUp size={16} /></button>
                                  )}
                                  {!req.status.includes('Closed') && (
                                    <button onClick={() => { setSelectedRequest(req); setIsAssignModalOpen(true); }} disabled={loading} className="p-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/40 text-indigo-600 dark:text-indigo-400 rounded-lg transition-colors" title="Assign"><UserPlus size={16} /></button>
                                  )}
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                          {requests.length === 0 && (
                            <tr><td colSpan={3} className="text-center py-10 text-slate-400 text-sm font-medium">No requests found.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </DashboardCard>
                );
              }
              return null;
            })}
          </motion.div>
        </SortableContext>
      </DndContext>

      {/* Assign Modal Drawer (Slide-in right) */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end"
          >
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Assign Staff</h2>
                  <p className="text-xs text-slate-500 mt-0.5">For Request #{selectedRequest?.id}</p>
                </div>
                <button onClick={() => setIsAssignModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-3">
                {initialTechnicians.map((tech) => (
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    key={tech.id} onClick={() => handleAssign(tech.id)} disabled={loading}
                    className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 group transition-all"
                  >
                    <div className="text-left flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">{tech.name.charAt(0)}</div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tech.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Load: {tech.load}</p>
                      </div>
                    </div>
                    {loading ? <Loader2 className="animate-spin text-slate-400" size={16} /> : <UserPlus className="text-slate-400 group-hover:text-indigo-500 transition-colors" size={16} />}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}