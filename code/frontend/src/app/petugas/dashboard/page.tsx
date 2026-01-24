'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { dashboardService } from "@/lib/api";

export default function PetugasDashboard() {
    const [stats, setStats] = useState({
        parked_vehicles: 0,
        today_transactions: 0
    });

    useEffect(() => {
        dashboardService.getPetugasStats().then(setStats).catch(console.error);
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Petugas Dashboard</h1>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Link href="/petugas/check-in">
                    <Card className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xl">Check-In Kendaraan</CardTitle>
                            <LogIn className="h-8 w-8" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm opacity-90">Catat kendaraan masuk dan cetak tiket.</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/petugas/check-out">
                    <Card className="bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xl">Check-Out Kendaraan</CardTitle>
                            <LogOut className="h-8 w-8" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm opacity-90">Scan tiket, hitung tarif dan pembayaran.</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle>Cari Kendaraan Terparkir</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Input placeholder="Masukkan Nomor Plat..." />
                            <Button>
                                <Search className="mr-2 h-4 w-4" /> Cari
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Shift Info</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm">
                            <p className="mb-1"><strong>Shift:</strong> Pagi (07:00 - 15:00)</p>
                            <p className="mb-1"><strong>Petugas:</strong> Budi Santoso</p>
                            <p><strong>Lokasi:</strong> Gerbang Utama</p>
                            <div className="mt-4 border-t pt-2">
                                <p><strong>Kendaraan Terparkir:</strong> {stats.parked_vehicles}</p>
                                <p><strong>Transaksi Hari Ini:</strong> {stats.today_transactions}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
