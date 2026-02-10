


import { NotificationBell } from './NotificationBell';

export function Navbar({ userName }: { userName: string }) {
    return (
        <header className="flex h-20 items-center justify-between px-8 lg:px-12 bg-transparent">
            {/* Optional Search Bar or context info */}
            <div className="flex items-center flex-1 max-w-md">
                {/* Placeholder if needed */}
            </div>

            <div className="flex items-center gap-6">
                <NotificationBell />
                <div className="flex items-center gap-4 pl-4 border-l border-slate-300">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-slate-900 leading-none">{userName}</span>
                        <span className="text-xs font-bold text-blue-600 mt-1 uppercase">Administrator</span>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400">
                        <div className="h-8 w-8 rounded-full bg-slate-100" />
                    </div>
                </div>
            </div>
        </header>
    );
}
