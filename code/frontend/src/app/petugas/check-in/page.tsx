'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer, Loader2 } from "lucide-react";
import { vehicleService } from "@/lib/api";
import { Transaction } from "@/types";

export default function CheckInPage() {
    const [loading, setLoading] = useState(false);
    const [ticket, setTicket] = useState<Transaction | null>(null);
    const [selectedType, setSelectedType] = useState('motor');

    const handleCheckIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const plateInput = document.getElementById('plate') as HTMLInputElement;
            const data = {
                license_plate: plateInput.value,
                vehicle_type: selectedType,
                area_id: 1, // Defaulting to 1 for simplicity, should be selected
            };
            const res = await vehicleService.checkIn(data);
            setTicket(res);
            alert('Check-in Successful! Ticket: ' + res.ticket_number);
        } catch (error: any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            alert('Check-in Failed: ' + (error as any).message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Check-In Kendaraan</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCheckIn} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="plate">Nomor Plat Kendaraan</Label>
                            <Input id="plate" placeholder="Contoh: B 1234 ABC" className="text-lg uppercase" required />
                        </div>

                        <div className="space-y-2">
                            <Label>Jenis Kendaraan</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {['motor', 'mobil', 'truck'].map((type) => (
                                    <div
                                        key={type}
                                        onClick={() => setSelectedType(type)}
                                        className={`cursor-pointer rounded-md border p-4 text-center hover:bg-muted active:bg-primary/20 ${selectedType === type ? 'ring-2 ring-primary bg-primary/10' : ''}`}
                                    >
                                        <span className="font-semibold capitalize">{type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="photo">Foto Kendaraan (Opsional)</Label>
                            <div className="h-32 w-full rounded-md border border-dashed flex items-center justify-center text-muted-foreground bg-muted/20">
                                Kamera / Upload
                            </div>
                        </div>

                        <Button type="submit" className="w-full gap-2" disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
                            {loading ? 'Processing...' : 'Cetak Tiket'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Visual Feedback for Ticket, could be a modal */}
            {ticket && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" onClick={() => setTicket(null)}>
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-2">Tiket Parkir</h3>
                        <p className="font-mono text-2xl">{ticket.ticket_number}</p>
                        <p className="mt-2 text-sm text-gray-500">Silakan cetak tiket ini.</p>
                        <Button className="mt-4" onClick={() => setTicket(null)}>Tutup</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
