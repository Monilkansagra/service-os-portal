"use client";
import React from 'react';
import PortalSidebar from "@/components/portalSidebar";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0F0F1A] text-slate-100 selection:bg-indigo-500/30 overflow-x-hidden relative">
      {/* Subtle background glow effect for deep dark theme */}
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[100px] z-0" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[100px] z-0" />

      {/* Sidebar navigation */}
      <PortalSidebar />

      {/* Main Content Area */}
      <main className="flex-1 w-full md:ml-64 relative z-10 min-h-screen">
        <div className="p-4 sm:p-6 md:p-10 lg:p-14 max-w-[1600px] mx-auto mt-14 md:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
}