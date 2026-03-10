'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';
import FadeIn from '@/components/motion/FadeIn';

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-[#D8E6FF] p-6">
            <div className="w-full max-w-md space-y-8 text-center">
                <FadeIn direction="down" duration={0.6}>
                    <div className="flex justify-center mb-6">
                        <div className="bg-red-100 p-4 rounded-full">
                            <AlertTriangle className="h-16 w-16 text-red-600" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black text-black tracking-tighter">403</h1>
                        <p className="text-xl font-black text-black tracking-tight uppercase">TIDAK DIIZINKAN</p>
                    </div>
                </FadeIn>

                <FadeIn direction="up" delay={0.2} duration={0.6}>
                    <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden mt-8">
                        <CardContent className="px-10 py-12 space-y-8">
                            <p className="text-lg text-slate-700 font-medium">
                                Anda tidak memiliki akses ke halaman ini.
                            </p>
                            
                            <Link href="/" passHref className="block">
                                <Button className="w-full h-14 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-500/30 transition-all active:scale-95">
                                    <Home className="mr-2 h-5 w-5" />
                                    Kembali ke Beranda
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </FadeIn>
            </div>
        </div>
    );
}
