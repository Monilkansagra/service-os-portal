"use client";

import { useState, useMemo } from "react";
import { DownloadCloud, Filter, Calendar, Building2, Search } from "lucide-react";

interface Request {
  request_no: string;
  request_title: string;
  request_datetime: string | null;
  assigned_datetime: string | null;
  dept_name: string;
  status: string;
  priority: string;
  created_by: string;
  assigned_to: string;
}

interface ReportsClientProps {
  requests: Request[];
  departments: string[];
  statuses: string[];
}

export default function ReportsClient({ requests, departments, statuses }: ReportsClientProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      // Date Filter
      if (startDate && req.request_datetime) {
        if (new Date(req.request_datetime) < new Date(startDate)) return false;
      }
      if (endDate && req.request_datetime) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (new Date(req.request_datetime) > end) return false;
      }
      
      // Dept & Status Filters
      if (deptFilter !== "ALL" && req.dept_name !== deptFilter) return false;
      if (statusFilter !== "ALL" && req.status !== statusFilter) return false;
      
      // Search
      if (searchQuery) {
         const q = searchQuery.toLowerCase();
         if (!req.request_no.toLowerCase().includes(q) && 
             !req.request_title.toLowerCase().includes(q) &&
             !req.created_by.toLowerCase().includes(q)) {
             return false;
         }
      }

      return true;
    });
  }, [requests, startDate, endDate, deptFilter, statusFilter, searchQuery]);

  const downloadCSV = () => {
    if (filteredRequests.length === 0) return;
    
    const headers = ["Request No", "Title", "Created By", "Assigned To", "Department", "Request Date", "Assigned Date", "Priority", "Status"];
    
    const rows = filteredRequests.map(req => {
      return [
        `"${req.request_no}"`,
        `"${req.request_title.replace(/"/g, '""')}"`,
        `"${req.created_by}"`,
        `"${req.assigned_to}"`,
        `"${req.dept_name}"`,
        `"${req.request_datetime ? new Date(req.request_datetime).toLocaleString() : 'N/A'}"`,
        `"${req.assigned_datetime ? new Date(req.assigned_datetime).toLocaleString() : 'N/A'}"`,
        `"${req.priority}"`,
        `"${req.status}"`
      ].join(",");
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const filename = `Enterprise_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20 mt-6 mx-6 animate-in-up">
      <div className="bg-[#1A1A2E] rounded-2xl border border-indigo-900/40 p-6 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden shadow-2xl">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-teal-500" />
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight">Enterprise Reports</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.2)]">ANALYTICS</span>
          </div>
          <p className="text-slate-400 font-medium text-sm mt-1">
            Generate, filter and export comprehensive data reports.
          </p>
        </div>

        <button 
          onClick={downloadCSV}
          disabled={filteredRequests.length === 0}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.5)] active:scale-95"
        >
          <DownloadCloud size={20} /> Export to CSV
        </button>
      </div>

      <div className="bg-[#1A1A2E] border border-indigo-900/40 rounded-2xl p-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
            <input 
              type="text" 
              placeholder="Search ID, Title, User..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#13131F] border border-indigo-900/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500/70 transition-colors placeholder:text-slate-600 shadow-inner"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#13131F] border border-indigo-900/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500/70 transition-colors [color-scheme:dark] shadow-inner"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#13131F] border border-indigo-900/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500/70 transition-colors [color-scheme:dark] shadow-inner"
            />
          </div>

          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
            <select 
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full bg-[#13131F] border border-indigo-900/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500/70 transition-colors appearance-none shadow-inner"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#13131F] border border-indigo-900/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 outline-none focus:border-indigo-500/70 transition-colors appearance-none shadow-inner"
            >
              <option value="ALL">All Statuses</option>
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-indigo-900/40 shadow-inner bg-[#13131F]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#13131F] text-indigo-300 border-b border-indigo-900/40 text-[11px] uppercase font-black tracking-widest sticky top-0">
              <tr>
                <th className="px-6 py-4">Req No</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-900/20">
              {filteredRequests.length > 0 ? filteredRequests.map((req, i) => (
                <tr key={i} className="hover:bg-indigo-900/20 transition-colors text-slate-300 font-medium">
                  <td className="px-6 py-4 font-bold text-indigo-400">{req.request_no}</td>
                  <td className="px-6 py-4 truncate max-w-[200px]" title={req.request_title}>{req.request_title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-black tracking-wider border ${
                      req.status === 'Resolved' || req.status === 'Closed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      req.status === 'Open' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{req.dept_name}</td>
                  <td className="px-6 py-4 text-slate-400">{req.request_datetime ? new Date(req.request_datetime).toLocaleDateString() : 'N/A'}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-bold text-sm">
                    No requests found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-[10px] font-black text-slate-500 text-right uppercase tracking-widest">
          Showing {filteredRequests.length} results
        </div>
      </div>
    </div>
  );
}
