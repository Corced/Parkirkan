'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Loader2 } from "lucide-react";
import { vehicleService } from "@/lib/api";
import { ParkedVehicle } from "@/types";
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ParkedVehiclesPage() {
    const [parkedVehicles, setParkedVehicles] = useState<ParkedVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fetchData();
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update duration every minute
        return () => clearInterval(timer);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await vehicleService.getParked();
            if (Array.isArray(data)) setParkedVehicles(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calculateDuration = (checkInTime: string) => {
        const start = new Date(checkInTime);
        const diffMs = currentTime.getTime() - start.getTime();
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        let durationStr = '';
        if (diffHrs > 0) durationStr += `${diffHrs} jam `;
        durationStr += `${diffMins} menit`;
        return durationStr;
    };

    const getVehicleBadgeStyle = (type: string) => {
        switch (type.toLowerCase()) {
            case 'motor': return 'bg-emerald-400';
            case 'mobil': return 'bg-amber-400';
            case 'van': case 'truck': return 'bg-slate-700';
            default: return 'bg-blue-400';
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-extrabold text-black tracking-tight">Kendaraan yang Sedang Parkir</h1>
                <p className="text-slate-800 mt-2 font-bold uppercase text-xs tracking-widest italic">Daftar kendaraan aktif di semua area</p>
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-10 py-8 text-sm font-black text-slate-700 uppercase tracking-widest">Nomor Tiket</th>
                                    <th className="px-10 py-8 text-sm font-black text-slate-700 uppercase tracking-widest">Plat Nomor</th>
                                    <th className="px-10 py-8 text-sm font-black text-slate-700 uppercase tracking-widest">Jenis</th>
                                    <th className="px-10 py-8 text-sm font-black text-slate-700 uppercase tracking-widest text-center">Area</th>
                                    <th className="px-10 py-8 text-sm font-black text-slate-700 uppercase tracking-widest">Waktu Masuk</th>
                                    <th className="px-10 py-8 text-sm font-black text-slate-700 uppercase tracking-widest text-center">Durasi</th>
                                    <th className="px-10 py-8 text-sm font-black text-slate-700 uppercase tracking-widest text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-10 py-32 text-center">
                                            <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                                            <p className="text-xl font-black text-slate-300 uppercase italic">Memuat Data...</p>
                                        </td>
                                    </tr>
                                ) : parkedVehicles.length > 0 ? (
                                    parkedVehicles.map((transaction) => (
                                        <tr key={transaction.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-10 py-8">
                                                <p className="text-lg font-mono font-black text-slate-800 italic tracking-tighter">{transaction.ticket_number}</p>
                                            </td>
                                            <td className="px-10 py-8">
                                                <p className="text-2xl font-black text-black uppercase tracking-tight">{transaction.vehicle?.license_plate}</p>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className={cn(
                                                    "px-6 py-1.5 rounded-full text-white font-black text-xs uppercase italic inline-block",
                                                    getVehicleBadgeStyle(transaction.vehicle?.vehicle_type || '')
                                                )}>
                                                    {transaction.vehicle?.vehicle_type}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center text-xl font-bold text-black">{transaction.area?.name || '---'}</td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-2 text-slate-800 font-bold">
                                                    <Clock className="h-4 w-4" />
                                                    {new Date(transaction.check_in_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    <span className="text-xs opacity-50 ml-1">({new Date(transaction.check_in_time).toLocaleDateString('id-ID')})</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <p className="text-lg font-black text-blue-600 italic tracking-tighter">
                                                    {calculateDuration(transaction.check_in_time)}
                                                </p>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <Link href={`/petugas/check-out?ticket=${transaction.ticket_number}`}>
                                                    <Button className="bg-emerald-400 hover:bg-emerald-500 text-white px-8 h-12 rounded-2xl font-black uppercase italic shadow-lg shadow-emerald-200/50 transition-all active:scale-95">
                                                        Check-out
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-10 py-32 text-center text-slate-300 uppercase font-black italic text-xl">
                                            Belum ada kendaraan yang parkir
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
