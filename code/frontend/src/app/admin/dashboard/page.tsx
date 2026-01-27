'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, CreditCard, Activity, Settings, Car } from "lucide-react";
import { dashboardService } from "@/lib/api";
import { AdminStats } from '@/types';
import { cn } from '@/lib/utils';

import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats>({
        total_revenue: 0,
        total_users: 0,
        parked_vehicles: 0,
        active_parked_count: 0
    });

    useEffect(() => {
        dashboardService.getAdminStats().then(data => {
            setStats(prev => ({ ...prev, ...data }));
        }).catch(console.error);
    }, []);

    const statCards = [
        { label: 'Total User', value: stats.total_users, icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', borderColor: 'border-blue-200' },
        { label: 'Total Area', value: 10, icon: MapPin, iconBg: 'bg-green-50', iconColor: 'text-green-600', borderColor: 'border-green-200' },
        { label: 'Total Area', value: 10, icon: Car, iconBg: 'bg-orange-50', iconColor: 'text-orange-600', borderColor: 'border-orange-200' },
        { label: 'Total Pendapatan', value: `Rp ${(stats.total_revenue / 1000000).toFixed(1)}jt`, icon: CreditCard, iconBg: 'bg-purple-50', iconColor: 'text-purple-600', borderColor: 'border-purple-200' },
    ];

    const quickActions = [
        { label: 'Tambah User', icon: Users, color: 'text-slate-600', border: 'border-blue-200', path: '/admin/users' },
        { label: 'Atur Tarif', icon: CreditCard, color: 'text-slate-600', border: 'border-purple-200', path: '/admin/rates' },
        { label: 'Kelola Area', icon: MapPin, color: 'text-slate-600', border: 'border-green-200', path: '/admin/area' },
        { label: 'Lihat Log', icon: Activity, color: 'text-slate-600', border: 'border-blue-200', path: '/admin/logs' },
    ];

    const recentActivities = [
        { title: 'User baru ditambahkan', admin: 'petugas02', time: '5 menit lalu' },
        { title: 'Tarif parkir diperbarui', admin: 'admin01', time: '15 menit lalu' },
        { title: 'Area C mencapai kapasitas 90%', admin: 'System', time: '1 jam lalu' },
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

            {/* Recent Activity */}
            <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 min-h-[400px]">
                <h2 className="text-2xl font-black text-slate-900 mb-10">Aktivitas Terkini</h2>
                <div className="space-y-10">
                    {recentActivities.map((activity, idx) => (
                        <div key={idx} className="flex justify-between items-start group">
                            <div className="space-y-2">
                                <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{activity.title}</h4>
                                <p className="text-slate-500 font-medium tracking-tight leading-relaxed">oleh {activity.admin}</p>
                            </div>
                            <span className="text-slate-400 font-semibold tracking-tight">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
