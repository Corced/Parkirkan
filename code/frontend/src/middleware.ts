import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('role')?.value;
    
    const { pathname } = request.nextUrl;

    // 1. If trying to access login page, but already logged in -> redirect to respective dashboard
    if (pathname === '/login' && token && role) {
        const dashboardRole = role === 'superadmin' ? 'admin' : role;
        return NextResponse.redirect(new URL(`/${dashboardRole}/dashboard`, request.url));
    }

    // 2. Protect specific routes based on role
    if (pathname.startsWith('/admin') || pathname.startsWith('/petugas') || pathname.startsWith('/owner')) {
        
        // If not logged in at all, redirect to login
        if (!token || !role) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // 3. User is logged in, but check if they are trying to access another role's route
        const expectedRole = pathname.split('/')[1]; // e.g., 'admin', 'petugas', 'owner'
        
        // Role check setup:
        // Admin gets unrestricted access to all routes for management if needed.
        if (role === 'admin' || role === 'superadmin') {
             return NextResponse.next();
        }

        // Petugas and Owner get strict matching:
        if (role !== expectedRole) {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/admin/:path*', '/petugas/:path*', '/owner/:path*', '/login'],
};
