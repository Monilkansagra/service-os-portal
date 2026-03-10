"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckSquare, Plus, Trash2, Edit3, X, Save, Loader2 } from 'lucide-react';

interface StatusItem {
  id: number;
  name: string;
  status_system_name: string;
  sequence: number;
  color: string;
  description: string;
  is_open: boolean;
}

interface Props {
  initialData: StatusItem[];
}

export default function StatusMasterClient({ initialData }: Props) {
  const router = useRouter();

  // Use props as initial state
  const [statuses, setStatuses] = useState<StatusItem[]>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state if server data changes (revalidation)
  useEffect(() => {
    setStatuses(initialData);
  }, [initialData]);

  const [formData, setFormData] = useState({
    name: '',
    status_system_name: '',
    sequence: '',
    color: 'bg-slate-500',
    description: '',
    is_open: true
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingId ? `/api/status-master/${editingId}` : '/api/status-master';
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        closeModal();
        router.refresh();
      } else {
        alert("Error: " + (result.error || result.message));
      }
    } catch (error) {
      alert("Unexpected error occurred while connecting to API");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this status via API?")) {
      try {
        const response = await fetch(`/api/status-master/${id}`, {
          method: 'DELETE'
        });
        const result = await response.json();

        if (response.ok) {
          router.refresh();
        } else {
          alert("Error: " + (result.error || result.message));
        }
      } catch (err) {
        alert("Delete request failed");
      }
    }
  };

  const handleEdit = (status: StatusItem) => {
    setFormData({
      name: status.name,
      status_system_name: status.status_system_name,
      sequence: String(status.sequence), // Input expects string
      color: status.color,
      description: status.description,
      is_open: status.is_open
    });
    setEditingId(status.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', status_system_name: '', sequence: '', color: 'bg-slate-500', description: '', is_open: true });
  };

  return (
    <div className="space-y-8 p-6 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-100 flex items-center gap-3">
            <CheckSquare className="text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" size={36} /> Status Master
          </h1>
          <p className="text-slate-400 font-bold text-sm mt-2">Define workflow stages for service requests</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          <Plus size={20} /> Add Status
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border-2 border-indigo-100 shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-indigo-50 to-white text-[10px] font-black text-slate-600 uppercase tracking-widest border-b-2 border-indigo-100">
            <tr>
              <th className="px-8 py-5">Sequence</th>
              <th className="px-8 py-5">Status Name</th>
              <th className="px-8 py-5">Indicator</th>
              <th className="px-8 py-5">State</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50">
            {statuses.map((s) => (
              <tr key={s.id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="px-8 py-6 font-bold text-indigo-600">#{s.sequence}</td>
                <td className="px-8 py-6">
                  <div className="font-bold text-slate-900">{s.name}</div>
                  <div className="text-xs text-slate-500">{s.status_system_name}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full shadow-lg ${s.color}`} />
                    <span className="text-xs font-bold text-slate-600 lowercase">{s.color}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${s.is_open ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {s.is_open ? 'Open' : 'Closed'}
                  </span>
                </td>
                <td className="px-8 py-6 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="p-2 text-indigo-600 hover:bg-indigo-100 transition-all rounded-lg inline-block"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-2 text-red-600 hover:bg-red-100 transition-all rounded-lg inline-block"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {statuses.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-500 font-bold">No statuses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content max-w-lg">
            <div className="p-8 border-b-2 border-indigo-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
              <h2 className="text-2xl font-black text-slate-900">{editingId ? 'Edit Status' : 'New Status'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={24} className="text-slate-900" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Display Name *</label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                    placeholder="e.g. Pending"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Sequence *</label>
                  <input
                    required
                    type="number"
                    name="sequence"
                    value={formData.sequence}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">System Name *</label>
                  <input
                    required
                    name="status_system_name"
                    value={formData.status_system_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                    placeholder="PENDING"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Color (Tailwind) *</label>
                  <input
                    required
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                    placeholder="bg-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Description</label>
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                  placeholder="Short description..."
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200">
                <input
                  type="checkbox"
                  name="is_open"
                  checked={formData.is_open}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-2 border-indigo-300 accent-indigo-600"
                />
                <label className="font-bold text-slate-900 cursor-pointer">This status keeps the request OPEN</label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg font-black disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {isLoading ? 'Saving...' : (editingId ? 'Update Status' : 'Create Status')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}