'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, MapPin, TrendingUp, Calendar, ArrowUpRight, DollarSign } from "lucide-react";
import { dashboardService } from '@/lib/api';
import { OwnerStats } from '@/types';
import { cn } from '@/lib/utils';

export default function OwnerDashboard() {
    const [stats, setStats] = useState<OwnerStats>({
        monthly_revenue: 0,
        occupancy_rate: 0,
        total_transactions: 0
    });

    useEffect(() => {
        dashboardService.getOwnerStats().then(setStats).catch(console.error);
    }, []);

    const statCards = [
        { label: 'Pendapatan Bulan Ini', value: `Rp ${Number(stats.monthly_revenue).toLocaleString()}`, icon: DollarSign, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', borderColor: 'border-amber-200' },
        { label: 'Okupansi Parkir', value: `${Math.round(stats.occupancy_rate || 0)}%`, icon: MapPin, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', borderColor: 'border-blue-200' },
        { label: 'Total Transaksi', value: stats.total_transactions.toLocaleString(), icon: TrendingUp, iconBg: 'bg-purple-50', iconColor: 'text-purple-600', borderColor: 'border-purple-200' },
    ];

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard Owner</h1>
                    <p className="text-slate-500 mt-2 font-bold uppercase text-xs tracking-widest">Business Insights & Analytics</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    <span className="font-bold text-slate-900 border-l pl-3 ml-1 border-slate-200">Mei 2024</span>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid gap-8 md:grid-cols-3">
                {statCards.map((card, idx) => (
                    <Card key={idx} className={cn("border-t-8 shadow-sm hover:shadow-xl transition-all rounded-[2.5rem]", card.borderColor)}>
                        <CardContent className="p-10">
                            <div className="flex flex-col gap-6">
                                <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center border-2", card.iconBg)}>
                                    <card.icon className={cn("h-8 w-8", card.iconColor)} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{card.label}</p>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{card.value}</h3>
                                </div>
                                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                                    <ArrowUpRight className="h-4 w-4" />
                                    <span>+12.5% dari bulan lalu</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Chart Section Placeholder */}
            <div className="bg-white rounded-[3.5rem] p-16 shadow-sm border border-slate-100 min-h-[500px] flex flex-col group">
                <div className="flex justify-between items-start mb-16">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Overview Pendapatan Tahunan</h2>
                        <p className="text-slate-400 font-bold text-lg">Visualisasi data rekapitulasi transaksi tahunan.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-colors">2024</button>
                        <button className="px-6 py-2 bg-slate-100 text-slate-400 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">2023</button>
                    </div>
                </div>

                <div className="flex-1 flex items-end justify-between gap-4 border-b-2 border-slate-50 pb-8">
                    {/* Simulated Chart Bars */}
                    {[40, 60, 45, 80, 55, 90, 70, 85, 60, 75, 50, 65].map((height, i) => (
                        <div key={i} className="flex-1 group/bar relative">
                            <div
                                className="w-full bg-slate-100 rounded-2xl transition-all duration-500 group-hover:bg-blue-500 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer"
                                style={{ height: `${height}%` }}
                            >
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold py-2 px-3 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    Rp {(height * 1.2).toFixed(1)}jt
                                </div>
                            </div>
                            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase italic">
                                {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][i]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
