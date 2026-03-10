"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users2, Plus, Search, Mail, X, Save, Loader2, Edit2, Trash2 } from 'lucide-react';

export default function DepartmentPersonClient({ initialStaff, roles, departments }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<any>({});
  const router = useRouter();

  const filteredStaff = initialStaff.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.deptName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Convert FormData to a plain object
    const formDataObj = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const url = formData.id ? `/api/users/${formData.id}` : '/api/users';
      const method = formData.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataObj)
      });

      const result = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        router.refresh();
      } else {
        alert(result.error || "Failed to save staff");
      }
    } catch (err) {
      alert("API Error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this staff member via API?")) {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        if (response.ok) {
          router.refresh();
        } else {
          alert(result.error || "Failed to delete");
        }
      } catch (err) {
        alert("Request failed");
      }
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-100 flex items-center gap-3">
            <Users2 className="text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" size={36} /> Personnel Management
          </h1>
          <p className="text-slate-400 font-bold text-sm mt-2">Manage staff members across departments</p>
        </div>
        <button
          onClick={() => { setFormData({}); setIsModalOpen(true); }}
          className="btn-primary flex items-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1"
        >
          <Plus size={20} /> Add New
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search staff by name or department..."
          className="w-full px-4 py-4 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50 pl-12"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table/Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredStaff.map((p: any) => (
          <div
            key={p.id}
            className="bg-white p-8 rounded-3xl border-2 border-indigo-100 shadow-md card-hover group relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button
                onClick={() => { setFormData(p); setIsModalOpen(true); }}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-110"
                title="Edit"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleActionDelete(p.id)}
                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:scale-110"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg flex-shrink-0">
                {p.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-lg text-slate-900">{p.name}</h3>
                <p className="text-sm text-slate-600 font-medium">{p.deptName} • {p.roleName}</p>
                <div className="flex items-center gap-2 text-xs mt-2 text-slate-500 font-medium">
                  <Mail size={14} className="text-indigo-600" /> {p.email}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <form onSubmit={handleActionSubmit} className="modal-content max-w-md">
            <div className="p-8 border-b-2 border-indigo-100 bg-gradient-to-r from-indigo-50 to-white">
              <h2 className="text-2xl font-black text-slate-900">{formData.id ? 'Edit' : 'Add'} Staff Member</h2>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Full Name *</label>
                <input
                  name="full_name"
                  defaultValue={formData.name}
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Email *</label>
                <input
                  name="email"
                  type="email"
                  defaultValue={formData.email}
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Role *</label>
                <select
                  name="role_id"
                  defaultValue={formData.roleId}
                  required
                  className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                >
                  <option value="">Select Role</option>
                  {roles.map((r: any) => <option key={r.role_id} value={r.role_id}>{r.role_name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Department *</label>
                <select
                  name="dept_id"
                  defaultValue={formData.deptId ?? ""}
                  className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl text-slate-900 font-medium transition-all focus:outline-none focus:border-indigo-500 focus:bg-indigo-50"
                >
                  <option value="">Unassigned</option>
                  {departments.map((d: any) => <option key={d.dept_id} value={d.dept_id}>{d.dept_name}</option>)}
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 btn-secondary py-3 font-black"
                >
                  Cancel
                </button>
                <button
                  disabled={isLoading}
                  type="submit"
                  className="flex-1 btn-primary py-3 font-black flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Save size={18} />} Save
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}