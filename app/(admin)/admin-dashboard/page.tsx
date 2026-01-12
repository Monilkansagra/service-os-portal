"use client";
import React from 'react';
import { Users, Building, Activity, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
  const systemStats = [
    { label: "Total Users", value: "1,240", icon: <Users />, color: "text-blue-600" },
    { label: "Departments", value: "18", icon: <Building />, color: "text-indigo-600" },
    { label: "Active Services", value: "42", icon: <Activity />, color: "text-purple-600" },
    { label: "System Health", value: "99.9%", icon: <ShieldCheck />, color: "text-emerald-600" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">System <span className="text-indigo-600 italic">Overview</span></h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Administrator Control Panel</p>
        </div>
        <div className="px-6 py-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200 font-bold text-sm">
          Generate Report
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${stat.color} mb-6 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-indigo-900 rounded-[48px] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
           <h2 className="text-3xl font-black mb-4">Welcome back, Super Admin!</h2>
           <p className="text-indigo-200 font-medium leading-relaxed">
             Everything is running smoothly. There are 4 new department requests and 2 service updates pending your review.
           </p>
           <button className="mt-8 px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-indigo-50 transition-colors">
             View Requests <ArrowUpRight size={18} />
           </button>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>
    </div>
  );
}