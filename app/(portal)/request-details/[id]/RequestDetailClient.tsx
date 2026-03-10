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
        <Link href="/request-details" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600">
          <ArrowLeft size={20} /> Back to list
        </Link>
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-slate-500 font-bold">Request not found.</p>
        </div>
      </div>
    );
  }

  const replies = request.service_request_reply || [];
  const statusName = request.service_request_status?.status_name || "Unknown";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/request-details"
          className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-blue-600 transition-all"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {request.request_no || `Request #${requestId}`}
          </h1>
          <p className="text-sm text-slate-600 font-medium">{request.request_title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col h-[600px] bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <MessageCircle size={18} className="text-blue-600" /> Activity Log
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            {replies.length > 0 ? (
              replies.map((reply, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-2xl border max-w-[85%] ${
                    reply.replied_by_user_id === userId
                      ? "bg-blue-50 border-blue-100 ml-auto"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <p className="text-sm font-bold text-slate-800 mb-1">
                    {reply.replied_by_user_id === userId
                      ? "You"
                      : reply.users?.full_name || "Technician"}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {reply.reply_text || ""}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">
                    {reply.created ? new Date(reply.created).toLocaleString() : ""}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 font-medium">
                No replies yet. Add a message below.
              </div>
            )}
          </div>

          <form onSubmit={handleSendReply} className="p-6 border-t border-slate-100">
            <div className="flex gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:ring-4 ring-blue-500/5 transition-all">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-bold text-slate-700"
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 h-fit">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
            Status Info
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase">Current Status</span>
              <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-lg font-black uppercase tracking-tighter border border-blue-100">
                {statusName}
              </span>
            </div>
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase">Description</span>
              <p className="text-sm text-slate-700 mt-2 font-medium">
                {request.request_description || "No description"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
