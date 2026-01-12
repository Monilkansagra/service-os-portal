"use client";
import React, { useState } from 'react';
import { Building2, Plus, Search, Edit2, Trash2, CheckCircle2, Clock, X, Save } from 'lucide-react';

export default function DeptMaster() {
  // 1. Main Data State
  const [departments, setDepartments] = useState([
    { id: 1, name: 'IT Support', resolutionDays: 2, status: 'Active' },
    { id: 2, name: 'Electrical & Maintenance', resolutionDays: 3, status: 'Active' },
  ]);

  // 2. Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', days: 2, status: 'Active' });

  // --- CRUD Functions ---

  // CREATE or UPDATE
  const handleSave = () => {
    if (editId !== null) {
      // Update logic
      setDepartments(departments.map(d => 
        d.id === editId ? { ...d, name: formData.name, resolutionDays: formData.days, status: formData.status } : d
      ));
    } else {
      // Create logic
      const newDept = {
        id: Math.max(0, ...departments.map(d => d.id)) + 1,
        name: formData.name,
        resolutionDays: formData.days,
        status: formData.status
      };
      setDepartments([...departments, newDept]);
    }
    closeModal();
  };

  // DELETE
  const handleDelete = (id: number) => {
    if(confirm("Are you sure you want to delete this department?")) {
      setDepartments(departments.filter(d => d.id !== id));
    }
  };

  // EDIT (Open modal with data)
  const handleEdit = (dept: any) => {
    setEditId(dept.id);
    setFormData({ name: dept.name, days: dept.resolutionDays, status: dept.status });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ name: '', days: 2, status: 'Active' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
          <Building2 className="text-blue-600" size={28} /> Dept Master
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-blue-100"
        >
          <Plus size={20} /> Add New
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b">
            <tr>
              <th className="px-8 py-5">Name</th>
              <th className="px-8 py-5">SLA</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {departments.map((dept) => (
              <tr key={dept.id} className="hover:bg-slate-50/30">
                <td className="px-8 py-5 font-bold text-slate-800">{dept.name}</td>
                <td className="px-8 py-5 text-slate-500 font-bold">{dept.resolutionDays} Days</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(dept)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(dept.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
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
            <h2 className="text-2xl font-black text-slate-800">{editId ? 'Edit' : 'Add'} Department</h2>
            
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Dept Name" 
                className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-4 ring-blue-500/5 font-bold"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
             <input 
  type="number" 
  placeholder="SLA Days" 
  className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-4 ring-blue-500/5 font-bold"
  // 1. જો value NaN હોય તો ખાલી સ્ટ્રિંગ બતાવો
  value={isNaN(formData.days) ? '' : formData.days}
  onChange={(e) => {
    const val = e.target.value;
    // 2. જો ઇનપુટ ખાલી હોય તો ખાલી રાખો, બાકી parseInt કરો
    setFormData({
      ...formData, 
      days: val === '' ? '' : parseInt(val)
    } as any);
  }}
/>
            </div>

            <div className="flex gap-4">
              <button onClick={handleSave} className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2">
                <Save size={18} /> Save
              </button>
              <button onClick={closeModal} className="flex-1 bg-slate-50 text-slate-400 font-bold py-4 rounded-2xl">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}