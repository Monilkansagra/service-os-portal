"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid, Building2, Users, ListFilter, Settings,
  Fingerprint, Map as MapIcon, User, BarChart3, ShieldCheck,
  Download, ChevronLeft, Menu, LogOut, Search, Bell, FileSpreadsheet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_GROUPS = [
  {
    label: "CORE MASTERS",
    items: [
      { name: "Admin Dashboard", href: "/admin-dashboard", icon: LayoutGrid },
      { name: "Dept. Master", href: "/dept-master", icon: Building2 },
      { name: "Dept. Person", href: "/dept-person", icon: Users },
      { name: "Request Type", href: "/request-type", icon: ListFilter },
      { name: "Service Type", href: "/service-type", icon: Settings },
      { name: "Status Master", href: "/status-master", icon: Fingerprint },
      { name: "Type Mapping", href: "/type-mapping", icon: MapIcon },
      { name: "Person Master", href: "/department-person-master", icon: User },
      { name: "Reports", href: "/reports", icon: FileSpreadsheet },
    ]
  }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      window.location.href = "/login";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F0F1A]">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-[#0F0F1A]/80 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 72, x: 0 }}
        className={`h-full flex flex-col items-center py-6 z-50 shadow-2xl flex-shrink-0 overflow-x-hidden border-r border-indigo-900/40 ${isSidebarOpen ? 'absolute md:relative' : 'hidden md:flex'}`}
        style={{ background: "linear-gradient(180deg, #1E1B4B 0%, #312E81 50%, #1E1B4B 100%)" }}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="absolute right-0 top-8 translate-x-1/2 w-7 h-7 bg-indigo-600 rounded-full hidden md:flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition-colors z-50 border-2 border-[#1E1B4B]"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!isSidebarOpen && 'rotate-180'}`} />
        </button>

        {/* Mobile close button inside sidebar */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute right-4 top-4 md:hidden text-slate-400 hover:text-white"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Logo Section */}
        <div className="w-full flex items-center px-6 mb-8 gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex flex-shrink-0 items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-400/30">
            <ShieldCheck className="w-5 h-5 text-indigo-300 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          </div>
          <motion.div animate={{ opacity: isSidebarOpen ? 1 : 0, display: isSidebarOpen ? "block" : "none" }} className="whitespace-nowrap pt-1">
            <span className="font-heading font-black text-xl tracking-wider text-white">ADMINOS</span>
            <span className="ml-2 text-indigo-400 text-xs font-bold tracking-widest">v2.0</span>
          </motion.div>
        </div>

        {/* Navigation Groups */}
        <nav className="w-full flex-1 flex flex-col gap-6 px-3 overflow-y-auto custom-scrollbar">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx} className="w-full">
              {/* Group Label */}
              <motion.div animate={{ opacity: isSidebarOpen ? 1 : 0, height: isSidebarOpen ? "auto" : 0 }} className="px-3 mb-2 overflow-hidden">
                <span className="text-indigo-300/60 uppercase tracking-widest text-[10px] font-bold">{group.label}</span>
              </motion.div>

              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname.startsWith(item.href) || (pathname === '/' && item.href === '/admin-dashboard');
                  return (
                    <li key={item.name}>
                      <Link href={item.href} className="block group relative" title={!isSidebarOpen ? item.name : undefined}>
                        {isActive && (
                          <motion.div layoutId="activeNavBg" className="absolute inset-0 bg-indigo-500/20 rounded-xl" />
                        )}
                        <div
                          className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 relative 
                          ${isActive
                              ? 'border-l-[3px] border-indigo-400'
                              : 'border-l-[3px] border-transparent hover:bg-white/10 group-hover:translate-x-[6px]'
                            }`}
                        >
                          <item.icon
                            className={`w-5 h-5 flex-shrink-0 transition-colors 
                            ${isActive ? 'text-indigo-300 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)] animate-[pulse-glow_2s_infinite]' : 'text-indigo-400 group-hover:text-indigo-300 group-hover:drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]'}`}
                          />
                          <motion.span
                            animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? "auto" : 0 }}
                            className={`whitespace-nowrap overflow-hidden transition-colors ${isActive ? 'text-white font-semibold' : 'text-slate-300 group-hover:text-white font-medium'}`}
                          >
                            {item.name}
                          </motion.span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="w-full px-3 mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2 hover:bg-white/5 cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex flex-shrink-0 items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <User className="w-5 h-5" />
            </div>
            <motion.div animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? "auto" : 0 }} className="overflow-hidden whitespace-nowrap">
              <p className="text-sm font-bold text-white leading-tight">Admin User</p>
              <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Superadmin</p>
            </motion.div>
            <motion.div animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? "auto" : 0 }} className="ml-auto overflow-hidden">
              <Settings className="w-4 h-4 text-slate-400 group-hover:text-white transition-all duration-300 group-hover:rotate-90" />
            </motion.div>
          </div>

          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:translate-x-[6px] transition-all duration-150 group" title={!isSidebarOpen ? "Sign Out" : undefined}>
            <LogOut className="w-5 h-5 flex-shrink-0 text-red-400" />
            <motion.span animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? "auto" : 0 }} className="font-bold whitespace-nowrap overflow-hidden group-hover:text-red-300">
              Sign Out
            </motion.span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#0F0F1A]">
        {/* Top Header Banner */}
        <header className="h-16 bg-[#13131F] border-b border-indigo-900/40 flex items-center justify-between px-4 sm:px-8 z-50 sticky top-0 shadow-sm relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-violet-500" />

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden mr-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-400 hover:text-white transition-colors">
              <Menu size={24} />
            </button>
          </div>

          <div className="flex-1 max-w-lg">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input type="text" placeholder="Search across AdminOS..." className="w-full pl-10 pr-4 py-2 bg-[#1A1A2E] border border-indigo-900/30 rounded-full text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-500" />
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => setNotificationsOpen(!isNotificationsOpen)}
              className={`p-2.5 rounded-full ${isNotificationsOpen ? 'bg-[#232338] text-white border-indigo-500/50' : 'bg-[#1A1A2E] text-slate-400 border-indigo-900/30'} hover:bg-[#232338] border hover:text-white transition-colors relative group`}
            >
              <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border border-[#1A1A2E]"></span>
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-14 right-0 w-80 bg-[#1A1A2E] border border-indigo-900/40 rounded-2xl shadow-2xl overflow-hidden z-50 text-white"
                >
                  <div className="p-4 border-b border-indigo-900/30 flex justify-between items-center bg-[#13131F]">
                    <h3 className="font-bold text-sm tracking-wide">Notifications</h3>
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">2 New</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    <div className="p-4 border-b border-indigo-900/20 hover:bg-[#232338] transition-colors cursor-pointer">
                      <p className="text-sm font-medium text-white mb-1">New Service Request</p>
                      <p className="text-xs text-slate-400">IT Support required in HR block</p>
                      <p className="text-[10px] text-indigo-400 font-semibold mt-2">Just now</p>
                    </div>
                    <div className="p-4 border-b border-indigo-900/20 hover:bg-[#232338] transition-colors cursor-pointer opacity-70">
                      <p className="text-sm font-medium text-slate-300 mb-1">System Update</p>
                      <p className="text-xs text-slate-400">AdminOS v2.0 update completed</p>
                      <p className="text-[10px] text-slate-500 font-semibold mt-2">2 hours ago</p>
                    </div>
                    <div className="p-4 hover:bg-[#232338] transition-colors cursor-pointer opacity-70">
                      <p className="text-sm font-medium text-slate-300 mb-1">Server Alert</p>
                      <p className="text-xs text-slate-400">High CPU usage on Node 3</p>
                      <p className="text-[10px] text-slate-500 font-semibold mt-2">Yesterday</p>
                    </div>
                  </div>
                  <div className="p-3 border-t border-indigo-900/30 bg-[#13131F] text-center">
                    <button
                      onClick={() => alert("All notifications marked as read")}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-bold tracking-wider uppercase transition-colors"
                    >
                      Mark All as Read
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar p-6 lg:p-10 relative">
          {/* Subtle background glow effect for deep dark theme */}
          <div className="pointer-events-none absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[100px]" />

          <div className="max-w-[1600px] mx-auto h-full relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}