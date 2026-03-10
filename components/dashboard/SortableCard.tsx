"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";

interface SortableCardProps {
    id: string;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export function SortableCard({ id, title, children, className = "" }: SortableCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative bg-[#1A1A2E] border border-indigo-900/40 rounded-3xl shadow-xl hover:-translate-y-1 hover:border-indigo-500/60 transition-all duration-300 group flex flex-col ${isDragging ? "opacity-50 ring-2 ring-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]" : "hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] shadow-indigo-500/5"
                } ${className}`}
        >
            <div className="flex items-center justify-between p-6 border-b border-[#232338]">
                <h3 className="font-heading font-bold text-white tracking-tight">{title}</h3>
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1 rounded text-slate-500 hover:bg-[#13131F] hover:text-indigo-400 cursor-grab active:cursor-grabbing transition-colors"
                >
                    <GripHorizontal className="w-5 h-5" />
                </button>
            </div>
            <div className="flex-1 p-6">
                {children}
            </div>
        </div>
    );
}
