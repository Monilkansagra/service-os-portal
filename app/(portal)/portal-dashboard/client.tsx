"use client";

import React, { useState, useEffect } from 'react';
import {
  Plus, MessageSquare, Clock, CheckCircle2,
  Search, Filter, Send, X,
  AlertCircle, History, ChevronRight, Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import { DashboardCard } from '@/components/DashboardCard';
import { Input } from '@/components/ui/input';

interface Props {
  initialRequests: any[];
  userId: number;
  requestTypes: any[];
}

export default function RequestorDashboardClient({ initialRequests, userId, requestTypes }: Props) {
  const router = useRouter();
  const [requests, setRequests] = useState(initialRequests);
  const [isNewRequestModal, setIsNewRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Widget State
  const [widgetIds, setWidgetIds] = useState(["stats-row", "active-requests"]);

  useEffect(() => {
    setIsMounted(true);
    const savedLayout = localStorage.getItem("portal-dashboard-layout");
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
      localStorage.setItem("portal-dashboard-layout", JSON.stringify(newLayout));
    }
  };

  // Form States
  const [replyMsg, setReplyMsg] = useState('');
  const [formData, setFormData] = useState({
    category: requestTypes && requestTypes.length > 0 ? requestTypes[0].request_type_id.toString() : '',
    priority: 'Medium',
    title: '',
    description: ''
  });

  const handleCreateSubmit = async () => {
    if (!formData.title || !formData.description) return alert("Please fill all fields");

    setLoading(true);
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_title: formData.title,
          request_description: formData.description,
          request_type_id: Number(formData.category),
          priority_level: formData.priority,
          status_id: 1, // Default 'New'
          created_by_user_id: userId,
          user_id: userId
        })
      });

      const result = await response.json();

      if (response.ok) {
        setIsNewRequestModal(false);
        setFormData({ category: requestTypes && requestTypes.length > 0 ? requestTypes[0].request_type_id.toString() : '', priority: 'Medium', title: '', description: '' });
        router.refresh();
      } else {
        alert("Error: " + (result.error || result.details));
      }
    } catch (e) {
      alert("System Error");
    }
    setLoading(false);
  };

  const handleSendReply = async () => {
    if (!replyMsg.trim()) return;

    try {
      const response = await fetch('/api/request-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: selectedRequest.realId,
          user_id: userId,
          reply_text: replyMsg,
          status_id: selectedRequest.status_id || 1
        })
      });

      if (response.ok) {
        const newReply = { from: "You", msg: replyMsg, time: "Just now" };
        setSelectedRequest({
          ...selectedRequest,
          replies: [...(selectedRequest.replies || []), newReply]
        });
        setReplyMsg('');
      } else {
        alert("Failed to send reply");
      }
    } catch (err) {
      alert("Connection error");
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes('Pending') || status.includes('New')) return 'bg-amber-100/50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20';
    if (status.includes('Progress')) return 'bg-indigo-100/50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20';
    if (status.includes('Resolved') || status.includes('Closed')) return 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20';
    return 'bg-slate-100/50 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border border-slate-200/50 dark:border-slate-500/20';
  };

  if (!isMounted) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto font-sans dark:text-slate-100">

      {/* Header Slide-in */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
      >
        <div className="space-y-1.5">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 flex items-center gap-3">
            Operations Hub 
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center justify-center px-2.5 py-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[11px] rounded-full font-bold uppercase tracking-widest shadow-sm"
            >
              User Portal
            </motion.span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium">Manage your service requests and track updates in real-time</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(99 102 241 / 0.2)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsNewRequestModal(true)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl shadow-sm shadow-indigo-200 dark:shadow-none font-semibold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={16} /> Raise New Request
        </motion.button>
      </motion.div>

      {/* Grid Drag and Drop Context */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={widgetIds} strategy={rectSortingStrategy}>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial="hidden" animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {widgetIds.map((id) => {
              if (id === "stats-row") {
                return (
                  <DashboardCard key={id} id={id} title="My Stats" className="lg:col-span-3 min-h-[140px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-slate-200/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                      <motion.div whileHover={{ y: -5 }} className="group relative overflow-hidden flex flex-col justify-center p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-500/10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-400/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500" />
                        <div className="flex items-center justify-between z-10">
                          <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Requests</p>
                            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{requests.length}</h3>
                          </div>
                          <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300"><Clock size={28} strokeWidth={2.5} /></div>
                        </div>
                      </motion.div>
                      
                      <motion.div whileHover={{ y: -5 }} className="group relative overflow-hidden flex flex-col justify-center p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all hover:shadow-xl hover:shadow-amber-500/10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 dark:bg-amber-400/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500" />
                        <div className="flex items-center justify-between z-10">
                          <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Waiting Action</p>
                            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{requests.filter((r: any) => r.status.includes('Pending') || r.status.includes('New')).length}</h3>
                          </div>
                          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center transform group-hover:-rotate-12 transition-transform duration-300"><AlertCircle size={28} strokeWidth={2.5} /></div>
                        </div>
                      </motion.div>

                      <motion.div whileHover={{ y: -5 }} className="group relative overflow-hidden flex flex-col justify-center p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all hover:shadow-xl hover:shadow-emerald-500/10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-500" />
                        <div className="flex items-center justify-between z-10">
                          <div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Resolved</p>
                            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{requests.filter((r: any) => r.status.includes('Resolved') || r.status.includes('Closed')).length}</h3>
                          </div>
                          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300"><CheckCircle2 size={28} strokeWidth={2.5} /></div>
                        </div>
                      </motion.div>
                    </div>
                  </DashboardCard>
                );
              }

              if (id === "active-requests") {
                return (
                  <DashboardCard key={id} id={id} title="Recent Requests" className="lg:col-span-3 min-h-[400px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-slate-200/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                      <div className="relative group w-full sm:w-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <Input className="pl-11 w-full sm:w-80 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium py-5 shadow-sm" placeholder="Search Request ID or Title..." />
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition-all shadow-sm">
                          <Filter size={16} /> Filter
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {requests.length === 0 ? (
                        <div className="p-16 text-center text-slate-400 font-medium flex flex-col items-center justify-center">
                          <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600"><Search size={32} /></div>
                          <p>You have no requests yet.</p>
                          <button onClick={() => setIsNewRequestModal(true)} className="mt-4 text-indigo-500 hover:text-indigo-600 font-semibold underline text-sm">Create your first request</button>
                        </div>
                      ) : (
                        <AnimatePresence>
                          {requests.map((req: any, i: number) => (
                            <motion.div
                              initial={{ opacity: 0, x: -20, scale: 0.98 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05, duration: 0.2 }}
                              key={req.id}
                              onClick={() => setSelectedRequest(req)}
                              className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/50 hover:border-indigo-500/30 hover:shadow-[0_8px_30px_rgb(99,102,241,0.08)] transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                              <div className="flex items-start sm:items-center gap-4">
                                <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${getStatusColor(req.status)}`}>
                                  {req.type?.charAt(0) || 'R'}
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{req.id}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${req.priority === 'High' ? 'bg-red-100/50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200/50 dark:border-red-500/20' : req.priority === 'Medium' ? 'bg-blue-100/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20' : 'bg-slate-100/50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400 border border-slate-200/50 dark:border-slate-500/20'}`}>{req.priority}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold tracking-wider ${getStatusColor(req.status)}`}>{req.status}</span>
                                  </div>
                                  <h4 className="font-bold text-lg tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{req.title}</h4>
                                </div>
                              </div>
                              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                                <div className="flex items-center gap-4 text-xs text-slate-500 font-semibold bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {req.date}</span>
                                  <div className="w-px h-3 bg-slate-300 dark:bg-slate-700"></div>
                                  <span className="flex items-center gap-1.5"><MessageSquare size={14} className="text-slate-400" /> {req.replies?.length || 0}</span>
                                </div>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors shrink-0">
                                  <ChevronRight className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" size={20} />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
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

      {/* New Request Slide-in Drawer */}
      <AnimatePresence>
        {isNewRequestModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end"
          >
            {/* Backdrop with dedicated click layer to close */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsNewRequestModal(false)}></div>
            
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 relative z-10"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2"><Plus size={22} className="text-indigo-600" /> New Request</h2>
                <button onClick={() => setIsNewRequestModal(false)} className="p-2.5 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full text-slate-500 hover:text-red-500 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/40"><X size={18} strokeWidth={2.5} /></button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                {/* Floating Label Form Fields */}
                <div className="relative group">
                  <select
                    value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-4 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors peer appearance-none relative z-10 font-medium"
                  >
                    {requestTypes && requestTypes.map((rt: any) => (
                      <option key={rt.request_type_id} value={rt.request_type_id}>
                        {rt.request_type_name}
                      </option>
                    ))}
                  </select>
                  <label className="absolute left-3 -top-2.5 bg-white dark:bg-slate-900 px-2 text-xs font-semibold text-indigo-500 z-20">Category</label>
                </div>

                <div className="relative group">
                  <select
                    value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-4 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors peer appearance-none relative z-10 font-medium"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <label className="absolute left-3 -top-2.5 bg-white dark:bg-slate-900 px-2 text-xs font-semibold text-indigo-500 z-20">Priority</label>
                </div>

                <div className="relative group">
                  <input
                    value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder=" "
                    className="w-full p-4 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors peer relative z-10 font-medium"
                  />
                  <label className="absolute left-4 top-4 text-slate-400 peer-focus:text-indigo-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white dark:peer-focus:bg-slate-900 peer-focus:px-2 peer-focus:z-20 transition-all peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:bg-white dark:peer-not-placeholder-shown:bg-slate-900 peer-not-placeholder-shown:px-2 peer-not-placeholder-shown:z-20">
                    Brief Title
                  </label>
                </div>

                <div className="relative group">
                  <textarea
                    value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder=" "
                    className="w-full p-4 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors peer relative z-10 h-32 resize-none font-medium"
                  />
                  <label className="absolute left-4 top-4 text-slate-400 peer-focus:text-indigo-500 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white dark:peer-focus:bg-slate-900 peer-focus:px-2 peer-focus:z-20 transition-all peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:bg-white dark:peer-not-placeholder-shown:bg-slate-900 peer-not-placeholder-shown:px-2 peer-not-placeholder-shown:z-20">
                    Detailed Description
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleCreateSubmit}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold shadow-xl shadow-indigo-500/20 dark:shadow-none transition-all flex justify-center items-center gap-2"
                >
                  {loading && <Loader2 className="animate-spin" size={18} />}
                  Submit Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details/Communication Drawer */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end"
          >
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedRequest(null)}></div>
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 relative z-10"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/50">
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedRequest.id}</span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mt-1">{selectedRequest.title}</h3>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-2.5 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full text-slate-500 hover:text-red-500 transition-all shrink-0 focus:outline-none focus:ring-2 focus:ring-red-500/40"><X size={18} strokeWidth={2.5} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Assigned to: IT Support Team</span>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Updates & Replies</h5>
                  {selectedRequest.replies && selectedRequest.replies.length > 0 ? (
                    selectedRequest.replies.map((reply: any, i: number) => (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className={`p-4 rounded-2xl text-sm font-medium ${reply.from === 'Technician' ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-100' : 'bg-slate-50 text-slate-800 dark:bg-slate-800 dark:text-slate-200'}`}>
                        <div className="flex justify-between items-center mb-1.5 opacity-70">
                          <span className="font-bold text-[10px] uppercase">{reply.from}</span>
                          <span className="text-[10px]">{reply.time}</span>
                        </div>
                        {reply.msg}
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-10 text-center space-y-2">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-300 dark:text-slate-600"><MessageSquare size={20} /></div>
                      <p className="text-sm font-medium text-slate-400">No replies yet.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="relative">
                  <Input
                    placeholder="Type a message..."
                    className="w-full pr-12 rounded-full border-slate-200 focus:border-indigo-500"
                    value={replyMsg}
                    onChange={(e) => setReplyMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!replyMsg.trim()}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    <Send size={14} className="ml-0.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}