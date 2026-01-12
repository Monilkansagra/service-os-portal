"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ClipboardList, Settings, 
  Users, Activity, LogOut, ShieldCheck 
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
    { name: 'My Requests', icon: <ClipboardList size={20} />, href: '/request-details' },
    { name: 'Staff Master', icon: <Users size={20} />, href: '/staff-master' },
    { name: 'Dept Master', icon: <Settings size={20} />, href: '/dept-master' },
    { name: 'Status Master', icon: <Activity size={20} />, href: '/status-master' },
  ];

  return (
    <div className="w-72 h-screen bg-white border-r border-slate-100 flex flex-col p-6 sticky top-0">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="bg-blue-600 p-2 rounded-xl text-white">
          <ShieldCheck size={24} />
        </div>
        <span className="text-xl font-black text-slate-800 tracking-tight">ServiceHub</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Main Menu</p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${
                isActive 
                ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout / User Profile */}
      <div className="pt-6 border-t border-slate-50">
        <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-red-400 hover:bg-red-50 hover:text-red-500 transition-all">
          <LogOut size={20} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;