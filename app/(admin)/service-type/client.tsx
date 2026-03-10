"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings2, Plus, Edit2,
  Trash2, X, Save
} from 'lucide-react';

interface ServiceType {
  service_type_id: number;
  service_type_name: string;
  description: string;
  is_for_staff: boolean;
  is_for_student: boolean;
}

interface Props {
  initialData: ServiceType[];
}

export default function ServiceTypeClient({ initialData }: Props) {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form matching your SCHEMA
  const [formData, setFormData] = useState({
    service_type_name: '',
    description: '',
    is_for_staff: true,
    is_for_student: true
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    if (!formData.service_type_name) {
      alert("Service Name is required");
      return;
    }

    setIsLoading(true);
    try {
      const url = editId ? `/api/service-type/${editId}` : '/api/service-type';
      const method = editId ? 'PATCH' : 'POST';

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
    if (confirm("Delete this Service Type via API?")) {
      try {
        const response = await fetch(`/api/service-type/${id}`, {
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

  const handleEdit = (item: ServiceType) => {
    setEditId(item.service_type_id);
    setFormData({
      service_type_name: item.service_type_name,
      description: item.description,
      is_for_staff: item.is_for_staff,
      is_for_student: item.is_for_student
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({
      service_type_name: '',
      description: '',
      is_for_staff: true,
      is_for_student: true
    });
  };

  return (
    <div className="space-y-8 p-6 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-100 flex items-center gap-3">
            <Settings2 className="text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" size={36} /> Service Types
          </h1>
          <p className="text-slate-400 font-bold text-sm mt-2">Manage generic service categories</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          <Plus size={20} /> Add New
        </button>
      </div>

      <div className="bg-white rounded-3xl border-2 border-indigo-100 shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gradient-to-r from-indigo-50 to-white text-[11px] font-black text-slate-600 uppercase tracking-widest border-b-2 border-indigo-100">
            <tr>
              <th className="px-8 py-5">Service Name</th>
              <th className="px-8 py-5">Description</th>
              <th className="px-8 py-5">Access</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50">
            {initialData.map((item) => (
              <tr key={item.service_type_id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="px-8 py-5 font-bold text-slate-900">{item.service_type_name}</td>
                <td className="px-8 py-5 text-slate-600 text-sm font-medium">{item.description || '-'}</td>
                <td className="px-8 py-5">
                  <div className="flex gap-2">
                    {item.is_for_staff && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Staff</span>}
                    {item.is_for_student && <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Student</span>}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-indigo-600 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.service_type_id)}
                      className="p-2 text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content max-w-md">
            <div className="p-8 border-b-2 border-indigo-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
              <h2 className="text-2xl font-black text-slate-900">{editId ? 'Edit' : 'Add'} Service Type</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={24} className="text-slate-900" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Service Name *</label>
                <input
                  type="text"
                  name="service_type_name"
                  value={formData.service_type_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                  placeholder="e.g. IT Support"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50 h-24 resize-none"
                  placeholder="Brief description of the service"
                />
              </div>

              <div className="flex flex-col gap-3 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200">
                <label className="flex items-center gap-3 font-bold text-slate-900 cursor-pointer hover:bg-indigo-100 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    name="is_for_staff"
                    checked={formData.is_for_staff}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-2 border-indigo-300 accent-indigo-600"
                  />
                  <span>Available for Staff</span>
                </label>
                <label className="flex items-center gap-3 font-bold text-slate-900 cursor-pointer hover:bg-indigo-100 p-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    name="is_for_student"
                    checked={formData.is_for_student}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-2 border-indigo-300 accent-indigo-600"
                  />
                  <span>Available for Students</span>
                </label>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  disabled={isLoading}
                  onClick={handleSave}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 font-black"
                >
                  <Save size={18} /> {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button onClick={closeModal} className="flex-1 btn-secondary py-3 font-black">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}