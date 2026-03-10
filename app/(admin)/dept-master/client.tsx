"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Plus, Trash2, MapPin, Mail, X, Save, Edit3, Loader2 } from 'lucide-react';

export default function DepartmentClient({ initialData }: { initialData: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    dept_name: '',
    campus_id: '',
    description: '',
    cc_email_to_csv: '',
    is_request_title_disable: false,
    user_id: 1
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ dept_name: '', campus_id: '', description: '', cc_email_to_csv: '', is_request_title_disable: false, user_id: 1 });
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const url = editingId ? `/api/departments/${editingId}` : '/api/departments';
      const method = editingId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, user_id: 1 })
      });

      const result = await response.json();

      if (response.ok) {
        closeModal();
        router.refresh();
      } else {
        setErrorMsg(result.error || result.details || 'Failed to save department.');
      }
    } catch (err) {
      setErrorMsg('Unexpected error connecting to API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionDelete = async (id: number) => {
    if (confirm("Delete this department?")) {
      try {
        const response = await fetch(`/api/departments/${id}`, {
          method: 'DELETE'
        });
        const res = await response.json();
        if (response.ok) {
          router.refresh();
        } else {
          alert("Error: " + (res.error || res.details || "Could not delete department."));
        }
      } catch (err) {
        alert("Delete request failed");
      }
    }
  };


  return (
    <div className="space-y-8 p-6 animate-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-100 flex items-center gap-3">
            <Building2 className="text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" size={36} /> Department Master
          </h1>
          <p className="text-slate-400 font-bold text-sm mt-2">Manage all departments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          <Plus size={20} /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialData.map((d) => (
          <div
            key={d.dept_id}
            className="bg-white p-8 rounded-3xl border-2 border-indigo-100 shadow-md card-hover group relative overflow-hidden transition-all duration-300"
          >
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                onClick={() => {
                  setEditingId(d.dept_id);
                  setFormData({
                    ...d,
                    campus_id: d.campus_id.toString(),
                    user_id: d.user_id || 1,
                    is_request_title_disable: d.is_request_title_disable ?? false
                  });
                  setIsModalOpen(true);
                }}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-110"
                title="Edit"
              >
                <Edit3 size={18} />
              </button>

              <button
                onClick={() => handleActionDelete(d.dept_id)}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:scale-110"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Card Content */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg">
                {d.dept_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{d.dept_name}</h3>
                <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wider">ID: {d.campus_id}</span>
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-6 font-medium leading-relaxed">{d.description || 'No description'}</p>

            <div className="space-y-3 mb-4 font-bold text-slate-700">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-indigo-600" />
                <span className="break-all">{d.cc_email_to_csv}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-indigo-600" />
                <span>Campus Zone: {d.campus_id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="p-8 border-b-2 border-indigo-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
              <h2 className="text-2xl font-black text-slate-900">{editingId ? 'Edit' : 'New'} Department</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-slate-900" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {errorMsg && (
                <div className="bg-red-100 border-2 border-red-400 text-red-900 p-4 rounded-2xl font-bold text-center animate-in">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Department Name *</label>
                <input
                  required
                  value={formData.dept_name}
                  onChange={(e) => setFormData({ ...formData, dept_name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                  placeholder="Enter department name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Campus ID *</label>
                <input
                  required
                  type="number"
                  value={formData.campus_id}
                  onChange={(e) => setFormData({ ...formData, campus_id: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                  placeholder="Enter campus ID"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">CC Email *</label>
                <input
                  required
                  type="email"
                  value={formData.cc_email_to_csv}
                  onChange={(e) => setFormData({ ...formData, cc_email_to_csv: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                  placeholder="Enter CC email"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:bg-indigo-50 h-24 resize-none"
                  placeholder="Enter department description"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
                <input
                  type="checkbox"
                  id="is_request_title_disable"
                  checked={formData.is_request_title_disable}
                  onChange={e => setFormData({ ...formData, is_request_title_disable: e.target.checked })}
                  className="w-5 h-5 rounded border-2 border-indigo-300 accent-indigo-600"
                />
                <label htmlFor="is_request_title_disable" className="font-bold text-slate-900">
                  Disable Request Title
                </label>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg font-black"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {editingId ? 'Update Department' : 'Create Department'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}