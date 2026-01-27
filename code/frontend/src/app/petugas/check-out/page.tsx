'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2, CreditCard, Clock, MapPin, Car, Receipt, CheckCircle2 } from "lucide-react";
import { vehicleService } from "@/lib/api";
import { Transaction } from "@/types";
import { cn } from '@/lib/utils';

function CheckOutContent() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('ticket') || '');
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const ticket = searchParams.get('ticket');
        if (ticket) {
            setSearchQuery(ticket);
            handleSearch(ticket);
        }
    }, [searchParams]);

    const handleSearch = async (queryOverride?: string) => {
        const query = queryOverride || searchQuery;
        if (!query.trim()) return;
        setLoading(true);
        setCheckoutSuccess(false);
        try {
            const res = await vehicleService.searchParked(query);
            if (!res.latest_transaction || res.latest_transaction.status !== 'active') {
                alert('Kendaraan tidak sedang terparkir');
                setTransaction(null);
            } else {
                setTransaction(res.latest_transaction);
            }
        } catch (error: any) {
            alert('Cari Gagal: ' + (error.message || 'Kendaraan tidak ditemukan'));
            setTransaction(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        if (!transaction) return;
        setIsProcessing(true);
        try {
            const res = await vehicleService.checkOut({ ticket_number: transaction.ticket_number });
            setTransaction(res);
            setCheckoutSuccess(true);
            // Auto-print receipt on success
            setTimeout(() => window.print(), 500);
        } catch (error: any) {
            alert('Check-out Gagal: ' + (error.message || 'Error tidak diketahui'));
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    };

    const calculateFairLogic = (checkInStr: string) => {
        if (!transaction?.rate) return { durationText: '...', totalCost: 0, days: 0, hours: 0, mins: 0, secs: 0 };

        const checkIn = new Date(checkInStr);
        const now = checkoutSuccess && transaction.check_out_time ? new Date(transaction.check_out_time) : currentTime;

        const diffMs = now.getTime() - checkIn.getTime();
        const diffSecs = Math.max(0, Math.floor(diffMs / 1000));

        const days = Math.floor(diffSecs / 86400);
        const hours = Math.floor((diffSecs % 86400) / 3600);
        const mins = Math.floor((diffSecs % 3600) / 60);
        const secs = diffSecs % 60;

        const durationText = `${String(days).padStart(2, '0')} Hari ${String(hours).padStart(2, '0')} Jam ${String(mins).padStart(2, '0')} Menit ${String(secs).padStart(2, '0')} Detik`;

        // Billing Logic (Hourly Round Up)
        const totalMinutes = diffSecs / 60;
        const billedHours = Math.max(1, Math.ceil(totalMinutes / 60));

        const rate = transaction.rate;
        const dailyMax = rate.daily_max_rate;
        const hourlyRate = rate.hourly_rate;

        const billDays = Math.floor(billedHours / 24);
        const remainingHours = billedHours % 24;

        let totalCost = 0;
        if (dailyMax > 0) {
            totalCost = (billDays * dailyMax) + Math.min(remainingHours * hourlyRate, dailyMax);
        } else {
            totalCost = billedHours * hourlyRate;
        }

        return { durationText, totalCost, days, hours, mins, secs };
    };

    const { durationText, totalCost, days, hours, mins, secs } = transaction ? calculateFairLogic(transaction.check_in_time) : { durationText: '', totalCost: 0, days: 0, hours: 0, mins: 0, secs: 0 };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Print Only Receipt */}
            <div className="hidden print:block fixed inset-0 bg-white z-[9999] p-8 text-black font-mono">
                <div className="max-w-[80mm] mx-auto border-b-2 border-dashed border-black pb-4 text-center">
                    <h2 className="text-2xl font-bold uppercase">PARKIRKAN</h2>
                    <p className="text-xs">Sistem Parkir Modern</p>
                    <p className="text-[10px] mt-1 italic">Terima kasih atas kunjungan Anda</p>
                </div>

                <div className="mt-6 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Tiket:</span>
                        <span className="font-bold">{transaction?.ticket_number}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Plat:</span>
                        <span className="font-bold">{transaction?.vehicle?.license_plate}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tipe:</span>
                        <span>{transaction?.vehicle?.vehicle_type}</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t-2 border-dotted border-gray-300 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                        <span>Masuk:</span>
                        <span>{transaction ? new Date(transaction.check_in_time).toLocaleString('id-ID') : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Keluar:</span>
                        <span>{checkoutSuccess && transaction?.check_out_time ? new Date(transaction.check_out_time).toLocaleString('id-ID') : currentTime.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Durasi:</span>
                        <span>{days} Hari {hours} Jam {mins} Menit {secs} Detik</span>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-black space-y-2">
                    <div className="flex justify-between text-xs">
                        <span>Tarif / Jam:</span>
                        <span>{formatCurrency(transaction?.rate?.hourly_rate || 0)}</span>
                    </div>
                    {transaction?.rate?.daily_max_rate && (
                        <div className="flex justify-between text-xs">
                            <span>Maks / Hari:</span>
                            <span>{formatCurrency(transaction.rate.daily_max_rate)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-lg font-bold mt-2">
                        <span>TOTAL:</span>
                        <span>{formatCurrency(totalCost)}</span>
                    </div>
                </div>

                <div className="mt-10 text-center text-[10px] border-t-2 border-dashed border-black pt-4">
                    <p>Simpan struk ini sebagai bukti pembayaran</p>
                    <p className="mt-1 font-bold">LUNAS</p>
                    <p className="mt-4 opacity-30">{new Date().toLocaleString('id-ID')}</p>
                </div>
            </div>

            {/* Main UI (Hidden on Print) */}
            <div className="print:hidden space-y-10">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">Check-out Kendaraan</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Proses pembayaran dan keluar parkir</p>
                </div>

                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden">
                    <CardContent className="p-12 space-y-12">
                        {/* Search Bar */}
                        <div className="flex gap-4 p-2 bg-slate-50 rounded-[2.5rem] border-4 border-slate-100 shadow-inner group focus-within:border-blue-200 transition-all">
                            <div className="flex-1 relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
                                <Input
                                    placeholder="Contoh : B 1234 XYZ atau TKT-20250120-001"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="h-20 pl-16 pr-6 border-none bg-transparent text-xl font-black uppercase placeholder:text-slate-200 focus-visible:ring-0"
                                />
                            </div>
                            <Button
                                onClick={() => handleSearch()}
                                disabled={loading}
                                className="h-20 px-12 rounded-[2rem] bg-emerald-400 hover:bg-emerald-500 text-white text-xl font-black uppercase italic shadow-xl shadow-emerald-200/50 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Cari'}
                            </Button>
                        </div>

                        {/* Transaction Details */}
                        {transaction ? (
                            <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex items-center gap-4 border-b-4 border-slate-50 pb-4">
                                    <Receipt className="h-6 w-6 text-blue-500" />
                                    <h3 className="text-2xl font-black text-slate-900 uppercase italic">Detail Transaksi</h3>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { label: 'Nomor Tiket', value: transaction.ticket_number, isMono: true },
                                        { label: 'Plat Nomor', value: transaction.vehicle?.license_plate, isBold: true },
                                        { label: 'Jenis Kendaraan', value: transaction.vehicle?.vehicle_type, isBadge: true },
                                        { label: 'Area Parkir', value: transaction.area?.name },
                                        { label: 'Waktu Masuk', value: new Date(transaction.check_in_time).toLocaleString('id-ID') },
                                        { label: 'Waktu Keluar', value: transaction.check_out_time ? new Date(transaction.check_out_time).toLocaleString('id-ID') : currentTime.toLocaleString('id-ID'), isFuture: !transaction.check_out_time },
                                        { label: 'Durasi Parkir', value: durationText },
                                        { label: 'Tarif per Jam', value: formatCurrency(transaction.rate?.hourly_rate || 0) },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 group">
                                            <p className="text-lg font-bold text-slate-400 uppercase tracking-tighter">{item.label}</p>
                                            <div className="flex items-center">
                                                {item.isBadge ? (
                                                    <div className="bg-emerald-400 text-white px-6 py-1 rounded-full font-black text-sm uppercase italic">
                                                        {item.value}
                                                    </div>
                                                ) : (
                                                    <p className={cn(
                                                        "text-xl font-black text-slate-700",
                                                        item.isMono && "font-mono",
                                                        item.isBold && "text-slate-900",
                                                        item.isFuture && "text-blue-500 animate-pulse"
                                                    )}>
                                                        {item.value || '---'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Total Cost */}
                                <div className="flex justify-between items-center p-10 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/20">
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Total Biaya :</p>
                                        <h2 className="text-5xl font-black italic tracking-tighter">
                                            {totalCost ? formatCurrency(totalCost) : 'Mengkalkulasi...'}
                                        </h2>
                                    </div>
                                    <div className="h-20 w-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md">
                                        <CreditCard className="h-10 w-10 text-emerald-400" />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col md:flex-row gap-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setTransaction(null)}
                                        className="h-20 flex-1 rounded-2xl border-4 text-xl font-black uppercase italic hover:bg-slate-50 transition-all"
                                    >
                                        Batal
                                    </Button>
                                    {!checkoutSuccess && (
                                        <Button
                                            onClick={handleCheckOut}
                                            disabled={isProcessing}
                                            className="h-20 flex-[2] rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-black uppercase italic shadow-2xl shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                                    Memproses...
                                                </>
                                            ) : (
                                                'Proses Check-out & Cetak Struk'
                                            )}
                                        </Button>
                                    )}
                                    {checkoutSuccess && (
                                        <Button
                                            onClick={handlePrint}
                                            className="h-20 flex-[2] rounded-2xl bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center text-white text-xl font-black uppercase italic shadow-2xl shadow-blue-500/30"
                                        >
                                            <CheckCircle2 className="mr-3 h-6 w-6" />
                                            Cetak Struk Lagi
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center space-y-6 border-4 border-dashed border-slate-100 rounded-[3rem]">
                                <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                    <Search className="h-12 w-12 text-slate-200" />
                                </div>
                                <div className="max-w-md mx-auto">
                                    <p className="text-xl font-black text-slate-300 uppercase italic tracking-tight">Cari tiket untuk melihat rincian pembayaran</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function CheckOutPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
        }>
            <CheckOutContent />
        </Suspense>
    );
}
