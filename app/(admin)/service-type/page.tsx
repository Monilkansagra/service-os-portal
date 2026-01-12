"use client";
import React, { useState } from 'react';
import { 
  Settings2, Plus, Search, Edit2, 
  Trash2, CheckCircle2, X, Save, Layers 
} from 'lucide-react';

export default function ServiceTypeMaster() {
  // 1. Departments State (Dropdown માટે)
  const [departments] = useState([
    { id: 1, name: 'IT Support' },
    { id: 2, name: 'Electrical' },
    { id: 3, name: 'Maintenance' },
  ]);

  // 2. Service Types Main State
  const [serviceTypes, setServiceTypes] = useState([
    { id: 1, deptId: 1, name: 'Hardware Repair', days: 2, status: 'Active' },
    { id: 2, deptId: 1, name: 'Software Installation', days: 1, status: 'Active' },
    { id: 3, deptId: 2, name: 'Wiring Issue', days: 3, status: 'Active' },
  ]);

  // 3. Form & Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    deptId: '',
    name: '',
    days: 1 as any,
    status: 'Active'
  });

  // --- CRUD Functions ---

  const handleSave = () => {
    if (!formData.deptId || !formData.name) {
      alert("Please fill all fields");
      return;
    }

    if (editId !== null) {
      // Update
      setServiceTypes(serviceTypes.map(st => 
        st.id === editId ? { ...st, deptId: Number(formData.deptId), name: formData.name, days: formData.days, status: formData.status } : st
      ));
    } else {
      // Create
      const newId = Math.max(0, ...serviceTypes.map(s => s.id)) + 1;
      setServiceTypes([...serviceTypes, { 
        id: newId, 
        deptId: Number(formData.deptId), 
        name: formData.name, 
        days: formData.days, 
        status: formData.status 
      }]);
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    if(confirm("Delete this service type?")) {
      setServiceTypes(serviceTypes.filter(s => s.id !== id));
    }
  };

  const handleEdit = (item: any) => {
    setEditId(item.id);
    setFormData({ 
      deptId: item.deptId.toString(), 
      name: item.name, 
      days: item.days, 
      status: item.status 
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ deptId: '', name: '', days: 1, status: 'Active' });
  };

  // Helper: Department નું નામ મેળવવા માટે
  const getDeptName = (id: number) => departments.find(d => d.id === id)?.name || 'Unknown';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Settings2 className="text-blue-600" size={28} /> Service Type Master
          </h1>
          <p className="text-slate-400 text-sm font-medium">Manage issue categories for each department</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all"
        >
          <Plus size={20} /> Add New Type
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b">
            <tr>
              <th className="px-8 py-5">Department</th>
              <th className="px-8 py-5">Service Type Name</th>
              <th className="px-8 py-5">SLA Days</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {serviceTypes.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/30 group transition-colors">
                <td className="px-8 py-5">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                    {getDeptName(item.deptId)}
                  </span>
                </td>
                <td className="px-8 py-5 font-bold text-slate-800">{item.name}</td>
                <td className="px-8 py-5 text-slate-500 font-bold">{item.days} Days</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800">{editId ? 'Edit' : 'Add'} Service Type</h2>
              <button onClick={closeModal} className="text-slate-300 hover:text-slate-500"><X size={24} /></button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Select Department</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-blue-500/5 font-bold text-slate-700"
                  value={formData.deptId}
                  onChange={(e) => setFormData({...formData, deptId: e.target.value})}
                >
                  <option value="">Choose Department...</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Service Type Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Printer Issue" 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-blue-500/5 font-bold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Resolution Days</label>
                <input 
                  type="number" 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-blue-500/5 font-bold"
                  value={isNaN(formData.days) ? '' : formData.days}
                  onChange={(e) => setFormData({...formData, days: e.target.value === '' ? '' : parseInt(e.target.value)} as any)}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button onClick={handleSave} className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-100">
                <Save size={18} /> Save Type
              </button>
              <button onClick={closeModal} className="flex-1 bg-slate-50 text-slate-400 font-bold py-4 rounded-2xl">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}