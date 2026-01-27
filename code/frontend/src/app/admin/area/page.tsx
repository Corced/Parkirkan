'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";
import { areaService } from "@/lib/api";
import { ParkingArea } from "@/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function AreaPage() {
    const [areas, setAreas] = useState<ParkingArea[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingArea, setEditingArea] = useState<ParkingArea | null>(null);
    const [areaToDelete, setAreaToDelete] = useState<ParkingArea | null>(null);
    const [confirmCode, setConfirmCode] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        total_capacity: 0
    });

    useEffect(() => {
        fetchAreas();
    }, []);

    const fetchAreas = async () => {
        try {
            const data = await areaService.getAll();
            setAreas(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        try {
            if (editingArea) {
                const updated = await areaService.update(editingArea.id, formData);
                setAreas(areas.map(a => a.id === editingArea.id ? updated : a));
                setEditingArea(null);
            } else {
                const created = await areaService.create(formData);
                setAreas([...areas, created]);
                setIsAdding(false);
            }
            setFormData({ name: '', code: '', total_capacity: 0 });
        } catch (error: any) {
            alert('Gagal menyimpan: ' + (error.message || 'Error'));
        }
    };

    const handleDelete = async () => {
        if (!areaToDelete) return;
        try {
            await areaService.delete(areaToDelete.id);
            setAreas(areas.filter(a => a.id !== areaToDelete.id));
            setAreaToDelete(null);
            setConfirmCode('');
        } catch (error) {
            alert('Gagal menghapus area');
        }
    };

    const getStatusInfo = (occupied: number, total: number) => {
        const percentage = (occupied / total) * 100;
        if (percentage >= 100) return { label: 'Tidak Tersedia', color: 'bg-red-400', barColor: 'bg-red-500' };
        if (percentage >= 80) return { label: 'Hampir Penuh', color: 'bg-orange-400', barColor: 'bg-orange-500' };
        return { label: 'Tersedia', color: 'bg-emerald-400', barColor: 'bg-blue-500' };
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Area Parkir</h1>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest leading-none">Manajemen area dan kapasitas parkir</p>
                </div>
                <Button onClick={() => setIsAdding(true)} className="bg-[#2563EB] hover:bg-blue-700 h-14 px-8 rounded-2xl gap-3 text-lg font-black shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                    <Plus className="h-6 w-6" strokeWidth={3} />
                    Tambah Area
                </Button>
            </div>

            {/* Grid */}
            <div className="grid gap-10 md:grid-cols-2">
                {areas.map((area) => {
                    const status = getStatusInfo(area.occupied_slots, area.total_capacity);
                    const remaining = area.total_capacity - area.occupied_slots;
                    const progressWidth = Math.min((area.occupied_slots / area.total_capacity) * 100, 100);

                    return (
                        <div key={area.id} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 space-y-8 group hover:shadow-xl transition-all duration-300">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">{area.name}</h3>
                                    <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{area.code}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setEditingArea(area);
                                            setFormData({ name: area.name, code: area.code, total_capacity: area.total_capacity });
                                        }}
                                        className="p-3 text-slate-300 hover:text-blue-500 transition-colors"
                                    >
                                        <Edit className="h-7 w-7" />
                                    </button>
                                    <button
                                        onClick={() => setAreaToDelete(area)}
                                        className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-7 w-7" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Kapasitas</span>
                                    <span className="text-lg font-bold text-slate-600 italic">{area.occupied_slots}/{area.total_capacity}</span>
                                </div>
                                <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className={cn("h-full transition-all duration-1000 ease-out", status.barColor)}
                                        style={{ width: `${progressWidth}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <span className={cn(
                                    "px-6 py-2 rounded-xl text-xs font-black text-white uppercase tracking-widest italic shadow-sm",
                                    status.color
                                )}>
                                    {status.label}
                                </span>
                                <div className="text-right">
                                    <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{remaining}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Slot Tersisa</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* MODAL ADD/EDIT */}
            {(isAdding || editingArea) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                    <div className="relative bg-white rounded-[4rem] w-full max-w-2xl p-16 shadow-2xl space-y-12 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">
                                {editingArea ? 'Edit Area' : 'Tambah Area'}
                            </h3>
                            <button onClick={() => { setIsAdding(false); setEditingArea(null); }} className="p-4 hover:bg-slate-50 rounded-2xl transition-all">
                                <X className="h-8 w-8 text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Nama Area</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="CONTOH: AREA A"
                                    className="h-20 rounded-[1.5rem] border-4 border-slate-50 bg-slate-50 px-8 text-2xl font-black focus:border-blue-400 focus:bg-white transition-all uppercase"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Kode Area</label>
                                <Input
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    placeholder="CONTOH: A1"
                                    className="h-20 rounded-[1.5rem] border-4 border-slate-50 bg-slate-50 px-8 text-2xl font-black focus:border-blue-400 focus:bg-white transition-all uppercase"
                                    disabled={!!editingArea}
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Total Kapasitas</label>
                                <Input
                                    type="number"
                                    value={formData.total_capacity}
                                    onChange={(e) => setFormData({ ...formData, total_capacity: Number(e.target.value) })}
                                    placeholder="0"
                                    className="h-20 rounded-[1.5rem] border-4 border-slate-50 bg-slate-50 px-8 text-2xl font-black focus:border-blue-400 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex gap-6 pt-4">
                            <Button onClick={handleSave} className="flex-1 h-20 rounded-[2rem] bg-[#2563EB] hover:bg-blue-700 text-white text-2xl font-black italic shadow-xl shadow-blue-500/20 transition-all active:scale-95 gap-4">
                                <Save className="h-8 w-8" /> SIMPAN AREA
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* SECURE DELETE MODAL */}
            {areaToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                    <div className="relative bg-white rounded-[4rem] w-full max-w-2xl p-20 shadow-2xl space-y-16 text-center animate-in zoom-in-95 duration-200">
                        <div className="space-y-4">
                            <h3 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">Hapus Area Parkir?</h3>
                            <p className="text-2xl font-bold text-slate-400 tracking-tight">
                                Apakah anda yakin untuk menghapus <br /><span className="text-red-500">"{areaToDelete.name}"</span>?
                            </p>
                        </div>

                        <div className="space-y-6">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Ketik Kode Area untuk Konfirmasi</p>
                            <Input
                                value={confirmCode}
                                onChange={(e) => setConfirmCode(e.target.value)}
                                placeholder={areaToDelete.code}
                                className="h-24 rounded-[2rem] border-4 border-slate-50 bg-slate-50 px-8 text-3xl font-black text-center focus:border-red-400 focus:bg-white transition-all uppercase"
                            />
                        </div>

                        <div className="flex gap-8">
                            <Button
                                onClick={handleDelete}
                                disabled={confirmCode !== areaToDelete.code}
                                className={cn(
                                    "flex-1 h-24 rounded-[2.5rem] text-3xl font-black italic shadow-2xl transition-all active:scale-95",
                                    confirmCode === areaToDelete.code
                                        ? "bg-[#4ADE80] hover:bg-green-500 text-white shadow-green-500/40"
                                        : "bg-slate-100 text-slate-300 cursor-not-allowed border-4 border-slate-200"
                                )}
                            >
                                Iya
                            </Button>
                            <Button
                                onClick={() => { setAreaToDelete(null); setConfirmCode(''); }}
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
