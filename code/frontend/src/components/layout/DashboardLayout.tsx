import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
    children: ReactNode;
    role: 'admin' | 'petugas' | 'owner';
    userName: string;
}

export function DashboardLayout({ children, role, userName }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen bg-[#E5EDFB]">
            <Sidebar role={role} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar userName={userName} />
                <main className="flex-1 overflow-y-auto p-8 lg:p-12">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
