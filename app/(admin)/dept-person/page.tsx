"use client";
import React, { useState } from 'react';
import { Plus, UserCog, Search, ShieldCheck, User, Calendar, Edit, Trash2, X, Save } from 'lucide-react';

export default function DeptPersonMapping() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Initial Static Data based on service_department_person table
  const [mappings, setMappings] = useState([
    { id: 1, dept: 'IT Support', name: 'John Doe', is_hod: true, active_from: '2023-01-01', active_to: '', active: true },
    { id: 2, dept: 'IT Support', name: 'Mike Ross', is_hod: false, active_from: '2023-02-15', active_to: '', active: true },
    { id: 3, dept: 'Electrical', name: 'Sarah Connor', is_hod: true, active_from: '2023-01-10', active_to: '', active: true },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    dept: '',
    is_hod: false,
    active_from: '',
    active_to: ''
  });

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Create or Update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setMappings(mappings.map(m => m.id === editingId ? { ...formData, id: editingId } : m));
    } else {
      setMappings([...mappings, { ...formData, id: Date.now() }]);
    }
    closeModal();
  };

  // Delete Assignment
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to remove this staff assignment?")) {
      setMappings(mappings.filter(m => m.id !== id));
    }
  };

  // Edit Assignment
  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', dept: '', is_hod: false, active_from: '', active_to: '' });
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header Area */}
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

      {/* Mapping List Table */}
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
            {mappings.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5 text-slate-800 font-bold">{item.name}</td>
                <td className="px-8 py-5 text-slate-600 font-medium">{item.dept}</td>
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
                <td className="px-8 py-5 text-slate-400 text-sm">{item.active_from}</td>
                <td className="px-8 py-5 text-right space-x-2">
                   <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Edit size={16} /></button>
                   <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal - Mapping Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl p-10 space-y-6 border border-white">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-800">{editingId ? 'Edit Mapping' : 'Map Staff to Dept'}</h2>
                <button onClick={closeModal} className="text-slate-400 hover:text-red-500"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Staff Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" placeholder="Enter staff name..." />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Department</label>
                <select required name="dept" value={formData.dept} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none">
                  <option value="">Select Department...</option>
                  <option value="IT Support">IT Support</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <input type="checkbox" name="is_hod" checked={formData.is_hod} onChange={handleChange} id="isHOD" className="w-5 h-5 accent-blue-600" />
                <label htmlFor="isHOD" className="text-sm font-bold text-blue-700">Designate as Head of Department (HOD)</label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Active From</label>
                  <input required type="date" name="active_from" value={formData.active_from} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Active To (Optional)</label>
                  <input type="date" name="active_to" value={formData.active_to} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm" />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
                <Save size={20}/> {editingId ? 'Update Assignment' : 'Save Assignment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}