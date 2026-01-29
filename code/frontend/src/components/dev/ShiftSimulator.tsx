'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { simulationService } from '@/lib/api';
import { Play, Loader2, Sun, Moon, CloudSun } from "lucide-react";

interface ShiftSimulatorProps {
    onSimulationComplete: () => void;
}

export function ShiftSimulator({ onSimulationComplete }: ShiftSimulatorProps) {
    const [loading, setLoading] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleSimulate = async (shift: string) => {
        setLoading(shift);
        setMessage(null);
        try {
            const res = await simulationService.simulateShift(shift);
            setMessage(`${res.message}. ${res.generated_transactions} Transaksi dibuat.`);
            onSimulationComplete();
        } catch (error) {
            console.error(error);
            setMessage("Gagal mensimulasikan shift.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <Card className="border-blue-100 bg-blue-50/50">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Play className="h-4 w-4 text-blue-600" />
                    Simulasi Operasional (Dev)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        Generate transaksi dummy dan notifikasi untuk mencoba fitur dashboard.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            className="bg-white border-blue-200 text-slate-700 hover:bg-blue-100 hover:text-blue-700 font-semibold"
                            onClick={() => handleSimulate('Pagi')}
                            disabled={!!loading}
                        >
                            {loading === 'Pagi' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CloudSun className="mr-2 h-4 w-4 text-orange-400" />}
                            Shift Pagi
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-white border-blue-200 text-slate-700 hover:bg-blue-100 hover:text-blue-700 font-semibold"
                            onClick={() => handleSimulate('Siang')}
                            disabled={!!loading}
                        >
                            {loading === 'Siang' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sun className="mr-2 h-4 w-4 text-yellow-500" />}
                            Shift Siang
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-white border-blue-200 text-slate-700 hover:bg-blue-100 hover:text-blue-700 font-semibold"
                            onClick={() => handleSimulate('Malam')}
                            disabled={!!loading}
                        >
                            {loading === 'Malam' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Moon className="mr-2 h-4 w-4 text-indigo-500" />}
                            Shift Malam
                        </Button>
                    </div>
                    {message && (
                        <div className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                            {message}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
