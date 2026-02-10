'use client';

import { useEffect, useState } from 'react';
import { logService } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Plus, Edit, Trash2, DollarSign, Clock, User as UserIcon } from "lucide-react";
import { ActivityLog } from "@/types";

export default function LogsPage() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await logService.getAll();
            setLogs(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getActionType = (action: string) => {
        const a = action.toUpperCase();
        if (a.includes('CREATE')) return { label: 'CREATE', color: 'bg-emerald-500', icon: Plus, iconBg: 'bg-emerald-100 text-emerald-600', border: 'border-emerald-200' };
        if (a.includes('UPDATE')) return { label: 'UPDATE', color: 'bg-sky-500', icon: Edit, iconBg: 'bg-sky-100 text-sky-600', border: 'border-sky-200' };
        if (a.includes('DELETE')) return { label: 'DELETE', color: 'bg-red-500', icon: Trash2, iconBg: 'bg-red-100 text-red-600', border: 'border-red-200' };
        if (a.includes('TRANSACTION') || a.includes('CHECK')) return { label: 'TRANSACTION', color: 'bg-amber-500', icon: DollarSign, iconBg: 'bg-amber-100 text-amber-600', border: 'border-amber-200' };
        return { label: 'INFO', color: 'bg-slate-500', icon: Clock, iconBg: 'bg-slate-100 text-slate-600', border: 'border-slate-200' };
    };

    return (
        <div className="space-y-12 pb-20 max-w-5xl mx-auto">
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-tight">Log Aktivitas</h1>
            </div>

            {/* Logs List Container */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-12 lg:p-16 space-y-12 min-h-[600px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96 space-y-4">
                        <div className="h-12 w-12 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
                        <p className="text-slate-400 font-bold italic">Memuat aktivitas...</p>
                    </div>
                ) : logs.length > 0 ? (
                    logs.map((log) => {
                        const type = getActionType(log.action);
                        const Icon = type.icon;

                        return (
                            <div key={log.id} className="flex gap-8 group relative">
                                {/* Connector Line (Optional, for timeline feel) */}
                                <div className="absolute left-6 top-16 bottom-[-3rem] w-1 bg-slate-50 group-last:hidden" />

                                {/* Icon Column */}
                                <div className={cn(
                                    "flex-shrink-0 h-14 w-14 rounded-full flex items-center justify-center shadow-md z-10 transition-transform group-hover:scale-110",
                                    type.iconBg
                                )}>
                                    <Icon className="h-6 w-6" strokeWidth={2.5} />
                                </div>

                                {/* Content Column */}
                                <div className="space-y-3 pt-1 flex-1">
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl font-black text-slate-900 tracking-tight lowercase">
                                            {log.user?.username || log.userName || 'system'}
                                        </span>
                                        <span className={cn(
                                            "px-4 py-1 rounded-lg text-[10px] font-black text-white italic tracking-[0.1em] uppercase shadow-sm",
                                            type.color
                                        )}>
                                            {type.label}
                                        </span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold text-slate-500 tracking-tight leading-snug">
                                            {log.description}
                                        </p>
                                        <p className="text-sm font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            {new Date(log.created_at).toLocaleString('id-ID', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center h-96 space-y-4">
                        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                            <Clock className="h-10 w-10 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold italic">Belum ada aktivitas tercatat</p>
                    </div>
                )}
            </div>
        </div>
    );
}
