"use client";

import React, { useState } from 'react';
import { 
  Users2, Plus, Search, 
  Mail, Phone, ShieldCheck, 
  Wrench, Trash2, Edit2, 
  Filter, X, Save, Loader2
} from 'lucide-react';
import { upsertStaff, deleteStaff } from './actions';

interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  roleId: number | null;
  roleName: string;
  deptId: number;
  deptName: string;
}

interface Props {
  initialStaff: StaffMember[];
  roles: any[];
  departments: any[];
}

export default function DepartmentPersonClient({ initialStaff, roles, departments }: Props) {
  const [staff] = useState(initialStaff);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [formData, setFormData] = useState<Partial<StaffMember>>({});

  // Filter Logic
  const filteredStaff = staff.filter(person => 
    (person.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person.deptName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleEdit = (person: StaffMember) => {
    setFormData(person);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setFormData({}); // Reset form
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to deactivate this staff member?")) {
      await deleteStaff(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const form = new FormData(e.currentTarget);
    if (formData.id) form.append("id", String(formData.id));

    const result = await upsertStaff(form);
    
    setIsLoading(false);
    if (result.success) {
      setIsModalOpen(false);
      setFormData({});
    } else {
      alert(result.message);
    }
  };

  // Helper for Role Badges
  const getRoleBadge = (role: string) => {
    const r = (role || '').toLowerCase();
    return r.includes('hod') || r.includes('manager') || r.includes('admin')
      ? 'bg-blue-50 text-blue-600 border-blue-100' 
      : 'bg-emerald-50 text-emerald-600 border-emerald-100';
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Users2 className="text-blue-600" size={32} /> Personnel Master
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage staff, roles, and department assignments</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="bg-slate-900 text-white px-8 py-4 rounded-[24px] font-black flex items-center gap-2 shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95"
        >
          <Plus size={20} /> Add Staff Member
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email or department..." 
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[24px] text-sm font-bold outline-none focus:ring-4 ring-blue-500/5 transition-all shadow-sm"
          />
        </div>
        <button className="px-6 py-4 bg-white border border-slate-100 rounded-[24px] text-slate-500 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
          <Filter size={18} /> Filters
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredStaff.map((person, index) => (
          // FIXED: Added fallback key using index
          <div key={person.id || `staff-${index}`} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            {/* Decorative BG */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-blue-50 transition-colors" />
            
            <div className="flex flex-col sm:flex-row gap-6 relative">
              {/* Avatar */}
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-2xl font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shrink-0 uppercase">
                {person.name ? person.name.substring(0,2) : '??'}
              </div>

              {/* Details */}
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-slate-800">{person.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getRoleBadge(person.roleName)}`}>
                        {person.roleName?.toLowerCase().includes('hod') ? <ShieldCheck size={10} className="inline mr-1" /> : <Wrench size={10} className="inline mr-1" />}
                        {person.roleName}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                        {person.deptName}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(person)} className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(person.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 overflow-hidden">
                    <Mail size={14} className="text-slate-300 shrink-0" /> <span className="truncate">{person.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Phone size={14} className="text-slate-300 shrink-0" /> {person.phone || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredStaff.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-400 font-bold">No staff members found.</div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-8 md:p-10 space-y-6 relative border border-white/50">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors"
            >
              <X size={24} />
            </button>

            <div>
              <h2 className="text-2xl font-black text-slate-900">{formData.id ? 'Edit Staff Member' : 'Add New Staff'}</h2>
              <p className="text-slate-500 text-sm mt-1">Enter personnel details and assign department.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                   <input required name="full_name" defaultValue={formData.name} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 ring-blue-500/20" placeholder="e.g. Rahul Sharma" />
                </div>
                
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                    <input required type="email" name="email" defaultValue={formData.email} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 ring-blue-500/20" placeholder="rahul@company.com" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                    <input name="phone_number" defaultValue={formData.phone} className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 ring-blue-500/20" placeholder="+91..." />
                  </div>
                </div>

                {/* Dropdowns */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                    <select name="role_id" defaultValue={formData.roleId || ""} required className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 ring-blue-500/20">
                      <option value="">Select Role</option>
                      {/* FIXED: Added fallback key */}
                      {roles.map((r, i) => (
                        <option key={r.role_id || `role-${i}`} value={r.role_id}>{r.role_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
                    <select name="dept_id" defaultValue={formData.deptId || ""} required className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 ring-blue-500/20">
                      <option value="">Select Dept</option>
                      {/* FIXED: Added fallback key for Departments */}
                      {departments.map((d, i) => (
                        <option 
                          key={d.service_department_id || `dept-${i}`} 
                          value={d.service_department_id}
                        >
                          {d.dept_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  disabled={isLoading}
                  type="submit" 
                  className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                  {isLoading ? 'Saving...' : 'Save Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}