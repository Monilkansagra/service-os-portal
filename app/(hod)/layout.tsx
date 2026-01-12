"use client";
import React from 'react';
import HODSidebar from "@/components/hodSidebar";

export default function HODLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <HODSidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-10 lg:p-14">
          {children}
        </div>
      </main>
    </div>
  );
}