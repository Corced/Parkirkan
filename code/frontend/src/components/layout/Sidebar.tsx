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
} from 'lucide-react';

interface SidebarProps {
    role: 'admin' | 'petugas' | 'owner';
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();

    const links = {
        admin: [
            { href: '/admin/dashboard', label: 'Beranda', icon: LayoutDashboard },
            { href: '/admin/users', label: 'Kelola User', icon: Users },
            { href: '/admin/rates', label: 'Tarif Parkir', icon: CreditCard },
            { href: '/admin/area', label: 'Area Parkir', icon: MapPin },
            { href: '/admin/vehicles', label: 'Data Kendaraan', icon: Car },
            { href: '/admin/logs', label: 'Log Aktivitas', icon: FileText },
        ],
        petugas: [
            { href: '/petugas/dashboard', label: 'Beranda', icon: LayoutDashboard },
            { href: '/petugas/check-in', label: 'Check-In', icon: LogIn },
            { href: '/petugas/check-out', label: 'Check-Out', icon: LogOut },
            { href: '/petugas/parked', label: 'Kendaraan Terparkir', icon: Car },
        ],
        owner: [
            { href: '/owner/dashboard', label: 'Beranda', icon: LayoutDashboard },
            { href: '/owner/area', label: 'Area Parkir', icon: MapPin },
            { href: '/owner/vehicles', label: 'Data Kendaraan', icon: Car },
            { href: '/owner/transactions', label: 'Rekap Transaksi', icon: History },
        ],
    };

    const currentLinks = links[role];

    return (
        <div className="flex h-screen w-72 flex-col bg-[#0F172A] text-white shadow-xl">
            {/* Logo Section */}
            <div className="flex h-20 items-center border-b border-slate-800 px-8">
                <span className="text-2xl font-bold tracking-wider">PARKIRKAN</span>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 space-y-3 p-6 mt-4">
                {currentLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 border border-transparent shadow-sm",
                                isActive
                                    ? "bg-[#2563EB] text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white border-slate-800/50"
                            )}
                        >
                            <div className={cn(
                                "flex items-center justify-center h-10 w-10 rounded-lg border transition-colors",
                                isActive ? "bg-white/20 border-white/30" : "bg-slate-800/50 border-slate-700"
                            )}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <span className="flex-1">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Section */}
            <div className="p-6 border-t border-slate-800 bg-[#0B1120]">
                <Link
                    href="/login"
                    className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition-all hover:bg-red-500/10 active:scale-95"
                >
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-red-500/10 border border-red-500/20">
                        <LogOut className="h-5 w-5" />
                    </div>
                    <span className="text-xl">Keluar</span>
                </Link>
            </div>
        </div>
    );
}
