"use client";
import React, { useState } from 'react';
import { 
  UserCog, Plus, Link2, 
  Trash2, Search, Filter, 
  Save, X, Edit3
} from 'lucide-react';

export default function RequestMappingMaster() {
  // 1. Static State for Mappings
  const [mappings, setMappings] = useState([
    { id: 1, requestType: 'Hardware Repair', staffName: 'Rahul Sharma', role: 'Senior Technician' },
    { id: 2, requestType: 'Software Install', staffName: 'Suresh Varma', role: 'Technician' },
    { id: 3, requestType: 'AC Repair', staffName: 'Amit Patel', role: 'Maintenance Lead' },
  ]);

  // Data for Dropdowns
  const [requestTypes] = useState(['Hardware Repair', 'Software Install', 'Network Issue', 'AC Repair', 'Wiring Issue']);
  const [staffList] = useState([
    { name: 'Rahul Sharma', role: 'Senior Technician' },
    { name: 'Amit Patel', role: 'Maintenance Lead' },
    { name: 'Suresh Varma', role: 'Technician' },
    { name: 'Vijay Shah', role: 'HOD' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ requestType: '', staffName: '' });

  // Create or Update
  const handleSave = () => {
    if (!formData.requestType || !formData.staffName) return;
    
    const staffInfo = staffList.find(s => s.name === formData.staffName);
    
    if (editingId) {
      // Update existing mapping
      setMappings(mappings.map(m => m.id === editingId ? { 
        ...m, 
        requestType: formData.requestType, 
        staffName: formData.staffName,
        role: staffInfo?.role || 'Staff'
      } : m));
    } else {
      // Create new mapping
      const newMapping = {
        id: Date.now(),
        requestType: formData.requestType,
        staffName: formData.staffName,
        role: staffInfo?.role || 'Staff'
      };
      setMappings([...mappings, newMapping]);
    }
    
    closeModal();
  };

  // Open Edit Modal
  const handleEdit = (item) => {
    setFormData({ requestType: item.requestType, staffName: item.staffName });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  // Delete Mapping
  const deleteMapping = (id) => {
    if(confirm("Remove this mapping?")) {
      setMappings(mappings.filter(m => m.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ requestType: '', staffName: '' });
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <UserCog className="text-blue-600" size={32} /> Responsibility Mapping
          </h1>
          <p className="text-slate-500 font-medium">Link service request types to specific personnel</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-[24px] font-black flex items-center gap-2 shadow-xl hover:bg-blue-600 transition-all active:scale-95"
        >
          <Plus size={20} /> New Assignment
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search request type or staff..." 
              className="w-full pl-12 pr-6 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 ring-blue-500/10 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-500 font-bold rounded-2xl hover:bg-slate-100 transition-all">
            <Filter size={18} /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Service Category</th>
                <th className="px-8 py-5">Assigned Staff</th>
                <th className="px-8 py-5">Role / Position</th>
                <th className="px-8 py-5 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mappings.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Link2 size={16} />
                      </div>
                      <span className="font-bold text-slate-800">{item.requestType}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                        {item.staffName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{item.staffName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-lg">
                      {item.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button onClick={() => handleEdit(item)} className="p-3 text-slate-300 hover:text-blue-600 transition-all">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => deleteMapping(item.id)} className="p-3 text-slate-300 hover:text-red-500 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for New/Edit Mapping */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-md rounded-[45px] p-10 space-y-8 shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900">{editingId ? 'Update Mapping' : 'Map Responsibility'}</h2>
              <button onClick={closeModal} className="bg-slate-50 p-2 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Select Request Type</label>
                <select 
                  className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-[24px] font-bold outline-none focus:bg-white focus:border-blue-500/20"
                  value={formData.requestType}
                  onChange={(e) => setFormData({...formData, requestType: e.target.value})}
                >
                  <option value="">Choose Type...</option>
                  {requestTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Responsible Staff</label>
                <select 
                  className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-[24px] font-bold outline-none focus:bg-white focus:border-blue-500/20"
                  value={formData.staffName}
                  onChange={(e) => setFormData({...formData, staffName: e.target.value})}
                >
                  <option value="">Choose Staff Member...</option>
                  {staffList.map(s => <option key={s.name} value={s.name}>{s.name} ({s.role})</option>)}
                </select>
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full bg-blue-600 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-2 shadow-xl hover:bg-blue-700 transition-all"
            >
              <Save size={20} /> {editingId ? 'Update Assignment' : 'Finalize Mapping'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}