"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
    id: string;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export function DashboardCard({ id, title, children, className }: DashboardCardProps) {
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
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={cn(
                "relative group flex flex-col h-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm transition-all overflow-hidden",
                isDragging && "z-50 ring-2 ring-indigo-500 opacity-80 cursor-grabbing shadow-2xl scale-105",
                className
            )}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-wider">{title}</CardTitle>
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1.5 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-md transition-colors"
                >
                    <GripVertical className="h-4 w-4" />
                </button>
            </CardHeader>
            <CardContent className="p-4 flex-1">
                {children}
            </CardContent>
        </Card>
    );
}
