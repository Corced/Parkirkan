import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
    children: ReactNode;
    role: 'admin' | 'petugas' | 'owner';
    userName: string; // Passed from page for now
}

export function DashboardLayout({ children, role, userName }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen bg-muted/40">
            <Sidebar role={role} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar userName={userName} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
