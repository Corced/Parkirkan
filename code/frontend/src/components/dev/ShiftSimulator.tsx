'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { simulationService } from '@/lib/api';
import { 
    Play, Loader2, Sun, Moon, CloudSun, 
    ShieldCheck, UserCog, Clock, CalendarDays,
    Sunrise, Clock9
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShiftSimulatorProps {
    onSimulationComplete: () => void;
}

const roles = [
    { id: 'petugas', label: 'Petugas', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'admin', label: 'Admin', icon: UserCog, color: 'text-blue-600', bg: 'bg-blue-50' },
];

const scenarios = [
    { id: 'morning', label: 'Pagi (08:00)', icon: CloudSun },
    { id: 'noon', label: 'Siang (12:00)', icon: Sun },
    { id: 'evening', label: 'Sore (17:00)', icon: Sunrise },
    { id: 'night', label: 'Malam (21:00)', icon: Moon },
    { id: 'overnight', label: 'Menginap', icon: Clock9 },
    { id: 'yesterday', label: 'Kemarin', icon: CalendarDays },
];

export function ShiftSimulator({ onSimulationComplete }: ShiftSimulatorProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState('petugas');
    const [selectedScenario, setSelectedScenario] = useState('morning');

    const handleSimulate = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await simulationService.simulateShift({
                role: selectedRole,
                scenario: selectedScenario
            });
            setMessage(`${res.message}. ${res.generated_transactions} Transaksi aktif dibuat.`);
            onSimulationComplete();
        } catch (error) {
            console.error(error);
            setMessage("Gagal mensimulasikan shift.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-blue-100 bg-blue-50/30 overflow-hidden">
            <CardHeader className="pb-3 bg-blue-50/50 border-b border-blue-100/50">
                <CardTitle className="text-lg font-black text-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Play className="h-5 w-5 text-blue-600 fill-blue-600" />
                        Simulator Data Dinamis (Dev)
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
                <div className="space-y-6">
                    {/* Role Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-400">Pilih Aktor (Bisa Gantian)</label>
                        <div className="grid grid-cols-2 gap-2">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRole(role.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200",
                                        selectedRole === role.id 
                                            ? "border-blue-500 bg-white shadow-md ring-4 ring-blue-500/10" 
                                            : "border-slate-100 bg-slate-50/50 text-slate-400 hover:bg-white hover:border-slate-200"
                                    )}
                                >
                                    <role.icon className={cn("h-6 w-6", selectedRole === role.id ? role.color : "text-slate-300")} />
                                    <span className="text-sm font-bold">{role.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scenario Selection */}
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-400">Skenario Waktu Masuk</label>
                        <div className="grid grid-cols-3 gap-2">
                            {scenarios.map((scene) => (
                                <button
                                    key={scene.id}
                                    onClick={() => setSelectedScenario(scene.id)}
                                    className={cn(
                                        "flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all text-center",
                                        selectedScenario === scene.id 
                                            ? "border-orange-400 bg-white shadow-sm ring-4 ring-orange-400/10" 
                                            : "border-slate-100 bg-slate-50/50 text-slate-400 hover:border-orange-200"
                                    )}
                                >
                                    <scene.icon className={cn("h-5 w-5", selectedScenario === scene.id ? "text-orange-500" : "text-slate-300")} />
                                    <span className="text-[10px] font-black">{scene.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-6 rounded-xl shadow-lg shadow-blue-600/20"
                        onClick={handleSimulate}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <Play className="mr-2 h-5 w-5 fill-white" />
                        )}
                        Simulasikan Kedatangan
                    </Button>

                    {message && (
                        <div className="text-xs font-bold text-center text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200 animate-in fade-in slide-in-from-top-2">
                            {message}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
