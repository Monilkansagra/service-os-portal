"use client";
import React, { useState } from 'react';
import { 
  Settings2, Plus, Search, 
  Layers, ChevronRight, Trash2, 
  Edit3, Lightbulb, Box
} from 'lucide-react';

export default function RequestTypeMaster() {
  // 1. Mock Data for Request Types
  const [requestTypes, setRequestTypes] = useState([
    { id: 1, category: 'Technical', typeName: 'Computer Issue', dept: 'IT Support', priority: 'High' },
    { id: 2, category: 'Facility', typeName: 'AC Repair', dept: 'Maintenance', priority: 'Medium' },
    { id: 3, category: 'Administrative', typeName: 'Stationary Request', dept: 'Operations', priority: 'Low' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Settings2 className="text-blue-600" size={32} /> Request Type Master
          </h1>
          <p className="text-slate-500 font-medium mt-1">Define specific request categories and service types</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-[24px] font-black flex items-center gap-2 shadow-xl shadow-blue-100 hover:bg-slate-900 transition-all active:scale-95"
        >
          <Plus size={20} /> Add Request Type
        </button>
      </div>

      {/* Main Content Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/30">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Layers size={20} className="text-blue-500" /> Defined Categories
          </h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Filter types..." 
              className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 ring-blue-500/5 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Request Type Name</th>
                <th className="px-8 py-6">Broad Category</th>
                <th className="px-8 py-6">Linked Department</th>
                <th className="px-8 py-6">Default Priority</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requestTypes.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
                        <Box size={18} />
                      </div>
                      <span className="font-bold text-slate-800">{item.typeName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                      <Lightbulb size={14} className="text-amber-400" /> {item.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-lg uppercase tracking-wider">
                      {item.dept}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`w-20 text-center py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      item.priority === 'High' ? 'bg-red-50 text-red-500 border border-red-100' : 
                      item.priority === 'Medium' ? 'bg-amber-50 text-amber-500 border border-amber-100' : 
                      'bg-emerald-50 text-emerald-500 border border-emerald-100'
                    }`}>
                      {item.priority}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right space-x-1">
                    <button className="p-3 text-slate-300 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm shadow-transparent hover:shadow-blue-100">
                      <Edit3 size={18} />
                    </button>
                    <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm shadow-transparent hover:shadow-red-100">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card for Admin */}
      <div className="bg-blue-600 rounded-[32px] p-8 text-white flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10">
          <h4 className="text-xl font-black">Need more categories?</h4>
          <p className="text-blue-100 text-sm font-medium mt-1">You can map these types to specific personnel in the 'Request Mapping' section.</p>
        </div>
        <ChevronRight size={48} className="text-blue-500 absolute -right-4 opacity-50" />
      </div>
    </div>
  );
}