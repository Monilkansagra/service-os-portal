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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-2">
                        <History className="text-blue-600" /> My Request History
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">Track and manage your support tickets</p>
                </div>
            </div>

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
                            <tr key={req.realId} className="hover:bg-slate-50/30 group transition-colors">
                                <td className="px-8 py-6 font-mono font-bold text-blue-600 text-sm">{req.id}</td>
                                <td className="px-8 py-6">
                                    <div className="font-bold text-slate-800">{req.title}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                                        {req.dept} • {req.type}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${req.status.includes('Pending') ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-3">
                                        {req.status.includes('Pending') && (
                                            <button onClick={() => handleCancelRequest(req.realId)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                        <Link
                                            href={`/request-details/${req.realId}`}
                                            className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-blue-600 transition-all shadow-lg"
                                        >
                                            View Details <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {requests.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-slate-300 font-bold italic">No history found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
