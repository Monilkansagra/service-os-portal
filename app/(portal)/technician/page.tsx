"use client";
import React, { useState } from 'react';
import { 
  Wrench, CheckCircle2, Clock, 
  MessageSquare, ChevronRight, Filter,
  Search, AlertCircle, Loader2
} from 'lucide-react';

export default function TechnicianDashboard() {
  // 1. Assigned Requests State (Sample Data)
  const [requests, setRequests] = useState([
    { id: 'SR-1001', type: 'Hardware Repair', priority: 'High', status: 'Pending', date: '2023-10-24', user: 'Monil Kansagra', desc: 'Printer not responding in IT Dept.' },
    { id: 'SR-1002', type: 'Software Install', priority: 'Medium', status: 'In Progress', date: '2023-10-25', user: 'Rahul Shah', desc: 'Need MS Office activation on Room 402.' },
    { id: 'SR-1003', type: 'Wiring Issue', priority: 'Urgent', status: 'In Progress', date: '2023-10-26', user: 'Amit Patel', desc: 'Main server room light flickering.' },
  ]);

  // 2. Status Update Function
  const updateStatus = (id: string, newStatus: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
  };

  // Helper for Status Styles
  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Wrench className="text-blue-600" size={32} /> Technician Workspace
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage your assigned service tasks and updates</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2 px-4">
            <Clock className="text-blue-500" size={18} />
            <span className="text-sm font-black text-slate-700">Shift: 09:00 - 18:00</span>
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Assigned', count: requests.length, icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'In Progress', count: requests.filter(r => r.status === 'In Progress').length, icon: Loader2, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Completed', count: requests.filter(r => r.status === 'Completed').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{stat.count} Tasks</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Task List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-black text-slate-800">Your Active Tasks</h2>
          <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:underline">
            <Filter size={16} /> Filter List
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {requests.map((task) => (
            <div key={task.id} className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                
                {/* Task Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-tighter">
                      {task.id}
                    </span>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase border ${getStatusStyle(task.status)}`}>
                      {task.status}
                    </span>
                    {task.priority === 'Urgent' && (
                      <span className="animate-pulse bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Urgent</span>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-black text-slate-800">{task.type}</h3>
                    <p className="text-slate-500 text-sm font-medium mt-1">{task.desc}</p>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px]">MK</div>
                      Requested by {task.user}
                    </div>
                    <div className="text-slate-400 text-xs font-bold flex items-center gap-1">
                      <Clock size={14} /> Assigned on {task.date}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row lg:flex-col justify-end gap-3 min-w-[180px]">
                  {task.status !== 'Completed' ? (
                    <>
                      <button 
                        onClick={() => updateStatus(task.id, task.status === 'Pending' ? 'In Progress' : 'Completed')}
                        className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                      >
                        {task.status === 'Pending' ? 'Start Task' : 'Mark as Done'}
                        <ChevronRight size={16} />
                      </button>
                      <button className="flex-1 bg-slate-50 text-slate-600 font-bold py-4 rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors border border-slate-100">
                        <MessageSquare size={16} /> Post Reply
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center bg-emerald-50 border border-emerald-100 p-4 rounded-2xl w-full h-full">
                      <CheckCircle2 className="text-emerald-500 mb-1" size={24} />
                      <span className="text-emerald-700 font-black text-xs uppercase">Task Closed</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}