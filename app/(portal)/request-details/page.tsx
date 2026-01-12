"use client";
import React, { useState } from 'react';
import { 
  Plus, Search, Filter, MessageSquare, 
  Clock, Trash2, X, Send, ChevronRight, LayoutGrid 
} from 'lucide-react';
import Link from 'next/link';

export default function UserRequestPortal() {
  // 1. Mock Data from Masters (આ ડેટા આપણે અગાઉના સ્ટેપ્સમાં બનાવ્યો હતો)
  const departments = [
    { id: 1, name: 'IT Support' },
    { id: 2, name: 'Electrical' }
  ];

  const serviceTypes = [
    { id: 1, deptId: 1, name: 'Software Install' },
    { id: 2, deptId: 1, name: 'Hardware Repair' },
    { id: 3, deptId: 2, name: 'Power Failure' }
  ];

  // 2. Requests State (CRUD માટે)
  const [requests, setRequests] = useState([
    { id: 'REQ-101', title: 'Monitor not working', dept: 'IT Support', type: 'Hardware Repair', status: 'In Progress', date: '2023-11-10' },
  ]);

  // 3. Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    deptId: '',
    typeId: '',
    subject: '',
    description: ''
  });

  // --- CRUD Functions ---

  // CREATE: નવી રિક્વેસ્ટ ઉમેરવી
  const handleCreateRequest = () => {
    if (!formData.deptId || !formData.subject) {
      alert("Please fill in the details");
      return;
    }

    const deptName = departments.find(d => d.id === Number(formData.deptId))?.name || "";
    const typeName = serviceTypes.find(t => t.id === Number(formData.typeId))?.name || "";

    const newRequest = {
      id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.subject,
      dept: deptName,
      type: typeName,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };

    setRequests([newRequest, ...requests]);
    setIsModalOpen(false);
    setFormData({ deptId: '', typeId: '', subject: '', description: '' });
  };

  // DELETE: રિક્વેસ્ટ કેન્સલ કરવી (જો Pending હોય તો જ)
  const handleCancelRequest = (id: string) => {
    if(confirm("Are you sure you want to cancel this request?")) {
      setRequests(requests.filter(r => r.id !== id));
    }
  };

  // Cascading Filter: પસંદ કરેલા ડિપાર્ટમેન્ટ મુજબ જ સર્વિસ ટાઈપ દેખાય
  const filteredTypes = serviceTypes.filter(t => t.deptId === Number(formData.deptId));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">My Requests</h1>
          <p className="text-slate-400 text-sm font-medium">Track and manage your support tickets</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-[20px] font-black flex items-center gap-2 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={20} /> New Request
        </button>
      </div>

      {/* Request Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-8 py-5">Ticket ID</th>
              <th className="px-8 py-5">Issue Details</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/30 group transition-colors">
                <td className="px-8 py-6 font-mono font-bold text-blue-600 text-sm">#{req.id}</td>
                <td className="px-8 py-6">
                  <div className="font-bold text-slate-800">{req.title}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                    {req.dept} • {req.type}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${
                    req.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-3">
                    {req.status === 'Pending' && (
                      <button onClick={() => handleCancelRequest(req.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                    <Link 
                      href={`/request-details/${req.id}`}
                      className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-blue-600 transition-all shadow-lg"
                    >
                      View Thread <ChevronRight size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: New Request Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-xl rounded-[40px] p-10 space-y-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800">Submit New Request</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-500"><X size={24} /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Select Department</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-blue-500/5 font-bold"
                  value={formData.deptId}
                  onChange={(e) => setFormData({...formData, deptId: e.target.value, typeId: ''})}
                >
                  <option value="">Choose Dept...</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Service Type</label>
                <select 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-blue-500/5 font-bold"
                  disabled={!formData.deptId}
                  value={formData.typeId}
                  onChange={(e) => setFormData({...formData, typeId: e.target.value})}
                >
                  <option value="">Choose Type...</option>
                  {filteredTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Subject / Issue Title</label>
                <input 
                  type="text" 
                  placeholder="Briefly describe the problem"
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 ring-blue-500/5 font-bold"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={handleCreateRequest}
                className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
              >
                Submit Ticket <Send size={18} />
              </button>
              <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-50 text-slate-400 font-bold py-4 rounded-2xl">Discard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}