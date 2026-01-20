"use client";
import React, { useState } from 'react';
import { 
  Settings2, Plus, Search, Layers, X, Save,
  Trash2, Edit3, Lightbulb, Box
} from 'lucide-react';

export default function RequestTypeMaster() {
  // Static State for Request Types
  const [requestTypes, setRequestTypes] = useState([
    { id: 1, typeName: 'Computer Issue', category: 'Technical', dept: 'IT Support', priority: 'High' },
    { id: 2, typeName: 'AC Repair', category: 'Facility', dept: 'Maintenance', priority: 'Medium' },
    { id: 3, typeName: 'Stationary Request', category: 'Administrative', dept: 'Operations', priority: 'Low' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    typeName: '',
    category: '',
    dept: '',
    priority: 'Medium'
  });

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Create or Update function
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setRequestTypes(requestTypes.map(t => t.id === editingId ? { ...formData, id: editingId } : t));
    } else {
      setRequestTypes([...requestTypes, { ...formData, id: Date.now() }]);
    }
    closeModal();
  };

  // Delete function
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this request type?")) {
      setRequestTypes(requestTypes.filter(t => t.id !== id));
    }
  };

  // Open Edit Modal
  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ typeName: '', category: '', dept: '', priority: 'Medium' });
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
              {requestTypes.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 group-hover:text-blue-600 transition-all">
                        <Box size={18} />
                      </div>
                      <span className="font-bold text-slate-800">{item.typeName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                      <Lightbulb size={14} className="text-amber-400" /> {item.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-lg uppercase">
                      {item.dept}
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
                    <button onClick={() => handleDelete(item.id)} className="p-3 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
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
                <input required name="typeName" value={formData.typeName} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" placeholder="e.g. Printer Repair" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <input required name="category" value={formData.category} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" placeholder="e.g. Hardware" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Linked Department</label>
                <select required name="dept" value={formData.dept} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none">
                  <option value="">Select Dept...</option>
                  <option value="IT Support">IT Support</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
                <Save size={20}/> {editingId ? 'Update Type' : 'Save Type'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}