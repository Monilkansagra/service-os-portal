"use client";

import React, { useState } from 'react';
import { Plus, GitMerge, Search, User, Settings, Trash2, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { createAssignment, deleteAssignment } from './actions';

interface Props {
  initialData: any[];
  requestTypes: any[];
  technicians: any[];
}

export default function AutoAssignmentClient({ initialData, requestTypes, technicians }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter logic
  const filteredList = initialData.filter(item => 
    item.requestType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.technician.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if(confirm("Remove this auto-assignment?")) {
      await deleteAssignment(id);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const result = await createAssignment(formData);
    
    setIsLoading(false);
    if (result.success) {
      setIsModalOpen(false);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <GitMerge className="text-blue-600" /> Auto Assignment Master
          </h1>
          <p className="text-slate-500 text-sm">Link specific request types to dedicated technicians</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all"
        >
          <Plus size={20} /> Create New Mapping
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by request type or staff..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 ring-blue-500/5 transition-all"
          />
        </div>
      </div>

      {/* Mapping Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-8 py-5">Service Request Type</th>
              <th className="px-8 py-5 text-center">Auto-Assign To</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredList.length > 0 ? (
              filteredList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <Settings size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{item.requestType}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{item.dept}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <ArrowRight className="text-slate-300" size={16} />
                      <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl">
                        <User size={14} className="text-slate-500" />
                        <span className="text-sm font-bold text-slate-700">{item.technician}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex justify-center">
                      <span className="flex items-center gap-1 text-green-600 text-[10px] font-black uppercase tracking-tighter">
                        <CheckCircle size={12} /> Active
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-slate-400 font-medium">No mappings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal - Mapping Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl p-10 space-y-6 border border-white">
            <h2 className="text-2xl font-black text-slate-800">New Auto-Assignment</h2>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Request Type</label>
                <select name="request_type_id" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-blue-500/10 transition-all font-bold text-slate-700">
                  <option value="">-- Select Type --</option>
                  {requestTypes.map(t => (
                    <option key={t.request_type_id} value={t.request_type_id}>{t.request_type_name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Technician</label>
                <select name="user_id" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-blue-500/10 transition-all font-bold text-slate-700">
                  <option value="">-- Select Person --</option>
                  {technicians.map(u => (
                    <option key={u.user_id} value={u.user_id}>{u.full_name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  disabled={isLoading}
                  type="submit" 
                  className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 transition-transform active:scale-95 flex justify-center items-center gap-2"
                >
                   {isLoading && <Loader2 className="animate-spin" size={20} />}
                   {isLoading ? 'Linking...' : 'Link Technician'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 bg-slate-50 text-slate-400 font-bold py-4 rounded-2xl hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}