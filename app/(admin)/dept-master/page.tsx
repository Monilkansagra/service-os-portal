"use client";
import React, { useState } from 'react';
import { Building2, Plus, Trash2, MapPin, Phone, Users } from 'lucide-react';

export default function DepartmentMaster() {
  const [depts, setDepts] = useState([
    { id: 1, name: 'IT Support', head: 'Vijay Shah', extension: '101', location: 'Block A, 2nd Floor' },
    { id: 2, name: 'Maintenance', head: 'Amit Patel', extension: '205', location: 'Ground Floor' },
    { id: 3, name: 'Housekeeping', head: 'Sunita Rao', extension: '009', location: 'Basement' },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Building2 className="text-blue-600" size={32} /> Department Master
          </h1>
          <p className="text-slate-500 font-medium">Manage organizational service departments</p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-4 rounded-[24px] font-black flex items-center gap-2 hover:bg-blue-600 transition-all">
          <Plus size={20} /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {depts.map((d) => (
          <div key={d.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black">
                {d.name.charAt(0)}
              </div>
              <h3 className="text-xl font-black text-slate-800">{d.name}</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                <Users size={16} className="text-slate-300" /> Head: {d.head}
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                <MapPin size={16} className="text-slate-300" /> {d.location}
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                <Phone size={16} className="text-slate-300" /> Ext: {d.extension}
              </div>
            </div>

            <button className="w-full mt-6 py-3 bg-slate-50 text-slate-400 font-black rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all text-xs uppercase tracking-widest">
              View Personnel
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}