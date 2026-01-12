"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Building2, UserCog, ListTree, 
  Settings2, Fingerprint, Map, LogOut, ShieldAlert
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
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
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1e1b4b] text-indigo-300 flex flex-col z-50">
      <div className="p-8 flex items-center gap-3 border-b border-indigo-900/50">
        <div className="bg-indigo-500 p-2 rounded-xl text-white">
          <ShieldAlert size={22} />
        </div>
        <span className="text-xl font-black text-white tracking-tighter uppercase">Admin<span className="text-indigo-400">OS</span></span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-6 text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-4">Core Masters</p>
        {masters.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                isActive ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-indigo-900/50 hover:text-white'
              }`}
            >
              {item.icon} {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 bg-indigo-950/50 border-t border-indigo-900/50">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-indigo-400 hover:text-red-400 transition-colors font-bold text-sm"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}