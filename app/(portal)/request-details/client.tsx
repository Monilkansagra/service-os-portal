"use client";
import React, { useState } from 'react';
import {
    Plus, Trash2, X, Send, ChevronRight, History
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PortalRequestListClient({ initialRequests, userId }: { initialRequests: any[], userId: number }) {
    const router = useRouter();
    const [requests] = useState(initialRequests);

    const handleCancelRequest = async (id: number) => {
        if (!confirm("Cancel this request?")) return;

        try {
            const res = await fetch(`/api/requests?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                router.refresh();
            } else {
                alert("Failed to cancel");
            }
        } catch (e) {
            alert("Error");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 flex items-center gap-3">
                        <History className="text-indigo-600 dark:text-indigo-400" size={32} /> My Request History
                    </h1>
                    <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium mt-1">Track and manage your previous support tickets</p>
                </div>
            </div>

            <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-200/60 dark:border-slate-700/50">
                            <tr>
                                <th className="px-8 py-5">Ticket ID</th>
                                <th className="px-8 py-5">Issue Details</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
                            {requests.map((req) => (
                                <tr key={req.realId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 group transition-all duration-300">
                                    <td className="px-8 py-6 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                                        <div className="bg-indigo-50 dark:bg-indigo-500/10 inline-block px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                                            {req.id}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{req.title}</div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded pl-1 pr-2 font-bold uppercase tracking-wider">
                                                {req.dept}
                                            </span>
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                                                • {req.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                                            req.status.includes('Pending') || req.status.includes('New')
                                                ? 'bg-amber-100/50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20' 
                                            : req.status.includes('Resolved') || req.status.includes('Closed')
                                                ? 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20'
                                                : 'bg-indigo-100/50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-500/20'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end items-center gap-3">
                                            {(req.status.includes('Pending') || req.status.includes('New')) && (
                                                <button 
                                                    onClick={() => handleCancelRequest(req.realId)} 
                                                    className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all shadow-sm"
                                                    title="Cancel Request"
                                                >
                                                    <Trash2 size={18} strokeWidth={2.5} />
                                                </button>
                                            )}
                                            <Link
                                                href={`/request-details/${req.realId}`}
                                                className="inline-flex items-center gap-2 bg-slate-900 dark:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-600 dark:hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                                            >
                                                View Details <ChevronRight size={16} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-16 text-slate-400 dark:text-slate-500 font-bold italic">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                                                <History size={24} className="opacity-50" />
                                            </div>
                                            No request history found.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
