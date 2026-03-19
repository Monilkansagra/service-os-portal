"use client";
import React from 'react';
import HODSidebar from "@/components/hodSidebar";

export default function HODLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <HODSidebar />
      <main className="flex-1 w-full md:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 md:p-10 lg:p-14 max-w-[1600px] mx-auto mt-14 md:mt-0 relative z-0">
          {children}
        </div>
      </main>
    </div>
  );
}