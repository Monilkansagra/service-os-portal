"use client";
import React, { useState } from 'react';
import { 
  Wrench, CheckCircle, Clock, AlertCircle, 
  MessageSquare, ExternalLink, Send 
} from 'lucide-react';

export default function TechnicianDashboard() {
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Mock data representing ServiceRequest records assigned to this Tech
  const myTasks = [
    { id: 1, reqNo: 'REQ-IT-001', title: 'Keyboard Not Working', priority: 'Medium', date: '2023-11-05', status: 'Assigned' },
    { id: 2, reqNo: 'REQ-IT-004', title: 'Server Down in Block A', priority: 'High', date: '2023-11-06', status: 'In Progress' },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Wrench className="text-blue-600" /> Technician Portal
          </h1>
          <p className="text-slate-500">Manage your assigned service tasks and updates</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white px-4 py-2 rounded-xl border font-bold text-blue-600 shadow-sm">
            Total Tasks: 05
          </div>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myTasks.map((task) => (
          <div key={task.id} className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                task.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {task.priority} Priority
              </span>
              <span className="text-xs text-slate-400 font-medium">{task.date}</span>
            </div>
            
            <h3 className="font-bold text-slate-800 text-lg mb-1">{task.title}</h3>
            <p className="text-sm text-slate-400 mb-6 font-mono">{task.reqNo}</p>

            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-600">Status: {task.status}</span>
            </div>

            <button 
              onClick={() => setSelectedTask(task)}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
            >
              Update Progress <ExternalLink size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Reply Modal - Connects to ServiceRequestReply table */}
      {selectedTask && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-[32px] shadow-2xl p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black text-slate-800">Submit Resolution</h2>
                <p className="text-sm text-slate-500">Reference: {selectedTask.reqNo}</p>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-600 font-bold">Close</button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-blue-500/10 font-bold">
                  <option>In Progress</option>
                  <option>Waiting for Spare Parts</option>
                  <option>Resolved / Completed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Resolution Details (Reply Description)</label>
                <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none h-32 resize-none"
                  placeholder="Describe the work done or issues faced..."
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                <AlertCircle className="text-blue-600 mt-1" size={20} />
                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                  Submitting a 'Resolved' status will notify the department head and the user that the request is fulfilled.
                </p>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
              Send Update <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}