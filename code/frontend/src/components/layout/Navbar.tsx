'use client';

import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Simplified Navbar without complex Dropdown for now
export function Navbar({ userName }: { userName: string }) {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">Dashboard</h2>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Bell className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        <User className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{userName}</span>
                </div>
            </div>
        </header>
    );
}
