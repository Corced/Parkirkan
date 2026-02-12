'use client';

import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ReactNode, useState, useEffect } from 'react';
import { User } from '@/types';

interface DashboardLayoutProps {
    children: ReactNode;
    role: 'admin' | 'petugas' | 'owner';
    userName: string;
}

export function DashboardLayout({ children, role, userName: initialUserName }: DashboardLayoutProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [userName, setUserName] = useState(initialUserName);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr) as User;
                if (user.name) {
                    setUserName(user.name);
                }
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
            }
        }
    }, []);

    return (
        <div className="flex h-screen bg-[#E5EDFB]">
            <Sidebar
                role={role}
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar userName={userName} userRole={role} />
                <main className="flex-1 overflow-y-auto p-8 lg:p-12 text-black">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
