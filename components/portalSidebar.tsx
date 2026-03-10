"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Briefcase, History, LogOut } from 'lucide-react';

export default function PortalSidebar() {
  const pathname = usePathname();

  // --- LOGOUT FUNCTION ---
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const menuItems = [
    { name: 'Operations Hub', icon: <Zap size={20} />, href: '/portal-dashboard' },
    { name: 'Technician View', icon: <Briefcase size={20} />, href: '/technician' },
    { name: 'Request Details', icon: <History size={20} />, href: '/request-details' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-50 to-indigo-50 border-r-2 border-indigo-200 flex flex-col z-50 shadow-lg animate-in-left">
      <div className="p-8 flex items-center gap-3 border-b-2 border-indigo-200 bg-white backdrop-blur">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg">
          <Zap size={24} fill="currentColor" />
        </div>
        <span className="text-2xl font-black text-slate-900 tracking-tighter">Service<span className="text-indigo-600">OS</span></span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-6 text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">User Menu</p>
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${pathname === item.href ? 'bg-indigo-600 text-white shadow-lg sidebar-item-active' : 'text-slate-700 hover:bg-indigo-100 hover:text-indigo-700'
              }`}
          >
            {item.icon} {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t-2 border-indigo-200 bg-white backdrop-blur">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl transition-all font-bold text-sm uppercase tracking-widest hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}