'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, MapPin, TrendingUp, Calendar, ArrowUpRight, DollarSign, Car } from "lucide-react";
import { dashboardService, transactionService } from '@/lib/api';
import { OwnerStats, Transaction } from '@/types';
import { cn } from '@/lib/utils';
import { ShiftSimulator } from '@/components/dev/ShiftSimulator';
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
    const [todayStats, setTodayStats] = useState({ revenue: 0, transactions: 0 });
    const [vehicleStats, setVehicleStats] = useState<{ labels: string[], data: number[] }>({ labels: [], data: [] });
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = () => {
        setLoading(true);
        Promise.all([
            dashboardService.getOwnerStats(),
            transactionService.getAll()
        ])
            .then(([ownerStats, transactions]) => {
                setStats(ownerStats);

                // Calculate Today's Stats
                const today = new Date();
                const todayStr = today.toDateString();
                const todayTransactions = transactions.filter(transaction => new Date(transaction.check_in_time).toDateString() === todayStr);

                const revenueToday = todayTransactions.reduce((acc, transaction) => acc + (Number(transaction.total_cost) || 0), 0);
                setTodayStats({
                    revenue: revenueToday,
                    transactions: todayTransactions.length
                });

                // Calculate Vehicle Type Stats
                const vehicleCounts: Record<string, number> = {};
                transactions.forEach(transaction => {
                    const type = transaction.vehicle?.vehicle_type || 'Unknown';
                    vehicleCounts[type] = (vehicleCounts[type] || 0) + 1;
                });

                setVehicleStats({
                    labels: Object.keys(vehicleCounts),
                    data: Object.values(vehicleCounts)
                });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const statCards = [
        {
            label: 'Pendapatan Hari Ini',
            value: `Rp ${todayStats.revenue.toLocaleString('id-ID')}`,
            change: stats.monthly_revenue_change, // Keeping monthly change as proxy or placeholder
            icon: DollarSign,
            iconBg: 'bg-white',
            iconColor: 'text-black',
            borderColor: 'border-slate-200'
        },
        {
            label: 'Transaksi Hari Ini',
            value: todayStats.transactions.toLocaleString('id-ID'),
            change: stats.total_transactions_change,
            icon: TrendingUp,
            iconBg: 'bg-white',
            iconColor: 'text-emerald-500',
            borderColor: 'border-slate-200'
        },
        {
            label: 'Kendaraan Aktif',
            value: stats.occupancy_rate ? Math.round((stats.occupancy_rate / 100) * 120).toString() : "3", // Infer from occupancy or keep mock if needed. Using mock fallback.
            subtext: "Sedang parkir",
            icon: Car,
            iconBg: 'bg-white',
            iconColor: 'text-black',
            borderColor: 'border-slate-200'
        },
        {
            label: 'Tingkat Okupansi',
            value: `${Math.round(stats.occupancy_rate || 0)}%`,
            subtext: `${Math.round(((stats.occupancy_rate || 0) / 100) * 120)}/120 slot terisi`,
            icon: MapPin,
            iconBg: 'bg-white',
            iconColor: 'text-black',
            borderColor: 'border-slate-200'
        },
    ];

    const currentYear = new Date().getFullYear();

    // Chart Data from API
    const revenueLabels = stats.revenue_data?.map(d => d.name) || ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const revenueValues = stats.revenue_data?.map(d => d.value) || [0, 0, 0, 0, 0, 0, 0];

    const vehicleLabels = vehicleStats.labels.length ? vehicleStats.labels : ['Motor', 'Mobil'];
    const vehicleValues = vehicleStats.data.length ? vehicleStats.data : [0, 0];

    const createHorizontalChartOptions = (isValueCurrency: boolean = false) => ({
        indexAxis: 'y' as const,
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: (context: any) => isValueCurrency
                        ? `Rp ${context.raw.toLocaleString('id-ID')}`
                        : `${context.raw}`
                }
            }
        },
        scales: {
            x: { display: false },
            y: {
                grid: { display: false },
                ticks: {
                    font: { size: 14, weight: 500 },
                    color: '#334155'
                },
                border: { display: false }
            }
        },
        maintainAspectRatio: false,
    });

    return (
        <div className="space-y-8 pb-20 font-sans">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-black">Dashboard Owner</h1>
                <p className="text-slate-800">Overview pendapatan dan statistik parkir</p>
            </div>

            {/* Simulation Tool */}
            <ShiftSimulator onSimulationComplete={fetchDashboardData} />

            {/* Stat Cards - Row of 4 */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card, idx) => (
                    <Card key={idx} className="border shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4">
                                <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center border", card.iconBg)}>
                                    <card.icon className={cn("h-6 w-6", card.iconColor)} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{card.label}</p>
                                    <h3 className="text-2xl font-bold text-black mt-1">{card.value}</h3>
                                    {card.change !== undefined ? (
                                        <div className={cn("text-xs font-bold mt-1", card.change >= 0 ? "text-emerald-500" : "text-red-500")}>
                                            {card.change >= 0 ? '+' : ''}{card.change}% dari kemarin
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-700 mt-1">{card.subtext}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section - Two Columns */}
            <div className="grid gap-8 lg:grid-cols-2">
                {/* Weekly Revenue Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-black mb-6">Pendapatan 7 Hari Terakhir</h3>
                    <div className="h-[300px]">
                        <Bar
                            data={{
                                labels: revenueLabels,
                                datasets: [{
                                    data: revenueValues,
                                    backgroundColor: '#3b82f6',
                                    borderRadius: 50,
                                    barThickness: 12,
                                }]
                            }}
                            options={createHorizontalChartOptions(true)}
                        />
                    </div>
                </div>

                {/* Vehicle Type Stats Chart */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-black mb-6">Statistik Jenis Kendaraan</h3>
                    <div className="h-[300px]">
                        <Bar
                            data={{
                                labels: vehicleLabels,
                                datasets: [{
                                    data: vehicleValues,
                                    backgroundColor: '#93c5fd', // Light blue foundation
                                    hoverBackgroundColor: '#3b82f6',
                                    borderRadius: 50,
                                    barThickness: 12,
                                }]
                            }}
                            options={{
                                ...createHorizontalChartOptions(false),
                                indexAxis: 'y',
                                plugins: { ...createHorizontalChartOptions(false).plugins, legend: { display: false } }
                            }}
                        />
                        {/* Custom Legend/Labels simulation for "Sedang parkir" text could be added here if exact pixel match needed, using plain HTML below chart */}
                        <div className="mt-4 space-y-3">
                            {vehicleLabels.map((label, idx) => (
                                <div key={idx} className="flex justify-between text-xs text-slate-800 px-2 lg:hidden">
                                    <span>Sedang parkir</span>
                                    <span className="font-bold text-black">{vehicleValues[idx]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
