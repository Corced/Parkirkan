'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { authService } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const usernameInput = document.getElementById('username') as HTMLInputElement;
            const passwordInput = document.getElementById('password') as HTMLInputElement;

            const data = await authService.login({
                login_id: usernameInput.value,
                password: passwordInput.value,
            });

            if (typeof window !== 'undefined') {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('role', data.user.role);
            }

            // Redirect based on role
            if (data.user.role === 'admin') router.push('/admin/dashboard');
            else if (data.user.role === 'petugas') router.push('/petugas/dashboard');
            else if (data.user.role === 'owner') router.push('/owner/dashboard');
        } catch (error: any) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            alert('Login failed: ' + (error as any).message || 'Unknown');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-[#D8E6FF] p-6">
            <div className="w-full max-w-md space-y-12 text-center pb-12">
                <div className="space-y-2">
                    <h1 className="text-6xl font-black text-black tracking-tighter">PARKIRKAN</h1>
                    <p className="text-lg font-black text-black tracking-tight uppercase">Masuk ke dashboard anda</p>
                </div>

                <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
                    <CardContent className="px-10 py-16 space-y-10">
                        <form onSubmit={handleLogin} className="space-y-10">
                            <div className="space-y-6 text-left">
                                <div className="space-y-3">
                                    <Label htmlFor="username" className="text-xl font-black text-black tracking-tight pl-1">Username/ID</Label>
                                    <Input
                                        id="username"
                                        className="h-16 rounded-2xl border-2 border-slate-900 bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] text-lg px-6 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-black"
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="password" title="password" className="text-xl font-black text-black tracking-tight pl-1">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        className="h-16 rounded-2xl border-2 border-slate-900 bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] text-lg px-6 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-black"
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-16 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-black text-xl shadow-xl shadow-blue-500/30 transition-all active:scale-95" disabled={loading}>
                                {loading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : null}
                                Masuk
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Link href="/" className="inline-block text-lg font-black text-black hover:text-blue-600 transition-colors tracking-tight uppercase">
                    ← Kembali ke landing page
                </Link>
            </div>
        </div>
    );
}
