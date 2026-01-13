"use client";
import React, { useState } from 'react';
import { 
  Users2, Plus, Search, 
  Mail, Phone, ShieldCheck, 
  Wrench, Trash2, Edit2, 
  MoreVertical, Filter 
} from 'lucide-react';

export default function DepartmentPersonMaster() {
  // 1. Mock Data for Personnel
  const [staff, setStaff] = useState([
    { id: 1, name: 'Vijay Shah', role: 'HOD', dept: 'IT Support', email: 'vijay@company.com', phone: '+91 98765 43210' },
    { id: 2, name: 'Rahul Sharma', role: 'Technician', dept: 'IT Support', email: 'rahul@company.com', phone: '+91 98765 43211' },
    { id: 3, name: 'Amit Patel', role: 'HOD', dept: 'Maintenance', email: 'amit@company.com', phone: '+91 98765 43212' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function for Role Badges
  const getRoleBadge = (role: string) => {
    return role === 'HOD' 
      ? 'bg-blue-50 text-blue-600 border-blue-100' 
      : 'bg-emerald-50 text-emerald-600 border-emerald-100';
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Users2 className="text-blue-600" size={32} /> Personnel Master
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage staff, roles, and department assignments</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-[24px] font-black flex items-center gap-2 shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95"
        >
          <Plus size={20} /> Add Staff Member
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email or department..." 
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[24px] text-sm font-bold outline-none focus:ring-4 ring-blue-500/5 transition-all shadow-sm"
          />
        </div>
        <button className="px-6 py-4 bg-white border border-slate-100 rounded-[24px] text-slate-500 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
          <Filter size={18} /> Filters
        </button>
      </div>

      {/* Staff Grid/Table */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {staff.map((person) => (
          <div key={person.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-50 transition-colors" />
            
            <div className="flex flex-col sm:flex-row gap-6 relative">
              {/* Avatar */}
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-2xl font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                {person.name.split(' ').map(n => n[0]).join('')}
              </div>

              {/* Details */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-slate-800">{person.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getRoleBadge(person.role)}`}>
                        {person.role === 'HOD' ? <ShieldCheck size={10} className="inline mr-1" /> : <Wrench size={10} className="inline mr-1" />}
                        {person.role}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                        {person.dept}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Edit2 size={16}/></button>
                    <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Mail size={14} className="text-slate-300" /> {person.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Phone size={14} className="text-slate-300" /> {person.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}