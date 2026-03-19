"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, UserCog, ListTree,
  Settings2, Fingerprint, Map, LogOut, ShieldAlert, FileSpreadsheet
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  // --- LOGOUT FUNCTION ---
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const masters = [
    { name: 'Admin Dashboard', icon: <LayoutDashboard size={20} />, href: '/admin-dashboard' },
    { name: 'Dept. Master', icon: <Building2 size={20} />, href: '/dept-master' },
    { name: 'Dept. Person', icon: <UserCog size={20} />, href: '/dept-person' },
    { name: 'Request Type', icon: <ListTree size={20} />, href: '/request-type' },
    { name: 'Service Type', icon: <Settings2 size={20} />, href: '/service-type' },
    { name: 'Status Master', icon: <Fingerprint size={20} />, href: '/status-master' },
    { name: 'Type Mapping', icon: <Map size={20} />, href: '/type-mapping' },
    { name: 'Person Master', icon: <Map size={20} />, href: '/department-person-master' },
    { name: 'Reports', icon: <FileSpreadsheet size={20} />, href: '/reports' }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 text-indigo-100 flex flex-col z-50 shadow-2xl border-r border-indigo-700/50 animate-in-left">
      <div className="p-8 flex items-center gap-3 border-b border-indigo-700/50 bg-indigo-950/50 backdrop-blur">
        <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 p-2 rounded-xl text-white shadow-lg">
          <ShieldAlert size={24} />
        </div>
        <span className="text-xl font-black text-white tracking-tighter uppercase">Admin<span className="text-indigo-300">OS</span></span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        <p className="px-6 text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] mb-4">Core Masters</p>
        {masters.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${isActive
                  ? 'bg-indigo-600 text-white shadow-lg sidebar-item-active'
                  : 'text-indigo-100 hover:bg-indigo-700/60 hover:text-white'
                }`}
            >
              {item.icon} {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 bg-indigo-950/70 border-t border-indigo-700/50 backdrop-blur">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-indigo-200 hover:text-red-300 transition-all duration-300 font-bold text-sm rounded-xl hover:bg-red-900/30"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}