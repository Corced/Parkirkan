'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, CreditCard, Activity, Settings, Car, AlertTriangle } from "lucide-react";
import { dashboardService, logService, areaService } from "@/lib/api";
import { AdminStats, ParkingArea } from '@/types';
import { cn } from '@/lib/utils';

import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats>({
        total_revenue: 0,
        total_users: 0,
        parked_vehicles: 0,
        active_parked_count: 0
    });
    const [recentLogs, setRecentLogs] = useState<any[]>([]);
    const [areas, setAreas] = useState<ParkingArea[]>([]);
    const [capacityAlerts, setCapacityAlerts] = useState<string[]>([]);

    useEffect(() => {
        // Fetch dashboard stats
        dashboardService.getAdminStats().then(data => {
            setStats(prev => ({ ...prev, ...data }));
        }).catch(console.error);

        // Fetch recent activity logs
        logService.getAll().then(response => {
            const logs = response.data || [];
            setRecentLogs(logs.slice(0, 5)); // Get latest 5
        }).catch(console.error);

        // Fetch areas and check capacity
        areaService.getAll().then(areasData => {
            setAreas(areasData);
            // Check for capacity alerts (areas >= 80% full)
            const alerts: string[] = [];
            areasData.forEach(area => {
                const occupancy = (area.occupied_slots / area.total_capacity) * 100;
                if (occupancy >= 90) {
                    alerts.push(`${area.name} sudah PENUH (${occupancy.toFixed(0)}%)`);
                } else if (occupancy >= 80) {
                    alerts.push(`${area.name} hampir penuh (${occupancy.toFixed(0)}%)`);
                }
            });
            setCapacityAlerts(alerts);
        }).catch(console.error);
    }, []);

    // Helper to format time ago
    const formatTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit lalu`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} jam lalu`;
        return date.toLocaleDateString('id-ID');
    };

    const statCards = [
        { label: 'Total User', value: stats.total_users, icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', borderColor: 'border-blue-200' },
        { label: 'Total Area', value: areas.length, icon: MapPin, iconBg: 'bg-green-50', iconColor: 'text-green-600', borderColor: 'border-green-200' },
        { label: 'Kendaraan Aktif', value: stats.active_parked_count || stats.parked_vehicles, icon: Car, iconBg: 'bg-orange-50', iconColor: 'text-orange-600', borderColor: 'border-orange-200' },
        { label: 'Total Pendapatan', value: `Rp ${(stats.total_revenue / 1000000).toFixed(1)}jt`, icon: CreditCard, iconBg: 'bg-purple-50', iconColor: 'text-purple-600', borderColor: 'border-purple-200' },
    ];

    const quickActions = [
        { label: 'Tambah User', icon: Users, color: 'text-slate-600', border: 'border-blue-200', path: '/admin/users' },
        { label: 'Atur Tarif', icon: CreditCard, color: 'text-slate-600', border: 'border-purple-200', path: '/admin/rates' },
        { label: 'Kelola Area', icon: MapPin, color: 'text-slate-600', border: 'border-green-200', path: '/admin/area' },
        { label: 'Lihat Log', icon: Activity, color: 'text-slate-600', border: 'border-blue-200', path: '/admin/logs' },
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard Admin</h1>
                <p className="text-slate-500 mt-2 font-medium">Selamat datang kembali, Admin</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((card, idx) => (
                    <Card key={idx} className={cn("border-t-4 shadow-sm hover:shadow-md transition-shadow", card.borderColor)}>
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4">
                                <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center border", card.iconBg)}>
                                    <card.icon className={cn("h-6 w-6", card.iconColor)} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-600 uppercase tracking-wide">{card.label}</p>
                                    <h3 className="text-3xl font-black text-slate-900">{card.value}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-black text-slate-900 mb-8">Aksi Cepat</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickActions.map((action, idx) => (
                        <Link
                            key={idx}
                            href={action.path}
                            className={cn(
                                "flex items-center gap-4 p-5 rounded-2xl border bg-white transition-all hover:scale-[1.02] hover:shadow-md active:scale-95 group shadow-sm",
                                action.border
                            )}
                        >
                            <div className="flex items-center justify-center h-10 w-10">
                                <action.icon className={cn("h-6 w-6", action.color)} />
                            </div>
                            <span className="font-bold text-slate-800 group-hover:text-black whitespace-nowrap">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Capacity Alerts */}
            {capacityAlerts.length > 0 && (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="h-6 w-6 text-amber-600" />
                        <h3 className="text-lg font-bold text-amber-800">Peringatan Kapasitas</h3>
                    </div>
                    <div className="space-y-2">
                        {capacityAlerts.map((alert, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-amber-700 font-medium">
                                <div className="h-2 w-2 rounded-full bg-amber-500" />
                                {alert}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Activity - Real Logs */}
            <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 min-h-[400px]">
                <h2 className="text-2xl font-black text-slate-900 mb-10">Aktivitas Terkini</h2>
                <div className="space-y-8">
                    {recentLogs.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">Belum ada aktivitas terbaru</p>
                    ) : (
                        recentLogs.map((log, idx) => (
                            <div key={idx} className="flex justify-between items-start group">
                                <div className="space-y-2">
                                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                        {log.action?.replace('_', ' ')}
                                    </h4>
                                    <p className="text-slate-500 font-medium tracking-tight leading-relaxed">
                                        {log.description}
                                    </p>
                                    <p className="text-slate-400 text-sm">
                                        oleh {log.user?.name || 'System'}
                                    </p>
                                </div>
                                <span className="text-slate-400 font-semibold tracking-tight shrink-0">
                                    {formatTimeAgo(log.created_at)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
