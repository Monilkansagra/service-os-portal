"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, BarChart3, LogOut, ChevronRight } from 'lucide-react';

export default function HODSidebar() {
  const pathname = usePathname();

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-slate-400 flex flex-col z-50 border-r border-slate-800">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-emerald-500 p-2.5 rounded-2xl text-white shadow-xl">
          <BarChart3 size={22} />
        </div>
        <span className="text-xl font-black text-white tracking-tighter">Dept<span className="text-emerald-400 font-normal italic">Manager</span></span>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-2">
        <p className="px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Management</p>
        <Link href="/hod-dashboard"
          className={`flex items-center justify-between px-6 py-4 rounded-[24px] text-sm font-bold transition-all ${
            pathname === '/hod-dashboard' ? 'bg-emerald-500 text-white shadow-lg' : 'hover:bg-slate-800 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-4"><LayoutGrid size={20} /> Dept. Dashboard</div>
          {pathname === '/hod-dashboard' && <ChevronRight size={14} />}
        </Link>
      </nav>

      <div className="p-6 space-y-4">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-slate-500 hover:text-red-400 transition-colors font-bold text-sm uppercase tracking-widest"
        >
          <LogOut size={18} /> Exit System
        </button>
      </div>
    </aside>
  );
}