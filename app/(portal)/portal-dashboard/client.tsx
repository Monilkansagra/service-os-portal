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
}

export default function RequestorDashboardClient({ initialRequests, userId }: Props) {
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
    category: 'Hardware',
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
          request_type_id: 1, // Default or map from category
          priority_level: formData.priority,
          status_id: 1, // Default 'New'
          created_by_user_id: userId,
          user_id: userId
        })
      });

      const result = await response.json();

      if (response.ok) {
        setIsNewRequestModal(false);
        setFormData({ category: 'Hardware', priority: 'Medium', title: '', description: '' });
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
    if (status.includes('Pending') || status.includes('New')) return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
    if (status.includes('Progress')) return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400';
    if (status.includes('Resolved') || status.includes('Closed')) return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
    return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
  };

  if (!isMounted) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto font-sans dark:text-slate-100">

      {/* Header Slide-in */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm"
      >
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            My Portal <span className="inline-flex items-center justify-center px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] rounded-full font-black uppercase tracking-wider">User</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your service requests and track updates</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
                  <DashboardCard key={id} id={id} title="My Stats" className="lg:col-span-3 min-h-[140px]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center mr-4"><Clock size={20} /></div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{requests.length}</h3>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Total Requests</p>
                        </div>
                      </motion.div>
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center mr-4"><AlertCircle size={20} /></div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{requests.filter((r: any) => r.status.includes('Pending') || r.status.includes('New')).length}</h3>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Waiting on Action</p>
                        </div>
                      </motion.div>
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="flex items-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center mr-4"><CheckCircle2 size={20} /></div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{requests.filter((r: any) => r.status.includes('Resolved') || r.status.includes('Closed')).length}</h3>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Resolved</p>
                        </div>
                      </motion.div>
                    </div>
                  </DashboardCard>
                );
              }

              if (id === "active-requests") {
                return (
                  <DashboardCard key={id} id={id} title="Recent Requests" className="lg:col-span-3 min-h-[400px]">
                    <div className="flex justify-between items-center mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <Input className="pl-9 w-64 bg-slate-50 dark:bg-slate-900 border-none" placeholder="Search ID or Title..." />
                      </div>
                      <button className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-500 transition-colors"><Filter size={18} /></button>
                    </div>

                    <div className="space-y-2">
                      {requests.length === 0 ? (
                        <div className="p-10 text-center text-slate-400 font-medium">You have no requests yet.</div>
                      ) : (
                        <AnimatePresence>
                          {requests.map((req: any, i: number) => (
                            <motion.div
                              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                              key={req.id}
                              onClick={() => setSelectedRequest(req)}
                              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group flex items-center justify-between"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${getStatusColor(req.status)}`}>
                                  {req.type?.charAt(0) || 'R'}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.id}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${req.priority === 'High' ? 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'}`}>{req.priority}</span>
                                  </div>
                                  <h4 className="font-semibold tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{req.title}</h4>
                                </div>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400 font-medium">
                                  <span className="flex items-center gap-1"><Clock size={14} /> {req.date}</span>
                                  <span className="flex items-center gap-1"><MessageSquare size={14} /> {req.replies?.length || 0}</span>
                                </div>
                                <ChevronRight className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" size={20} />
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end"
          >
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">New Request</h2>
                <button onClick={() => setIsNewRequestModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                {/* Floating Label Form Fields */}
                <div className="relative group">
                  <select
                    value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-4 bg-transparent border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-colors peer appearance-none relative z-10 font-medium"
                  >
                    <option value="Hardware">Hardware Issue</option>
                    <option value="Software">Software Request</option>
                    <option value="Network">Network/WiFi</option>
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end"
          >
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedRequest.id}</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mt-1">{selectedRequest.title}</h3>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
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