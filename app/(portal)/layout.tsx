"use client";
import React from 'react';
import PortalSidebar from "@/components/portalSidebar";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* સાઇડબાર લોડ થશે */}
      <PortalSidebar />

      {/* મેઈન કન્ટેન્ટ એરિયા - ml-64 સાઇડબારની જગ્યા રોકે છે */}
      <main className="flex-1 ml-64">
        <div className="p-10 lg:p-14 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}