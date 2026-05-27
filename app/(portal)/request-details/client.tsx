"use client";
import React, { useState } from 'react';
import { Plus, Trash2, ChevronRight, History, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortalRequestListClient({ initialRequests, userId }: { initialRequests: any[], userId: number }) {
    const router = useRouter();
    const [requests] = useState(initialRequests);
    const [search, setSearch] = useState('');

    const handleCancelRequest = async (id: number) => {
        if (!confirm("Cancel this request?")) return;
        try {
            const res = await fetch(`/api/requests?id=${id}`, { method: 'DELETE' });
            if (res.ok) { router.refresh(); }
            else { alert("Failed to cancel"); }
        } catch (e) { alert("Error"); }
    };

    const filtered = requests.filter((r: any) =>
        r.title?.toLowerCase().includes(search.toLowerCase()) ||
        r.id?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusStyle = (status: string) => {
        if (status.includes('Pending') || status.includes('New')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        if (status.includes('Resolved') || status.includes('Closed')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-[#1A1A2E] rounded-2xl border border-indigo-900/40 p-6 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden"
            >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-indigo-500" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
                            <History className="text-emerald-400" size={26} /> My Request History
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">{requests.length} Total</span>
                    </div>
                    <p className="text-slate-400 font-medium text-sm mt-1">Track and manage all your previous support tickets.</p>
                </div>

                <div className="relative group mt-4 md:mt-0 w-full md:w-72 relative z-10">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={15} />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search ticket ID or title..."
                        className="w-full pl-10 pr-4 py-2.5 bg-[#13131F] border border-indigo-900/40 focus:border-indigo-500/50 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all font-medium placeholder:text-slate-600"
                    />
                </div>
            </motion.div>

            {/* Table Card */}
            <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-[#1A1A2E] rounded-2xl border border-indigo-900/40 overflow-hidden"
            >
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[720px]">
                        <thead className="bg-[#13131F] border-b border-indigo-900/40">
                            <tr>
                                {['Ticket ID', 'Issue Details', 'Status', 'Action'].map((h, i) => (
                                    <th key={h} className={`px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest ${i === 3 ? 'text-right' : ''}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-indigo-900/20">
                            <AnimatePresence>
                                {filtered.map((req: any, i: number) => (
                                    <motion.tr
                                        key={req.realId}
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="hover:bg-indigo-950/30 group transition-all duration-200"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="inline-flex items-center px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                                                <span className="font-mono font-black text-indigo-400 text-xs">{req.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-base text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-1">{req.title}</div>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className="text-[10px] bg-[#13131F] border border-indigo-900/30 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{req.dept || req.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                {(req.status.includes('Pending') || req.status.includes('New')) && (
                                                    <button
                                                        onClick={() => handleCancelRequest(req.realId)}
                                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-all"
                                                        title="Cancel Request"
                                                    >
                                                        <Trash2 size={16} strokeWidth={2.5} />
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/request-details/${req.realId}`}
                                                    className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all active:scale-95"
                                                >
                                                    View <ChevronRight size={14} />
                                                </Link>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-20">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                <History size={24} />
                                            </div>
                                            <div>
                                                <p className="text-slate-300 font-bold text-base">No requests found</p>
                                                <p className="text-slate-500 font-medium text-sm mt-1">
                                                    {search ? 'Try a different search term.' : 'No request history yet.'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
