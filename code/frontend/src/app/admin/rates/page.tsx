'use client';

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Edit } from "lucide-react";
import { fetchAPI } from "@/lib/api";
import { ParkingRate } from "@/types";

export default function RatesPage() {
    const [rates, setRates] = useState<ParkingRate[]>([]);

    useEffect(() => {
        fetchAPI<ParkingRate[]>('/rates').then(data => {
            if (Array.isArray(data)) setRates(data);
        }).catch(console.error);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Tarif Parkir</h1>
                {/* Potentially add 'Add Rate' if dynamic types allowed, but usually fixed types */}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Jenis Kendaraan</TableHead>
                            <TableHead>Tarif Dasar (1 Jam Pertama)</TableHead>
                            <TableHead>Tarif Per Jam Berikutnya</TableHead>
                            <TableHead>Maksimal Harian</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rates.map((rate) => (
                            <TableRow key={rate.id}>
                                <TableCell className="font-medium capitalize">{rate.vehicle_type}</TableCell>
                                <TableCell>Rp {rate.hourly_rate.toLocaleString()}</TableCell>
                                <TableCell>Rp {rate.hourly_rate.toLocaleString()}</TableCell>
                                <TableCell>{rate.daily_max_rate ? `Rp ${Number(rate.daily_max_rate).toLocaleString()}` : '-'}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Edit className="h-4 w-4" /> Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
