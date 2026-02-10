'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { logService } from '@/lib/api';
import { cn } from '@/lib/utils';

import { ActivityLog } from '@/types';

export function NotificationBell() {
    const [notifications, setNotifications] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await logService.getAll();
            const logs = response.data || [];
            // Get latest 10 logs
            setNotifications(logs.slice(0, 10));
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const unreadCount = notifications.length > 0 ? Math.min(notifications.length, 9) : 0;

    const getActionColor = (action: string) => {
        if (action.includes('SHIFT_START')) return 'text-emerald-600 bg-emerald-50';
        if (action.includes('SHIFT_END')) return 'text-blue-600 bg-blue-50';
        if (action.includes('CHECK_IN')) return 'text-purple-600 bg-purple-50';
        if (action.includes('CHECK_OUT')) return 'text-orange-600 bg-orange-50';
        if (action.includes('USER')) return 'text-red-600 bg-red-50';
        return 'text-slate-600 bg-slate-50';
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-slate-800 hover:bg-white hover:shadow-sm relative"
                >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
                <div className="p-4 border-b bg-slate-50">
                    <h4 className="font-bold text-black">Notifikasi Aktivitas</h4>
                    <p className="text-xs text-slate-800 mt-1">Riwayat aktivitas terbaru</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center text-slate-800">Loading...</div>
                    ) : notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-800">Tidak ada notifikasi</div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className={cn(
                                            "px-2 py-1 rounded-md text-[10px] font-bold uppercase shrink-0",
                                            getActionColor(notif.action)
                                        )}>
                                            {notif.action.replace('_', ' ')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-black font-medium line-clamp-2">
                                                {notif.description}
                                            </p>
                                            <p className="text-xs text-slate-800 mt-1">
                                                {new Date(notif.created_at).toLocaleString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
