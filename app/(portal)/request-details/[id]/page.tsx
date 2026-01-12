"use client";
import React, { use, useState } from 'react';
import { ArrowLeft, MessageCircle, Send, Clock } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RequestDetails({ params }: PageProps) {
  // 1. Params ને React.use() થી અનરેપ કરો (Next.js 15+ Rules)
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [message, setMessage] = useState("");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center gap-4">
        <Link href="/request-details" className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-blue-600 transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Request #{id}</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Conversation Timeline</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Thread */}
        <div className="lg:col-span-2 flex flex-col h-[600px] bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
             <h2 className="font-bold text-slate-700 flex items-center gap-2">
                <MessageCircle size={18} className="text-blue-600" /> Activity Log
             </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 max-w-[80%]">
              <p className="text-sm font-bold text-slate-800 mb-1">Rajesh (Technician)</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                We have received your request. I will be visiting your location in 30 minutes.
              </p>
              <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Today • 10:45 AM</p>
            </div>
          </div>

          {/* Reply Box */}
          <div className="p-6 border-t border-slate-100">
            <div className="flex gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:ring-4 ring-blue-500/5 transition-all">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..." 
                className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-bold text-slate-700"
              />
              <button className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 h-fit">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Status Info</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Current Status</span>
              <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-lg font-black uppercase tracking-tighter border border-blue-100">
                In Progress
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Resolution Target</span>
              <span className="text-sm font-black text-slate-700">48 Hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}