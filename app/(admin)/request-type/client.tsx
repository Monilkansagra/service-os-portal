"use client";

import React, { useState } from 'react';
import { 
  Settings2, Plus, Search, Layers, X, Save,
  Trash2, Edit3, Lightbulb, Box
} from 'lucide-react';
import { createRequestType, updateRequestType, deleteRequestType } from './actions';

// Types matching your DB Schema
interface RequestType {
  request_type_id: number;
  request_type_name: string;
  request_category: string;
  priority: string; // 'High' | 'Medium' | 'Low'
  dept_id: number;
  service_department: { dept_name: string }; // Joined Data
}

interface Props {
  initialData: RequestType[];
  departments: any[]; // For the Dropdown
}

export default function RequestTypeClient({ initialData, departments }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    request_type_name: '',
    request_category: '',
    dept_id: '',
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
      if (editingId) {
        await updateRequestType(editingId, formData);
      } else {
        await createRequestType(formData);
      }
      closeModal();
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this request type?")) {
      await deleteRequestType(id);
    }
  };

  const handleEdit = (item: RequestType) => {
    setFormData({
      request_type_name: item.request_type_name,
      request_category: item.request_category,
      dept_id: item.dept_id.toString(),
      priority: item.priority
    });
    setEditingId(item.request_type_id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ request_type_name: '', request_category: '', dept_id: '', priority: 'Medium' });
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Settings2 className="text-blue-600" size={32} /> Request Type Master
          </h1>
          <p className="text-slate-500 font-medium mt-1">Define specific request categories and service types</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-[24px] font-black flex items-center gap-2 shadow-xl hover:bg-slate-900 transition-all active:scale-95"
        >
          <Plus size={20} /> Add Request Type
        </button>
      </div>

      {/* Main Content Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/30">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Layers size={20} className="text-blue-500" /> Defined Categories
          </h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Filter types..." 
              className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-4 ring-blue-500/5 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Request Type Name</th>
                <th className="px-8 py-6">Broad Category</th>
                <th className="px-8 py-6">Linked Department</th>
                <th className="px-8 py-6">Priority</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {initialData.map((item) => (
                <tr key={item.request_type_id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 group-hover:text-blue-600 transition-all">
                        <Box size={18} />
                      </div>
                      <span className="font-bold text-slate-800">{item.request_type_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                      <Lightbulb size={14} className="text-amber-400" /> {item.request_category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-lg uppercase">
                      {item.service_department.dept_name}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`w-20 text-center py-1 rounded-full text-[10px] font-black uppercase ${
                      item.priority === 'High' ? 'bg-red-50 text-red-500' : 
                      item.priority === 'Medium' ? 'bg-amber-50 text-amber-500' : 
                      'bg-emerald-50 text-emerald-500'
                    }`}>
                      {item.priority}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right space-x-1">
                    <button onClick={() => handleEdit(item)} className="p-3 text-slate-300 hover:text-blue-600 transition-all"><Edit3 size={18} /></button>
                    <button onClick={() => handleDelete(item.request_type_id)} className="p-3 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl p-10 space-y-6 border border-white">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800">{editingId ? 'Edit Type' : 'New Request Type'}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-red-500"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Type Name</label>
                <input required name="request_type_name" value={formData.request_type_name} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700" placeholder="e.g. Printer Repair" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <input required name="request_category" value={formData.request_category} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700" placeholder="e.g. Hardware" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Linked Department</label>
                <select required name="dept_id" value={formData.dept_id} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-700">
                  <option value="">Select Dept...</option>
                  {departments.map((d) => (
                    <option key={d.dept_id} value={d.dept_id}>{d.dept_name}</option>
                  ))}
                </select>
              </div>

              <button disabled={isLoading} type="submit" className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-slate-800 transition-all">
                <Save size={20}/> {isLoading ? 'Saving...' : (editingId ? 'Update Type' : 'Save Type')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}