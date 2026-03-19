"use client";

import React, { useState } from "react";
import { ArrowLeft, MessageCircle, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Reply {
  reply_text: string | null;
  created: string;
  users?: { full_name: string } | null;
  replied_by_user_id: number | null;
}

interface RequestData {
  request_id: number;
  request_no: string;
  request_title: string;
  request_description: string;
  status_id: number;
  service_request_status?: { status_name: string };
  service_request_reply?: Reply[];
}

interface Props {
  request: RequestData | null;
  requestId: string;
  userId: number;
}

export default function RequestDetailClient({ request, requestId, userId }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !request) return;

    setLoading(true);
    try {
      const res = await fetch("/api/request-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: request.request_id,
          user_id: userId,
          reply_text: message.trim(),
          status_id: request.status_id || 1,
        }),
      });

      if (res.ok) {
        setMessage("");
        router.refresh();
      } else {
        alert("Failed to send reply");
      }
    } catch {
      alert("Connection error");
    } finally {
      setLoading(false);
    }
  };

  if (!request) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <Link href="/request-details" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors">
          <ArrowLeft size={20} /> Back to list
        </Link>
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-16 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={32} className="text-slate-400 dark:text-slate-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 mb-2">Request Not Found</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">This request may have been deleted or you do not have permission to view it.</p>
        </div>
      </div>
    );
  }

  const replies = request.service_request_reply || [];
  const statusName = request.service_request_status?.status_name || "Unknown";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        <Link
          href="/request-details"
          className="w-12 h-12 flex shrink-0 items-center justify-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 hover:shadow-md hover:shadow-indigo-500/10 transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-md uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
              {request.request_no || `REQ-${requestId}`}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
               statusName.includes('Pending') || statusName.includes('New')
                  ? 'bg-amber-100/50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20' 
              : statusName.includes('Resolved') || statusName.includes('Closed')
                  ? 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20'
                  : 'bg-indigo-100/50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-500/20'
            }`}>
              {statusName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            {request.request_title}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 flex flex-col h-[650px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[32px] border border-slate-200/50 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-800/40">
            <h2 className="font-black text-lg text-slate-800 dark:text-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100/50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20">
                <MessageCircle size={20} />
              </div>
              Chat & Activity Log
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar bg-slate-50/30 dark:bg-slate-900/30">
            {replies.length > 0 ? (
              replies.map((reply, i) => (
                <div
                  key={i}
                  className={`p-5 sm:p-6 rounded-3xl border w-fit min-w-[200px] max-w-[85%] sm:max-w-[75%] shadow-sm ${
                    reply.replied_by_user_id === userId
                      ? "bg-indigo-600 dark:bg-indigo-600 border-indigo-500 dark:border-indigo-500 text-white ml-auto rounded-tr-sm"
                      : "bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 rounded-tl-sm"
                  }`}
                >
                  <p className={`text-xs font-black uppercase tracking-widest mb-2 ${reply.replied_by_user_id === userId ? "text-indigo-200" : "text-slate-400 dark:text-slate-500"}`}>
                    {reply.replied_by_user_id === userId
                      ? "You"
                      : reply.users?.full_name || "Support Team"}
                  </p>
                  <p className="text-sm sm:text-base font-medium leading-relaxed whitespace-pre-wrap">
                    {reply.reply_text || ""}
                  </p>
                  <p className={`text-[10px] mt-4 font-bold uppercase tracking-wider text-right ${reply.replied_by_user_id === userId ? "text-indigo-300" : "text-slate-400 dark:text-slate-500"}`}>
                    {reply.created ? new Date(reply.created).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : ""}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 font-medium space-y-4">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
                  <MessageCircle size={24} className="opacity-50" />
                </div>
                <p>No messages yet. Send a message to get started.</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSendReply} className="p-4 sm:p-6 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-800/40">
            <div className="flex gap-3 sm:gap-4 bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 focus-within:ring-4 ring-indigo-500/10 focus-within:border-indigo-300 dark:focus-within:border-indigo-500/50 transition-all shadow-sm">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none outline-none px-4 text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 sm:px-6 sm:py-3 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-indigo-500/25 flex items-center gap-2 shrink-0 font-bold"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><span className="hidden sm:inline">Send</span> <Send size={18} /></>}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[32px] border border-slate-200/50 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-6 sm:p-8 h-fit">
          <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Request Details
          </h3>
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Description</p>
               <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                 {request.request_description || "No description provided."}
               </p>
            </div>
            
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
               <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Timeline</p>
               <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <span>Created</span>
                  <span className="text-slate-500 dark:text-slate-400">
                     {replies.length > 0 && replies[0].created ? new Date(replies[0].created).toLocaleDateString() : 'Unknown'}
                  </span>
               </div>
               <div className="w-full h-px bg-slate-200/60 dark:bg-slate-700/50 my-3"></div>
               <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <span>Last Update</span>
                  <span className="text-slate-500 dark:text-slate-400">
                     {replies.length > 0 && replies[replies.length-1].created ? new Date(replies[replies.length-1].created).toLocaleDateString() : 'Unknown'}
                  </span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
