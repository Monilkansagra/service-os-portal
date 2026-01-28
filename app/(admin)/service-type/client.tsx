"use client";

import React, { useState } from 'react';
import { 
  Settings2, Plus, Edit2, 
  Trash2, X, Save 
} from 'lucide-react';
import { createServiceType, updateServiceType, deleteServiceType } from './actions';

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
      const result = editId 
        ? await updateServiceType(editId, formData) 
        : await createServiceType(formData);

      if (result.success) {
        closeModal();
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      alert("Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm("Delete this Service Type?")) {
      const result = await deleteServiceType(id);
      if (!result.success) alert(result.message);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Settings2 className="text-blue-600" size={28} /> Service Types
          </h1>
          <p className="text-slate-400 text-sm font-medium">Manage generic service categories</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all"
        >
          <Plus size={20} /> Add New
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b">
            <tr>
              <th className="px-8 py-5">Service Name</th>
              <th className="px-8 py-5">Description</th>
              <th className="px-8 py-5">Access</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {initialData.map((item) => (
              <tr key={item.service_type_id} className="hover:bg-slate-50/30">
                <td className="px-8 py-5 font-bold text-slate-800">{item.service_type_name}</td>
                <td className="px-8 py-5 text-slate-500 text-sm">{item.description || '-'}</td>
                <td className="px-8 py-5">
                  <div className="flex gap-2">
                    {item.is_for_staff && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Staff</span>}
                    {item.is_for_student && <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">Student</span>}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(item.service_type_id)} className="p-2 text-red-500 bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 space-y-6 shadow-2xl">
            <h2 className="text-2xl font-black text-slate-800">{editId ? 'Edit' : 'Add'} Service Type</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Service Name</label>
                <input 
                  type="text" 
                  name="service_type_name"
                  value={formData.service_type_name}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium outline-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input type="checkbox" name="is_for_staff" checked={formData.is_for_staff} onChange={handleChange} className="w-5 h-5 accent-blue-600" />
                  For Staff
                </label>
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input type="checkbox" name="is_for_student" checked={formData.is_for_student} onChange={handleChange} className="w-5 h-5 accent-blue-600" />
                  For Student
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button disabled={isLoading} onClick={handleSave} className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:bg-slate-800 transition-all">
                <Save size={18} /> {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button onClick={closeModal} className="flex-1 bg-slate-50 text-slate-400 font-bold py-4 rounded-2xl hover:bg-slate-100">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}