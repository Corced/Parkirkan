'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Receipt, Search, Loader2 } from "lucide-react";
import { vehicleService } from "@/lib/api";
import { Transaction } from "@/types";

export default function CheckOutPage() {
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState<Transaction | null>(null);

    const handleScan = async () => {
        setLoading(true);
        try {
            const ticketInput = document.getElementById('ticket') as HTMLInputElement;
            const data = { ticket_number: ticketInput.value };
            const res = await vehicleService.checkOut(data);
            setTransaction(res);
        } catch (error: any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            alert('Check-out Failed: ' + (error as any).message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 lg:flex-row">
            {/* Scanner Section */}
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Check-Out / Pembayaran</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="ticket">Scan Barcode / Input No Tiket</Label>
                        <div className="flex gap-2">
                            <Input id="ticket" placeholder="T-XXXXX" />
                            <Button variant="secondary" onClick={handleScan} disabled={loading}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detail & Payment - Shown after successful checkout (or pre-calc if API supported it) */}
            {transaction && (
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Rincian Pembayaran</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <span className="text-muted-foreground">Plat Nomor:</span>
                            <span className="font-bold">{transaction.vehicle?.license_plate || '-'}</span>

                            <span className="text-muted-foreground">Masuk:</span>
                            <span>{new Date(transaction.check_in_time).toLocaleTimeString()}</span>

                            <span className="text-muted-foreground">Keluar:</span>
                            <span>{transaction.check_out_time ? new Date(transaction.check_out_time).toLocaleTimeString() : '-'}</span>

                            <span className="text-muted-foreground">Durasi:</span>
                            <span>{transaction.duration_hours} Jam</span>
                        </div>
                        <div className="border-t pt-4">
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total Biaya</span>
                                <span>Rp {Number(transaction.total_cost).toLocaleString()}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button className="w-full gap-2 text-lg h-12">
                            <Receipt className="h-4 w-4" /> Cetak Struk
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
