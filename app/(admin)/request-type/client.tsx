"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings2, Plus, Search, Layers, X, Save,
  Trash2, Edit3, Lightbulb, Box
} from 'lucide-react';

// Types matching your DB Schema
interface RequestType {
  request_type_id: number;
  request_type_name: string;
  request_category: string;
  priority: string; // 'High' | 'Medium' | 'Low'
  dept_id: number;
  service_type_id: number;
  service_department: { dept_name: string }; // Joined Data
}

interface Props {
  initialData: RequestType[];
  departments: any[];
  serviceTypes: any[];
}

export default function RequestTypeClient({ initialData, departments, serviceTypes }: Props) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    request_type_name: '',
    request_category: '',
    dept_id: '',
    service_type_id: '',
    priority: 'Medium'
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const url = editingId ? `/api/request-types/${editingId}` : '/api/request-types';
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
      alert("Unexpected error connecting to API");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this request type via API?")) {
      try {
        const response = await fetch(`/api/request-types/${id}`, {
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

  const handleEdit = (item: RequestType) => {
    setFormData({
      request_type_name: item.request_type_name,
      request_category: item.request_category,
      dept_id: item.dept_id.toString(),
      service_type_id: item.service_type_id?.toString() || '',
      priority: item.priority
    });
    setEditingId(item.request_type_id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ request_type_name: '', request_category: '', dept_id: '', service_type_id: '', priority: 'Medium' });
  };

  return (
    <div className="space-y-8 p-6 animate-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-100 flex items-center gap-3">
            <Settings2 className="text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" size={36} /> Request Type Master
          </h1>
          <p className="text-slate-400 font-bold text-sm mt-2">Define specific request categories and service types</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          <Plus size={20} /> Add Request Type
        </button>
      </div>

      {/* Main Content Table */}
      <div className="bg-white rounded-3xl border-2 border-indigo-100 shadow-md overflow-hidden">
        <div className="p-8 border-b-2 border-indigo-100 flex flex-col sm:flex-row justify-between gap-4 bg-gradient-to-r from-indigo-50 to-white">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Layers size={24} className="text-indigo-600" /> Defined Categories
          </h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
            <input
              type="text"
              placeholder="Filter types..."
              className="pl-12 pr-6 py-3 bg-white border-2 border-indigo-200 rounded-xl text-sm font-bold text-slate-900 placeholder-slate-400 transition-all focus:outline-none focus:ring-4 ring-indigo-500/20 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-indigo-50 to-white text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] border-b-2 border-indigo-100">
              <tr>
                <th className="px-8 py-6">Request Type Name</th>
                <th className="px-8 py-6">Broad Category</th>
                <th className="px-8 py-6">Linked Department</th>
                <th className="px-8 py-6">Priority</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50">
              {initialData.map((item) => (
                <tr key={item.request_type_id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 border border-indigo-200 rounded-xl text-indigo-600 group-hover:text-indigo-700 transition-all">
                        <Box size={18} />
                      </div>
                      <span className="font-bold text-slate-900">{item.request_type_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <Lightbulb size={14} className="text-amber-500" /> {item.request_category}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xs text-slate-700 font-bold">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg uppercase w-fit">
                        {item.service_department.dept_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`w-24 text-center py-1.5 rounded-full text-[10px] font-black uppercase font-bold ${item.priority === 'High' ? 'bg-red-100 text-red-700' :
                        item.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                          'bg-emerald-100 text-emerald-700'
                      }`}>
                      {item.priority}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right space-x-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 transition-all rounded-lg inline-block"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.request_type_id)}
                      className="p-2 text-red-600 hover:bg-red-100 transition-all rounded-lg inline-block"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content max-w-lg">
            <div className="p-8 border-b-2 border-indigo-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
              <h2 className="text-2xl font-black text-slate-900">{editingId ? 'Edit Type' : 'New Request Type'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={24} className="text-slate-900" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Type Name *</label>
                <input
                  required
                  name="request_type_name"
                  value={formData.request_type_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                  placeholder="e.g. Printer Repair"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Category *</label>
                  <input
                    required
                    name="request_category"
                    value={formData.request_category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                    placeholder="e.g. Hardware"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Priority *</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Linked Department *</label>
                  <select
                    required
                    name="dept_id"
                    value={formData.dept_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                  >
                    <option value="">Select Dept...</option>
                    {departments.map((d) => (
                      <option key={d.dept_id} value={d.dept_id}>{d.dept_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Service Type *</label>
                  <select
                    required
                    name="service_type_id"
                    value={formData.service_type_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                  >
                    <option value="">Select Service...</option>
                    {serviceTypes.map((s) => (
                      <option key={s.service_type_id} value={s.service_type_id}>{s.service_type_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg font-black"
              >
                <Save size={20} /> {isLoading ? 'Saving...' : (editingId ? 'Update Type' : 'Save Type')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
