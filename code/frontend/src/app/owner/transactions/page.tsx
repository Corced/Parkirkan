'use client';

import { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { transactionService, areaService, rateService } from "@/lib/api";
import { Transaction, ParkingArea, ParkingRate } from '@/types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Search, Calendar, FileSpreadsheet, FileIcon } from "lucide-react";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    // Dynamic Dropdown Data
    const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
    const [parkingAreas, setParkingAreas] = useState<ParkingArea[]>([]);

    // Filter States
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [vehicleType, setVehicleType] = useState('all');
    const [parkingArea, setParkingArea] = useState('all');

    useEffect(() => {
        Promise.all([
            transactionService.getAll(),
            areaService.getAll(),
            rateService.getAll()
        ])
            .then(([transactions, areas, rates]) => {
                if (Array.isArray(transactions)) {
                    setTransactions(transactions);
                    setFilteredTransactions(transactions);
                }
                setParkingAreas(areas);
                // Extract unique vehicle types from rates
                const types = rates.map(r => r.vehicle_type);
                setVehicleTypes(types);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleFilter = () => {
        let filtered = [...transactions];

        if (startDate) {
            filtered = filtered.filter(t => new Date(t.check_in_time) >= new Date(startDate));
        }

        if (endDate) {
            // Set end date to end of day
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filtered = filtered.filter(t => new Date(t.check_in_time) <= end);
        }

        if (vehicleType !== 'all') {
            filtered = filtered.filter(t => t.vehicle?.vehicle_type === vehicleType);
        }

        if (parkingArea !== 'all') {
            filtered = filtered.filter(t => t.area?.id.toString() === parkingArea);
        }

        setFilteredTransactions(filtered);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Laporan Transaksi Parkir", 14, 15);
        doc.text(`Periode: ${startDate || 'Awal'} s/d ${endDate || 'Sekarang'}`, 14, 22);

        const tableColumn = ["Tanggal", "No. Tiket", "Plat Nomor", "Jenis", "Area", "Masuk", "Keluar", "Biaya"];
        const tableRows = filteredTransactions.map(t => [
            new Date(t.check_in_time).toLocaleDateString(),
            t.ticket_number,
            t.vehicle?.license_plate || '-',
            t.vehicle?.vehicle_type || '-',
            t.area?.name || '-',
            new Date(t.check_in_time).toLocaleTimeString(),
            t.check_out_time ? new Date(t.check_out_time).toLocaleTimeString() : '-',
            t.total_cost ? `Rp ${Number(t.total_cost).toLocaleString('id-ID')}` : '-'
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });

        doc.save("laporan_transaksi.pdf");
    };

    const handleExportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredTransactions.map(t => ({
            Tanggal: new Date(t.check_in_time).toLocaleDateString(),
            No_Tiket: t.ticket_number,
            Plat_Nomor: t.vehicle?.license_plate,
            Jenis: t.vehicle?.vehicle_type,
            Area: t.area?.name || '-',
            Masuk: new Date(t.check_in_time).toLocaleTimeString(),
            Keluar: t.check_out_time ? new Date(t.check_out_time).toLocaleTimeString() : '-',
            Biaya: t.total_cost
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transaksi");
        XLSX.writeFile(workbook, "laporan_transaksi.xlsx");
    };

    // Calculate Summary Stats from FILTERED data
    const totalRevenue = filteredTransactions.reduce((acc, curr) => acc + (Number(curr.total_cost) || 0), 0);
    const summaryStats = [
        { label: 'Total Transaksi', value: filteredTransactions.length.toString(), color: 'bg-cyan-100/50', border: 'border-cyan-200' },
        { label: 'Total Pendapatan', value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, color: 'bg-emerald-100/50', border: 'border-emerald-200' },
        { label: 'Rata-rata Durasi', value: '2 Hari 5.2 Jam', color: 'bg-fuchsia-100/50', border: 'border-fuchsia-200' }, // Hard to calc without duration_hours being consistent
        { label: 'Rata-rata Biaya', value: filteredTransactions.length ? `Rp ${(totalRevenue / filteredTransactions.length).toFixed(0)}` : 'Rp 0', color: 'bg-amber-100/50', border: 'border-amber-200' },
    ];

    return (
        <div className="space-y-8 pb-20 font-sans">
            <div>
                <h1 className="text-3xl font-bold text-black">Rekap Transaksi</h1>
                <p className="text-slate-800">Laporan transaksi parkir dengan filter waktu</p>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 items-end">
                <div className="w-full lg:w-auto space-y-2">
                    <label className="text-sm font-semibold text-black">Tanggal Mulai</label>
                    <div className="relative">
                        <Input
                            type="date"
                            className="pl-10 h-10 border-slate-200 rounded-lg bg-white text-black"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-700" />
                    </div>
                </div>
                <div className="w-full lg:w-auto space-y-2">
                    <label className="text-sm font-semibold text-black">Tanggal Akhir</label>
                    <div className="relative">
                        <Input
                            type="date"
                            className="pl-10 h-10 border-slate-200 rounded-lg bg-white text-black"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-700" />
                    </div>
                </div>
                <div className="w-full lg:w-[200px] space-y-2">
                    <label className="text-sm font-semibold text-black">Jenis Kendaraan</label>
                    <Select value={vehicleType} onValueChange={setVehicleType}>
                        <SelectTrigger className="h-10 border-slate-200 rounded-lg bg-white text-black">
                            <SelectValue placeholder="Semua" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black">
                            <SelectItem value="all">Semua</SelectItem>
                            {vehicleTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full lg:w-[200px] space-y-2">
                    <label className="text-sm font-semibold text-black">Area Parkir</label>
                    <Select value={parkingArea} onValueChange={setParkingArea}>
                        <SelectTrigger className="h-10 border-slate-200 rounded-lg bg-white text-black">
                            <SelectValue placeholder="Semua area" />
                        </SelectTrigger>
                        <SelectContent className="bg-white text-black">
                            <SelectItem value="all">Semua area</SelectItem>
                            {parkingAreas.map(area => (
                                <SelectItem key={area.id} value={area.id.toString()}>{area.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex-1" />
                <Button
                    className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 h-10 px-8 rounded-lg font-bold"
                    onClick={handleFilter}
                >
                    <Search className="mr-2 h-4 w-4" /> Filter
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {summaryStats.map((stat, idx) => (
                    <div key={idx} className={`p-6 rounded-xl border-2 ${stat.border} ${stat.color} flex flex-col justify-center space-y-2`}>
                        <span className="text-sm font-bold text-black">{stat.label}</span>
                        <span className="text-2xl font-black text-black">{stat.value}</span>
                    </div>
                ))}
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className="text-xl font-bold text-black">Detail Transaksi</h3>
                    <div className="flex gap-2">
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold border-none"
                            onClick={handleExportPDF}
                        >
                            <FileIcon className="mr-2 h-4 w-4" /> Ekspor PDF
                        </Button>
                        <Button
                            className="bg-green-700 hover:bg-green-800 text-white font-semibold border-none"
                            onClick={handleExportExcel}
                        >
                            <FileSpreadsheet className="mr-2 h-4 w-4" /> Ekspor Excel
                        </Button>
                    </div>
                </div>

                <div className="border rounded-xl overflow-hidden">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-bold text-black">Tanggal</TableHead>
                                <TableHead className="font-bold text-black">No. Tiket</TableHead>
                                <TableHead className="font-bold text-black">Plat Nomor</TableHead>
                                <TableHead className="font-bold text-black">Jenis</TableHead>
                                <TableHead className="font-bold text-black">Area</TableHead>
                                <TableHead className="font-bold text-black">Masuk</TableHead>
                                <TableHead className="font-bold text-black">Keluar</TableHead>
                                <TableHead className="font-bold text-black">Durasi</TableHead>
                                <TableHead className="font-bold text-black text-right">Biaya</TableHead>
                                <TableHead className="font-bold text-black text-center">Petugas</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="h-24 text-center">Loading...</TableCell>
                                </TableRow>
                            ) : filteredTransactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="h-24 text-center text-slate-800">Tidak ada data transaksi</TableCell>
                                </TableRow>
                            ) : (
                                filteredTransactions.map((transaction) => (
                                    <TableRow key={transaction.id} className="hover:bg-slate-50/50">
                                        <TableCell className="font-medium text-slate-600">
                                            {new Date(transaction.check_in_time).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="font-medium text-black">{transaction.ticket_number}</TableCell>
                                        <TableCell className="font-mono text-slate-600">{transaction.vehicle?.license_plate}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-bold font-mono ${transaction.vehicle?.vehicle_type === 'motor' ? 'bg-emerald-100 text-emerald-700' :
                                                transaction.vehicle?.vehicle_type === 'mobil' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-black'
                                                }`}>
                                                {transaction.vehicle?.vehicle_type || '-'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-slate-600">{transaction.area?.name || '-'}</TableCell>
                                        <TableCell className="text-slate-600">
                                            {new Date(transaction.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </TableCell>
                                        <TableCell className="text-slate-600">
                                            {transaction.check_out_time ? new Date(transaction.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </TableCell>
                                        <TableCell className="text-slate-600">2j 30m</TableCell> {/* Mock Duration */}
                                        <TableCell className="text-right font-bold text-black">
                                            {transaction.total_cost ? `Rp ${Number(transaction.total_cost).toLocaleString('id-ID')}` : '-'}
                                        </TableCell>
                                        <TableCell className="text-center text-slate-600">petugas01</TableCell> {/* Mock Petugas */}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex justify-between items-center pt-4">
                    <p className="text-sm text-slate-800">Menampilkan {filteredTransactions.length} transaksi</p>
                    <div className="flex gap-2">
                        <div className="text-xl font-black text-black">
                            Total Transaksi : Rp {totalRevenue.toLocaleString('id-ID')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
