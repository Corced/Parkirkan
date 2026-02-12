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
import { vehicleService } from "@/lib/api";
import { Vehicle } from "@/types";

export default function VehicleHistoryPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        vehicleService.getHistory().then(data => {
            if (Array.isArray(data)) setVehicles(data);
        }).catch(console.error);
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Data Kendaraan</h1>
            <p className="text-muted-foreground">Riwayat semua kendaraan yang pernah masuk.</p>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Plat Nomor</TableHead>
                            <TableHead>Jenis</TableHead>
                            <TableHead>Total Kunjungan</TableHead>
                            <TableHead>Terakhir Berkunjung</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vehicles.map((vehicle) => (
                            <TableRow key={vehicle.id}>
                                <TableCell className="font-bold">{vehicle.license_plate}</TableCell>
                                <TableCell className="capitalize">{vehicle.vehicle_type}</TableCell>
                                <TableCell>{vehicle.total_visits}</TableCell>
                                <TableCell>{new Date(vehicle.last_visit).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                        {vehicles.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    No vehicle history found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
