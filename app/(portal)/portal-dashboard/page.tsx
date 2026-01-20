"use client";
import React, { useState } from 'react';
import { 
  Plus, MessageSquare, Clock, CheckCircle2, 
  Search, Filter, Send, Paperclip, X,
  AlertCircle, History, ChevronRight
} from 'lucide-react';

export default function RequestorDashboard() {
  // 1. Mock Data for User's Requests
  const [requests, setRequests] = useState([
    { 
      id: "REQ-2024-001", 
      title: "Laptop not starting", 
      type: "Hardware", 
      status: "In-Progress", 
      priority: "High",
      date: "2024-03-15",
      replies: [
        { from: "Technician", msg: "We have assigned Vijay to look into this.", time: "10:30 AM" },
        { from: "System", msg: "Status changed to In-Progress", time: "11:00 AM" }
      ]
    },
    { 
      id: "REQ-2024-002", 
      title: "WiFi Access Issue", 
      type: "Network", 
      status: "Pending", 
      priority: "Medium",
      date: "2024-03-16",
      replies: []
    }
  ]);

  const [isNewRequestModal, setIsNewRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header & New Request Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Requestor Dashboard</h1>
          <p className="text-slate-500 font-medium">Manage your service requests and track updates</p>
        </div>
        <button 
          onClick={() => setIsNewRequestModal(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-[24px] font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
        >
          <Plus size={20} /> Raise New Request
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100">
          <Clock className="text-blue-600 mb-4" size={24} />
          <div className="text-3xl font-black text-blue-900">{requests.length}</div>
          <div className="text-blue-600 font-bold text-sm uppercase">Total Requests</div>
        </div>
        <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100">
          <AlertCircle className="text-amber-600 mb-4" size={24} />
          <div className="text-3xl font-black text-amber-900">
            {requests.filter(r => r.status === 'Pending').length}
          </div>
          <div className="text-amber-600 font-bold text-sm uppercase">Waiting for Action</div>
        </div>
        <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100">
          <CheckCircle2 className="text-emerald-600 mb-4" size={24} />
          <div className="text-3xl font-black text-emerald-900">0</div>
          <div className="text-emerald-600 font-bold text-sm uppercase">Resolved Tickets</div>
        </div>
      </div>

      {/* Search and List */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
            <History className="text-blue-500" size={22} /> My Recent Requests
          </h3>
          <div className="flex gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input type="text" placeholder="Search ID..." className="pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-sm outline-none w-40" />
            </div>
            <button className="p-2 bg-slate-50 rounded-xl text-slate-400"><Filter size={20}/></button>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {requests.map((req) => (
            <div 
              key={req.id} 
              onClick={() => setSelectedRequest(req)}
              className="p-6 hover:bg-slate-50 transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black ${
                  req.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {req.type.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{req.id}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      req.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'
                    }`}>{req.priority}</span>
                  </div>
                  <h4 className="font-black text-slate-800 group-hover:text-blue-600 transition-colors">{req.title}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                      <Clock size={12} /> {req.date}
                    </span>
                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                      <MessageSquare size={12} /> {req.replies.length} updates
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="text-slate-200 group-hover:text-blue-400 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: New Request Form */}
      {isNewRequestModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-900">New Service Request</h2>
              <button onClick={() => setIsNewRequestModal(false)} className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500"><X size={24}/></button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Request Category</label>
                <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500/20">
                  <option>Hardware Issue</option>
                  <option>Software Request</option>
                  <option>Network/WiFi</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Priority Level</label>
                <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500/20">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Brief Title</label>
                <input className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500/20" placeholder="e.g. Printer in Lab 2 not working" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Detailed Description</label>
                <textarea className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-blue-500/20 h-32" placeholder="Describe your problem in detail..."></textarea>
              </div>
              <div className="md:col-span-2 flex items-center gap-4 p-4 border-2 border-dashed border-slate-100 rounded-2xl hover:border-blue-200 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Paperclip size={20}/></div>
                <span className="text-sm font-bold text-slate-400">Attach photo or document (Optional)</span>
              </div>
              <button className="md:col-span-2 bg-blue-600 text-white py-5 rounded-[24px] font-black shadow-xl shadow-blue-100 hover:bg-slate-900 transition-all">Submit Request</button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER: Communication History */}
      {selectedRequest && (
        <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-[-20px_0_60px_-15px_rgba(0,0,0,0.1)] z-50 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedRequest.id}</span>
              <h3 className="text-xl font-black text-slate-900 leading-tight">{selectedRequest.title}</h3>
            </div>
            <button onClick={() => setSelectedRequest(null)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-red-500"><X size={24}/></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                selectedRequest.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
              }`}>{selectedRequest.status}</span>
              <span className="text-xs text-slate-400 font-bold tracking-tight">Assigned to: IT Support Team</span>
            </div>

            <div className="space-y-4 pt-4">
              <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Updates & Replies</h5>
              {selectedRequest.replies.length > 0 ? (
                selectedRequest.replies.map((reply, i) => (
                  <div key={i} className={`p-4 rounded-2xl text-sm font-medium ${reply.from === 'Technician' ? 'bg-blue-50 text-blue-800' : 'bg-slate-50 text-slate-600'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-[10px] uppercase">{reply.from}</span>
                      <span className="text-[10px] opacity-50">{reply.time}</span>
                    </div>
                    {reply.msg}
                  </div>
                ))
              ) : (
                <div className="py-10 text-center space-y-2">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200"><MessageSquare size={24}/></div>
                  <p className="text-sm font-bold text-slate-300">No replies yet. Our team will update you soon.</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 border-t border-slate-100 bg-slate-50/50">
            <div className="relative">
              <input type="text" placeholder="Type a message..." className="w-full pl-6 pr-14 py-4 bg-white border border-slate-200 rounded-[24px] outline-none font-bold text-sm focus:ring-4 ring-blue-500/5 shadow-sm" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-slate-900 transition-all"><Send size={18}/></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}