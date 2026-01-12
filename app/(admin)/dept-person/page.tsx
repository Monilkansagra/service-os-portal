"use client";
import React, { useState } from 'react';
import { Plus, UserCog, Search, ShieldCheck, User, Calendar, Edit, Trash2 } from 'lucide-react';

export default function DeptPersonMapping() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock Data for Table
  const mappings = [
    { id: 1, dept: 'IT Support', name: 'John Doe', role: 'HOD', fromDate: '2023-01-01', active: true },
    { id: 2, dept: 'IT Support', name: 'Mike Ross', role: 'Technician', fromDate: '2023-02-15', active: true },
    { id: 3, dept: 'Electrical', name: 'Sarah Connor', role: 'HOD', fromDate: '2023-01-10', active: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <UserCog className="text-blue-600" /> Dept Person Mapping
          </h1>
          <p className="text-slate-500 text-sm">Assign staff to departments and designate HODs</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <Plus size={20} /> Map New Person
        </button>
      </div>

      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 ring-blue-500/5 transition-all"
          />
        </div>
        <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-600 font-medium">
          <option>All Departments</option>
          <option>IT Support</option>
          <option>Electrical</option>
        </select>
      </div>

      {/* Mapping List Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-8 py-5">Staff Member</th>
              <th className="px-8 py-5">Department</th>
              <th className="px-8 py-5">Role Type</th>
              <th className="px-8 py-5">Since</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mappings.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                      <User size={20} />
                    </div>
                    <div className="font-bold text-slate-800">{item.name}</div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-slate-600 font-medium">{item.dept}</span>
                </td>
                <td className="px-8 py-5">
                  {item.role === 'HOD' ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black border border-amber-100">
                      <ShieldCheck size={12} /> HOD
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black border border-blue-100">
                      <User size={12} /> TECHNICIAN
                    </span>
                  )}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Calendar size={14} /> {item.fromDate}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all"><Edit size={16} /></button>
                    <button className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - Mapping Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl p-10 space-y-6 border border-white">
            <h2 className="text-2xl font-black text-slate-800">Map Staff to Dept</h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Staff</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-blue-500/10 transition-all">
                  <option>Select Member...</option>
                  <option value="1">John Doe</option>
                  <option value="2">Mike Ross</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Assign to Department</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-blue-500/10 transition-all">
                  <option>Select Department...</option>
                  <option value="1">IT Support</option>
                  <option value="2">Electrical</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <input type="checkbox" id="isHOD" className="w-5 h-5 accent-blue-600" />
                <label htmlFor="isHOD" className="text-sm font-bold text-blue-700">Designate as Head of Department (HOD)</label>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">From Date</label>
                  <input type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">To Date (Optional)</label>
                  <input type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100">Save Assignment</button>
              <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-50 text-slate-400 font-bold py-4 rounded-2xl">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}