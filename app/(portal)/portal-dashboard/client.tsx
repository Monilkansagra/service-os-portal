"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, MessageSquare, Clock, CheckCircle2,
  Search, Filter, Send, X,
  AlertCircle, ChevronRight, Loader2,
  ArrowUpRight, Activity, TrendingUp
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
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// CountUp hook
function useCountUp(end: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easing = 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(end * easing));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(end);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  return count;
}

const CHART_COLORS = ['#6366F1', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

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
  const [searchQuery, setSearchQuery] = useState('');

  const [widgetIds, setWidgetIds] = useState(["stats-row", "analytics", "active-requests"]);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("portal-dashboard-layout");
    if (saved) { try { setWidgetIds(JSON.parse(saved)); } catch (e) { } }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = widgetIds.indexOf(active.id);
      const newIndex = widgetIds.indexOf(over.id);
      const newLayout = arrayMove(widgetIds, oldIndex, newIndex);
      setWidgetIds(newLayout);
      localStorage.setItem("portal-dashboard-layout", JSON.stringify(newLayout));
    }
  };

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
          status_id: 1,
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
    } catch (e) { alert("System Error"); }
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
        setSelectedRequest({ ...selectedRequest, replies: [...(selectedRequest.replies || []), newReply] });
        setReplyMsg('');
      } else { alert("Failed to send reply"); }
    } catch (err) { alert("Connection error"); }
  };

  const getStatusColor = (status: string) => {
    if (status.includes('Pending') || status.includes('New')) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    if (status.includes('Progress')) return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
    if (status.includes('Resolved') || status.includes('Closed')) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'High') return 'bg-red-500/10 text-red-400 border border-red-500/20';
    if (priority === 'Medium') return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
    return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  };

  // Analytics data
  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [requests]);

  const areaData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(d => ({ name: d, requests: Math.floor(Math.random() * 5) }));
  }, []);

  const filteredRequests = useMemo(() =>
    requests.filter(r =>
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [requests, searchQuery]);

  const totalCount = useCountUp(requests.length);
  const pendingCount = useCountUp(requests.filter((r: any) => r.status.includes('Pending') || r.status.includes('New')).length);
  const resolvedCount = useCountUp(requests.filter((r: any) => r.status.includes('Resolved') || r.status.includes('Closed')).length);

  if (!isMounted) return <div className="min-h-screen bg-[#0F0F1A]" />;

  return (
    <div className="space-y-6 pb-10 font-sans">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#1A1A2E] rounded-2xl border border-indigo-900/40 p-6 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-violet-500" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight">Operations Hub</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest shadow-[0_0_10px_rgba(99,102,241,0.2)]">USER PORTAL</span>
          </div>
          <p className="text-slate-400 font-medium text-sm mt-1">Manage service requests and track updates in real-time.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setIsNewRequestModal(true)}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all active:scale-95 relative z-10"
        >
          <Plus size={16} /> Raise New Request
        </motion.button>
      </motion.div>

      {/* DnD Grid */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={widgetIds} strategy={rectSortingStrategy}>
          <motion.div
            className="grid grid-cols-1 xl:grid-cols-3 gap-6"
            initial="hidden" animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
          >
            {widgetIds.map((id) => {

              if (id === "stats-row") return (
                <DashboardCard key={id} id={id} title="My Stats" className="xl:col-span-3 bg-transparent border-none shadow-none">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: 'Total Requests', value: totalCount, icon: <Activity size={28} strokeWidth={2} />, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', glow: 'shadow-indigo-500/10', sparkColor: '#6366F1' },
                      { label: 'Waiting Action', value: pendingCount, icon: <AlertCircle size={28} strokeWidth={2} />, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'shadow-amber-500/10', sparkColor: '#F59E0B' },
                      { label: 'Resolved', value: resolvedCount, icon: <CheckCircle2 size={28} strokeWidth={2} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10', sparkColor: '#10B981' },
                    ].map((stat, i) => (
                      <motion.div
                        key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -4, scale: 1.01 }}
                        className={`group relative overflow-hidden bg-[#1A1A2E] rounded-2xl border border-indigo-900/40 p-6 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl ${stat.glow}`}
                      >
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-12 -mt-12 opacity-50 transition-transform duration-700 group-hover:scale-150"
                          style={{ backgroundColor: stat.sparkColor + '15' }} />
                        <div className="flex items-center justify-between mb-4 relative z-10">
                          <div className={`${stat.bg} ${stat.color} p-3.5 rounded-xl border ${stat.border} shadow-inner`}>
                            {stat.icon}
                          </div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                            <ArrowUpRight size={12} className="text-emerald-400" /> Live
                          </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 relative z-10">{stat.label}</p>
                        <h3 className="text-4xl font-black text-white tracking-tighter relative z-10">{stat.value}</h3>
                      </motion.div>
                    ))}
                  </div>
                </DashboardCard>
              );

              if (id === "analytics") return (
                <DashboardCard key={id} id={id} title="Analytics Overview" className="xl:col-span-3 bg-[#1A1A2E] border-indigo-900/40">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Area Chart */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={16} className="text-indigo-400" />
                        <h4 className="text-sm font-bold text-slate-300">Request Activity (This Week)</h4>
                      </div>
                      <div className="h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={areaData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="portalGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={8} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
                            <RechartsTooltip
                              contentStyle={{ backgroundColor: '#13131F', borderRadius: '12px', borderColor: '#4F46E5', color: 'white', fontWeight: 'bold' }}
                              itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="requests" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#portalGrad)" animationDuration={1200} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    {/* Pie Chart */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Activity size={16} className="text-violet-400" />
                        <h4 className="text-sm font-bold text-slate-300">Status Breakdown</h4>
                      </div>
                      <div className="h-[220px]">
                        {pieData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={pieData} innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none" animationDuration={1200}>
                                {pieData.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                ))}
                              </Pie>
                              <RechartsTooltip contentStyle={{ backgroundColor: '#13131F', borderRadius: '12px', borderColor: '#312E81', color: 'white', fontWeight: 'bold' }} />
                              <Legend iconType="circle" formatter={(v) => <span className="text-slate-400 text-xs font-medium ml-1">{v}</span>} />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center text-slate-500 text-sm font-medium">No data yet</div>
                        )}
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              );

              if (id === "active-requests") return (
                <DashboardCard key={id} id={id} title="My Requests" className="xl:col-span-3 bg-[#1A1A2E] border-indigo-900/40">
                  {/* Search & Filter */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
                    <div className="relative group w-full sm:w-80">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                      <input
                        className="w-full pl-10 pr-4 py-2.5 bg-[#13131F] border border-indigo-900/40 focus:border-indigo-500/60 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium placeholder:text-slate-500"
                        placeholder="Search Request ID or Title..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-[#13131F] border border-indigo-900/40 rounded-xl text-slate-400 font-semibold text-sm hover:border-indigo-500/40 hover:text-slate-200 transition-all">
                      <Filter size={15} /> Filter
                    </button>
                  </div>

                  <div className="space-y-3">
                    {filteredRequests.length === 0 ? (
                      <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                        <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <Search size={28} />
                        </div>
                        <p className="text-slate-400 font-medium text-sm">No requests found.</p>
                        <button onClick={() => setIsNewRequestModal(true)} className="text-indigo-400 hover:text-indigo-300 font-semibold underline text-sm transition-colors">
                          Raise your first request
                        </button>
                      </div>
                    ) : (
                      <AnimatePresence>
                        {filteredRequests.map((req: any, i: number) => (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.97 }} transition={{ delay: i * 0.04 }}
                            key={req.id}
                            onClick={() => setSelectedRequest(req)}
                            className="group p-4 sm:p-5 rounded-xl bg-[#13131F] border border-indigo-900/30 hover:border-indigo-500/40 hover:shadow-[0_4px_20px_rgba(99,102,241,0.08)] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-start sm:items-center gap-4">
                              <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center font-black text-lg border ${getStatusColor(req.status)}`}>
                                {req.type?.charAt(0) || 'R'}
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">{req.id}</span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${getPriorityColor(req.priority)}`}>{req.priority}</span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold tracking-wider ${getStatusColor(req.status)}`}>{req.status}</span>
                                </div>
                                <h4 className="font-bold text-base tracking-tight text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">{req.title}</h4>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                              <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold bg-[#1A1A2E] px-3 py-1.5 rounded-lg border border-indigo-900/30">
                                <span className="flex items-center gap-1.5"><Clock size={12} className="text-slate-500" /> {req.date}</span>
                                <div className="w-px h-3 bg-slate-700" />
                                <span className="flex items-center gap-1.5"><MessageSquare size={12} className="text-slate-500" /> {req.replies?.length || 0}</span>
                              </div>
                              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1A1A2E] border border-indigo-900/30 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/40 transition-all shrink-0">
                                <ChevronRight className="text-slate-500 group-hover:text-indigo-400 transition-colors" size={16} />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                </DashboardCard>
              );

              return null;
            })}
          </motion.div>
        </SortableContext>
      </DndContext>

      {/* ====== NEW REQUEST DRAWER ====== */}
      <AnimatePresence>
        {isNewRequestModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setIsNewRequestModal(false)} />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="w-full max-w-md bg-[#13131F] border-l border-indigo-900/40 h-full shadow-2xl flex flex-col relative z-10"
            >
              <div className="p-6 border-b border-indigo-900/40 flex justify-between items-center bg-[#1A1A2E]">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2"><Plus size={20} className="text-indigo-400" /> New Request</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Submit a new service request</p>
                </div>
                <button onClick={() => setIsNewRequestModal(false)} className="p-2 rounded-full bg-[#13131F] border border-indigo-900/40 text-slate-400 hover:text-red-400 hover:border-red-900/50 hover:bg-red-950/20 transition-all">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto space-y-5 custom-scrollbar">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Category</label>
                  <select
                    value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0F0F1A] border border-indigo-900/40 focus:border-indigo-500/60 rounded-xl text-slate-200 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all appearance-none"
                  >
                    {requestTypes && requestTypes.map((rt: any) => (
                      <option key={rt.request_type_id} value={rt.request_type_id} className="bg-[#0F0F1A]">{rt.request_type_name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Priority</label>
                  <select
                    value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0F0F1A] border border-indigo-900/40 focus:border-indigo-500/60 rounded-xl text-slate-200 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all appearance-none"
                  >
                    <option value="Low" className="bg-[#0F0F1A]">Low</option>
                    <option value="Medium" className="bg-[#0F0F1A]">Medium</option>
                    <option value="High" className="bg-[#0F0F1A]">High</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Brief Title</label>
                  <input
                    value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Summarize your issue..."
                    className="w-full px-4 py-3 bg-[#0F0F1A] border border-indigo-900/40 focus:border-indigo-500/60 rounded-xl text-slate-200 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Detailed Description</label>
                  <textarea
                    value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the issue in detail..."
                    className="w-full px-4 py-3 bg-[#0F0F1A] border border-indigo-900/40 focus:border-indigo-500/60 rounded-xl text-slate-200 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all h-32 resize-none placeholder:text-slate-600"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-indigo-900/40 bg-[#1A1A2E]">
                <button
                  onClick={handleCreateSubmit} disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
                >
                  {loading && <Loader2 className="animate-spin" size={16} />}
                  Submit Request
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== DETAILS DRAWER ====== */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="w-full max-w-md bg-[#13131F] border-l border-indigo-900/40 h-full shadow-2xl flex flex-col relative z-10"
            >
              <div className="p-6 border-b border-indigo-900/40 bg-[#1A1A2E] flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">{selectedRequest.id}</span>
                  <h3 className="text-lg font-black text-white mt-1 leading-snug">{selectedRequest.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                    <span className="text-xs text-slate-500 font-medium self-center">IT Support Team</span>
                  </div>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-2 rounded-full bg-[#0F0F1A] border border-indigo-900/40 text-slate-400 hover:text-red-400 hover:border-red-900/50 transition-all shrink-0">
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Updates & Replies</h5>
                {selectedRequest.replies && selectedRequest.replies.length > 0 ? (
                  selectedRequest.replies.map((reply: any, i: number) => (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      key={i}
                      className={`p-4 rounded-xl text-sm font-medium border ${reply.from === 'Technician' || reply.from === 'You' && i === selectedRequest.replies.length - 1
                        ? reply.from === 'Technician'
                          ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-100'
                          : 'bg-[#1A1A2E] border-indigo-900/30 text-slate-200'
                        : 'bg-[#1A1A2E] border-indigo-900/30 text-slate-200'
                        }`}
                    >
                      <div className="flex justify-between items-center mb-1.5 opacity-70">
                        <span className="font-black text-[10px] uppercase tracking-wider">{reply.from}</span>
                        <span className="text-[10px]">{reply.time}</span>
                      </div>
                      {reply.msg}
                    </motion.div>
                  ))
                ) : (
                  <div className="py-10 text-center space-y-2">
                    <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-full flex items-center justify-center mx-auto text-indigo-400">
                      <MessageSquare size={20} />
                    </div>
                    <p className="text-sm font-medium text-slate-500">No replies yet.</p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-indigo-900/40 bg-[#1A1A2E]">
                <div className="relative">
                  <input
                    placeholder="Type a message..."
                    className="w-full pr-12 pl-4 py-3 bg-[#0F0F1A] border border-indigo-900/40 focus:border-indigo-500/50 rounded-xl text-slate-200 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-600"
                    value={replyMsg}
                    onChange={(e) => setReplyMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  />
                  <button
                    onClick={handleSendReply} disabled={!replyMsg.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-500 disabled:opacity-40 transition-all active:scale-90"
                  >
                    <Send size={14} />
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