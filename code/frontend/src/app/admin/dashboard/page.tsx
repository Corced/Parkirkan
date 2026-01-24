'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Car, CreditCard, Activity } from "lucide-react";
import { dashboardService, transactionService } from "@/lib/api";
import { AdminStats, Transaction } from '@/types';

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats>({
        total_revenue: 0,
        total_users: 0,
        parked_vehicles: 0,
        active_parked_count: 0
    });
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        dashboardService.getAdminStats().then(data => {
            setStats(prev => ({ ...prev, ...data }));
        }).catch(console.error);

        transactionService.getAll().then(data => {
            if (Array.isArray(data)) setRecentTransactions(data.slice(0, 5));
        }).catch(console.error);
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp {Number(stats.total_revenue).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total accumulated</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_users}</div>
                        <p className="text-xs text-muted-foreground">Registered users</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vehicles Parked</CardTitle>
                        <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active_parked_count}</div>
                        <p className="text-xs text-muted-foreground">Currently in area</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Online</div>
                        <p className="text-xs text-muted-foreground">Backend Connected</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity or Chart Placeholder */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="flex h-[300px] items-center justify-center rounded-md bg-muted/20">
                            <span className="text-muted-foreground">Chart Implementation Pending</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentTransactions.map(tr => (
                                <div key={tr.id} className="flex items-center">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{tr.ticket_number}</p>
                                        <p className="text-sm text-muted-foreground">{new Date(tr.created_at).toLocaleTimeString()}</p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        {tr.status === 'completed'
                                            ? `+Rp {Number(tr.total_cost).toLocaleString()}`
                                            : 'Active'}
                                    </div>
                                </div>
                            ))}
                            {recentTransactions.length === 0 && <p className="text-sm text-muted-foreground">No recent transactions.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
