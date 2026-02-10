'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Car, MapPin, User, Phone, Info, ChevronDown, CheckCircle2 } from "lucide-react";
import { vehicleService, areaService, rateService } from "@/lib/api";
import { Transaction, ParkingArea, ParkingRate } from "@/types";


export default function CheckInPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ticket, setTicket] = useState<Transaction | null>(null);
    const [areas, setAreas] = useState<ParkingArea[]>([]);
    const [rates, setRates] = useState<ParkingRate[]>([]);

    const [formData, setFormData] = useState({
        license_plate: '',
        vehicle_type: '',
        area_id: '',
        owner_name: '',
        owner_phone: ''
    });

    useEffect(() => {
        // Fetch areas and rates
        Promise.all([
            areaService.getAll(),
            rateService.getAll()
        ]).then(([areasData, ratesData]) => {
            setAreas(areasData.filter(a => a.is_active));
            setRates(ratesData);
            // Set defaults
            if (ratesData.length > 0) setFormData(prev => ({ ...prev, vehicle_type: ratesData[0].vehicle_type }));
            if (areasData.length > 0) setFormData(prev => ({ ...prev, area_id: areasData[0].id.toString() }));
        }).catch(console.error);
    }, []);

    const handleCheckIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            const res = await vehicleService.checkIn({
                license_plate: formData.license_plate.toUpperCase(),
                vehicle_type: formData.vehicle_type,
                area_id: parseInt(formData.area_id),
                owner_name: formData.owner_name,
                owner_phone: formData.owner_phone
            });
            setTicket(res);
            setSuccess(true);
            // Reset form but keep ticket visible
            setFormData({
                license_plate: '',
                vehicle_type: rates[0]?.vehicle_type || '',
                area_id: areas[0]?.id.toString() || '',
                owner_name: '',
                owner_phone: ''
            });
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Unknown error';
            alert('Check-in Failed: ' + msg);
        } finally {
            setLoading(false);
        }
    };

    const currentTime = new Date().toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).replace(/\./g, ':');

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-black uppercase italic tracking-tighter">Check-in Kendaraan</h1>
                <p className="text-slate-700 font-bold uppercase tracking-widest text-xs">Masukkan data kendaraan yang akan parkir</p>
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden">
                <CardContent className="p-12">
                    <form onSubmit={handleCheckIn} className="space-y-10">
                        <div className="grid gap-10 md:grid-cols-2">
                            {/* Left Column */}
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Label htmlFor="plate" className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Plat nomor</Label>
                                    <div className="relative group">
                                        <Car className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                        <Input
                                            id="plate"
                                            placeholder="CONTOH : XY 123 BZ"
                                            value={formData.license_plate}
                                            onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
                                            className="h-20 pl-16 pr-6 rounded-2xl border-4 border-slate-50 bg-slate-50 text-xl font-black uppercase focus:border-blue-400 focus:bg-white transition-all shadow-inner"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Jenis Kendaraan</Label>
                                    <div className="relative">
                                        <select
                                            value={formData.vehicle_type}
                                            onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                                            className="w-full h-20 pl-6 pr-12 rounded-2xl border-4 border-slate-50 bg-slate-50 text-xl font-black uppercase focus:border-blue-400 focus:bg-white transition-all shadow-inner appearance-none outline-none"
                                            required
                                        >
                                            {rates.map(rate => (
                                                <option key={rate.id} value={rate.vehicle_type}>{rate.vehicle_type}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-700 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Pilih Area Parkir</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 pointer-events-none" />
                                        <select
                                            value={formData.area_id}
                                            onChange={(e) => setFormData({ ...formData, area_id: e.target.value })}
                                            className="w-full h-20 pl-16 pr-12 rounded-2xl border-4 border-slate-50 bg-slate-50 text-xl font-black uppercase focus:border-blue-400 focus:bg-white transition-all shadow-inner appearance-none outline-none"
                                            required
                                        >
                                            {areas.map(area => (
                                                <option key={area.id} value={area.id}>{area.name} (Tersedia: {area.total_capacity - area.occupied_slots})</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-700 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">Nama Pemilik (opsional)</Label>
                                        <div className="relative">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
                                            <Input
                                                placeholder="Nama Lengkap"
                                                value={formData.owner_name}
                                                onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                                                className="h-20 pl-16 pr-6 rounded-2xl border-4 border-slate-50 bg-slate-50 text-lg font-bold focus:border-blue-400 transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-black text-slate-700 uppercase tracking-widest ml-1">No. Telepon (opsional)</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300" />
                                            <Input
                                                placeholder="08xxxxxxxxx"
                                                value={formData.owner_phone}
                                                onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                                                className="h-20 pl-16 pr-6 rounded-2xl border-4 border-slate-50 bg-slate-50 text-lg font-bold focus:border-blue-400 transition-all shadow-inner"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Info Transaksi Box */}
                                <div className="bg-cyan-50 border-4 border-cyan-100 rounded-[2rem] p-8 space-y-4 relative overflow-hidden group">
                                    <div className="absolute -right-4 -top-4 opacity-5 group-hover:rotate-12 transition-transform duration-500">
                                        <Info className="h-32 w-32" />
                                    </div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <Info className="h-6 w-6 text-cyan-500" />
                                        <h4 className="text-lg font-black text-black uppercase italic">Info Transaksi</h4>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-bold text-slate-800">Waktu Masuk :</p>
                                            <p className="text-lg font-black text-black font-mono tracking-tight">{success && ticket ? new Date(ticket.check_in_time).toLocaleString('id-ID') : currentTime}</p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-bold text-slate-800">Nomor Tiket :</p>
                                            <p className="text-xl font-black text-blue-600 font-mono italic">{success && ticket ? ticket.ticket_number : '---'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col md:flex-row gap-6 pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setTicket(null)}
                                className="h-20 flex-1 rounded-2xl border-4 text-xl font-black uppercase italic hover:bg-slate-50 transition-all"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-20 flex-[2] rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xl font-black uppercase italic shadow-2xl shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                        Memproses...
                                    </>
                                ) : success ? (
                                    <>
                                        <CheckCircle2 className="mr-3 h-6 w-6" />
                                        Berhasil Check-in
                                    </>
                                ) : (
                                    'Proses Check-in'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
