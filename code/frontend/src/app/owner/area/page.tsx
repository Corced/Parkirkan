'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAPI } from "@/lib/api";
import { ParkingArea } from "@/types";

export default function AreaParkirPage() {
    const [areas, setAreas] = useState<ParkingArea[]>([]);

    useEffect(() => {
        fetchAPI<ParkingArea[]>('/areas').then(data => {
            if (Array.isArray(data)) setAreas(data);
        }).catch(console.error);
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Area Parkir</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {areas.map((area) => {
                    const percentage = area.total_capacity > 0
                        ? Math.round((area.occupied_slots / area.total_capacity) * 100)
                        : 0;

                    return (
                        <Card key={area.id}>
                            <CardHeader>
                                <CardTitle>{area.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span>Kapasitas: {area.total_capacity}</span>
                                    <span>Terisi: {area.occupied_slots}</span>
                                </div>
                                {/* Custom Progress Bar */}
                                <div className="h-4 w-full rounded-full bg-secondary">
                                    <div
                                        className="h-full rounded-full bg-primary transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground text-center">{percentage}% Terisi</p>

                                <div className="pt-4 border-t text-sm font-medium capitalize">
                                    Kode: {area.code}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
}
