"use client";

import React, { useState } from 'react';
import {
  Wrench, CheckCircle2, Clock,
  MessageSquare, ChevronRight, Filter,
  AlertCircle, Loader2, Send, X
} from 'lucide-react';
// Actions replaced by Fetch API
import { useRouter } from 'next/navigation';

interface Props {
  initialTasks: any[];
  currentUserId: number;
}

export default function TechnicianDashboardClient({ initialTasks, currentUserId }: Props) {
  const router = useRouter();
  const [requests, setRequests] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Dynamic Status Update
  const handleUpdateStatus = async (task: any, newStatus: string) => {
    // Optimistic Update
    setRequests(requests.map(req =>
      req.id === task.id ? { ...req, status: newStatus } : req
    ));

    try {
      const response = await fetch(`/api/requests/${task.realId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status_name: newStatus,
          modified: new Date()
        })
      });

      if (!response.ok) {
        alert("Failed to update status in Database!");
        router.refresh();
      } else {
        router.refresh();
      }
    } catch (e) {
      alert("Network Error");
    }
  };

  // 2. Dynamic Reply
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
          status_id: selectedTask.status_id || 2 // Default Assigned/Progress
        })
      });

      if (response.ok) {
        alert("Update sent to User!");
        setReplyMessage('');
        setSelectedTask(null);
        router.refresh();
      } else {
        alert("Error sending update.");
      }
    } catch (e) {
      alert("System Error");
    }
    setLoading(false);
  };

  const getStatusStyle = (status: string) => {
    // Flexible matching for DB status names
    if (status.includes('Pending')) return 'bg-amber-100/50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20';
    if (status.includes('Progress')) return 'bg-indigo-100/50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20';
    if (status.includes('Completed') || status.includes('Resolved')) return 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20';
    return 'bg-slate-100/50 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border border-slate-200/50 dark:border-slate-500/20';
  };

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 flex items-center gap-3">
            <Wrench className="text-indigo-600 dark:text-indigo-400" size={32} /> Technician Workspace
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium mt-1.5">Manage and resolve assigned service tasks</p>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pending', count: requests.filter(r => r.status.includes('Pending')).length, icon: AlertCircle, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/20', border: 'hover:shadow-amber-500/10' },
          { label: 'Active', count: requests.filter(r => r.status.includes('Progress')).length, icon: Loader2, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-500/20', border: 'hover:shadow-indigo-500/10' },
          { label: 'Finished', count: requests.filter(r => r.status.includes('Completed') || r.status.includes('Resolved')).length, icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/20', border: 'hover:shadow-emerald-500/10' },
        ].map((stat, i) => (
          <div key={i} className={`group bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 rounded-[32px] border border-slate-200/50 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center gap-5 transition-all duration-300 hover:shadow-xl ${stat.border}`}>
            <div className={`${stat.bg} ${stat.color} p-4 sm:p-5 rounded-2xl transform group-hover:scale-110 transition-transform duration-300`}><stat.icon size={28} strokeWidth={2.5} /></div>
            <div>
              <p className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.count} <span className="text-lg text-slate-400 dark:text-slate-500 font-bold tracking-normal">Tasks</span></h3>
            </div>
          </div>
        ))}
      </div>

      {/* Task Cards List */}
      <div className="grid grid-cols-1 gap-6">
        {requests.map((task) => (
          <div key={task.id} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[32px] border border-slate-200/50 dark:border-slate-800/50 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(99,102,241,0.08)] transition-all duration-300 group">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] sm:text-xs font-black bg-indigo-100/50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-indigo-200/50 dark:border-indigo-500/20 uppercase tracking-widest">{task.id}</span>
                  <span className={`text-[10px] sm:text-xs font-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl uppercase tracking-widest ${getStatusStyle(task.status)}`}>{task.status}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{task.type}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium leading-relaxed max-w-3xl">{task.desc}</p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-semibold bg-white dark:bg-slate-800 w-fit px-4 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                  <span className="text-slate-600 dark:text-slate-300">{task.user}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                  <span>{task.date}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col justify-end gap-3 min-w-[240px] pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-200/50 dark:border-slate-800/50 lg:border-l lg:border-slate-200/50 dark:lg:border-slate-800/50 lg:pl-8">
                {(!task.status.includes('Completed') && !task.status.includes('Resolved')) ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(
                        task,
                        task.status.includes('Pending') ? 'In Progress' : 'Resolved'
                      )}
                      className="flex-1 w-full bg-indigo-600 text-white font-bold py-3.5 sm:py-4 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 active:scale-95 group/btn"
                    >
                      {task.status.includes('Pending') ? 'Start Working' : 'Close Ticket'}
                      <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="flex-1 w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3.5 sm:py-4 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
                    >
                      <MessageSquare size={18} className="text-slate-400 group-hover:text-indigo-500" /> Update & Reply
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center bg-emerald-100/50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 py-6 px-6 rounded-2xl w-full h-full min-h-[120px]">
                    <div className="text-center space-y-2">
                      <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 mx-auto" size={32} />
                      <p className="text-emerald-700 dark:text-emerald-300 font-black text-xs sm:text-sm uppercase tracking-widest">Successfully Closed</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[32px] border border-slate-200/50 dark:border-slate-800/50 p-16 flex flex-col items-center justify-center text-center space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <CheckCircle2 size={32} className="text-slate-300 dark:text-slate-600" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200">All caught up!</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">No tasks assigned to you right now.</p>
            </div>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedTask(null)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden relative z-10 border border-slate-200/50 dark:border-slate-800/50 transform transition-all animate-in slide-in-from-bottom sm:slide-in-from-bottom-8 duration-300">
            <div className="p-6 sm:p-8 border-b border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Post Update</h2>
                <div className="flex gap-2 items-center mt-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedTask.id}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                  <span className="text-[10px] font-bold text-slate-400 line-clamp-1 flex-1">{selectedTask.type}</span>
                </div>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-2.5 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full text-slate-500 hover:text-red-500 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/40"><X size={20} className="stroke-[2.5]" /></button>
            </div>
            <div className="p-6 sm:p-8 space-y-8 bg-white dark:bg-slate-900">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-2 block">Work Status / Message to User</label>
                <textarea
                  className="w-full p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl sm:rounded-3xl font-medium text-slate-800 dark:text-slate-200 text-sm sm:text-base outline-none border border-slate-200/50 dark:border-slate-700/50 focus:border-indigo-500/50 dark:focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 min-h-[160px] resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner"
                  placeholder="Describe what you have done or ask user for more information..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                ></textarea>
              </div>
              <button
                onClick={handleSendReply}
                disabled={loading || !replyMessage.trim()}
                className="w-full bg-indigo-600 text-white py-4 sm:py-5 rounded-2xl sm:rounded-[24px] font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 active:translate-y-0 disabled:hover:translate-y-0"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                Send Update to User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}