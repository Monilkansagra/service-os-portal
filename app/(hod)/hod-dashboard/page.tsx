"use client";
import React from 'react';
import { 
  Users, 
  Activity, 
  Clock3, 
  TrendingUp, 
  ArrowUpRight,
  MoreHorizontal,
  CheckCircle
} from 'lucide-react';

export default function HODDashboard() {
  const stats = [
    { label: "Team Members", value: "12", icon: <Users />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Requests Resolved", value: "84%", icon: <CheckCircle />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending Approvals", value: "05", icon: <Clock3 />, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight italic">
            Dept. <span className="text-emerald-600">Analytics</span>
          </h1>
          <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">Monitoring Department Health</p>
        </div>
        <div className="flex gap-2">
           <div className="px-5 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
              <Activity className="text-emerald-500" size={16} />
              <span className="text-[10px] font-black uppercase text-slate-500">Peak Performance</span>
           </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-50 group hover:scale-[1.02] transition-all cursor-default">
            <div className="flex justify-between items-start mb-4">
               <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl group-hover:rotate-6 transition-transform`}>
                 {stat.icon}
               </div>
               <ArrowUpRight className="text-slate-200" size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-4xl font-black text-slate-800 mt-1 tracking-tighter">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Quick Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Approvals / Activity */}
        <div className="bg-white p-10 rounded-[48px] shadow-2xl shadow-slate-200/40 border border-slate-50">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Recent Activity</h2>
              <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><MoreHorizontal size={20} className="text-slate-400" /></button>
           </div>
           
           <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-colors">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black">#</div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-800">New Software Request</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applied by Rahul Sharma</p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg uppercase">Auto-Assigned</span>
                </div>
              ))}
           </div>
        </div>

        {/* Team Efficiency Chart Placeholder */}
        <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl shadow-blue-900/10 text-white flex flex-col justify-between relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-xl font-black tracking-tight">Efficiency Score</h2>
              <p className="text-slate-400 text-xs mt-1">Based on last 30 days of ticket resolution.</p>
           </div>
           
           <div className="mt-12 flex items-end gap-3 h-32 relative z-10">
              {[40, 70, 45, 90, 65, 80].map((h, idx) => (
                <div key={idx} className="flex-1 bg-emerald-500 rounded-t-xl transition-all hover:bg-white cursor-pointer" style={{ height: `${h}%` }}></div>
              ))}
           </div>

           <div className="mt-8 flex justify-between items-center relative z-10">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-500">Overall Rating</p>
                <p className="text-2xl font-black tracking-tighter text-emerald-400 italic">Excellent</p>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                 <TrendingUp size={24} className="text-emerald-400" />
              </div>
           </div>

           {/* Decorative background element */}
           <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}