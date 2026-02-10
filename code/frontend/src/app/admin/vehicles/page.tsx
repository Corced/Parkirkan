'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, Search, X, Car, User, Phone, Calendar, Hash } from "lucide-react";
import { vehicleService, transactionService } from "@/lib/api";
import { Vehicle, Transaction } from "@/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
    const [confirmPlate, setConfirmPlate] = useState('');

    // View Modal State
    const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);
    const [vehicleTransactions, setVehicleTransactions] = useState<Transaction[]>([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    // Edit Modal State
    const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
    const [editForm, setEditForm] = useState({ owner_name: '', owner_phone: '', vehicle_type: '' });
    const [saving, setSaving] = useState(false);

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

    // Handle View - fetch vehicle transactions
    const handleView = async (vehicle: Vehicle) => {
        setViewVehicle(vehicle);
        setLoadingTransactions(true);
        try {
            const allTransactions = await transactionService.getAll();
            const vehicleTx = allTransactions.filter(t => t.vehicle_id === vehicle.id);
            setVehicleTransactions(vehicleTx);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingTransactions(false);
        }
    };

    // Handle Edit - open edit form
    const handleEdit = (vehicle: Vehicle) => {
        setEditVehicle(vehicle);
        setEditForm({
            owner_name: vehicle.owner_name || '',
            owner_phone: vehicle.owner_phone || '',
            vehicle_type: vehicle.vehicle_type
        });
    };

    // Save Edit
    const handleSaveEdit = async () => {
        if (!editVehicle) return;
        setSaving(true);
        try {
            await vehicleService.update(editVehicle.id, editForm);
            // Update local state
            setVehicles(vehicles.map(v =>
                v.id === editVehicle.id ? { ...v, ...editForm } : v
            ));
            setEditVehicle(null);
        } catch (error) {
            alert('Gagal menyimpan perubahan');
        } finally {
            setSaving(false);
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
                                        <button
                                            onClick={() => handleView(vehicle)}
                                            className="p-3 text-slate-300 hover:text-blue-500 transition-colors"
                                            title="Lihat Detail"
                                        >
                                            <Eye className="h-6 w-6" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(vehicle)}
                                            className="p-3 text-slate-300 hover:text-blue-500 transition-colors"
                                            title="Edit Data"
                                        >
                                            <Edit className="h-6 w-6" />
                                        </button>
                                        <button
                                            onClick={() => setVehicleToDelete(vehicle)}
                                            className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                                            title="Hapus"
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

            {/* VIEW MODAL */}
            {viewVehicle && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                    <div className="relative bg-white rounded-[3rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-10 border-b border-slate-100 bg-slate-50">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
                                        {viewVehicle.license_plate}
                                    </h3>
                                    {getVehicleTypeBadge(viewVehicle.vehicle_type)}
                                </div>
                                <button onClick={() => setViewVehicle(null)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                                    <X className="h-6 w-6 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-10 space-y-8 overflow-y-auto max-h-[60vh]">
                            {/* Vehicle Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl">
                                    <User className="h-6 w-6 text-blue-500" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pemilik</p>
                                        <p className="text-lg font-bold text-slate-900">{viewVehicle.owner_name || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl">
                                    <Phone className="h-6 w-6 text-emerald-500" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Telepon</p>
                                        <p className="text-lg font-bold text-slate-900">{viewVehicle.owner_phone || '-'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl">
                                    <Hash className="h-6 w-6 text-purple-500" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Kunjungan</p>
                                        <p className="text-lg font-bold text-slate-900">{viewVehicle.total_visits}x</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl">
                                    <Calendar className="h-6 w-6 text-orange-500" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kunjungan Terakhir</p>
                                        <p className="text-lg font-bold text-slate-900">
                                            {viewVehicle.last_visit ? new Date(viewVehicle.last_visit).toLocaleDateString('id-ID') : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction History */}
                            <div className="space-y-4">
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-wide">Riwayat Transaksi</h4>
                                {loadingTransactions ? (
                                    <p className="text-slate-400 text-center py-8">Loading...</p>
                                ) : vehicleTransactions.length === 0 ? (
                                    <p className="text-slate-400 text-center py-8">Belum ada riwayat transaksi</p>
                                ) : (
                                    <div className="space-y-3">
                                        {vehicleTransactions.slice(0, 5).map(tx => (
                                            <div key={tx.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                                                <div>
                                                    <p className="font-bold text-slate-900">{tx.ticket_number}</p>
                                                    <p className="text-sm text-slate-500">
                                                        {new Date(tx.check_in_time).toLocaleDateString('id-ID')} • {tx.area?.name || 'Area'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-slate-900">
                                                        {tx.total_cost ? `Rp ${Number(tx.total_cost).toLocaleString('id-ID')}` : '-'}
                                                    </p>
                                                    <Badge className={cn(
                                                        "text-xs",
                                                        tx.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                                    )}>
                                                        {tx.status === 'completed' ? 'Selesai' : 'Aktif'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50">
                            <Button onClick={() => setViewVehicle(null)} className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-black font-bold">
                                Tutup
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editVehicle && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                    <div className="relative bg-white rounded-[3rem] w-full max-w-xl p-12 shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">
                                    Edit Kendaraan
                                </h3>
                                <p className="text-xl font-bold text-blue-500">{editVehicle.license_plate}</p>
                            </div>
                            <button onClick={() => setEditVehicle(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <X className="h-6 w-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Jenis Kendaraan</label>
                                <Select value={editForm.vehicle_type} onValueChange={(v) => setEditForm({ ...editForm, vehicle_type: v })}>
                                    <SelectTrigger className="h-14 rounded-xl bg-slate-50 border-2 border-slate-100 font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="z-[200]">
                                        <SelectItem value="motor">Motor</SelectItem>
                                        <SelectItem value="mobil">Mobil</SelectItem>
                                        <SelectItem value="truck">Truck</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Nama Pemilik</label>
                                <Input
                                    value={editForm.owner_name}
                                    onChange={(e) => setEditForm({ ...editForm, owner_name: e.target.value })}
                                    placeholder="Nama pemilik kendaraan"
                                    className="h-14 rounded-xl bg-slate-50 border-2 border-slate-100 font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">No. Telepon</label>
                                <Input
                                    value={editForm.owner_phone}
                                    onChange={(e) => setEditForm({ ...editForm, owner_phone: e.target.value })}
                                    placeholder="08xxxxxxxxxx"
                                    className="h-14 rounded-xl bg-slate-50 border-2 border-slate-100 font-bold"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                onClick={() => setEditVehicle(null)}
                                variant="outline"
                                className="flex-1 h-14 rounded-2xl font-bold"
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleSaveEdit}
                                disabled={saving}
                                className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold"
                            >
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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

