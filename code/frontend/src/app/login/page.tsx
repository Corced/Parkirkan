'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { authService } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const emailInput = document.getElementById('email') as HTMLInputElement;
            const passwordInput = document.getElementById('password') as HTMLInputElement;

            const data = await authService.login({
                email: emailInput.value,
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
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Masuk ke Parkirkan</CardTitle>
                    <CardDescription>
                        Masukkan kredensial Anda untuk mengakses dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="nama@contoh.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Masuk
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/" className="text-sm text-muted-foreground hover:underline">
                        Kembali ke Beranda
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
