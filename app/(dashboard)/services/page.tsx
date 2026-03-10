"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, ArrowUpDown, Filter, Eye, Edit2, Trash2, X, Plus, Printer, Download,
    CheckCircle2, Clock, Check, AlertTriangle, ShieldCheck, User, Building2,
    ChevronLeft, ChevronRight, RefreshCcw
} from "lucide-react";

type RequestStatus = "Active" | "Pending" | "Resolved" | "Rejected";
type Priority = "High" | "Medium" | "Low";

interface ServiceData {
    id: string;
    person: string;
    department: string;
    service: string;
    status: RequestStatus;
    priority: Priority;
    created: string;
}

const mockData: ServiceData[] = [
    { id: "REQ-1001", person: "John Smith", department: "IT Support", service: "Network Access", status: "Active", priority: "High", created: "2026-03-01" },
    { id: "REQ-1002", person: "Sarah Jane", department: "HR Services", service: "Onboarding Kit", status: "Pending", priority: "Medium", created: "2026-03-05" },
    { id: "REQ-1003", person: "Mike Ross", department: "Facilities", service: "AC Repair", status: "Resolved", priority: "Low", created: "2026-02-28" },
    { id: "REQ-1004", person: "Jane Doe", department: "Finance", service: "Expense Software", status: "Active", priority: "High", created: "2026-03-07" },
    { id: "REQ-1005", person: "Adam Driver", department: "IT Support", service: "Hardware Request", status: "Rejected", priority: "Medium", created: "2026-03-02" },
    // Adding more data for pagination
    { id: "REQ-1006", person: "Eva Green", department: "HR Services", service: "Leave Approval", status: "Resolved", priority: "Low", created: "2026-03-06" },
    { id: "REQ-1007", person: "Tony Stark", department: "IT Support", service: "Server Access", status: "Pending", priority: "High", created: "2026-03-08" },
];

export default function DataDirectoryPage() {
    const [data, setData] = useState<ServiceData[]>(mockData);
    const [search, setSearch] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof ServiceData; direction: 'asc' | 'desc' } | null>(null);

    // Filters
    const [statusFilter, setStatusFilter] = useState("All");
    const [deptFilter, setDeptFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");

    // Selection
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Modals & Drawers
    const [isAddDrawerOpen, setAddDrawerOpen] = useState(false);
    const [drawerStep, setDrawerStep] = useState(1);
    const [isDetailDrawerOpen, setDetailDrawerOpen] = useState<ServiceData | null>(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState<string | null>(null);

    // Pagination
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Computed Data
    const filteredData = useMemo(() => {
        let result = [...data];
        if (search) {
            result = result.filter(item =>
                Object.values(item).some(val => val.toString().toLowerCase().includes(search.toLowerCase()))
            );
        }
        if (statusFilter !== "All") result = result.filter(i => i.status === statusFilter);
        if (deptFilter !== "All") result = result.filter(i => i.department === deptFilter);
        if (priorityFilter !== "All") result = result.filter(i => i.priority === priorityFilter);

        if (sortConfig) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [data, search, statusFilter, deptFilter, priorityFilter, sortConfig]);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, page, rowsPerPage]);

    const handleSort = (key: keyof ServiceData) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === paginatedData.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(paginatedData.map(d => d.id)));
        }
    };

    const toggleSelect = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newKeys = new Set(selectedIds);
        if (newKeys.has(id)) newKeys.delete(id);
        else newKeys.add(id);
        setSelectedIds(newKeys);
    };

    const handleDeleteConfirm = () => {
        if (isDeleteModalOpen) {
            setData(data.filter(item => item.id !== isDeleteModalOpen));
            setDeleteModalOpen(null);
        }
    };

    const handleBulkDelete = () => {
        setData(data.filter(item => !selectedIds.has(item.id)));
        setSelectedIds(new Set());
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-black tracking-tight text-white mb-1">Service Requests</h1>
                    <p className="text-slate-400 font-medium text-sm">Manage and track all organizational service tickets.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-[#1A1A2E] border border-indigo-900/30 hover:border-indigo-500/50 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold transition-all">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button
                        onClick={() => { setAddDrawerOpen(true); setDrawerStep(1); }}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> Define New Request
                    </button>
                </div>
            </div>

            {/* Main Table Container */}
            <div className="bg-[#1A1A2E] rounded-2xl border border-indigo-900/40 shadow-xl overflow-hidden">

                {/* Bulk Action Bar (Overlay) */}
                <AnimatePresence>
                    {selectedIds.size > 0 && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-indigo-900/40 border-b border-indigo-900/50 px-6 py-3 flex justify-between items-center"
                        >
                            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                                <CheckCircle2 className="w-4 h-4" /> {selectedIds.size} items selected
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded disabled:opacity-50 transition-colors">Change Status</button>
                                <button onClick={handleBulkDelete} className="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded transition-colors">Delete Selected</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Filters Toolbar */}
                <div className="p-4 border-b border-[#232338] flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex gap-4 items-center flex-1 max-w-2xl">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search ID, Person, Dept..."
                                className="w-full pl-10 pr-4 py-2 bg-[#13131F] border border-[#232338] rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors font-medium placeholder:text-slate-500 hover:border-indigo-900"
                            />
                        </div>

                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-[#13131F] border border-[#232338] text-slate-300 text-sm font-medium rounded-xl px-3 py-2 outline-none focus:border-indigo-500 hover:border-indigo-900 transition-colors">
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                        </select>

                        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="bg-[#13131F] border border-[#232338] text-slate-300 text-sm font-medium rounded-xl px-3 py-2 outline-none focus:border-indigo-500 hover:border-indigo-900 transition-colors">
                            <option value="All">All Priorities</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>

                    <button className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                        <Filter className="w-4 h-4" /> More Filters
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-[#13131F] border-b border-[#232338] text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <th className="px-6 py-4 w-10">
                                    <div className="w-5 h-5 rounded border border-slate-600 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors" onClick={toggleSelectAll}>
                                        {selectedIds.size > 0 && selectedIds.size === paginatedData.length && <Check className="w-3 h-3 text-indigo-400" />}
                                        {selectedIds.size > 0 && selectedIds.size !== paginatedData.length && <div className="w-2.5 h-0.5 bg-indigo-400 rounded-full" />}
                                    </div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:text-indigo-400 select-none group" onClick={() => handleSort('id')}>
                                    Request ID <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50 group-hover:opacity-100" />
                                </th>
                                <th className="px-6 py-4 cursor-pointer hover:text-indigo-400 select-none group" onClick={() => handleSort('person')}>Person <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50 group-hover:opacity-100" /></th>
                                <th className="px-6 py-4 cursor-pointer hover:text-indigo-400 select-none group" onClick={() => handleSort('department')}>Department <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50 group-hover:opacity-100" /></th>
                                <th className="px-6 py-4 cursor-pointer hover:text-indigo-400 select-none group" onClick={() => handleSort('service')}>Service <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50 group-hover:opacity-100" /></th>
                                <th className="px-6 py-4 cursor-pointer hover:text-indigo-400 select-none group" onClick={() => handleSort('status')}>Status <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50 group-hover:opacity-100" /></th>
                                <th className="px-6 py-4 cursor-pointer hover:text-indigo-400 select-none group" onClick={() => handleSort('priority')}>Priority <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50 group-hover:opacity-100" /></th>
                                <th className="px-6 py-4 cursor-pointer hover:text-indigo-400 select-none group" onClick={() => handleSort('created')}>Created <ArrowUpDown className="w-3 h-3 inline-block ml-1 opacity-50 group-hover:opacity-100" /></th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {paginatedData.map((item, index) => {
                                    const isSelected = selectedIds.has(item.id);
                                    return (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
                                            key={item.id}
                                            onClick={() => setDetailDrawerOpen(item)}
                                            className={`border-b border-[#232338]/50 group cursor-pointer transition-colors duration-200 
                        ${isSelected ? 'bg-indigo-900/20 hover:bg-indigo-900/30' : (index % 2 === 0 ? 'bg-[#1A1A2E]' : 'bg-[#16162A]')} 
                        hover:bg-indigo-900/20 hover:border-indigo-900/50`
                                            }
                                        >
                                            <td className="px-6 py-4" onClick={(e) => toggleSelect(item.id, e)}>
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                          ${isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-600 group-hover:border-indigo-400'}`}>
                                                    {isSelected && <Check className="w-3 h-3" />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-white tracking-wide">{item.id}</td>
                                            <td className="px-6 py-4 text-slate-300 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-300 font-bold uppercase">{item.person.substring(0, 2)}</div>
                                                    {item.person}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400 font-medium">{item.department}</td>
                                            <td className="px-6 py-4 text-slate-300 font-bold">{item.service}</td>
                                            <td className="px-6 py-4">
                                                {item.status === 'Active' && <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">Active</span>}
                                                {item.status === 'Pending' && <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-amber-400/10 text-amber-400 border border-amber-400/20">Pending</span>}
                                                {item.status === 'Resolved' && <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-blue-400/10 text-blue-400 border border-blue-400/20">Resolved</span>}
                                                {item.status === 'Rejected' && <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-red-400/10 text-red-400 border border-red-400/20">Rejected</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                                                    {item.priority === 'High' && <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />}
                                                    {item.priority === 'Medium' && <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />}
                                                    {item.priority === 'Low' && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />}
                                                    {item.priority}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-medium text-sm">{item.created}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                                    <button onClick={() => setDetailDrawerOpen(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/20 transition-all title='View Details'"><Eye className="w-4 h-4" /></button>
                                                    <button onClick={() => { setAddDrawerOpen(true); setDrawerStep(1); }} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/20 transition-all title='Edit'"><Edit2 className="w-4 h-4" /></button>
                                                    <button onClick={() => setDeleteModalOpen(item.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/20 transition-all title='Delete'"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    {paginatedData.length === 0 && (
                        <div className="p-10 text-center flex flex-col items-center placeholder">
                            <div className="w-16 h-16 rounded-full bg-[#13131F] border border-indigo-900/30 flex items-center justify-center mb-4">
                                <Search className="w-6 h-6 text-slate-500" />
                            </div>
                            <h3 className="text-white font-bold text-lg">No requests found</h3>
                            <p className="text-slate-500 mt-1 text-sm">Adjust your filters or search query to find what you're looking for.</p>
                        </div>
                    )}
                </div>

                {/* Pagination Toolbar */}
                <div className="p-4 border-t border-[#232338] bg-[#13131F] flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-500">Rows per page:</span>
                        <select
                            value={rowsPerPage}
                            onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
                            className="bg-[#1A1A2E] border border-indigo-900/30 text-white text-sm font-bold rounded-lg px-2 py-1 outline-none"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                    <div className="text-sm font-medium text-slate-400">
                        Showing {(page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, filteredData.length)} of {filteredData.length} records
                    </div>
                    <div className="flex gap-1">
                        <button
                            disabled={page === 1} onClick={() => setPage(page - 1)}
                            className="p-1.5 rounded-lg border border-[#232338] hover:bg-[#1A1A2E] disabled:opacity-50 text-slate-400 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            disabled={page * rowsPerPage >= filteredData.length} onClick={() => setPage(page + 1)}
                            className="p-1.5 rounded-lg border border-[#232338] hover:bg-[#1A1A2E] disabled:opacity-50 text-slate-400 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, x: [-10, 10, -10, 10, 0] }} // simple shake effect setup on mount
                            transition={{ duration: 0.4 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1A1A2E] border border-red-900/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl shadow-red-500/10 text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 border border-red-500/20 text-red-500">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Are you fully sure?</h3>
                            <p className="text-sm text-slate-400 mb-6 font-medium">This action cannot be undone. This request will be permanently deleted from the directory.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteModalOpen(null)} className="flex-1 py-2 rounded-xl text-slate-300 font-bold bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                                <button onClick={handleDeleteConfirm} className="flex-1 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-500/20 active:scale-95 transition-all">Yes, Delete</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Detail Drawer Modal */}
            <AnimatePresence>
                {isDetailDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setDetailDrawerOpen(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-[500px] max-w-full bg-[#13131F] border-l border-indigo-900/50 shadow-2xl z-50 flex flex-col"
                        >
                            <div className="p-6 border-b border-indigo-900/30 flex justify-between items-center bg-[#13131F] sticky top-0 z-10">
                                <div>
                                    <h2 className="text-xl font-heading font-black tracking-tight text-white mb-1">Request Details</h2>
                                    <p className="text-xs text-indigo-400 font-bold tracking-widest uppercase">{isDetailDrawerOpen.id}</p>
                                </div>
                                <button onClick={() => setDetailDrawerOpen(null)} className="p-2 rounded-full hover:bg-white/5 transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                                {/* Status Callout */}
                                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400"><Clock className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-0.5">Current Status</p>
                                            <p className="text-white font-bold text-lg">{isDetailDrawerOpen.status}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-0.5">Priority</p>
                                        <p className={`font-bold ${isDetailDrawerOpen.priority === 'High' ? 'text-red-400' : isDetailDrawerOpen.priority === 'Medium' ? 'text-amber-400' : 'text-emerald-400'}`}>{isDetailDrawerOpen.priority}</p>
                                    </div>
                                </div>

                                {/* Person Info */}
                                <div>
                                    <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 border-b border-[#232338] pb-2">Requester Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-slate-500 text-xs font-medium block mb-1">Name</span>
                                            <span className="text-slate-300 font-bold">{isDetailDrawerOpen.person}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 text-xs font-medium block mb-1">Department</span>
                                            <span className="text-slate-300 font-bold">{isDetailDrawerOpen.department}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Service Info */}
                                <div>
                                    <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 border-b border-[#232338] pb-2">Service Context</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-slate-500 text-xs font-medium block mb-1">Requested Service Catalog</span>
                                            <span className="text-indigo-300 font-bold bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 inline-block">{isDetailDrawerOpen.service}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 text-xs font-medium block mb-1">Created At</span>
                                            <span className="text-slate-300 font-bold">{isDetailDrawerOpen.created}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div>
                                    <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 border-b border-[#232338] pb-2">Activity Timeline</h3>
                                    <div className="space-y-4 border-l border-indigo-900/50 ml-3 pl-4 relative">
                                        <div className="absolute w-2 h-2 rounded-full bg-indigo-500 -left-[4.5px] top-1.5" />
                                        <div>
                                            <p className="text-sm font-bold text-white leading-none">Ticket Created</p>
                                            <p className="text-xs text-slate-500 mt-1">{isDetailDrawerOpen.created}</p>
                                        </div>
                                        <div className="absolute w-2 h-2 rounded-full bg-indigo-500/20 border border-indigo-500 -left-[4.5px] top-[60px]" />
                                        <div className="pt-4">
                                            <p className="text-sm font-bold text-slate-300 leading-none">Assigned to IT Team</p>
                                            <p className="text-xs text-slate-500 mt-1">System Auto-assign</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-indigo-900/40 bg-[#13131F] flex justify-between">
                                <button onClick={() => setDetailDrawerOpen(null)} className="px-6 py-2.5 rounded-xl font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors">Close</button>
                                <button className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
                                    <Edit2 className="w-4 h-4" /> Edit Record
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Add Drawer Modal (Multi-step) */}
            <AnimatePresence>
                {isAddDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setAddDrawerOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-[500px] max-w-full bg-[#1A1A2E] border-l border-indigo-900/50 shadow-2xl z-50 flex flex-col"
                        >
                            <div className="p-6 border-b border-indigo-900/30 flex justify-between items-center bg-[#1A1A2E] sticky top-0 z-10">
                                <h2 className="text-xl font-heading font-black tracking-tight text-white mb-1">Define New Request</h2>
                                <button onClick={() => setAddDrawerOpen(false)} className="p-2 rounded-full hover:bg-[#13131F] transition-colors text-slate-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Progress bar */}
                            <div className="h-1 w-full bg-[#13131F]">
                                <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${(drawerStep / 3) * 100}%` }} />
                            </div>

                            <div className="px-6 py-4 flex items-center justify-between border-b border-indigo-900/30 bg-[#13131F]/50">
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${drawerStep >= step ? 'bg-indigo-500 text-white' : 'bg-[#1A1A2E] border border-indigo-900/50 text-slate-500'}`}>
                                            {drawerStep > step ? <Check className="w-3 h-3" /> : step}
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${drawerStep >= step ? 'text-indigo-300' : 'text-slate-600'}`}>
                                            {step === 1 ? 'Person' : step === 2 ? 'Service' : 'Review'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-white">
                                <AnimatePresence mode="popLayout">
                                    {drawerStep === 1 && (
                                        <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors z-20" />
                                                <input type="text" placeholder=" " className="peer w-full pl-12 pr-4 pt-6 pb-2 bg-[#13131F] border border-indigo-900/30 focus:border-indigo-500 hover:border-indigo-900/60 rounded-xl text-white outline-none transition-all font-medium" />
                                                <label className="absolute left-12 top-4 transform -translate-y-2 text-xs font-bold text-slate-500 uppercase tracking-widest peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-2 peer-focus:text-indigo-400 transition-all z-10 pointer-events-none">
                                                    Requester Name
                                                </label>
                                            </div>
                                            <div className="relative group">
                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors z-20" />
                                                <select className="peer w-full pl-12 pr-4 pt-6 pb-2 bg-[#13131F] border border-indigo-900/30 focus:border-indigo-500 hover:border-indigo-900/60 rounded-xl text-white outline-none transition-all font-medium appearance-none">
                                                    <option>IT Support</option>
                                                    <option>HR Services</option>
                                                    <option>Facilities</option>
                                                </select>
                                                <label className="absolute left-12 top-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest transition-all z-10 pointer-events-none">
                                                    Department
                                                </label>
                                            </div>
                                        </motion.div>
                                    )}

                                    {drawerStep === 2 && (
                                        <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                            <div className="relative group">
                                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors z-20" />
                                                <select className="peer w-full pl-12 pr-4 pt-6 pb-2 bg-[#13131F] border border-indigo-900/30 focus:border-indigo-500 hover:border-indigo-900/60 rounded-xl text-white outline-none transition-all font-medium appearance-none">
                                                    <option>Hardware Replacement</option>
                                                    <option>Software Installation</option>
                                                    <option>Network Access</option>
                                                </select>
                                                <label className="absolute left-12 top-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest transition-all z-10 pointer-events-none">
                                                    Service Catalog Type
                                                </label>
                                            </div>
                                            <div className="relative group">
                                                <select className="peer w-full px-4 pt-6 pb-2 bg-[#13131F] border border-indigo-900/30 focus:border-indigo-500 hover:border-indigo-900/60 rounded-xl text-white outline-none transition-all font-medium appearance-none">
                                                    <option>High</option>
                                                    <option>Medium</option>
                                                    <option>Low</option>
                                                </select>
                                                <label className="absolute left-4 top-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest transition-all z-10 pointer-events-none">
                                                    Priority Label
                                                </label>
                                            </div>
                                        </motion.div>
                                    )}

                                    {drawerStep === 3 && (
                                        <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                                            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-sm">
                                                <p className="text-slate-400 mb-1">Requester</p>
                                                <p className="font-bold text-white text-lg">New Person</p>
                                                <p className="font-bold text-indigo-300">IT Support</p>
                                            </div>
                                            <div className="p-4 bg-[#13131F] border border-indigo-900/30 rounded-xl text-sm">
                                                <p className="text-slate-400 mb-1">Service Required</p>
                                                <p className="font-bold text-white text-lg">Network Access</p>
                                                <p className="font-bold text-red-400 mt-2">High Priority</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="p-6 border-t border-indigo-900/40 bg-[#1A1A2E] flex justify-between items-center">
                                <button
                                    onClick={() => setDrawerStep(s => Math.max(1, s - 1))}
                                    disabled={drawerStep === 1}
                                    className="px-6 py-2.5 font-bold text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                                >
                                    Back
                                </button>
                                {drawerStep < 3 ? (
                                    <button
                                        onClick={() => setDrawerStep(s => s + 1)}
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all"
                                    >
                                        Next Step
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setAddDrawerOpen(false)}
                                        className="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        <Check className="w-5 h-5" /> Confirm & Add
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
