'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, MapPin, TrendingUp } from "lucide-react";
import { dashboardService } from '@/lib/api';
import { OwnerStats } from '@/types';

export default function OwnerDashboard() {
    const [stats, setStats] = useState<OwnerStats>({
        monthly_revenue: 0,
        occupancy_rate: 0,
        total_transactions: 0
    });

    useEffect(() => {
        dashboardService.getOwnerStats().then(setStats).catch(console.error);
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Owner Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pendapatan (Bulan Ini)</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp {Number(stats.monthly_revenue).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Detailed revenue report</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Okupansi Parkir</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.round(stats.occupancy_rate || 0)}%</div>
                        <p className="text-xs text-muted-foreground">Average capacity usage</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_transactions}</div>
                        <p className="text-xs text-muted-foreground">Lifetime transactions</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Overview Pendapatan Tahunan</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="flex h-[350px] items-center justify-center rounded-md bg-muted/20">
                        <span className="text-muted-foreground">Chart Pendapatan Visualization (Requires Chart.js)</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
