"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, GitMerge, Search, User, Settings, Trash2, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

interface Props {
  initialData: any[];
  requestTypes: any[];
  technicians: any[];
}

export default function AutoAssignmentClient({ initialData, requestTypes, technicians }: Props) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter logic
  const filteredList = initialData.filter(item =>
    item.requestType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.technician.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (confirm("Remove this auto-assignment via API?")) {
      try {
        const response = await fetch(`/api/type-mapping?id=${id}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        if (response.ok) {
          router.refresh();
        } else {
          alert(result.error || "Failed to remove assignment");
        }
      } catch (err) {
        alert("Request failed");
      }
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formDataObj = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const response = await fetch('/api/type-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataObj)
      });

      const result = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        router.refresh();
      } else {
        alert(result.error || result.message || "Failed to link technician");
      }
    } catch (err) {
      alert("Unexpected connection error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6 animate-in">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-100 flex items-center gap-3">
            <GitMerge className="text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" size={36} /> Auto Assignment Master
          </h1>
          <p className="text-slate-400 font-bold text-sm mt-2">Link specific request types to dedicated technicians</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          <Plus size={20} /> Create New Mapping
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-2xl border-2 border-indigo-100 shadow-md flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by request type or staff..."
            className="w-full pl-12 pr-6 py-3 bg-indigo-50 border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all focus:outline-none focus:ring-4 ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Mapping Table */}
      <div className="bg-white rounded-3xl border-2 border-indigo-100 shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-indigo-50 to-white text-slate-600 text-[11px] uppercase font-black tracking-widest border-b-2 border-indigo-100">
            <tr>
              <th className="px-8 py-5">Service Request Type</th>
              <th className="px-8 py-5 text-center">Auto-Assign To</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50">
            {filteredList.length > 0 ? (
              filteredList.map((item) => (
                <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 group-hover:scale-110 transition-transform">
                        <Settings size={16} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{item.requestType}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase">{item.dept}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-3">
                      <ArrowRight className="text-indigo-300" size={16} />
                      <div className="flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-xl shadow-sm">
                        <User size={14} className="text-indigo-600" />
                        <span className="text-sm font-bold text-slate-900">{item.technician}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex justify-center">
                      <span className="flex items-center gap-2 text-emerald-700 text-[10px] font-black uppercase tracking-tighter bg-emerald-100 px-3 py-1 rounded-full">
                        <CheckCircle size={12} /> Active
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-slate-500 font-bold">No mappings found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal - Mapping Form */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content max-w-lg">
            <div className="p-8 border-b-2 border-indigo-100 bg-gradient-to-r from-indigo-50 to-white">
              <h2 className="text-2xl font-black text-slate-900">New Auto-Assignment</h2>
            </div>

            <form onSubmit={handleCreate} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Request Type *</label>
                <select
                  name="request_type_id"
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                >
                  <option value="">-- Select Type --</option>
                  {requestTypes.map(t => (
                    <option key={t.request_type_id} value={t.request_type_id}>{t.request_type_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Technician *</label>
                <select
                  name="user_id"
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                >
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
                  className="flex-1 btn-primary font-bold py-4 flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {isLoading && <Loader2 className="animate-spin" size={20} />}
                  {isLoading ? 'Linking...' : 'Link Technician'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 btn-secondary font-bold py-4"
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