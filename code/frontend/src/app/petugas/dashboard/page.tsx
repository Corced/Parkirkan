'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Search, Car, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { dashboardService, vehicleService, shiftService } from "@/lib/api";
import { cn } from '@/lib/utils';
import { SearchParkedResponse } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PetugasDashboard() {
    const [stats, setStats] = useState({
        parked_vehicles: 0,
        today_transactions: 0
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState<SearchParkedResponse | null>(null);
    const [searchError, setSearchError] = useState('');

    // Shift States
    const [isShiftActive, setIsShiftActive] = useState(false);
    const [currentShift, setCurrentShift] = useState<string>('Pagi');
    const [shiftMessage, setShiftMessage] = useState<string | null>(null);

    useEffect(() => {
        dashboardService.getPetugasStats().then(setStats).catch(console.error);
    }, []);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSearchError('');
        setSearchResult(null);

        try {
            const result = await vehicleService.searchParked(searchQuery);
            setSearchResult(result);
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Kendaraan tidak ditemukan';
            setSearchError(msg);
        } finally {
            setIsSearching(false);
        }
    };

    const handleStartShift = async () => {
        try {
            const result = await shiftService.start(currentShift);
            setIsShiftActive(true);
            setShiftMessage(result.message);
            setTimeout(() => setShiftMessage(null), 3000);
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Gagal memulai shift';
            setShiftMessage(msg);
        }
    };

    const handleEndShift = async () => {
        try {
            const result = await shiftService.end(currentShift, stats.today_transactions);
            setIsShiftActive(false);
            setShiftMessage(result.message);
            setTimeout(() => setShiftMessage(null), 3000);
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Gagal mengakhiri shift';
            setShiftMessage(msg);
        }
    };

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
                <div className="lg:col-span-2 bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100 flex flex-col justify-between overflow-hidden relative">
                    <div className="space-y-4 mb-8">
                        <h3 className="text-2xl font-black text-slate-900 uppercase italic">Cari Kendaraan</h3>
                        <p className="text-slate-400 font-bold">Temukan posisi kendaraan terparkir berdasarkan plat nomor.</p>
                    </div>

                    <div className="space-y-8">
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-300" />
                            <Input
                                placeholder="MASUKKAN NOMOR PLAT..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="h-24 pl-20 pr-40 rounded-[2rem] border-4 border-slate-50 bg-slate-50 text-2xl font-black uppercase focus:border-blue-400 focus:bg-white transition-all shadow-inner"
                            />
                            <Button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="absolute right-4 top-1/2 -translate-y-1/2 h-16 px-10 rounded-2xl bg-slate-900 hover:bg-black text-lg font-black uppercase italic shadow-xl disabled:opacity-50"
                            >
                                {isSearching ? '...' : 'Cari'}
                            </Button>
                        </div>

                        {/* Search Result Display */}
                        {searchResult && (
                            <div className={cn(
                                "p-8 rounded-[2rem] border-2 animate-in fade-in slide-in-from-top-4 duration-300",
                                searchResult.is_currently_parked ? "bg-blue-50 border-blue-100" : "bg-slate-50 border-slate-100"
                            )}>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                            <Car className={cn("h-8 w-8", searchResult.is_currently_parked ? "text-blue-600" : "text-slate-400")} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                                                {searchResult.is_currently_parked ? 'Kendaraan Terparkir' : 'Terakhir Berkunjung'}
                                            </p>
                                            <h4 className="text-2xl font-black text-slate-900 uppercase italic">{searchResult.vehicle?.license_plate}</h4>
                                        </div>
                                    </div>

                                    <div className="h-12 w-[2px] bg-slate-200 hidden md:block" />

                                    <div className="flex items-center gap-6">
                                        <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                            <MapPin className={cn("h-8 w-8", searchResult.is_currently_parked ? "text-emerald-600" : "text-slate-300")} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Lokasi Area</p>
                                            <h4 className="text-2xl font-black text-slate-900 uppercase italic">
                                                {searchResult.latest_transaction?.area?.name || '---'}
                                            </h4>
                                        </div>
                                    </div>

                                    <div className={cn(
                                        "px-6 py-2 rounded-full font-black uppercase italic text-sm tracking-tighter",
                                        searchResult.is_currently_parked ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                                    )}>
                                        {searchResult.is_currently_parked ? 'PARKED' : 'OUT'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {searchError && (
                            <div className="p-8 bg-red-50 rounded-[2rem] border-2 border-red-100 flex items-center gap-4 text-red-600 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    <Search className="h-6 w-6" />
                                </div>
                                <p className="font-bold uppercase tracking-tight italic">{searchError}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Shift Control Card */}
                <div className="bg-white rounded-[3rem] p-12 border-4 border-slate-100 shadow-sm flex flex-col space-y-8">
                    <div className="space-y-2 text-center">
                        <div className="h-20 w-20 bg-slate-100 rounded-full mx-auto flex items-center justify-center shadow-sm border border-slate-200">
                            <Clock className="h-10 w-10 text-blue-500" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900 uppercase italic">Kontrol Shift</h4>
                    </div>

                    <div className="space-y-6">
                        {!isShiftActive ? (
                            <>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Pilih Shift</label>
                                    <Select value={currentShift} onValueChange={setCurrentShift}>
                                        <SelectTrigger className="h-14 bg-slate-50 border-2 font-bold text-lg rounded-2xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Pagi">Pagi (07:00 - 15:00)</SelectItem>
                                            <SelectItem value="Siang">Siang (15:00 - 23:00)</SelectItem>
                                            <SelectItem value="Malam">Malam (23:00 - 07:00)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    onClick={handleStartShift}
                                    className="w-full h-16 bg-blue-600 hover:bg-blue-700 font-black uppercase italic text-lg rounded-2xl"
                                >
                                    Mulai Shift
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-100">
                                    <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Shift Aktif</p>
                                    <p className="text-2xl font-black text-slate-900 italic">{currentShift}</p>
                                </div>
                                <Button
                                    onClick={handleEndShift}
                                    className="w-full h-16 bg-slate-900 hover:bg-black font-black uppercase italic text-lg rounded-2xl"
                                >
                                    Akhiri Shift
                                </Button>
                            </>
                        )}

                        {shiftMessage && (
                            <div className="text-sm font-bold text-center text-blue-600 bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">
                                {shiftMessage}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
