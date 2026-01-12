"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Briefcase, History, LogOut } from 'lucide-react';

export default function PortalSidebar() {
  const pathname = usePathname();

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/login";
  };

  const menuItems = [
    { name: 'Operations Hub', icon: <Zap size={20} />, href: '/portal-dashboard' },
    { name: 'Technician View', icon: <Briefcase size={20} />, href: '/technician' },
    { name: 'Request Details', icon: <History size={20} />, href: '/request-details' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 flex flex-col z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-xl shadow-blue-200">
          <Zap size={22} fill="currentColor" />
        </div>
        <span className="text-2xl font-black text-slate-800 tracking-tighter">Service<span className="text-blue-600">OS</span></span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <p className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">User Menu</p>
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}
            className={`flex items-center gap-4 px-6 py-4 rounded-[24px] text-sm font-black transition-all ${
              pathname === item.href ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            {item.icon} {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-50">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-slate-900 text-white rounded-[20px] transition-all font-black text-xs uppercase tracking-widest hover:bg-red-500 shadow-lg"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
}