"use client";
import React from 'react';
import AdminSidebar from "@/components/adminSidebar";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f5f7ff]">
      <AdminSidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}