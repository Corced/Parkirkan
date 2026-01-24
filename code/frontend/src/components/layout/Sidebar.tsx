'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    Car,
    FileText,
    CreditCard,
    LogOut,
    MapPin,
    History,
    LogIn,
    LogOut as LogOutIcon, // Check-out icon alias
} from 'lucide-react';

interface SidebarProps {
    role: 'admin' | 'petugas' | 'owner';
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();

    const links = {
        admin: [
            { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/admin/users', label: 'Kelola User', icon: Users },
            { href: '/admin/rates', label: 'Tarif Parkir', icon: CreditCard },
            { href: '/admin/logs', label: 'Log Aktivitas', icon: FileText },
        ],
        petugas: [
            { href: '/petugas/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/petugas/check-in', label: 'Check-In', icon: LogIn },
            { href: '/petugas/check-out', label: 'Check-Out', icon: LogOutIcon },
            { href: '/petugas/parked', label: 'Kendaraan Terparkir', icon: Car },
        ],
        owner: [
            { href: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { href: '/owner/area', label: 'Area Parkir', icon: MapPin },
            { href: '/owner/vehicles', label: 'Data Kendaraan', icon: Car },
            { href: '/owner/transactions', label: 'Rekap Transaksi', icon: History },
        ],
    };

    const currentLinks = links[role];

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-card">
            <div className="flex h-16 items-center justify-center border-b px-6">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">PARKIRKAN</span>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {currentLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t p-4">
                <Link
                    href="/login"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Link>
            </div>
        </div>
    );
}
