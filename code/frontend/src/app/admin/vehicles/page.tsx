'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, Search, X } from "lucide-react";
import { vehicleService } from "@/lib/api";
import { Vehicle } from "@/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
    const [confirmPlate, setConfirmPlate] = useState('');

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const data = await vehicleService.getHistory();
            setVehicles(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!vehicleToDelete) return;
        try {
            await vehicleService.delete(vehicleToDelete.id);
            setVehicles(vehicles.filter(v => v.id !== vehicleToDelete.id));
            setVehicleToDelete(null);
            setConfirmPlate('');
        } catch (error) {
            alert('Gagal menghapus data kendaraan');
        }
    };

    const filteredVehicles = vehicles.filter(v =>
        v.license_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.owner_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getVehicleTypeBadge = (type: string) => {
        const types: Record<string, string> = {
            'mobil': 'bg-amber-100 text-amber-700 border-amber-200',
            'motor': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'truck': 'bg-sky-100 text-sky-700 border-sky-200',
            'truk': 'bg-sky-100 text-sky-700 border-sky-200',
        };
        const color = types[type.toLowerCase()] || 'bg-slate-100 text-slate-700 border-slate-200';
        return (
            <Badge className={cn("px-4 py-1 rounded-lg border uppercase font-black text-[10px] tracking-widest", color)}>
                {type}
            </Badge>
        );
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div className="space-y-1">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-tight">Data Kendaraan</h1>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari plat nomor atau pemilik..."
                            className="h-14 w-80 pl-16 rounded-2xl border-none bg-white shadow-sm font-bold text-slate-600 focus:ring-4 focus:ring-blue-100 transition-all"
                        />
                    </div>
                    <Button className="bg-[#2563EB] hover:bg-blue-700 h-14 px-8 rounded-2xl gap-3 text-lg font-black shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                        <Plus className="h-6 w-6" strokeWidth={3} />
                        Tambah Kendaraan
                    </Button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-10 py-8 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Plat Nomor</th>
                            <th className="px-10 py-8 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Jenis</th>
                            <th className="px-10 py-8 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Nama Pemilik</th>
                            <th className="px-10 py-8 text-center text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Total Kunjungan</th>
                            <th className="px-10 py-8 text-right text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredVehicles.map((vehicle) => (
                            <tr key={vehicle.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-10 py-8">
                                    <span className="text-xl font-black text-slate-900 tracking-tighter italic uppercase">{vehicle.license_plate}</span>
                                </td>
                                <td className="px-10 py-8">
                                    {getVehicleTypeBadge(vehicle.vehicle_type)}
                                </td>
                                <td className="px-10 py-8">
                                    <span className="text-lg font-bold text-slate-500 tracking-tight">{vehicle.owner_name || '-'}</span>
                                </td>
                                <td className="px-10 py-8 text-center">
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-pink-100 text-pink-600 text-sm font-black italic shadow-inner">
                                        {vehicle.total_visits}x
                                    </span>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-3 text-slate-300 hover:text-blue-500 transition-colors">
                                            <Eye className="h-6 w-6" />
                                        </button>
                                        <button className="p-3 text-slate-300 hover:text-blue-500 transition-colors">
                                            <Edit className="h-6 w-6" />
                                        </button>
                                        <button
                                            onClick={() => setVehicleToDelete(vehicle)}
                                            className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="h-6 w-6" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredVehicles.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                            <Search className="h-10 w-10 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold italic">Tidak ada data kendaraan ditemukan</p>
                    </div>
                )}
            </div>

            {/* SECURE DELETE MODAL */}
            {vehicleToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                    <div className="relative bg-white rounded-[4rem] w-full max-w-2xl p-20 shadow-2xl space-y-16 text-center animate-in zoom-in-95 duration-200">
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">Hapus Kendaraan?</h3>
                            <p className="text-2xl font-bold text-slate-400 tracking-tight">
                                Apakah anda yakin untuk menghapus kendaraan <br /><span className="text-red-500">"{vehicleToDelete.license_plate}"</span>?
                            </p>
                        </div>

                        <div className="space-y-6">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Ketik Plat Nomor untuk Konfirmasi</p>
                            <Input
                                value={confirmPlate}
                                onChange={(e) => setConfirmPlate(e.target.value)}
                                placeholder={vehicleToDelete.license_plate}
                                className="h-24 rounded-[2rem] border-4 border-slate-50 bg-slate-50 px-8 text-3xl font-black text-center focus:border-red-400 focus:bg-white transition-all uppercase"
                            />
                        </div>

                        <div className="flex gap-8">
                            <Button
                                onClick={handleDelete}
                                disabled={confirmPlate !== vehicleToDelete.license_plate}
                                className={cn(
                                    "flex-1 h-24 rounded-[2.5rem] text-3xl font-black italic shadow-2xl transition-all active:scale-95",
                                    confirmPlate === vehicleToDelete.license_plate
                                        ? "bg-[#4ADE80] hover:bg-green-500 text-white shadow-green-500/40"
                                        : "bg-slate-100 text-slate-300 cursor-not-allowed border-4 border-slate-200"
                                )}
                            >
                                Iya
                            </Button>
                            <Button
                                onClick={() => { setVehicleToDelete(null); setConfirmPlate(''); }}
                                className="flex-1 h-24 rounded-[2.5rem] bg-[#EF4444] hover:bg-red-600 text-white text-3xl font-black italic shadow-2xl shadow-red-500/40 transition-all active:scale-95"
                            >
                                Tidak
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
