'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, TrendingUp, DollarSign, Car, ChevronDown, Filter } from "lucide-react";
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
    Filler,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const VEHICLE_COLORS: Record<string, { bg: string; border: string; hover: string }> = {
    motor: { bg: 'rgba(99, 102, 241, 0.8)', border: 'rgb(99, 102, 241)', hover: 'rgba(99, 102, 241, 1)' },
    mobil: { bg: 'rgba(59, 130, 246, 0.8)', border: 'rgb(59, 130, 246)', hover: 'rgba(59, 130, 246, 1)' },
    truck: { bg: 'rgba(245, 158, 11, 0.8)', border: 'rgb(245, 158, 11)', hover: 'rgba(245, 158, 11, 1)' },
    bus: { bg: 'rgba(16, 185, 129, 0.8)', border: 'rgb(16, 185, 129)', hover: 'rgba(16, 185, 129, 1)' },
    van: { bg: 'rgba(236, 72, 153, 0.8)', border: 'rgb(236, 72, 153)', hover: 'rgba(236, 72, 153, 1)' },
    default: { bg: 'rgba(148, 163, 184, 0.8)', border: 'rgb(148, 163, 184)', hover: 'rgba(148, 163, 184, 1)' },
};

function getVehicleColor(type: string) {
    return VEHICLE_COLORS[type.toLowerCase()] || VEHICLE_COLORS.default;
}

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
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [todayStats, setTodayStats] = useState({ revenue: 0, transactions: 0 });
    const [loading, setLoading] = useState(true);

    // Filter state
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedVehicleType, setSelectedVehicleType] = useState<string>('semua');
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);

    const fetchDashboardData = () => {
        setLoading(true);
        Promise.all([
            dashboardService.getOwnerStats(),
            transactionService.getAll()
        ])
            .then(([ownerStats, txns]) => {
                setStats(ownerStats);
                setTransactions(txns);

                // Calculate Today's Stats
                const today = new Date();
                const todayStr = today.toDateString();
                const todayTransactions = txns.filter((t: Transaction) => new Date(t.check_in_time).toDateString() === todayStr);
                const revenueToday = todayTransactions.reduce((acc: number, t: Transaction) => acc + (Number(t.total_cost) || 0), 0);
                setTodayStats({
                    revenue: revenueToday,
                    transactions: todayTransactions.length
                });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Derive available years from transactions
    const availableYears = useMemo(() => {
        const years = new Set<number>();
        transactions.forEach(t => {
            const year = new Date(t.check_in_time).getFullYear();
            if (!isNaN(year)) years.add(year);
        });
        if (years.size === 0) years.add(currentYear);
        return Array.from(years).sort((a, b) => b - a);
    }, [transactions, currentYear]);

    // Derive available vehicle types from transactions
    const availableVehicleTypes = useMemo(() => {
        const types = new Set<string>();
        transactions.forEach(t => {
            const type = t.vehicle?.vehicle_type;
            if (type) types.add(type);
        });
        return Array.from(types).sort();
    }, [transactions]);

    // --- REVENUE CHART DATA (monthly, by year) ---
    const revenueChartData = useMemo(() => {
        const monthlyRevenue = new Array(12).fill(0);
        const monthlyCount = new Array(12).fill(0);

        transactions.forEach(t => {
            const date = new Date(t.check_in_time);
            if (date.getFullYear() === selectedYear && t.total_cost) {
                monthlyRevenue[date.getMonth()] += Number(t.total_cost);
                monthlyCount[date.getMonth()] += 1;
            }
        });

        return { revenue: monthlyRevenue, count: monthlyCount };
    }, [transactions, selectedYear]);

    // --- VEHICLE STATS DATA (monthly breakdown, by year, filtered by type) ---
    const vehicleChartData = useMemo(() => {
        const typeCounts: Record<string, number[]> = {};

        transactions.forEach(t => {
            const date = new Date(t.check_in_time);
            if (date.getFullYear() !== selectedYear) return;
            const type = t.vehicle?.vehicle_type || 'Unknown';
            if (selectedVehicleType !== 'semua' && type.toLowerCase() !== selectedVehicleType.toLowerCase()) return;

            if (!typeCounts[type]) typeCounts[type] = new Array(12).fill(0);
            typeCounts[type][date.getMonth()] += 1;
        });

        return typeCounts;
    }, [transactions, selectedYear, selectedVehicleType]);

    // --- VEHICLE DONUT SUMMARY ---
    const vehicleDonutData = useMemo(() => {
        const counts: Record<string, number> = {};
        transactions.forEach(t => {
            const date = new Date(t.check_in_time);
            if (date.getFullYear() !== selectedYear) return;
            const type = t.vehicle?.vehicle_type || 'Unknown';
            counts[type] = (counts[type] || 0) + 1;
        });
        return counts;
    }, [transactions, selectedYear]);

    const totalVehiclesInYear = Object.values(vehicleDonutData).reduce((a, b) => a + b, 0);

    const statCards = [
        {
            label: 'Pendapatan Hari Ini',
            value: `Rp ${todayStats.revenue.toLocaleString('id-ID')}`,
            change: stats.monthly_revenue_change,
            icon: DollarSign,
            iconBg: 'bg-white',
            iconColor: 'text-black',
        },
        {
            label: 'Transaksi Hari Ini',
            value: todayStats.transactions.toLocaleString('id-ID'),
            change: stats.total_transactions_change,
            icon: TrendingUp,
            iconBg: 'bg-white',
            iconColor: 'text-emerald-500',
        },
        {
            label: 'Kendaraan Aktif',
            value: stats.occupancy_rate ? Math.round((stats.occupancy_rate / 100) * 120).toString() : "3",
            subtext: "Sedang parkir",
            icon: Car,
            iconBg: 'bg-white',
            iconColor: 'text-black',
        },
        {
            label: 'Tingkat Okupansi',
            value: `${Math.round(stats.occupancy_rate || 0)}%`,
            subtext: `${Math.round(((stats.occupancy_rate || 0) / 100) * 120)}/120 slot terisi`,
            icon: MapPin,
            iconBg: 'bg-white',
            iconColor: 'text-black',
        },
    ];

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

            {/* ====== CHARTS SECTION (STACKED) ====== */}
            <div className="space-y-8">

                {/* ---- 1. REVENUE CHART (Top) ---- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Chart header with filter */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 pb-2 gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-black tracking-tight">Pendapatan Bulanan</h3>
                            <p className="text-sm text-slate-500 mt-0.5">Total pendapatan per bulan dalam setahun</p>
                        </div>
                        {/* Year Filter */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowYearDropdown(!showYearDropdown); setShowVehicleDropdown(false); }}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-100 bg-slate-50 hover:border-blue-400 hover:bg-white transition-all text-sm font-bold text-slate-700 min-w-[140px] justify-between"
                            >
                                <span className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-slate-400" />
                                    Tahun {selectedYear}
                                </span>
                                <ChevronDown className={cn("h-4 w-4 transition-transform", showYearDropdown && "rotate-180")} />
                            </button>
                            {showYearDropdown && (
                                <div className="absolute top-12 right-0 w-full bg-white border border-slate-100 rounded-xl shadow-xl p-1.5 z-50 animate-in slide-in-from-top-2 duration-150">
                                    {availableYears.map(year => (
                                        <button
                                            key={year}
                                            onClick={() => { setSelectedYear(year); setShowYearDropdown(false); }}
                                            className={cn(
                                                "w-full text-left px-4 py-2.5 rounded-lg font-bold text-sm transition-colors",
                                                selectedYear === year ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                                            )}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Revenue Bar Chart */}
                    <div className="px-6 pb-6 pt-2">
                        <div className="h-[360px]">
                            <Bar
                                data={{
                                    labels: MONTH_LABELS,
                                    datasets: [{
                                        label: 'Pendapatan',
                                        data: revenueChartData.revenue,
                                        backgroundColor: (context) => {
                                            const chart = context.chart;
                                            const { ctx, chartArea } = chart;
                                            if (!chartArea) return 'rgba(59, 130, 246, 0.7)';
                                            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                                            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
                                            gradient.addColorStop(1, 'rgba(99, 102, 241, 0.9)');
                                            return gradient;
                                        },
                                        hoverBackgroundColor: 'rgba(99, 102, 241, 1)',
                                        borderRadius: 8,
                                        borderSkipped: false,
                                        barPercentage: 0.6,
                                        categoryPercentage: 0.7,
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: {
                                            backgroundColor: '#1e293b',
                                            titleFont: { size: 13, weight: 'bold' },
                                            bodyFont: { size: 13 },
                                            padding: 14,
                                            cornerRadius: 10,
                                            displayColors: false,
                                            callbacks: {
                                                title: (items) => `${items[0].label} ${selectedYear}`,
                                                label: (context) => `Rp ${Number(context.raw).toLocaleString('id-ID')}`,
                                                afterLabel: (context) => `${revenueChartData.count[context.dataIndex]} transaksi`,
                                            }
                                        }
                                    },
                                    scales: {
                                        x: {
                                            grid: { display: false },
                                            ticks: {
                                                font: { size: 13, weight: 'bold' as const },
                                                color: '#475569',
                                            },
                                            border: { display: false },
                                        },
                                        y: {
                                            grid: {
                                                color: 'rgba(226, 232, 240, 0.6)',
                                            },
                                            ticks: {
                                                font: { size: 12 },
                                                color: '#94a3b8',
                                                callback: (value) => {
                                                    const num = Number(value);
                                                    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}jt`;
                                                    if (num >= 1000) return `${(num / 1000).toFixed(0)}rb`;
                                                    return `${num}`;
                                                },
                                                maxTicksLimit: 6,
                                            },
                                            border: { display: false, dash: [4, 4] },
                                        }
                                    },
                                    interaction: {
                                        intersect: false,
                                        mode: 'index',
                                    },
                                    animation: {
                                        duration: 600,
                                        easing: 'easeOutQuart',
                                    }
                                }}
                            />
                        </div>
                        {/* Summary Row */}
                        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full bg-indigo-500" />
                                <span className="text-sm font-medium text-slate-600">
                                    Total {selectedYear}: <span className="font-bold text-black">Rp {revenueChartData.revenue.reduce((a, b) => a + b, 0).toLocaleString('id-ID')}</span>
                                </span>
                            </div>
                            <div className="text-sm text-slate-400">|</div>
                            <div className="text-sm font-medium text-slate-600">
                                {revenueChartData.count.reduce((a, b) => a + b, 0)} transaksi
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---- 2. VEHICLE STATS CHART (Bottom) ---- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Chart header with filter */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 pb-2 gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-black tracking-tight">Statistik Kendaraan</h3>
                            <p className="text-sm text-slate-500 mt-0.5">Distribusi jenis kendaraan per bulan</p>
                        </div>
                        {/* Vehicle Type Filter */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowVehicleDropdown(!showVehicleDropdown); setShowYearDropdown(false); }}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-100 bg-slate-50 hover:border-blue-400 hover:bg-white transition-all text-sm font-bold text-slate-700 min-w-[180px] justify-between"
                            >
                                <span className="flex items-center gap-2">
                                    <Car className="h-4 w-4 text-slate-400" />
                                    {selectedVehicleType === 'semua' ? 'Semua Kendaraan' : selectedVehicleType.charAt(0).toUpperCase() + selectedVehicleType.slice(1)}
                                </span>
                                <ChevronDown className={cn("h-4 w-4 transition-transform", showVehicleDropdown && "rotate-180")} />
                            </button>
                            {showVehicleDropdown && (
                                <div className="absolute top-12 right-0 w-full bg-white border border-slate-100 rounded-xl shadow-xl p-1.5 z-50 animate-in slide-in-from-top-2 duration-150">
                                    <button
                                        onClick={() => { setSelectedVehicleType('semua'); setShowVehicleDropdown(false); }}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 rounded-lg font-bold text-sm transition-colors",
                                            selectedVehicleType === 'semua' ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        Semua Kendaraan
                                    </button>
                                    {availableVehicleTypes.map(type => (
                                        <button
                                            key={type}
                                            onClick={() => { setSelectedVehicleType(type); setShowVehicleDropdown(false); }}
                                            className={cn(
                                                "w-full text-left px-4 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2",
                                                selectedVehicleType === type ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
                                            )}
                                        >
                                            <div
                                                className="h-2.5 w-2.5 rounded-full"
                                                style={{ backgroundColor: getVehicleColor(type).border }}
                                            />
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="px-6 pb-6 pt-2">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Stacked Bar Chart */}
                            <div className="lg:col-span-3 h-[320px]">
                                <Bar
                                    data={{
                                        labels: MONTH_LABELS,
                                        datasets: Object.entries(vehicleChartData).map(([type, data]) => {
                                            const color = getVehicleColor(type);
                                            return {
                                                label: type.charAt(0).toUpperCase() + type.slice(1),
                                                data,
                                                backgroundColor: color.bg,
                                                hoverBackgroundColor: color.hover,
                                                borderColor: color.border,
                                                borderWidth: 1,
                                                borderRadius: 6,
                                                borderSkipped: false,
                                                barPercentage: 0.55,
                                                categoryPercentage: 0.7,
                                            };
                                        })
                                    }}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                            tooltip: {
                                                backgroundColor: '#1e293b',
                                                titleFont: { size: 13, weight: 'bold' },
                                                bodyFont: { size: 12 },
                                                padding: 12,
                                                cornerRadius: 10,
                                                callbacks: {
                                                    title: (items) => `${items[0].label} ${selectedYear}`,
                                                    label: (context) => `${context.dataset.label}: ${context.raw} kendaraan`,
                                                }
                                            }
                                        },
                                        scales: {
                                            x: {
                                                stacked: selectedVehicleType === 'semua',
                                                grid: { display: false },
                                                ticks: {
                                                    font: { size: 13, weight: 'bold' as const },
                                                    color: '#475569',
                                                },
                                                border: { display: false },
                                            },
                                            y: {
                                                stacked: selectedVehicleType === 'semua',
                                                grid: { color: 'rgba(226, 232, 240, 0.6)' },
                                                ticks: {
                                                    font: { size: 12 },
                                                    color: '#94a3b8',
                                                    stepSize: 1,
                                                    maxTicksLimit: 6,
                                                },
                                                border: { display: false },
                                            }
                                        },
                                        interaction: {
                                            intersect: false,
                                            mode: 'index',
                                        },
                                        animation: {
                                            duration: 600,
                                            easing: 'easeOutQuart',
                                        }
                                    }}
                                />
                            </div>

                            {/* Donut Summary Sidebar */}
                            <div className="lg:col-span-1 flex flex-col items-center justify-center gap-4">
                                <div className="relative h-[160px] w-[160px]">
                                    <Doughnut
                                        data={{
                                            labels: Object.keys(vehicleDonutData).map(t => t.charAt(0).toUpperCase() + t.slice(1)),
                                            datasets: [{
                                                data: Object.values(vehicleDonutData),
                                                backgroundColor: Object.keys(vehicleDonutData).map(t => getVehicleColor(t).bg),
                                                borderColor: Object.keys(vehicleDonutData).map(t => getVehicleColor(t).border),
                                                borderWidth: 2,
                                                hoverOffset: 6,
                                            }]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: true,
                                            cutout: '65%',
                                            plugins: {
                                                legend: { display: false },
                                                tooltip: {
                                                    backgroundColor: '#1e293b',
                                                    padding: 10,
                                                    cornerRadius: 8,
                                                    bodyFont: { size: 12 },
                                                    callbacks: {
                                                        label: (context) => {
                                                            const pct = totalVehiclesInYear > 0
                                                                ? ((Number(context.raw) / totalVehiclesInYear) * 100).toFixed(1)
                                                                : '0';
                                                            return `${context.label}: ${context.raw} (${pct}%)`;
                                                        }
                                                    }
                                                }
                                            },
                                            animation: { animateRotate: true, duration: 800 }
                                        }}
                                    />
                                    {/* Center label */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-2xl font-black text-black">{totalVehiclesInYear}</span>
                                        <span className="text-xs font-medium text-slate-400">Total</span>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="space-y-2 w-full">
                                    {Object.entries(vehicleDonutData).map(([type, count]) => (
                                        <div key={type} className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-2.5 w-2.5 rounded-full"
                                                    style={{ backgroundColor: getVehicleColor(type).border }}
                                                />
                                                <span className="text-xs font-bold text-slate-600 capitalize">{type}</span>
                                            </div>
                                            <span className="text-xs font-black text-black">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
