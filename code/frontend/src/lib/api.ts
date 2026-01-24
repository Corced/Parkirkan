import {
    User,
    Transaction,
    AdminStats,
    PetugasStats,
    OwnerStats,
    LoginCredentials,
    AuthResponse,
    Vehicle,
    ParkedVehicle,
    ParkingArea
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {}),
    } as HeadersInit;

    // Add auth token if available (simple localStorage implementation)
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            (headers as any)['Authorization'] = `Bearer ${token}`; // Simplified typing for now
        }
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.message || 'API Request Failed');
    }

    // Handle 204 No Content
    if (res.status === 204) return null as T;

    return res.json();
}

// Service methods
export const authService = {
    login: (credentials: LoginCredentials) => fetchAPI<AuthResponse>('/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    logout: () => fetchAPI<{ message: string }>('/logout', { method: 'POST' }),
    user: () => fetchAPI<User>('/user'),
};

export const userService = {
    getAll: () => fetchAPI<User[]>('/users'),
    create: (data: Partial<User>) => fetchAPI<User>('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number | string, data: Partial<User>) => fetchAPI<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number | string) => fetchAPI<void>(`/users/${id}`, { method: 'DELETE' }),
};

export const dashboardService = {
    getAdminStats: () => fetchAPI<AdminStats>('/dashboard/admin'),
    getPetugasStats: () => fetchAPI<PetugasStats>('/dashboard/petugas'),
    getOwnerStats: () => fetchAPI<OwnerStats>('/dashboard/owner'),
};

export const vehicleService = {
    checkIn: (data: { license_plate: string; vehicle_type: string; area_id: number }) =>
        fetchAPI<Transaction>('/vehicles/check-in', { method: 'POST', body: JSON.stringify(data) }),
    checkOut: (data: { ticket_number: string }) =>
        fetchAPI<Transaction>('/vehicles/check-out', { method: 'POST', body: JSON.stringify(data) }),
    getParked: () => fetchAPI<Transaction[]>('/vehicles/parked'),
    getHistory: () => fetchAPI<Vehicle[]>('/vehicles'),
};

export const transactionService = {
    getAll: () => fetchAPI<Transaction[]>('/transactions'),
};
