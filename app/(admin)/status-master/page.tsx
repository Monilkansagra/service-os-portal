"use client";
import React, { useState } from 'react';
import { 
  Activity, Plus, Search, Edit2, 
  Trash2, X, Save, CheckCircle2 
} from 'lucide-react';

export default function StatusMaster() {
  // 1. Status Main State
  const [statuses, setStatuses] = useState([
    { id: 1, name: 'Pending', color: 'bg-amber-500', status: 'Active' },
    { id: 2, name: 'In Progress', color: 'bg-blue-500', status: 'Active' },
    { id: 3, name: 'Resolved', color: 'bg-green-500', status: 'Active' },
    { id: 4, name: 'Cancelled', color: 'bg-red-500', status: 'Active' },
  ]);

  // 2. Form & Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', status: 'Active' });

  // --- CRUD Functions ---

  const handleSave = () => {
    if (!formData.name) {
      alert("Please enter status name");
      return;
    }

    if (editId !== null) {
      // Update
      setStatuses(statuses.map(s => 
        s.id === editId ? { ...s, name: formData.name, status: formData.status } : s
      ));
    } else {
      // Create
      const newId = Math.max(0, ...statuses.map(s => s.id)) + 1;
      setStatuses([...statuses, { 
        id: newId, 
        name: formData.name, 
        color: 'bg-slate-400', // Default color for new
        status: formData.status 
      }]);
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this status?")) {
      setStatuses(statuses.filter(s => s.id !== id));
    }
  };

  const handleEdit = (s: any) => {
    setEditId(s.id);
    setFormData({ name: s.name, status: s.status });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ name: '', status: 'Active' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Activity className="text-blue-600" size={28} /> Status Master
          </h1>
          <p className="text-slate-400 text-sm font-medium">Define ticket lifecycle stages</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:shadow-blue-200 transition-all"
        >
          <Plus size={20} /> Add New Status
        </button>
      </div>

      {/* Status Grid/Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statuses.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-12 rounded-full ${item.color}`}></div>
              <div className="flex-1">
                <h3 className="font-black text-slate-800 text-lg">{item.name}</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.status}</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 space-y-6 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800">{editId ? 'Edit' : 'Add'} Status</h2>
              <button onClick={closeModal} className="text-slate-300 hover:text-slate-500"><X size={24} /></button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Status Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. On Hold" 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-blue-500/5 font-bold text-slate-700"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <input 
                  type="checkbox" 
                  id="isActive" 
                  className="w-5 h-5 accent-blue-600 rounded-lg"
                  checked={formData.status === 'Active'}
                  onChange={(e) => setFormData({...formData, status: e.target.checked ? 'Active' : 'Inactive'})}
                />
                <label htmlFor="isActive" className="text-sm font-bold text-slate-600 cursor-pointer">Set as Active</label>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button onClick={handleSave} className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-100">
                <Save size={18} /> Save Status
              </button>
              <button onClick={closeModal} className="flex-1 bg-slate-50 text-slate-400 font-bold py-4 rounded-2xl">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}