"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  Wrench, CheckCircle2, Clock,
  MessageSquare, ChevronRight,
  AlertCircle, Loader2, Send, X, BarChart3,
  ArrowUpRight, TrendingUp, Activity
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { updateTaskStatus } from './actions';

// CountUp Hook
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

interface Props {
  initialTasks: any[];
  currentUserId: number;
}

const PIE_COLORS = ['#F59E0B', '#6366F1', '#10B981'];

export default function TechnicianDashboardClient({ initialTasks, currentUserId }: Props) {
  const router = useRouter();
  const [requests, setRequests] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleUpdateStatus = async (task: any, newStatus: string) => {
    setRequests(requests.map(req =>
      req.id === task.id ? { ...req, status: newStatus } : req
    ));
    try {
      const res = await updateTaskStatus(task.realId, newStatus);
      if (!res.success) {
        alert("Failed to update status!"); 
        router.refresh(); 
      }
    } catch (e) { 
      alert("Network Error"); 
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/request-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: selectedTask.realId,
          user_id: currentUserId,
          reply_text: replyMessage,
          status_id: selectedTask.status_id || 2
        })
      });
      if (response.ok) {
        alert("Update sent to User!");
        setReplyMessage('');
        setSelectedTask(null);
        router.refresh();
      } else { alert("Error sending update."); }
    } catch (e) { alert("System Error"); }
    setLoading(false);
  };

  const getStatusStyle = (status: string) => {
    if (status.includes('Pending')) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    if (status.includes('Progress')) return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
    if (status.includes('Completed') || status.includes('Resolved')) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
  };

  const pendingCount = useCountUp(requests.filter(r => r.status.includes('Pending')).length);
  const activeCount = useCountUp(requests.filter(r => r.status.includes('Progress')).length);
  const finishedCount = useCountUp(requests.filter(r => r.status.includes('Completed') || r.status.includes('Resolved')).length);

  // Analytics data
  const pieData = [
    { name: 'Pending', value: requests.filter(r => r.status.includes('Pending')).length || 0 },
    { name: 'In Progress', value: requests.filter(r => r.status.includes('Progress')).length || 0 },
    { name: 'Resolved', value: requests.filter(r => r.status.includes('Completed') || r.status.includes('Resolved')).length || 0 },
  ].filter(d => d.value > 0);

  const barData = useMemo(() => {
    const typeCounts: Record<string, number> = {};
    requests.forEach(r => { typeCounts[r.type] = (typeCounts[r.type] || 0) + 1; });
    return Object.entries(typeCounts).slice(0, 5).map(([name, count]) => ({ name: name.split(' ')[0], count }));
  }, [requests]);

  if (!mounted) return <div className="min-h-screen bg-[#0F0F1A]" />;

  return (
    <div className="space-y-6 pb-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#1A1A2E] rounded-2xl border border-indigo-900/40 p-6 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-violet-500 to-indigo-500" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 border border-violet-400/20">
            <Wrench size={26} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight">Technician Workspace</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-widest">TECH</span>
            </div>
            <p className="text-slate-400 font-medium text-sm mt-0.5">Manage and resolve your assigned service tasks.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 md:mt-0 relative z-10">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-[#13131F] px-3 py-1.5 rounded-lg border border-indigo-900/30">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            Active Session
          </div>
        </div>
      </motion.div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pending', count: pendingCount, icon: <AlertCircle size={28} strokeWidth={2} />, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'hover:shadow-amber-500/10' },
          { label: 'In Progress', count: activeCount, icon: <Clock size={28} strokeWidth={2} />, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', glow: 'hover:shadow-indigo-500/10' },
          { label: 'Resolved', count: finishedCount, icon: <CheckCircle2 size={28} strokeWidth={2} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'hover:shadow-emerald-500/10' },
        ].map((stat, i) => (
          <motion.div
            key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className={`group relative overflow-hidden bg-[#1A1A2E] rounded-2xl border border-indigo-900/40 p-6 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl ${stat.glow}`}
          >
            <div className="flex items-center gap-5">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl border ${stat.border} transform group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-white tracking-tighter">
                  {stat.count} <span className="text-base text-slate-500 font-bold tracking-normal">Tasks</span>
                </h3>
              </div>
            </div>
            <div className="absolute top-0 right-0 flex items-center gap-1 text-[10px] font-bold text-slate-600 p-3">
              <ArrowUpRight size={12} className="text-emerald-400" /> Live
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
        className="bg-[#1A1A2E] rounded-2xl border border-indigo-900/40 p-6 hover:border-indigo-500/40 transition-colors"
      >
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 size={18} className="text-indigo-400" />
          <h3 className="text-base font-bold text-slate-200 tracking-tight">Task Analytics Overview</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Pie */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Activity size={13} /> Status Distribution
            </p>
            <div className="h-[220px]">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none" animationDuration={1200}>
                      {pieData.map((_, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: '#13131F', borderRadius: '12px', borderColor: '#4F46E5', color: 'white', fontWeight: 'bold' }} />
                    <Legend iconType="circle" formatter={(v) => <span className="text-slate-400 text-xs font-medium ml-1">{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm font-medium">No data to display</div>
              )}
            </div>
          </div>

          {/* Tasks by Type Bar */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <TrendingUp size={13} /> Tasks by Type
            </p>
            <div className="h-[220px]">
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#13131F', borderRadius: '12px', borderColor: '#4F46E5', color: 'white', fontWeight: 'bold' }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={1200}>
                      {barData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366F1' : '#8B5CF6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm font-medium">No task data yet</div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Task Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Assigned Tasks</h3>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">{requests.length}</span>
        </div>

        {requests.map((task, idx) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
            className="bg-[#1A1A2E] rounded-2xl border border-indigo-900/40 p-6 hover:border-indigo-500/40 hover:shadow-[0_4px_24px_rgba(99,102,241,0.08)] transition-all duration-300 group"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-lg border border-indigo-500/20 uppercase tracking-widest font-mono">{task.id}</span>
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest ${getStatusStyle(task.status)}`}>{task.status}</span>
                </div>
                <h3 className="text-xl font-black tracking-tight text-white group-hover:text-indigo-300 transition-colors">{task.type}</h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-2xl">{task.desc}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold bg-[#13131F] w-fit px-4 py-2 rounded-lg border border-indigo-900/30">
                  <span className="text-slate-300">{task.user}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-600" />
                  <Clock size={11} className="text-slate-500" />
                  <span>{task.date}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col justify-end gap-3 min-w-[220px] pt-4 lg:pt-0 border-t lg:border-t-0 border-indigo-900/30 lg:border-l lg:border-indigo-900/30 lg:pl-6">
                {(!task.status.includes('Completed') && !task.status.includes('Resolved')) ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(task, task.status.includes('Pending') ? 'In Progress' : 'Resolved')}
                      className="flex-1 w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3 px-5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all group/btn"
                    >
                      {task.status.includes('Pending') ? 'Start Working' : 'Close Ticket'}
                      <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="flex-1 w-full bg-[#13131F] hover:bg-indigo-950/40 text-slate-300 hover:text-white font-bold py-3 px-5 rounded-xl text-sm flex items-center justify-center gap-2 border border-indigo-900/40 hover:border-indigo-500/40 active:scale-95 transition-all"
                    >
                      <MessageSquare size={16} className="text-indigo-400" /> Update & Reply
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 py-6 px-5 rounded-xl w-full h-full min-h-[100px]">
                    <div className="text-center space-y-2">
                      <CheckCircle2 className="text-emerald-400 mx-auto" size={28} />
                      <p className="text-emerald-300 font-black text-[10px] uppercase tracking-widest">Successfully Closed</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {requests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-[#1A1A2E] rounded-2xl border border-indigo-900/40 p-16 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">All Caught Up!</h3>
              <p className="text-slate-400 font-medium mt-2 text-sm">No tasks are currently assigned to you.</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* ====== POST UPDATE MODAL ====== */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedTask(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full max-w-lg bg-[#13131F] border border-indigo-900/40 rounded-2xl shadow-2xl overflow-hidden relative z-10"
            >
              <div className="p-6 border-b border-indigo-900/40 bg-[#1A1A2E] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-white">Post Update</h2>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">{selectedTask.id}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-600" />
                    <span className="text-[10px] font-bold text-slate-400 line-clamp-1">{selectedTask.type}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedTask(null)} className="p-2 rounded-full bg-[#0F0F1A] border border-indigo-900/40 text-slate-400 hover:text-red-400 hover:border-red-900/50 transition-all">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-5 bg-[#13131F]">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Work Status / Message to User</label>
                  <textarea
                    className="w-full px-4 py-3.5 bg-[#0F0F1A] border border-indigo-900/40 focus:border-indigo-500/60 rounded-xl text-slate-200 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500/30 min-h-[140px] resize-none transition-all placeholder:text-slate-600"
                    placeholder="Describe what you have done or ask user for more information..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleSendReply}
                  disabled={loading || !replyMessage.trim()}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  Send Update to User
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}