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
import { Badge } from "@/components/ui/badge";
import { vehicleService } from "@/lib/api";
import { ParkedVehicle } from "@/types";

export default function ParkedVehiclesPage() {
    const [parkedVehicles, setParkedVehicles] = useState<ParkedVehicle[]>([]);

    useEffect(() => {
        vehicleService.getParked().then(data => {
            if (Array.isArray(data)) setParkedVehicles(data);
        }).catch(console.error);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Kendaraan Terparkir</h1>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>No Tiket</TableHead>
                            <TableHead>Plat Nomor</TableHead>
                            <TableHead>Jenis</TableHead>
                            <TableHead>Waktu Masuk</TableHead>
                            <TableHead>Area</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {parkedVehicles.map((t) => (
                            <TableRow key={t.id}>
                                <TableCell className="font-mono">{t.ticket_number}</TableCell>
                                <TableCell className="font-bold">{t.vehicle?.license_plate}</TableCell>
                                <TableCell className="capitalize">{t.vehicle?.vehicle_type}</TableCell>
                                <TableCell>{new Date(t.check_in_time).toLocaleString()}</TableCell>
                                <TableCell>{t.area?.name || '-'}</TableCell>
                                <TableCell>
                                    <Badge className="bg-green-600 hover:bg-green-700">Parked</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        {parkedVehicles.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    Tidak ada kendaraan terparkir.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
