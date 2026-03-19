"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, BarChart3, LogOut, ChevronRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HODSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // --- LOGOUT FUNCTION ---
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 w-full h-14 bg-emerald-950/90 backdrop-blur-md z-[60] flex items-center justify-between px-4 border-b border-emerald-900 shadow-sm text-white">
        <div className="flex items-center gap-2">
           <BarChart3 size={18} className="text-emerald-400" />
           <span className="text-lg font-black tracking-tight">Dept<span className="text-emerald-300">Manager</span></span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-emerald-900 rounded-lg text-emerald-100">
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             onClick={() => setIsOpen(false)}
             className="md:hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[65]" 
           />
        )}
      </AnimatePresence>

      <aside className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 text-emerald-100 flex flex-col z-[70] shadow-2xl border-r border-emerald-700/50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Mobile close button */}
        <button onClick={() => setIsOpen(false)} className="md:hidden absolute top-4 right-4 p-2 bg-emerald-800 rounded-full text-emerald-200 hover:text-white transition-colors">
          <X size={18} />
        </button>
      <div className="p-8 flex items-center gap-3 border-b border-emerald-700/50 bg-emerald-950/50 backdrop-blur">
        <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2.5 rounded-xl text-white shadow-lg">
          <BarChart3 size={24} />
        </div>
        <span className="text-xl font-black text-white tracking-tighter">Dept<span className="text-emerald-300 font-black">Manager</span></span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-6 text-[10px] font-black text-emerald-300 uppercase tracking-[0.3em] mb-4">Management</p>
        <Link href="/hod-dashboard"
          className={`flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${pathname === '/hod-dashboard' ? 'bg-emerald-600 text-white shadow-lg sidebar-item-active' : 'text-emerald-100 hover:bg-emerald-700/60 hover:text-white'
            }`}
        >
          <div className="flex items-center gap-4"><LayoutGrid size={20} /> Dept. Dashboard</div>
          {pathname === '/hod-dashboard' && <ChevronRight size={14} />}
        </Link>
      </nav>

      <div className="p-6 bg-emerald-950/70 border-t border-emerald-700/50 backdrop-blur">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full px-4 py-3 text-emerald-200 hover:text-red-300 transition-all duration-300 font-bold text-sm rounded-xl hover:bg-red-900/30"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
    </>
  );
}