"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wrench, FileText, LogOut, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function PortalSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // --- LOGOUT FUNCTION ---
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/portal-dashboard' },
    { name: 'Technician View', icon: <Wrench size={20} />, href: '/technician' },
    { name: 'Request Details', icon: <FileText size={20} />, href: '/request-details' },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 w-full h-14 bg-[#131324]/95 backdrop-blur-md z-[60] flex items-center justify-between px-4 border-b border-indigo-900/40 shadow-lg">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
             <Activity size={16} className="text-indigo-400" />
           </div>
           <span className="text-lg font-black tracking-tight text-white">Service<span className="text-indigo-400">OS</span></span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-indigo-950/60 border border-indigo-900/40 rounded-lg text-slate-300 hover:text-white transition-colors">
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             onClick={() => setIsOpen(false)}
             className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[65]" 
           />
        )}
      </AnimatePresence>

      <aside className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-[#131324] via-[#10101C] to-[#0D0D17] border-r border-indigo-900/40 flex flex-col z-[70] shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Mobile close button */}
        <button onClick={() => setIsOpen(false)} className="md:hidden absolute top-4 right-4 p-2 bg-indigo-950/60 hover:bg-red-500/10 border border-indigo-900/30 rounded-full text-slate-400 hover:text-red-400 transition-colors">
          <X size={18} />
        </button>
        
        <div className="p-8 flex items-center gap-3 border-b border-indigo-900/30">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20"
          >
            <Activity size={22} color="white" />
          </motion.div>
          <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tighter">
            Service<span className="text-white">OS</span>
          </span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Portal Menu</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}
                className={`relative flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 group overflow-hidden ${
                  isActive 
                    ? 'text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-bg-portal"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl -z-10 shadow-[0_4px_15px_rgba(99,102,241,0.3)] border border-indigo-500/30"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {/* Hover effect background for non-active items */}
                {!isActive && (
                  <div className="absolute inset-0 bg-indigo-950/40 border border-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl -z-10" />
                )}
                
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110 text-white' : 'text-indigo-400 group-hover:text-white group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                <span className="z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-indigo-900/30 bg-[#0d0d17]/50">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="relative overflow-hidden group flex items-center justify-center gap-3 w-full px-4 py-3.5 bg-indigo-950/40 hover:bg-red-950/20 border border-indigo-900/40 hover:border-red-900/50 text-slate-300 hover:text-white rounded-xl transition-all font-bold text-xs uppercase tracking-widest shadow-md"
          >
            <div className="relative z-10 flex items-center gap-3">
              <LogOut size={15} className="text-red-400 group-hover:text-red-300 transition-colors" /> 
              <span>Sign Out</span>
            </div>
          </motion.button>
        </div>
      </aside>
    </>
  );
}