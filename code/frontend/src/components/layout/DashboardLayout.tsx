'use client';

import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ReactNode, useState, useEffect } from 'react';
import { User } from '@/types';

interface DashboardLayoutProps {
    children: ReactNode;
    role: 'superadmin' | 'admin' | 'petugas' | 'owner'; // Added superadmin
    userName: string;
}

export function DashboardLayout({ children, role: initialRole, userName: initialUserName }: DashboardLayoutProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [userName, setUserName] = useState(initialUserName);
    const [userRole, setUserRole] = useState(initialRole);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');

        if (userStr) {
            try {
                const user = JSON.parse(userStr) as User;
                if (user.name) setUserName(user.name);
                if (user.role) setUserRole(user.role as any);
            } catch (error) {
                console.error('Error parsing user:', error);
            }
        } else if (storedRole) {
            setUserRole(storedRole as any);
        }
    }, []);

    return (
        <div className="flex h-screen bg-[#E5EDFB]">
            <Sidebar
                role={userRole}
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar userName={userName} userRole={userRole} />
                <main className="flex-1 overflow-y-auto p-8 lg:p-12 text-black">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
