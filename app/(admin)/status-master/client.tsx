"use client";

import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, Edit3, X, Save, Loader2 } from 'lucide-react';
import { createStatus, updateStatus, deleteStatus } from './actions';

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
      const result = editingId 
        ? await updateStatus(editingId, formData)
        : await createStatus(formData);

      if (result.success) {
        closeModal();
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      alert("Unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm("Are you sure you want to delete this status?")) {
      const result = await deleteStatus(id);
      if (!result.success) alert(result.message);
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
          className="bg-slate-900 text-white px-6 py-4 rounded-[24px] font-black flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl"
        >
          <Plus size={20} /> Add Status
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Sequence</th>
              <th className="px-8 py-5">Status Name</th>
              <th className="px-8 py-5">Indicator</th>
              <th className="px-8 py-5">State</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {statuses.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6 font-bold text-slate-400">#{s.sequence}</td>
                <td className="px-8 py-6">
                  <div className="font-bold text-slate-800">{s.name}</div>
                  <div className="text-xs text-slate-400">{s.status_system_name}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${s.color}`} />
                    <span className="text-xs font-bold text-slate-500 lowercase">{s.color}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${s.is_open ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                    {s.is_open ? 'Open' : 'Closed'}
                  </span>
                </td>
                <td className="px-8 py-6 text-right space-x-2">
                  <button onClick={() => handleEdit(s)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit3 size={18}/></button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
            {statuses.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400 font-bold">No statuses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">{editingId ? 'Edit Status' : 'New Status'}</h2>
              <button onClick={closeModal} className="p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Display Name</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Pending" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Sequence</label>
                  <input required type="number" name="sequence" value={formData.sequence} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500" placeholder="1" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">System Name</label>
                  <input required name="status_system_name" value={formData.status_system_name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500" placeholder="PENDING" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Color (Tailwind)</label>
                  <input required name="color" value={formData.color} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500" placeholder="bg-blue-500" />
                </div>
              </div>

              <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Description</label>
                  <input name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-medium text-slate-800 focus:ring-2 focus:ring-blue-500" placeholder="Short description..." />
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                <input type="checkbox" name="is_open" checked={formData.is_open} onChange={handleChange} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500" />
                <label className="text-sm font-bold text-slate-700">This status keeps the request OPEN</label>
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-blue-100 disabled:opacity-70">
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