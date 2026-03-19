"use client";
import React from 'react';
import PortalSidebar from "@/components/portalSidebar";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* સાઇડબાર લોડ થશે */}
      <PortalSidebar />

      {/* મેઈન કન્ટેન્ટ એરિયા - md:ml-64 સાઇડબારની જગ્યા રોકે છે ડેસ્કટોપ પર */}
      <main className="flex-1 w-full md:ml-64">
        <div className="p-4 sm:p-6 md:p-10 lg:p-14 max-w-[1600px] mx-auto mt-14 md:mt-0 relative z-0">
          {children}
        </div>
      </main>
    </div>
  );
}