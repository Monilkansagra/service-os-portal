"use client";

import React from 'react';
import { 
  Users, Building, Activity, 
  FileText, ArrowUpRight, Printer 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardProps {
  stats: {
    totalUsers: number;
    departments: number;
    activeServices: number;
    totalRequests: number;
  }
}

export default function AdminDashboardClient({ stats }: DashboardProps) {
  const router = useRouter();

  // Handle "Generate Report" - For now, triggers print dialog
  const handleGenerateReport = () => {
    window.print(); 
  };

  const systemStats = [
    { 
      label: "Total Active Users", 
      value: stats.totalUsers.toLocaleString(), 
      icon: <Users />, 
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      label: "Departments", 
      value: stats.departments.toString(), 
      icon: <Building />, 
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    { 
      label: "Service Types", 
      value: stats.activeServices.toString(), 
      icon: <Activity />, 
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    { 
      label: "Total Requests", 
      value: stats.totalRequests.toLocaleString(), 
      icon: <FileText />, 
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
  ];

  return (
    <div className="space-y-10 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            System <span className="text-indigo-600 italic">Overview</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
            Administrator Control Panel
          </p>
        </div>
        
        <button 
          onClick={handleGenerateReport}
          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200 font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Printer size={18} /> Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} mb-6 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {stat.label}
            </p>
            <h3 className="text-3xl font-black text-slate-800 mt-1">
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Welcome / Action Banner */}
      <div className="bg-indigo-900 rounded-[48px] p-12 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
           <h2 className="text-3xl font-black mb-4">Welcome back, Admin!</h2>
           <p className="text-indigo-200 font-medium leading-relaxed">
             The system is currently tracking <strong>{stats.totalRequests} service requests</strong> across <strong>{stats.departments} departments</strong>. 
             Click below to manage request mappings or view detailed logs.
           </p>
           
           <div className="flex gap-4 mt-8">
             <Link 
               href="/request-mapping" 
               className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-indigo-50 transition-colors"
             >
               Request Mapping <ArrowUpRight size={18} />
             </Link>
             
             <Link 
               href="/department-person-master" 
               className="px-8 py-4 bg-indigo-800/50 backdrop-blur-sm text-white border border-indigo-700 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-indigo-800 transition-colors"
             >
               Manage Staff
             </Link>
           </div>
        </div>
        
        {/* Decorative Background Blur */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>
    </div>
  );
}