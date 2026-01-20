"use client";
import React, { useState } from 'react';
import { Building2, Plus, Trash2, MapPin, Mail, X, Save, Edit3 } from 'lucide-react';

export default function DepartmentMaster() {
  // Static State based on your MySQL Schema
  const [depts, setDepts] = useState([
    { 
      dept_id: 1, 
      dept_name: 'IT Support', 
      campus_id: 101, 
      description: 'Handles all software and hardware issues', 
      cc_email_to_csv: 'it.admin@college.edu',
      is_request_title_disable: false 
    },
    { 
      dept_id: 2, 
      dept_name: 'Maintenance', 
      campus_id: 102, 
      description: 'Electrical and plumbing maintenance', 
      cc_email_to_csv: 'maintenance@college.edu',
      is_request_title_disable: true 
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    dept_name: '',
    campus_id: '',
    description: '',
    cc_email_to_csv: '',
    is_request_title_disable: false
  });

  // Handle Form Input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Create or Update function
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setDepts(depts.map(d => d.dept_id === editingId ? { ...formData, dept_id: editingId } : d));
    } else {
      setDepts([...depts, { ...formData, dept_id: Date.now() }]);
    }
    closeModal();
  };

  // Delete function
  const handleDelete = (id) => {
    if(confirm("Are you sure you want to delete this department?")) {
      setDepts(depts.filter(d => d.dept_id !== id));
    }
  };

  // Open Edit Modal
  const handleEdit = (dept) => {
    setFormData(dept);
    setEditingId(dept.dept_id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ dept_name: '', campus_id: '', description: '', cc_email_to_csv: '', is_request_title_disable: false });
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Building2 className="text-blue-600" size={32} /> Department Master
          </h1>
          <p className="text-slate-500 font-medium">Manage organizational service departments</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-6 py-4 rounded-[24px] font-black flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl"
        >
          <Plus size={20} /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {depts.map((d) => (
          <div key={d.dept_id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => handleEdit(d)} className="text-slate-300 hover:text-blue-600"><Edit3 size={18}/></button>
                <button onClick={() => handleDelete(d.dept_id)} className="text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black">
                {d.dept_name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">{d.dept_name}</h3>
                <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">ID: {d.campus_id}</span>
              </div>
            </div>

            <p className="text-sm text-slate-500 mb-6 line-clamp-2 font-medium">{d.description}</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <Mail size={16} className="text-slate-300" /> {d.cc_email_to_csv}
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <MapPin size={16} className="text-slate-300" /> Campus Zone: {d.campus_id}
              </div>
            </div>

            <button className="w-full py-3 bg-slate-50 text-slate-400 font-black rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all text-xs uppercase tracking-widest">
              View Personnel
            </button>
          </div>
        ))}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">{editingId ? 'Edit Department' : 'New Department'}</h2>
              <button onClick={closeModal} className="p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all"><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Dept Name</label>
                  <input required name="dept_name" value={formData.dept_name} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500" placeholder="e.g. IT Support" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Campus ID</label>
                  <input required type="number" name="campus_id" value={formData.campus_id} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500" placeholder="101" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">CC Email (CSV)</label>
                <input required type="email" name="cc_email_to_csv" value={formData.cc_email_to_csv} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500" placeholder="admin@college.edu" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl p-4 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 h-24" placeholder="Brief about the department..." />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-lg">
                <Save size={20} /> {editingId ? 'Update Department' : 'Create Department'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}