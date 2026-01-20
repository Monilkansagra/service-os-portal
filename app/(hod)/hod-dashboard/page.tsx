"use client";
import React, { useState } from 'react';
import { 
  Users, UserCheck, ArrowUpRight, CheckCircle, Clock, 
  UserPlus, Search, Filter, X, AlertCircle, BarChart3,
  ThumbsUp, ThumbsDown, ClipboardCheck
} from 'lucide-react';

export default function HODDashboard() {
  // 1. Enhanced Sample Requests Data
  const [requests, setRequests] = useState([
    { id: 'SR-3001', subject: 'Network Switch Failure', requester: 'John Doe', priority: 'High', status: 'Pending Approval', date: '13 Jan 2026', technician: null },
    { id: 'SR-3002', subject: 'New PC Setup', requester: 'Jane Smith', priority: 'Medium', status: 'Assigned', date: '12 Jan 2026', technician: 'Rahul Sharma' },
    { id: 'SR-3003', subject: 'ERP Access Issue', requester: 'Mike Ross', priority: 'High', status: 'Pending Approval', date: '13 Jan 2026', technician: null },
  ]);

  // 2. Technician Performance Data
  const [technicians] = useState([
    { id: 1, name: 'Rahul Sharma', expertise: 'Hardware', rating: '4.8', resolved: 24, load: 'High' },
    { id: 2, name: 'Amit Patel', expertise: 'Network', rating: '4.5', resolved: 18, load: 'Medium' },
    { id: 3, name: 'Suresh Varma', expertise: 'Software', rating: '4.2', resolved: 30, load: 'Low' },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'performance'

  // Assignment & Approval Logic
  const handleAssign = (techName: string) => {
    setRequests(requests.map(req => 
      req.id === selectedRequest.id 
      ? { ...req, status: 'Assigned', technician: techName } 
      : req
    ));
    setIsAssignModalOpen(false);
  };

  const handleApprove = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'Approved' } : req
    ));
  };

  return (
    <div className="space-y-8 min-h-screen p-2">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Users className="text-blue-600" size={32} /> HOD Control Center
          </h1>
          <p className="text-slate-500 font-medium italic">Department: IT & Infrastructure</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="bg-slate-100 p-1.5 rounded-[20px] flex gap-2">
          <button 
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-2.5 rounded-[16px] text-xs font-black uppercase transition-all ${activeTab === 'requests' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
          >
            All Requests
          </button>
          <button 
            onClick={() => setActiveTab('performance')}
            className={`px-6 py-2.5 rounded-[16px] text-xs font-black uppercase transition-all ${activeTab === 'performance' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
          >
            Tech Performance
          </button>
        </div>
      </div>

      {activeTab === 'requests' ? (
        <>
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Awaiting Action', count: requests.filter(r => r.status === 'Pending Approval' || r.status === 'Unassigned').length, color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle },
              { label: 'Ongoing Service', count: requests.filter(r => r.status === 'Assigned').length, color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
              { label: 'Avg. Resolution', count: '4.2h', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: BarChart3 },
            ].map((stat, i) => (
              <div key={i} className={`${stat.bg} p-6 rounded-[32px] border border-white shadow-sm flex items-center justify-between`}>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <h3 className={`text-3xl font-black ${stat.color}`}>{stat.count}</h3>
                </div>
                <div className={`p-4 rounded-2xl bg-white/50 ${stat.color}`}><stat.icon size={24} /></div>
              </div>
            ))}
          </div>

          {/* Request Management Table */}
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-800">Department Requests</h2>
              <div className="flex gap-2">
                <Search className="text-slate-300" />
                <Filter className="text-slate-300" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Details</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Assigned To</th>
                    <th className="px-8 py-5 text-right">Approval/Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-blue-600 block">{req.id}</span>
                        <span className="font-bold text-slate-800">{req.subject}</span>
                        <p className="text-xs text-slate-400 font-medium">By {req.requester} • {req.date}</p>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${req.status.includes('Pending') ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-600">
                        {req.technician || '—'}
                      </td>
                      <td className="px-8 py-6 text-right space-x-2">
                        {req.status === 'Pending Approval' && (
                          <button onClick={() => handleApprove(req.id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all">
                            <ThumbsUp size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => { setSelectedRequest(req); setIsAssignModalOpen(true); }}
                          className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <UserPlus size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Performance Review Section */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicians.map((tech) => (
            <div key={tech.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-2xl font-black">
                  {tech.name.charAt(0)}
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Rating</p>
                  <div className="flex items-center gap-1 text-amber-500 font-black">
                    {tech.rating} ★
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">{tech.name}</h4>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-tighter">{tech.expertise} Specialist</p>
              </div>
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Resolved</p>
                  <p className="text-lg font-black text-slate-800">{tech.resolved} Tickets</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Current Load</p>
                  <p className={`text-lg font-black ${tech.load === 'High' ? 'text-red-500' : 'text-emerald-500'}`}>{tech.load}</p>
                </div>
              </div>
              <button className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-xs uppercase hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2">
                <ClipboardCheck size={16} /> View Performance Report
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Assignment Modal (Remains same as previous) */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white w-full max-w-md rounded-[45px] p-10 space-y-6 shadow-2xl">
             <div className="flex justify-between items-center border-b pb-6">
               <h2 className="text-2xl font-black text-slate-900">Assign Technician</h2>
               <button onClick={() => setIsAssignModalOpen(false)}><X size={24}/></button>
             </div>
             {technicians.map((tech) => (
               <button 
                 key={tech.id} 
                 onClick={() => handleAssign(tech.name)}
                 className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-600 hover:text-white group transition-all"
               >
                 <div className="text-left">
                   <p className="font-black">{tech.name}</p>
                   <p className="text-[10px] uppercase font-bold opacity-60">Load: {tech.load}</p>
                 </div>
                 <UserPlus size={18} />
               </button>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}