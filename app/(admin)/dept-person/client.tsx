"use client";

import React, { useState } from 'react';
import { Plus, UserCog, ShieldCheck, User, Edit, Trash2, X, Save } from 'lucide-react';
import { createMapping, updateMapping, deleteMapping } from './actions';

// Types for our data
interface Mapping {
  dept_person_id: number;
  dept_id: number;
  user_id: number;
  is_hod: boolean;
  active_from: Date;
  active_to: Date | null;
  users: { full_name: string; roles: { role_name: string } | null };
  service_department: { dept_name: string };
}

interface Props {
  initialData: Mapping[];
  departments: any[];
  users: any[];
}

export default function DeptPersonClient({ initialData, departments, users }: Props) {
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
      if (editingId) {
        await updateMapping(editingId, formData);
      } else {
        await createMapping(formData);
      }
      closeModal();
    } catch (error) {
      alert("Error saving data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to remove this staff assignment?")) {
      await deleteMapping(id);
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
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <UserCog className="text-blue-600" /> Dept Person Mapping
          </h1>
          <p className="text-slate-500 text-sm">Assign staff to departments and designate HODs</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Plus size={20} /> Map New Person
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-black tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-8 py-5">Staff Member</th>
              <th className="px-8 py-5">Department</th>
              <th className="px-8 py-5">Role Type</th>
              <th className="px-8 py-5">Active From</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {initialData.map((item) => (
              <tr key={item.dept_person_id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5 text-slate-800 font-bold">
                    {item.users.full_name} 
                    <span className="text-xs text-slate-400 font-normal ml-2">
                        ({item.users.roles?.role_name || 'N/A'})
                    </span>
                </td>
                <td className="px-8 py-5 text-slate-600 font-medium">{item.service_department.dept_name}</td>
                <td className="px-8 py-5">
                  {item.is_hod ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black border border-amber-100 uppercase">
                      <ShieldCheck size={12} /> HOD
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black border border-blue-100 uppercase">
                      <User size={12} /> Technician
                    </span>
                  )}
                </td>
                {/* FIX: Added suppressHydrationWarning and forced 'en-GB' locale */}
                <td className="px-8 py-5 text-slate-400 text-sm" suppressHydrationWarning>
                    {item.active_from ? new Date(item.active_from).toLocaleDateString('en-GB') : '-'}
                </td>
                <td className="px-8 py-5 text-right space-x-2">
                   <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Edit size={16} /></button>
                   <button onClick={() => handleDelete(item.dept_person_id)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl p-10 space-y-6 border border-white">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-800">{editingId ? 'Edit Mapping' : 'Map Staff to Dept'}</h2>
                <button onClick={closeModal} className="text-slate-400 hover:text-red-500"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Staff Member</label>
                <select required name="user_id" value={formData.user_id} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700">
                  <option value="">Select Staff...</option>
                  {users.map((u) => (
                    <option key={u.user_id} value={u.user_id}>{u.full_name} ({u.roles?.role_name || 'User'})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Department</label>
                <select required name="dept_id" value={formData.dept_id} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700">
                  <option value="">Select Department...</option>
                  {departments.map((d) => (
                     <option key={d.dept_id} value={d.dept_id}>{d.dept_name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <input type="checkbox" name="is_hod" checked={formData.is_hod} onChange={handleChange} id="isHOD" className="w-5 h-5 accent-blue-600" />
                <label htmlFor="isHOD" className="text-sm font-bold text-blue-700">Designate as Head of Department (HOD)</label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Active From</label>
                  <input required type="date" name="active_from" value={formData.active_from} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold text-slate-700" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Active To (Optional)</label>
                  <input type="date" name="active_to" value={formData.active_to} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold text-slate-700" />
                </div>
              </div>

              <button disabled={isLoading} type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                <Save size={20}/> {isLoading ? 'Saving...' : (editingId ? 'Update Assignment' : 'Save Assignment')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}