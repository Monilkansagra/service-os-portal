"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, UserCog, ShieldCheck, User, Edit, Trash2, X, Save } from 'lucide-react';

// Types for our data
interface Mapping {
  dept_person_id: number;
  dept_id: number;
  user_id: number;
  is_hod: boolean;
  active_from: Date;
  active_to: Date | null;
  users: any;
  service_department: any;
}

interface Props {
  initialData: Mapping[];
  departments: any[];
  users: any[];
}

export default function DeptPersonClient({ initialData, departments, users }: Props) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    user_id: '',
    dept_id: '',
    is_hod: false,
    active_from: '',
    active_to: ''
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
      const url = editingId ? `/api/dept-person/${editingId}` : '/api/dept-person';
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
    if (confirm("Are you sure you want to remove this staff assignment via API?")) {
      try {
        const response = await fetch(`/api/dept-person/${id}`, {
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

  const handleEdit = (item: Mapping) => {
    setFormData({
      user_id: item.user_id.toString(),
      dept_id: item.dept_id.toString(),
      is_hod: item.is_hod,
      active_from: item.active_from ? new Date(item.active_from).toISOString().split('T')[0] : '',
      active_to: item.active_to ? new Date(item.active_to).toISOString().split('T')[0] : ''
    });
    setEditingId(item.dept_person_id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ user_id: '', dept_id: '', is_hod: false, active_from: '', active_to: '' });
  };

  return (
    <div className="space-y-8 p-6 animate-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <UserCog className="text-indigo-600" size={36} /> Dept Person Mapping
          </h1>
          <p className="text-slate-500 font-bold text-sm mt-2">Assign staff to departments and designate HODs</p>
        </div>
        <button
        onClick={() => setIsModalOpen(true)}
        className="btn-primary flex items-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1"
      >
        <Plus size={20} /> Map New Person
      </button>
    </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border-2 border-indigo-100 shadow-md overflow-hidden">
    <table className="w-full text-left">
      <thead className="bg-gradient-to-r from-indigo-50 to-white text-slate-600 text-[11px] uppercase font-black tracking-widest border-b-2 border-indigo-100">
        <tr>
          <th className="px-8 py-5">Staff Member</th>
          <th className="px-8 py-5">Department</th>
          <th className="px-8 py-5">Role Type</th>
          <th className="px-8 py-5">Active From</th>
          <th className="px-8 py-5 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-indigo-50">
        {initialData.map((item) => (
          <tr key={item.dept_person_id} className="hover:bg-indigo-50/30 transition-colors group">
            <td className="px-8 py-5 text-slate-900 font-bold">
              {item.users.full_name}
              <span className="text-xs text-slate-500 font-normal ml-2">
                ({item.users.roles?.role_name || 'N/A'})
              </span>
            </td>
            <td className="px-8 py-5 text-slate-700 font-medium">{item.service_department.dept_name}</td>
            <td className="px-8 py-5">
              {item.is_hod ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-black border border-amber-200 uppercase">
                  <ShieldCheck size={12} /> HOD
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black border border-indigo-200 uppercase">
                  <User size={12} /> Technician
                </span>
              )}
            </td>
            <td className="px-8 py-5 text-slate-600 text-sm font-bold" suppressHydrationWarning>
              {item.active_from ? new Date(item.active_from).toLocaleDateString('en-GB') : '-'}
            </td>
            <td className="px-8 py-5 text-right space-x-2">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 text-indigo-600 hover:bg-indigo-100 transition-all rounded-lg"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(item.dept_person_id)}
                className="p-2 text-red-600 hover:bg-red-100 transition-all rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Modal */ }
  {
    isModalOpen && (
      <div className="modal-backdrop">
        <div className="modal-content max-w-lg">
          <div className="p-8 border-b-2 border-indigo-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
            <h2 className="text-2xl font-black text-slate-900">{editingId ? 'Edit Mapping' : 'Map Staff to Dept'}</h2>
            <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={24} className="text-slate-900" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Staff Member *</label>
              <select
                required
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
              >
                <option value="">Select Staff...</option>
                {users.map((u) => (
                  <option key={u.user_id} value={u.user_id}>{u.full_name} ({u.roles?.role_name || 'User'})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Department *</label>
              <select
                required
                name="dept_id"
                value={formData.dept_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
              >
                <option value="">Select Department...</option>
                {departments.map((d) => (
                  <option key={d.dept_id} value={d.dept_id}>{d.dept_name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-200">
              <input
                type="checkbox"
                name="is_hod"
                checked={formData.is_hod}
                onChange={handleChange}
                id="isHOD"
                className="w-5 h-5 rounded border-2 border-indigo-300 accent-indigo-600"
              />
              <label htmlFor="isHOD" className="font-bold text-slate-900 cursor-pointer">
                Designate as Head of Department (HOD)
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Active From *</label>
                <input
                  required
                  type="date"
                  name="active_from"
                  value={formData.active_from}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Active To</label>
                <input
                  type="date"
                  name="active_to"
                  value={formData.active_to}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg font-black"
            >
              <Save size={20} /> {isLoading ? 'Saving...' : (editingId ? 'Update Assignment' : 'Save Assignment')}
            </button>
          </form>
        </div>
      </div>
    )
  }
    </div >
  );
}