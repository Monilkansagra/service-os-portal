"use client";
import React, { useState } from 'react';
import { 
  Plus, ListTree, Search, Edit, Trash2, 
  Clock, ShieldCheck, FileText, BarChart 
} from 'lucide-react';

export default function RequestTypeMaster() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock Data
  const requestTypes = [
    { id: 1, name: 'New Laptop Request', service: 'Hardware', priority: 'High', sla: 5, approval: true, docs: true },
    { id: 2, name: 'Email Password Reset', service: 'Software', priority: 'Medium', sla: 1, approval: false, docs: false },
    { id: 3, name: 'Room Cleaning', service: 'Housekeeping', priority: 'Low', sla: 1, approval: false, docs: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <ListTree className="text-blue-600" /> Request Type Master
          </h1>
          <p className="text-slate-500 text-sm">Configure SLA, Priority, and Approvals for each request</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
          <Plus size={20} /> Add Request Type
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by request type name..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 ring-blue-500/5 transition-all"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-8 py-5">Request Name & Category</th>
              <th className="px-8 py-5">SLA & Priority</th>
              <th className="px-8 py-5 text-center">Policies</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {requestTypes.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="font-bold text-slate-800">{item.name}</div>
                  <div className="text-[10px] font-bold text-blue-500 uppercase mt-0.5">{item.service}</div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock size={14} /> {item.sla} Days Resolution
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md w-fit ${
                      item.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {item.priority} Priority
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex justify-center gap-4">
                    <ShieldCheck className={item.approval ? 'text-green-500' : 'text-slate-200'} size={20} title="Approval Needed" />
                    <FileText className={item.docs ? 'text-blue-500' : 'text-slate-200'} size={20} title="Documents Required" />
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Edit size={16} /></button>
                    <button className="p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - Large Modal for many fields */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl p-10 space-y-8 border border-white max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-slate-800">New Request Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Request Type Name</label>
                <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-blue-500/10" placeholder="e.g. Printer Toner Replacement" />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Service Category</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none">
                  <option>Hardware</option>
                  <option>Network</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Priority Level</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-red-600">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              {/* SLA & Policies */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Resolution Days (SLA)</label>
                <input type="number" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" placeholder="3" />
              </div>

              <div className="flex flex-col gap-4 justify-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 accent-blue-600" />
                  <span className="text-sm font-bold text-slate-700">Approval Required</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 accent-blue-600" />
                  <span className="text-sm font-bold text-slate-700">Documents Required</span>
                </label>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Document Instructions (If any)</label>
                <textarea className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none h-24" placeholder="Mention which files are needed..."></textarea>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100">Save Configuration</button>
              <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-50 text-slate-400 font-bold py-4 rounded-2xl">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}