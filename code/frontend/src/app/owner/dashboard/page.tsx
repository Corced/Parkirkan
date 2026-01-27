'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, MapPin, TrendingUp, Calendar, ArrowUpRight, DollarSign } from "lucide-react";
import { dashboardService } from '@/lib/api';
import { OwnerStats } from '@/types';
import { cn } from '@/lib/utils';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function OwnerDashboard() {
    const [stats, setStats] = useState<OwnerStats>({
        monthly_revenue: 0,
        monthly_revenue_change: 0,
        occupancy_rate: 0,
        occupancy_rate_change: 0,
        total_transactions: 0,
        total_transactions_change: 0,
        revenue_data: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        dashboardService.getOwnerStats()
            .then(setStats)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const statCards = [
        {
            label: 'Pendapatan Bulan Ini',
            value: `Rp ${Number(stats.monthly_revenue).toLocaleString('id-ID')}`,
            change: stats.monthly_revenue_change,
            icon: DollarSign,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
            borderColor: 'border-amber-200'
        },
        {
            label: 'Okupansi Parkir',
            value: `${Math.round(stats.occupancy_rate || 0)}%`,
            change: stats.occupancy_rate_change,
            icon: MapPin,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            borderColor: 'border-blue-200'
        },
        {
            label: 'Total Transaksi',
            value: stats.total_transactions.toLocaleString('id-ID'),
            change: stats.total_transactions_change,
            icon: TrendingUp,
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-600',
            borderColor: 'border-purple-200'
        },
    ];

    const currentYear = new Date().getFullYear();
    const currentDateFormatted = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    const chartData = {
        labels: stats.revenue_data.map(d => d.name),
        datasets: [
            {
                label: 'Pendapatan',
                data: stats.revenue_data.map(d => d.value),
                backgroundColor: (context: any) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(59, 130, 246, 1)');
                    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
                    return gradient;
                },
                borderRadius: 12,
                borderSkipped: false,
                hoverBackgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#0f172a',
                titleFont: { size: 14, weight: 'bold' as const },
                bodyFont: { size: 13 },
                padding: 16,
                cornerRadius: 12,
                displayColors: false,
                callbacks: {
                    label: (context: any) => {
                        return `Rp ${context.raw.toLocaleString('id-ID')}`;
                    }
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    callback: (value: any) => `Rp ${value.toLocaleString('id-ID')}`,
                    font: { size: 11, weight: 'bold' as const },
                    color: '#94a3b8',
                },
                border: { display: false },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: { size: 11, weight: 'bold' as const },
                    color: '#94a3b8',
                },
                border: { display: false },
            },
        },
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div className="animate-in fade-in slide-in-from-left duration-700">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard Owner</h1>
                    <p className="text-slate-500 mt-2 font-bold uppercase text-xs tracking-widest">Business Insights & Analytics</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm animate-in fade-in slide-in-from-right duration-700">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    <span className="font-bold text-slate-900 border-l pl-3 ml-1 border-slate-200">{currentDateFormatted}</span>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid gap-8 md:grid-cols-3">
                {statCards.map((card, idx) => (
                    <Card key={idx} className={cn(
                        "border-t-8 shadow-sm hover:shadow-xl transition-all rounded-[2.5rem] animate-in fade-in slide-in-from-bottom-4 duration-500",
                        card.borderColor
                    )} style={{ animationDelay: `${idx * 150}ms` }}>
                        <CardContent className="p-10">
                            <div className="flex flex-col gap-6">
                                <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center border-2", card.iconBg)}>
                                    <card.icon className={cn("h-8 w-8", card.iconColor)} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{card.label}</p>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                                        {loading ? <div className="h-8 w-32 bg-slate-100 animate-pulse rounded-lg" /> : card.value}
                                    </h3>
                                </div>
                                {!loading && (
                                    <div className={cn(
                                        "flex items-center gap-2 font-bold text-sm",
                                        card.change >= 0 ? "text-emerald-500" : "text-rose-500"
                                    )}>
                                        <ArrowUpRight className={cn("h-4 w-4", card.change < 0 && "rotate-90")} />
                                        <span>{card.change >= 0 ? '+' : ''}{card.change}% dari bulan lalu</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-[3.5rem] p-16 shadow-sm border border-slate-100 min-h-[500px] flex flex-col group animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="flex justify-between items-start mb-16">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Overview Pendapatan Tahunan</h2>
                        <p className="text-slate-400 font-bold text-lg">Visualisasi data rekapitulasi transaksi tahunan {currentYear}.</p>
                    </div>
                </div>

                <div className="flex-1 h-[400px] relative">
                    {loading ? (
                        <div className="absolute inset-0 flex items-end justify-between gap-4">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="flex-1 bg-slate-50 animate-pulse rounded-t-2xl" style={{ height: `${Math.random() * 80 + 20}%` }} />
                            ))}
                        </div>
                    ) : (
                        <Bar data={chartData} options={chartOptions} />
                    )}
                </div>
            </div>
        </div>
    );
}
