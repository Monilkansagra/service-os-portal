"use client";

import React, { useState, useEffect } from 'react';
import {
  Users, CheckCircle, Clock,
  UserPlus, Search, Filter, X, AlertCircle, BarChart3,
  ThumbsUp, Loader2, ShieldCheck, ChevronRight
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
    if (!confirm("Are you sure you want to approve this request?")) return;
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
    name: t.name.split(' ')[0],
    resolved: t.resolved ?? 0
  }));

  if (!isMounted) return null;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1400px] mx-auto font-sans dark:text-slate-100 min-h-screen selection:bg-indigo-500/30">
      
      {/* Header Slide-in */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 transform rotate-3">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              HOD Control Center 
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center justify-center px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 text-[11px] rounded-full font-bold uppercase tracking-widest">
                {deptName}
              </span>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Department Oversight & Management</p>
            </div>
          </div>
        </div>
      </motion.div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={widgetIds} strategy={rectSortingStrategy}>
          <motion.div
            className="grid grid-cols-1 xl:grid-cols-3 gap-8"
            initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
          >
            {widgetIds.map((id) => {
              
              if (id === "stats-row") {
                return (
                  <DashboardCard key={id} id={id} title="Overview Stats" className="xl:col-span-3 min-h-[160px] bg-transparent border-none shadow-none dark:bg-transparent">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                      
                      <motion.div whileHover={{ y: -5, scale: 1.02 }} className="relative overflow-hidden flex flex-col justify-center p-8 rounded-[2rem] bg-gradient-to-br from-white to-amber-50/50 dark:from-slate-800 dark:to-slate-800/80 border border-amber-100/50 dark:border-amber-500/10 shadow-[0_8px_30px_rgb(245,158,11,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 dark:bg-amber-400/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
                        <div className="flex items-center justify-between z-10">
                          <div>
                            <p className="text-xs font-black text-amber-600/70 dark:text-amber-500/60 uppercase tracking-[0.2em] mb-2">Awaiting Action</p>
                            <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter drop-shadow-sm">{requests.filter(r => r.status.includes('Pending') || r.status.includes('New')).length}</h3>
                          </div>
                          <div className="w-16 h-16 rounded-2xl bg-amber-100/80 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center transform group-hover:-rotate-12 transition-transform duration-300 shadow-inner"><AlertCircle size={32} strokeWidth={2.5} /></div>
                        </div>
                      </motion.div>

                      <motion.div whileHover={{ y: -5, scale: 1.02 }} className="relative overflow-hidden flex flex-col justify-center p-8 rounded-[2rem] bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-100/50 dark:border-blue-500/10 shadow-[0_8px_30px_rgb(59,130,246,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
                        <div className="flex items-center justify-between z-10">
                          <div>
                            <p className="text-xs font-black text-blue-600/70 dark:text-blue-500/60 uppercase tracking-[0.2em] mb-2">Assigned</p>
                            <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter drop-shadow-sm">{requests.filter(r => r.status.includes('Assigned') || r.status.includes('Progress')).length}</h3>
                          </div>
                          <div className="w-16 h-16 rounded-2xl bg-blue-100/80 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-inner"><Clock size={32} strokeWidth={2.5} /></div>
                        </div>
                      </motion.div>

                      <motion.div whileHover={{ y: -5, scale: 1.02 }} className="relative overflow-hidden flex flex-col justify-center p-8 rounded-[2rem] bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-800 dark:to-slate-800/80 border border-emerald-100/50 dark:border-emerald-500/10 shadow-[0_8px_30px_rgb(16,185,129,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-400/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
                        <div className="flex items-center justify-between z-10">
                          <div>
                            <p className="text-xs font-black text-emerald-600/70 dark:text-emerald-500/60 uppercase tracking-[0.2em] mb-2">Resolved</p>
                            <h3 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter drop-shadow-sm">{requests.filter(r => r.status.includes('Closed') || r.status.includes('Resolved')).length}</h3>
                          </div>
                          <div className="w-16 h-16 rounded-2xl bg-emerald-100/80 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-inner"><CheckCircle size={32} strokeWidth={2.5} /></div>
                        </div>
                      </motion.div>

                    </div>
                  </DashboardCard>
                );
              }

              if (id === "performance-chart") {
                return (
                  <DashboardCard key={id} id={id} title="Staff Performance Overview" className="xl:col-span-1 min-h-[440px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-200/20 dark:shadow-none">
                    <div className="w-full h-full flex flex-col justify-center p-2">
                      <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                          <BarChart3 size={20} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Resolutions by Staff</h4>
                          <p className="text-xs font-medium text-slate-500">Based on closed tickets</p>
                        </div>
                      </div>
                      <div className="relative h-[260px] w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 600 }} dy={12} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 600 }} dx={-10} />
                            <RechartsTooltip cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', fontWeight: 'bold' }} />
                            <Bar dataKey="resolved" fill="url(#colorIndigo)" radius={[6, 6, 6, 6]} animationDuration={1500}>
                            </Bar>
                            <defs>
                              <linearGradient id="colorIndigo" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={1}/>
                                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.8}/>
                              </linearGradient>
                            </defs>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </DashboardCard>
                );
              }

              if (id === "active-requests") {
                return (
                  <DashboardCard key={id} id={id} title="Live Department Requests" className="xl:col-span-2 min-h-[440px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] border-slate-200/50 dark:border-slate-800/50 shadow-xl shadow-slate-200/20 dark:shadow-none">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6 pt-2">
                      <div className="relative group w-full sm:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <Input className="pl-12 py-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/50 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-base shadow-sm" placeholder="Search Request ID or User..." />
                      </div>
                      <button className="flex items-center justify-center gap-2 px-6 py-3 w-full sm:w-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-2xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"><Filter size={18} /> Filter</button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <AnimatePresence>
                        {requests.map((req, i) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -20, scale: 0.98 }} 
                            animate={{ opacity: 1, x: 0, scale: 1 }} 
                            transition={{ delay: i * 0.05, duration: 0.3 }} 
                            key={req.id} 
                            className="group flex flex-col md:flex-row md:items-center justify-between gap-6 p-5 sm:p-6 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 rounded-[1.5rem] hover:border-indigo-500/30 hover:shadow-[0_12px_40px_-15px_rgba(99,102,241,0.2)] dark:hover:shadow-none transition-all duration-300 cursor-default"
                          >
                            <div className="flex items-start sm:items-center gap-5">
                              <div className="w-14 h-14 shrink-0 rounded-[14px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                                <span className="text-xs font-black text-slate-400 dark:text-slate-500">ID</span>
                                <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{req.id}</span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider 
                                    ${req.status.includes('Pending') ? 'bg-amber-100/80 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20' : 
                                      req.status.includes('Closed') || req.status.includes('Resolved') ? 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20' : 
                                      'bg-blue-100/80 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20'}`}>
                                    {req.status}
                                  </span>
                                  {req.priority === 'High' && <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wider">Urgent</span>}
                                </div>
                                <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{req.subject}</h4>
                                <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                  <span className="text-slate-700 dark:text-slate-300">{req.requester}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                  <span>{req.date}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                  <Users size={14} className="text-slate-400 ml-1" /> <span className="text-slate-600 dark:text-slate-400">{req.technician || 'No Tech Assigned'}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 min-w-[140px] border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                              {req.status.includes('Pending') && (
                                <button onClick={() => handleApprove(req.id)} disabled={loading} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 border border-emerald-200/50 dark:border-transparent">
                                  <ThumbsUp size={16} /> Approve
                                </button>
                              )}
                              {(!req.status.includes('Closed') && !req.status.includes('Resolved')) && (
                                <button onClick={() => { setSelectedRequest(req); setIsAssignModalOpen(true); }} disabled={loading} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-500/30 dark:shadow-none transition-all hover:scale-105 active:scale-95 disabled:opacity-50">
                                  <UserPlus size={16} /> Assign
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {requests.length === 0 && (
                        <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
                          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                             <CheckCircle size={36} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No active requests</h3>
                            <p className="text-slate-500 font-medium">Your department queue is clear.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </DashboardCard>
                );
              }
              return null;
            })}
          </motion.div>
        </SortableContext>
      </DndContext>

      {/* Modern Assign Staff Drawer */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end overflow-hidden"
          >
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md cursor-pointer" onClick={() => setIsAssignModalOpen(false)} />
            
            <motion.div
              initial={{ x: "100%", boxShadow: "-20px 0 40px rgba(0,0,0,0)" }} 
              animate={{ x: 0, boxShadow: "-20px 0 40px rgba(0,0,0,0.1)" }} 
              exit={{ x: "100%", boxShadow: "-20px 0 40px rgba(0,0,0,0)" }} 
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 h-full flex flex-col border-l border-slate-200 dark:border-slate-800 relative z-10"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-start bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                      <UserPlus size={20} />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Assign Staff</h2>
                  </div>
                  <p className="text-sm font-semibold text-slate-500">Select technician for <span className="text-indigo-500 uppercase tracking-wider">#{selectedRequest?.id}</span></p>
                </div>
                <button onClick={() => setIsAssignModalOpen(false)} className="relative z-10 p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-500/10 dark:hover:border-red-500/30 rounded-full text-slate-400 hover:text-red-500 transition-all shadow-sm focus:outline-none focus:ring-4 focus:ring-red-500/20"><X size={18} strokeWidth={2.5} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-white dark:bg-slate-900">
                {initialTechnicians.map((tech, i) => (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    key={tech.id} 
                    onClick={() => handleAssign(tech.id)} 
                    disabled={loading}
                    className="w-full flex justify-between items-center p-5 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-[0_8px_20px_-5px_rgba(99,102,241,0.15)] group transition-all"
                  >
                    <div className="text-left flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/20 border border-indigo-200/50 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        {tech.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tech.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded">Resolved: {tech.resolved}</span>
                          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">Load: {tech.load}</span>
                        </div>
                      </div>
                    </div>
                    {loading ? (
                      <Loader2 className="animate-spin text-indigo-500" size={20} strokeWidth={2.5} />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 group-hover:bg-indigo-600 border border-slate-100 dark:border-slate-800 flex items-center justify-center transition-colors">
                        <ChevronRight className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" size={20} strokeWidth={2.5} />
                      </div>
                    )}
                  </motion.button>
                ))}
                
                {initialTechnicians.length === 0 && (
                  <div className="p-10 text-center">
                    <p className="font-bold text-slate-500">No technicians available in this department.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}