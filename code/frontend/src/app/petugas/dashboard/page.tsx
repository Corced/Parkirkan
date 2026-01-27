'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Search, Car, Clock, User as UserIcon, MapPin } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { dashboardService } from "@/lib/api";
import { cn } from '@/lib/utils';

export default function PetugasDashboard() {
    const [stats, setStats] = useState({
        parked_vehicles: 0,
        today_transactions: 0
    });

    useEffect(() => {
        dashboardService.getPetugasStats().then(setStats).catch(console.error);
    }, []);

    const statCards = [
        { label: 'Kendaraan Terparkir', value: stats.parked_vehicles, icon: Car, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', borderColor: 'border-blue-200' },
        { label: 'Transaksi Hari Ini', value: stats.today_transactions, icon: Clock, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', borderColor: 'border-emerald-200' },
    ];

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Dashboard Petugas</h1>
                <p className="text-slate-500 mt-2 font-bold uppercase text-xs tracking-widest">Sistem Operasional Parkir v1.0</p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-8 md:grid-cols-2">
                {statCards.map((card, idx) => (
                    <Card key={idx} className={cn("border-t-8 shadow-sm hover:shadow-xl transition-all rounded-[2.5rem]", card.borderColor)}>
                        <CardContent className="p-10">
                            <div className="flex items-center gap-8">
                                <div className={cn("h-20 w-20 rounded-3xl flex items-center justify-center border-2", card.iconBg)}>
                                    <card.icon className={cn("h-10 w-10", card.iconColor)} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{card.label}</p>
                                    <h3 className="text-5xl font-black text-slate-900 italic tracking-tighter">{card.value}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Actions */}
            <div className="grid gap-10 md:grid-cols-2">
                <Link href="/petugas/check-in" className="group">
                    <div className="h-full bg-[#2563EB] rounded-[3rem] p-12 text-white shadow-2xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 flex flex-col justify-between overflow-hidden relative">
                        <div className="relative z-10 space-y-4">
                            <div className="h-20 w-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                <LogIn className="h-10 w-10" />
                            </div>
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Check-In <br />Kendaraan</h2>
                            <p className="text-blue-100 font-bold text-lg opacity-80">Catat kendaraan masuk & cetak tiket parkir otomatis.</p>
                        </div>
                        <LogIn className="absolute -right-10 -bottom-10 h-64 w-64 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                    </div>
                </Link>

                <Link href="/petugas/check-out" className="group">
                    <div className="h-full bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-95 flex flex-col justify-between overflow-hidden relative">
                        <div className="relative z-10 space-y-4">
                            <div className="h-20 w-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                <LogOut className="h-10 w-10 text-orange-400" />
                            </div>
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Check-Out <br />Kendaraan</h2>
                            <p className="text-slate-400 font-bold text-lg opacity-80">Scan tiket, hitung tarif dan proses pembayaran tunai.</p>
                        </div>
                        <LogOut className="absolute -right-10 -bottom-10 h-64 w-64 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                    </div>
                </Link>
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                {/* Search Card */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="space-y-4 mb-8">
                        <h3 className="text-2xl font-black text-slate-900 uppercase italic">Cari Kendaraan</h3>
                        <p className="text-slate-400 font-bold">Temukan posisi kendaraan terparkir berdasarkan plat nomor.</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-300" />
                        <Input
                            placeholder="MASUKKAN NOMOR PLAT..."
                            className="h-24 pl-20 pr-40 rounded-[2rem] border-4 border-slate-50 bg-slate-50 text-2xl font-black uppercase focus:border-blue-400 focus:bg-white transition-all shadow-inner"
                        />
                        <Button className="absolute right-4 top-1/2 -translate-y-1/2 h-16 px-10 rounded-2xl bg-slate-900 hover:bg-black text-lg font-black uppercase italic shadow-xl">
                            Cari
                        </Button>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-slate-50 rounded-[3rem] p-12 border-4 border-white shadow-inner flex flex-col space-y-10">
                    <div className="space-y-2 text-center">
                        <div className="h-20 w-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-md border border-slate-100">
                            <UserIcon className="h-10 w-10 text-slate-400" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 uppercase italic">Informasi Shift</h4>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                            <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                <Clock className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Shift Sekarang</p>
                                <p className="text-lg font-bold text-slate-900">Pagi (07:00 - 15:00)</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                <UserIcon className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Petugas Aktif</p>
                                <p className="text-lg font-bold text-slate-900">Budi Santoso</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                <MapPin className="h-6 w-6 text-red-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Lokasi Pos</p>
                                <p className="text-lg font-bold text-slate-900">Gerbang Utama</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
