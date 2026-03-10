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
    if (status.includes('Pending')) return 'bg-amber-50 text-amber-600 border-amber-100';
    if (status.includes('Progress')) return 'bg-blue-50 text-blue-600 border-blue-100';
    if (status.includes('Completed') || status.includes('Resolved')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    return 'bg-slate-50 text-slate-600';
  };

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Wrench className="text-blue-600" size={32} /> Technician Workspace
          </h1>
          <p className="text-slate-400 font-medium">Manage and resolve assigned service tasks</p>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Pending', count: requests.filter(r => r.status.includes('Pending')).length, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Active', count: requests.filter(r => r.status.includes('Progress')).length, icon: Loader2, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Finished', count: requests.filter(r => r.status.includes('Completed') || r.status.includes('Resolved')).length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}><stat.icon size={24} /></div>
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{stat.count} Tasks</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Task Cards List */}
      <div className="grid grid-cols-1 gap-4">
        {requests.map((task) => (
          <div key={task.id} className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col lg:flex-row justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase">{task.id}</span>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase border ${getStatusStyle(task.status)}`}>{task.status}</span>
                </div>
                <h3 className="text-xl font-black text-slate-800">{task.type}</h3>
                <p className="text-slate-400 text-sm font-medium">{task.desc}</p>
                <p className="text-xs text-slate-400 font-bold italic">Requested by: {task.user} on {task.date}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row lg:flex-col justify-end gap-3 min-w-[200px]">
                {(!task.status.includes('Completed') && !task.status.includes('Resolved')) ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(
                        task,
                        task.status.includes('Pending') ? 'In Progress' : 'Resolved'
                      )}
                      className="flex-1 bg-blue-600 text-white font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-blue-100"
                    >
                      {task.status.includes('Pending') ? 'Start Working' : 'Close Ticket'}
                      <ChevronRight size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="flex-1 bg-slate-50 text-slate-600 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-100 hover:bg-white transition-all"
                    >
                      <MessageSquare size={16} /> Update & Reply
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center bg-emerald-50 border border-emerald-100 p-4 rounded-xl w-full">
                    <CheckCircle2 className="text-emerald-500 mr-2" size={20} />
                    <span className="text-emerald-700 font-black text-xs uppercase">Successfully Closed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="text-center py-10 text-slate-400 font-bold">No tasks assigned to you.</div>
        )}
      </div>

      {/* Reply Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-xl font-black text-slate-900">Post Update</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedTask.id}</p>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Work Status / Message to User</label>
                <textarea
                  className="w-full p-5 bg-slate-50 rounded-3xl font-bold outline-none border-2 border-transparent focus:border-blue-500/10 min-h-[150px] text-sm"
                  placeholder="Describe what you have done or ask user for more info..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                ></textarea>
              </div>
              <button
                onClick={handleSendReply}
                disabled={loading}
                className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                Send Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}