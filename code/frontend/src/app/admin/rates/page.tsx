'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { rateService } from "@/lib/api";
import { ParkingRate } from "@/types";
import { Edit, Trash2, Plus, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { vehicleIcons, VehicleIcon } from "@/components/vehicle-icons";

export default function RatesPage() {
    const [rates, setRates] = useState<ParkingRate[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [rateToDelete, setRateToDelete] = useState<ParkingRate | null>(null);
    const [confirmVehicleType, setConfirmVehicleType] = useState('');

    // Form State
    const [formData, setFormData] = useState<{
        vehicle_type: string;
        description: string;
        icon: string;
        hourly_rate: number;
        daily_max_rate: number;
    }>({
        vehicle_type: '',
        description: '',
        icon: 'car',
        hourly_rate: 0,
        daily_max_rate: 0
    });

    const icons = vehicleIcons;

    useEffect(() => {
        fetchRates();
    }, []);

    const fetchRates = async () => {
        try {
            const data = await rateService.getAll();
            if (Array.isArray(data)) setRates(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditClick = (rate: ParkingRate) => {
        setEditingId(rate.id);
        setFormData({
            vehicle_type: rate.vehicle_type,
            description: rate.description || '',
            icon: rate.icon || 'car',
            hourly_rate: rate.hourly_rate,
            daily_max_rate: rate.daily_max_rate || 0
        });
    };

    const handleSave = async (id?: number) => {
        try {
            if (id) {
                const updated = await rateService.update(id, formData as Partial<ParkingRate>);
                setRates(rates.map(rate => rate.id === id ? updated : rate));
                setEditingId(null);
            } else {
                const created = await rateService.create(formData as Partial<ParkingRate>);
                setRates([...rates, created]);
                setIsAdding(false);
            }
            setFormData({ vehicle_type: '', description: '', icon: 'car', hourly_rate: 0, daily_max_rate: 0 });
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Error';
            alert('Gagal menyimpan: ' + msg);
        }
    };

    const handleDelete = async () => {
        if (!rateToDelete) return;
        try {
            await rateService.delete(rateToDelete.id);
            setRates(rates.filter(rate => rate.id !== rateToDelete.id));
            setRateToDelete(null);
            setConfirmVehicleType('');
        } catch (error) {
            alert('Gagal menghapus');
        }
    };



    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold text-black tracking-tight">Tarif Parkir</h1>
                    <p className="text-slate-800 font-bold text-xs tracking-widest leading-none">Pengaturan tarif parkir kendaraan</p>
                </div>
                <Button onClick={() => setIsAdding(true)} className="bg-[#2563EB] hover:bg-blue-700 h-14 px-8 rounded-2xl gap-3 text-lg font-black shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                    <Plus className="h-6 w-6" strokeWidth={3} />
                    Tambah Parkir
                </Button>
            </div>

            {/* Grid of Cards */}
            <div className="grid gap-10 md:grid-cols-2">
                {rates.map((rate) => {
                    const isEditing = editingId === rate.id;
                    return (
                        <div
                            key={rate.id}
                            className={cn(
                                "bg-white rounded-[2rem] p-10 shadow-sm border-2 transition-all relative overflow-visible group",
                                isEditing ? "border-blue-400 shadow-2xl scale-[1.02] z-50" : "border-transparent hover:shadow-md"
                            )}
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="space-y-4">
                                    <div className="h-20 w-20 rounded-[1.5rem] border-2 border-slate-900 flex items-center justify-center bg-white shadow-inner">
                                        <VehicleIcon iconId={isEditing ? formData.icon : rate.icon} vehicleType={rate.vehicle_type} />
                                    </div>
                                    {isEditing && (
                                        <div className="flex gap-2 p-2 bg-slate-50 rounded-xl border-2 border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200 flex-wrap max-w-[320px]">
                                            {icons.map((item) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => setFormData({ ...formData, icon: item.id })}
                                                    className={cn(
                                                        "p-2 rounded-lg transition-all relative group/icon",
                                                        formData.icon === item.id ? "bg-white shadow-md text-blue-600 scale-110" : "text-slate-700 hover:text-slate-600"
                                                    )}
                                                    title={item.label}
                                                >
                                                    <item.icon className="h-5 w-5" />
                                                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-400 whitespace-nowrap opacity-0 group-hover/icon:opacity-100 transition-opacity">
                                                        {item.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    {isEditing ? (
                                        <button onClick={() => handleSave(rate.id)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all">
                                            <Save className="h-7 w-7" />
                                        </button>
                                    ) : (
                                        <button onClick={() => handleEditClick(rate)} className="p-3 text-orange-300 hover:text-orange-500 transition-colors">
                                            <Edit className="h-7 w-7" />
                                        </button>
                                    )}
                                    <button onClick={() => setRateToDelete(rate)} className="p-3 text-red-200 hover:text-red-500 transition-colors">
                                        <Trash2 className="h-7 w-7" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-1">
                                    {isEditing ? (
                                        <Input
                                            value={formData.vehicle_type}
                                            onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                                            className="h-12 text-2xl font-black text-black border-none bg-slate-50 rounded-lg p-0"
                                        />
                                    ) : (
                                        <h3 className="text-3xl font-black text-black tracking-tighter">{rate.vehicle_type}</h3>
                                    )}
                                    {!isEditing && rate.description && (
                                        <p className="text-xs font-bold text-slate-400 leading-relaxed mt-1">
                                            {rate.description}
                                        </p>
                                    )}
                                    {isEditing && (
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Deskripsi (Misal: Alphard, Fortuner)"
                                            className="w-full mt-2 p-3 text-sm font-bold text-slate-600 bg-slate-50 rounded-xl border-none outline-none resize-none min-h-[80px]"
                                        />
                                    )}
                                </div>

                                <div className="space-y-4 pt-2">
                                    <div className="flex justify-between items-center group/item">
                                        <span className="text-sm font-black text-slate-700 tracking-widest">Tarif per jam</span>
                                        {isEditing ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-black text-black">Rp.</span>
                                                <Input
                                                    type="number"
                                                    value={formData.hourly_rate}
                                                    onChange={(e) => setFormData({ ...formData, hourly_rate: Number(e.target.value) })}
                                                    className="w-32 h-10 text-xl font-black text-right border-none bg-slate-50 px-2"
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-xl font-black text-black tracking-tight group-hover/item:text-blue-600 transition-colors">
                                                Rp. {rate.hourly_rate.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center group/item">
                                        <span className="text-sm font-black text-slate-700 tracking-widest">Maksimal per hari</span>
                                        {isEditing ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-black text-black">Rp.</span>
                                                <Input
                                                    type="number"
                                                    value={formData.daily_max_rate}
                                                    onChange={(e) => setFormData({ ...formData, daily_max_rate: Number(e.target.value) })}
                                                    className="w-32 h-10 text-xl font-black text-right border-none bg-slate-50 px-2"
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-xl font-black text-black tracking-tight group-hover/item:text-blue-600 transition-colors">
                                                Rp. {rate.daily_max_rate?.toLocaleString() || '0'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Adding Card */}
                {isAdding && (
                    <div className="bg-white rounded-[2rem] p-10 shadow-2xl border-2 border-blue-400 animate-in zoom-in-95 duration-200 overflow-visible relative z-20">
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-4">
                                <div className="h-20 w-20 rounded-[1.5rem] border-2 border-slate-900 flex items-center justify-center bg-white shadow-inner">
                                    <VehicleIcon iconId={formData.icon} />
                                </div>
                                <div className="flex gap-2 p-2 bg-slate-50 rounded-xl border-2 border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200 flex-wrap max-w-[420px]">
                                    {icons.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setFormData({ ...formData, icon: item.id })}
                                            className={cn(
                                                "p-2 rounded-lg transition-all relative group/icon",
                                                formData.icon === item.id ? "bg-white shadow-md text-blue-600 scale-110" : "text-slate-700 hover:text-slate-600"
                                            )}
                                            title={item.label}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-400 whitespace-nowrap opacity-0 group-hover/icon:opacity-100 transition-opacity">
                                                {item.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => handleSave()} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all">
                                    <Save className="h-7 w-7" />
                                </button>
                                <button onClick={() => setIsAdding(false)} className="p-3 text-red-400 hover:text-red-500 transition-colors">
                                    <X className="h-7 w-7" />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <Input
                                placeholder="JENIS KENDARAAN"
                                value={formData.vehicle_type}
                                onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                                className="h-14 text-2xl font-black text-black border-4 border-slate-100 bg-slate-50 rounded-xl px-4 tracking-tighter"
                            />
                            <textarea
                                placeholder="DESKRIPSI VARIAN (OPSIONAL)"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full min-h-[100px] text-lg font-black text-slate-800 border-4 border-slate-100 bg-slate-50 rounded-xl p-4 outline-none focus:border-blue-400 transition-all resize-none"
                            />
                            <div className="space-y-4 pt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-black text-slate-700 tracking-widest">Tarif per jam</span>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        onChange={(e) => setFormData({ ...formData, hourly_rate: Number(e.target.value) })}
                                        className="w-40 h-12 text-xl font-black text-right border-4 border-slate-100 bg-slate-50 rounded-xl px-4"
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-black text-slate-700 tracking-widest">Maksimal per hari</span>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        onChange={(e) => setFormData({ ...formData, daily_max_rate: Number(e.target.value) })}
                                        className="w-40 h-12 text-xl font-black text-right border-4 border-slate-100 bg-slate-50 rounded-xl px-4"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* SECURE DELETE MODAL */}
            {rateToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md text-black">
                    <div className="relative bg-white rounded-[4rem] w-full max-w-3xl p-20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] space-y-16 text-center animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black leading-tight tracking-tighter ">
                                Hapus Tarif Parkir?
                            </h3>
                            <p className="text-2xl font-bold text-slate-700 tracking-tight">
                                Apakah anda yakin untuk menghapus tarif <span className="text-red-500">"{rateToDelete.vehicle_type}"</span>?
                            </p>
                        </div>

                        <div className="space-y-6">
                            <p className="text-lg font-black text-slate-700 tracking-[0.2em]">Ketik jenis kendaraan untuk konfirmasi</p>
                            <Input
                                value={confirmVehicleType}
                                onChange={(e) => setConfirmVehicleType(e.target.value)}
                                placeholder={rateToDelete.vehicle_type}
                                className="h-24 rounded-[2rem] border-4 border-slate-100 bg-slate-50 px-12 text-3xl font-black focus:border-red-400 focus:bg-white transition-all text-center shadow-inner tracking-tight"
                            />
                        </div>

                        <div className="flex gap-10">
                            <Button
                                onClick={handleDelete}
                                disabled={confirmVehicleType !== rateToDelete.vehicle_type}
                                className={cn(
                                    "flex-1 h-24 rounded-[2rem] text-4xl font-black shadow-2xl transition-all active:scale-95",
                                    confirmVehicleType === rateToDelete.vehicle_type
                                        ? "bg-[#4ADE80] hover:bg-green-500 text-white shadow-green-500/40"
                                        : "bg-slate-100 text-slate-300 cursor-not-allowed border-4 border-slate-200"
                                )}
                            >
                                Iya
                            </Button>
                            <Button
                                onClick={() => { setRateToDelete(null); setConfirmVehicleType(''); }}
                                className="flex-1 h-24 rounded-[2rem] bg-[#EF4444] hover:bg-red-600 text-white text-4xl font-black shadow-2xl shadow-red-500/40 transition-all active:scale-95"
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

