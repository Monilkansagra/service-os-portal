"use client";
import React, { useState } from 'react';
import { 
  Users, UserCheck, ClipboardList, 
  ArrowUpRight, CheckCircle, Clock, 
  UserPlus, Search, Filter, X, AlertCircle
} from 'lucide-react';

export default function HODDashboard() {
  // 1. Sample Requests Data
  const [requests, setRequests] = useState([
    { id: 'SR-3001', subject: 'Network Switch Failure', requester: 'John Doe', priority: 'High', status: 'Unassigned', date: '13 Jan 2026', technician: null },
    { id: 'SR-3002', subject: 'New PC Setup', requester: 'Jane Smith', priority: 'Medium', status: 'Assigned', date: '12 Jan 2026', technician: 'Rahul (Tech)' },
    { id: 'SR-3003', subject: 'ERP Access Issue', requester: 'Mike Ross', priority: 'High', status: 'Unassigned', date: '13 Jan 2026', technician: null },
  ]);

  // 2. Technicians List
  const [technicians] = useState([
    { id: 1, name: 'Rahul Sharma', expertise: 'Hardware' },
    { id: 2, name: 'Amit Patel', expertise: 'Network' },
    { id: 3, name: 'Suresh Varma', expertise: 'Software' },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const handleAssign = (techName: string) => {
    setRequests(requests.map(req => 
      req.id === selectedRequest.id 
      ? { ...req, status: 'Assigned', technician: techName } 
      : req
    ));
    setIsAssignModalOpen(false);
  };

  return (
    <div className="space-y-8 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Users className="text-blue-600" size={32} /> HOD Control Center
          </h1>
          <p className="text-slate-500 font-medium italic">Department: IT & Infrastructure</p>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Unassigned', count: requests.filter(r => r.status === 'Unassigned').length, color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle },
          { label: 'In Progress', count: requests.filter(r => r.status === 'Assigned').length, color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
          { label: 'Technicians', count: technicians.length, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: UserCheck },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-6 rounded-[32px] border border-white shadow-sm flex items-center justify-between`}>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className={`text-3xl font-black ${stat.color}`}>{stat.count}</h3>
            </div>
            <div className={`p-4 rounded-2xl bg-white/50 ${stat.color}`}>
               <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Request Management Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-black text-slate-800">Pending Assignments</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-blue-500/20 w-full" />
            </div>
            <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-colors border border-slate-100"><Filter size={20}/></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Issue Details</th>
                <th className="px-8 py-5">Requester</th>
                <th className="px-8 py-5">Priority</th>
                <th className="px-8 py-5">Assigned Tech</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-blue-600 mb-1">{req.id}</span>
                      <span className="font-bold text-slate-800">{req.subject}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-600">{req.requester}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      req.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    {req.technician ? (
                      <span className="text-sm font-bold text-emerald-600 flex items-center gap-2">
                        <CheckCircle size={14} /> {req.technician}
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-slate-300 italic">Not Assigned</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    {!req.technician ? (
                      <button 
                        onClick={() => { setSelectedRequest(req); setIsAssignModalOpen(true); }}
                        className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all flex items-center gap-2 ml-auto shadow-lg shadow-slate-100"
                      >
                        <UserPlus size={14} /> Assign
                      </button>
                    ) : (
                      <button className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <ArrowUpRight size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-md rounded-[45px] p-10 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Assign Technician</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Ticket: {selectedRequest?.id}</p>
              </div>
              <button onClick={() => setIsAssignModalOpen(false)} className="bg-slate-50 p-2 rounded-full text-slate-300 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Select Expert</label>
              {technicians.map((tech) => (
                <button 
                  key={tech.id}
                  onClick={() => handleAssign(tech.name)}
                  className="w-full flex items-center justify-between p-5 bg-slate-50 rounded-[28px] border-2 border-transparent hover:border-blue-500/20 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 font-black shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {tech.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className="font-black text-slate-800">{tech.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{tech.expertise} Specialization</p>
                    </div>
                  </div>
                  <UserPlus className="text-slate-300 group-hover:text-blue-600 transition-colors" size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}