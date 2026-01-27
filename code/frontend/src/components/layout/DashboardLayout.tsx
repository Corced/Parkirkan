'use client';

import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ReactNode, useState } from 'react';

interface DashboardLayoutProps {
    children: ReactNode;
    role: 'admin' | 'petugas' | 'owner';
    userName: string;
}

export function DashboardLayout({ children, role, userName }: DashboardLayoutProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-[#E5EDFB]">
            <Sidebar
                role={role}
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar userName={userName} />
                <main className="flex-1 overflow-y-auto p-8 lg:p-12 text-slate-900">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
