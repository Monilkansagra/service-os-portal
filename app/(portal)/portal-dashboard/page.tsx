"use client";
import React, { useState } from 'react';
import { 
  Plus, Search, Filter, Clock, CheckCircle2, 
  Settings, LayoutGrid, Sparkles
} from 'lucide-react';

export default function PortalDashboard() {
  const [mounted] = useState(true);

  const myRequests = [
    { id: 101, title: 'Printer Not Working', user: '@Anil Mehta', dept: 'IT Support', priority: 'HIGH', handledBy: 'WAITING...' },
    { id: 105, title: 'Light Flicker', user: '@Sneha Shah', dept: 'Electrical', priority: 'MEDIUM', handledBy: 'Suresh Patel' },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            Operations <span className="text-blue-600">Hub</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Real-time Service Management</p>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-full border border-slate-100 shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">System Live</span>
        </div>
      </div>

      {/* 3-Card Stats Section (Image Matching) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="relative overflow-hidden bg-blue-600 p-10 rounded-[48px] text-white shadow-2xl shadow-blue-200">
          <div className="absolute top-0 right-0 p-4 opacity-10"><LayoutGrid size={120} /></div>
          <h3 className="text-7xl font-black tracking-tighter italic">2</h3>
          <p className="text-xs font-black uppercase tracking-widest mt-2">Active Tickets</p>
        </div>

        <div className="bg-white p-10 rounded-[48px] border border-slate-50 shadow-xl shadow-slate-200/40 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-8 right-10 text-amber-50 opacity-50 group-hover:scale-110 transition-transform"><Clock size={64} /></div>
          <h3 className="text-7xl font-black tracking-tighter text-slate-800 italic">1</h3>
          <p className="text-xs font-black uppercase tracking-widest mt-2 text-amber-500">Awaiting Action</p>
        </div>

        <div className="bg-white p-10 rounded-[48px] border border-slate-50 shadow-xl shadow-slate-200/40 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-8 right-10 text-green-50 opacity-50 group-hover:scale-110 transition-transform"><CheckCircle2 size={64} /></div>
          <h3 className="text-7xl font-black tracking-tighter text-slate-800 italic">0</h3>
          <p className="text-xs font-black uppercase tracking-widest mt-2 text-green-500">Resolved Today</p>
        </div>
      </div>

      {/* Queue Table Section */}
      <div className="bg-white rounded-[56px] shadow-2xl shadow-slate-200/50 p-12 border border-slate-50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-4">
             <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
             <h2 className="text-3xl font-black text-slate-800 italic">Live Request Queue</h2>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-96">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input type="text" placeholder="Search ID or User..." className="w-full pl-16 pr-8 py-5 bg-slate-50 border-none rounded-[24px] text-sm font-bold focus:ring-4 ring-blue-500/5 transition-all outline-none" />
             </div>
             <button className="p-5 bg-slate-900 text-white rounded-[24px] hover:bg-blue-600 transition-all shadow-lg"><Filter size={20} /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] border-b border-slate-50">
                <th className="px-6 py-6">Request Detail</th>
                <th className="px-6 py-6 text-center">Priority</th>
                <th className="px-6 py-6 text-center">Handled By</th>
                <th className="px-6 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {myRequests.map((req) => (
                <tr key={req.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-6 py-10">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center text-blue-600 font-black text-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">{req.id}</div>
                       <div>
                         <div className="font-black text-slate-800 text-xl">{req.title}</div>
                         <div className="text-sm font-bold text-slate-400 mt-1">
                           <span className="text-blue-500">{req.user}</span> | {req.dept}
                         </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-10 text-center">
                    <span className={`px-5 py-2 rounded-full text-[10px] font-black tracking-widest border ${
                      req.priority === 'HIGH' ? 'bg-red-50 border-red-100 text-red-500' : 'bg-blue-50 border-blue-100 text-blue-500'
                    }`}>{req.priority}</span>
                  </td>
                  <td className="px-6 py-10 text-center font-black text-[11px] tracking-widest text-slate-300 uppercase italic">
                    {req.handledBy}
                  </td>
                  <td className="px-6 py-10 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center gap-2">
                        <Plus size={16} /> Assign
                      </button>
                      <button className="p-3.5 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-md"><Settings size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}