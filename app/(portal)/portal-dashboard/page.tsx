"use client";
import React, { useState } from 'react';
import { 
  Plus, Search, Clock, CheckCircle2, 
  AlertCircle, Filter, Send, Image as ImageIcon,
  ChevronRight, LayoutGrid
} from 'lucide-react';

export default function RequestorDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([
    { id: 'SR-2005', subject: 'Printer not working', type: 'Hardware', dept: 'IT Support', status: 'Pending', date: '12 Jan 2026' },
    { id: 'SR-2004', subject: 'AC making noise', type: 'Maintenance', dept: 'Electrical', status: 'In Progress', date: '10 Jan 2026' },
    { id: 'SR-2001', subject: 'Software Update', type: 'Software', dept: 'IT Support', status: 'Completed', date: '05 Jan 2026' },
  ]);

  return (
    <div className="space-y-8">
      {/* Upper Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <LayoutGrid className="text-blue-600" size={32} /> Portal Dashboard
          </h1>
          <p className="text-slate-500 font-medium">Welcome back! Raise and track your service requests.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-[24px] font-black flex items-center gap-2 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={20} /> Raise New Request
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: 12, color: 'text-slate-600', bg: 'bg-slate-50' },
          { label: 'Pending', count: 3, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Active', count: 4, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Closed', count: 5, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-6 rounded-[32px] border border-white/50 shadow-sm`}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className={`text-2xl font-black ${stat.color}`}>{stat.count}</h3>
          </div>
        ))}
      </div>

      {/* Request Tracking Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4">
          <h2 className="text-xl font-black text-slate-800">Recent Requests</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search request ID..." 
              className="pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold w-full md:w-64 outline-none focus:ring-2 ring-blue-500/10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Request Details</th>
                <th className="px-8 py-5">Department</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-blue-600 mb-1">{req.id}</span>
                      <span className="font-bold text-slate-800">{req.subject}</span>
                      <span className="text-xs text-slate-400 mt-1">Raised on {req.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                      {req.dept}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        req.status === 'Completed' ? 'bg-emerald-500' : 
                        req.status === 'In Progress' ? 'bg-blue-500' : 'bg-amber-500'
                      }`} />
                      <span className="text-xs font-black text-slate-700">{req.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-[45px] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black text-slate-900">New Service Request</h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-slate-50 p-3 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Service Department</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:bg-white focus:border-blue-500/20">
                  <option>Choose Dept...</option>
                  <option>IT Support</option>
                  <option>Electrical</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Request Type</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:bg-white focus:border-blue-500/20">
                  <option>Choose Category...</option>
                  <option>Hardware Issue</option>
                  <option>Software Installation</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Brief Subject</label>
                <input type="text" placeholder="e.g. Printer not responding in Room 101" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:bg-white focus:border-blue-500/20" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Issue Description</label>
                <textarea rows={3} placeholder="Provide details about the problem..." className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold outline-none focus:bg-white focus:border-blue-500/20 resize-none"></textarea>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <button className="flex-1 bg-slate-100 text-slate-600 font-black py-5 rounded-[24px] flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                <ImageIcon size={20} /> Attach Evidence
              </button>
              <button className="flex-1 bg-blue-600 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-2 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
                <Send size={20} /> Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}