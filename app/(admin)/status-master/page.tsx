"use client";
import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2, Edit3, Search, X, Save } from 'lucide-react';

export default function StatusMaster() {
  const [statuses, setStatuses] = useState([
    { id: 1, name: 'Pending', color: 'bg-amber-500', description: 'Initial state of request' },
    { id: 2, name: 'In Progress', color: 'bg-blue-500', description: 'Technician is working' },
    { id: 3, name: 'Completed', color: 'bg-emerald-500', description: 'Issue has been fixed' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <CheckSquare className="text-blue-600" size={32} /> Status Master
          </h1>
          <p className="text-slate-500 font-medium">Define workflow stages for service requests</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-6 py-4 rounded-[24px] font-black flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
        >
          <Plus size={20} /> Add Status
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Status Name</th>
              <th className="px-8 py-5">Indicator</th>
              <th className="px-8 py-5">Description</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {statuses.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6 font-bold text-slate-800">{s.name}</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${s.color}`} />
                    <span className="text-xs font-bold text-slate-500 lowercase">{s.color}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-slate-500">{s.description}</td>
                <td className="px-8 py-6 text-right space-x-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit3 size={18}/></button>
                  <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}