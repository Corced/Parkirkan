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
    Menu,
} from 'lucide-react';

interface SidebarProps {
    role: 'admin' | 'petugas' | 'owner';
    isCollapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ role, isCollapsed, onToggle }: SidebarProps) {
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
            { href: '/owner/transactions', label: 'Rekap Transaksi', icon: History },
        ],
    };

    const currentLinks = links[role];

    return (
        <div className={cn(
            "flex h-screen flex-col bg-[#0F172A] text-white shadow-xl transition-all duration-300 ease-in-out relative z-50",
            isCollapsed ? "w-24" : "w-72"
        )}>
            {/* Logo Section */}
            <div className={cn(
                "flex h-20 items-center justify-between border-b border-slate-800 transition-all duration-300 overflow-hidden",
                isCollapsed ? "px-6" : "px-8"
            )}>
                {!isCollapsed && <span className="text-2xl font-bold tracking-wider animate-in fade-in duration-300">PARKIRKAN</span>}
                <button
                    onClick={onToggle}
                    className={cn(
                        "flex items-center justify-center h-10 w-10 rounded-lg hover:bg-slate-800 transition-colors",
                        isCollapsed && "mx-auto"
                    )}
                >
                    <Menu className="h-6 w-6 text-slate-700" />
                </button>
            </div>

            {/* Navigation Section */}
            <nav className={cn(
                "flex-1 space-y-3 mt-4 overflow-y-auto overflow-x-hidden no-scrollbar transition-all duration-300",
                isCollapsed ? "p-4" : "p-6"
            )}>
                {currentLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-4 rounded-xl transition-all duration-200 border border-transparent group relative",
                                isCollapsed ? "justify-center p-0 h-14 w-full" : "px-4 py-3 text-sm font-semibold",
                                isActive
                                    ? "bg-[#2563EB] text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                    : "text-slate-700 hover:bg-slate-800/50 hover:text-white border-slate-800/50"
                            )}
                        >
                            <div className={cn(
                                "flex items-center justify-center h-12 w-12 rounded-lg border transition-colors shrink-0",
                                isActive ? "bg-white/20 border-white/30" : "bg-slate-800/50 border-slate-700"
                            )}>
                                <Icon className="h-5 w-5" />
                            </div>
                            {!isCollapsed && (
                                <span className="flex-1 whitespace-nowrap animate-in slide-in-from-left-2 duration-300">{link.label}</span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] shadow-xl border border-slate-700">
                                    {link.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Section */}
            <div className={cn(
                "border-t border-slate-800 bg-[#0B1120] transition-all duration-300",
                isCollapsed ? "p-4" : "p-6"
            )}>
                <Link
                    href="/login"
                    className={cn(
                        "flex items-center gap-4 rounded-xl transition-all hover:bg-red-500/10 active:scale-95 group relative",
                        isCollapsed ? "justify-center p-0 h-14 w-full" : "px-4 py-3 text-sm font-bold text-red-500"
                    )}
                >
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-500/10 border border-red-500/20 shrink-0">
                        <LogOut className="h-5 w-5 text-red-500" />
                    </div>
                    {!isCollapsed && <span className="text-xl animate-in slide-in-from-left-2 duration-300">Keluar</span>}

                    {/* Tooltip for collapsed logout */}
                    {isCollapsed && (
                        <div className="absolute left-full ml-4 px-3 py-2 bg-red-600 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] shadow-xl">
                            Keluar
                        </div>
                    )}
                </Link>
            </div>
        </div>
    );
}
