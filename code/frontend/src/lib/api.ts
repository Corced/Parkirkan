import {
    User,
    Transaction,
    AdminStats,
    PetugasStats,
    OwnerStats,
    LoginCredentials,
    AuthResponse,
    Vehicle,
    ActivityLog,
    ParkingArea,
    ParkingRate,
    SearchParkedResponse
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    // Add auth token if available (simple localStorage implementation)
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
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
    checkIn: (data: { license_plate: string; vehicle_type: string; area_id: number; owner_name?: string; owner_phone?: string }) =>
        fetchAPI<Transaction>('/vehicles/check-in', { method: 'POST', body: JSON.stringify(data) }),
    checkOut: (data: { ticket_number: string }) =>
        fetchAPI<Transaction>('/vehicles/check-out', { method: 'POST', body: JSON.stringify(data) }),
    getParked: () => fetchAPI<Transaction[]>('/vehicles/parked'),
    searchParked: (license_plate: string) => fetchAPI<SearchParkedResponse>(`/vehicles/search-parked?license_plate=${license_plate}`),
    getHistory: () => fetchAPI<Vehicle[]>('/vehicles'),
    update: (id: number | string, data: Partial<Vehicle>) => fetchAPI<Vehicle>(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number | string) => fetchAPI<void>(`/vehicles/${id}`, { method: 'DELETE' }),
};

export const areaService = {
    getAll: () => fetchAPI<ParkingArea[]>('/areas'),
    create: (data: Partial<ParkingArea>) => fetchAPI<ParkingArea>('/areas', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number | string, data: Partial<ParkingArea>) => fetchAPI<ParkingArea>(`/areas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number | string) => fetchAPI<void>(`/areas/${id}`, { method: 'DELETE' }),
};

export const logService = {
    getAll: () => fetchAPI<{ data: ActivityLog[] }>('/logs'), // Paginated response
};

export const transactionService = {
    getAll: () => fetchAPI<Transaction[]>('/transactions'),
};

export const rateService = {
    getAll: () => fetchAPI<ParkingRate[]>('/rates'),
    create: (data: Partial<ParkingRate>) => fetchAPI<ParkingRate>('/rates', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number | string, data: Partial<ParkingRate>) => fetchAPI<ParkingRate>(`/rates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number | string) => fetchAPI<void>(`/rates/${id}`, { method: 'DELETE' }),
};

// Simulation Service
export const simulationService = {
    simulateShift: (shift: string) => fetchAPI<{ message: string; generated_transactions: number }>('/simulate/shift', {
        method: 'POST',
        body: JSON.stringify({ shift })
    }),
};

// Shift Service
export const shiftService = {
    start: (shift_type: string) => fetchAPI<{ message: string; shift_type: string; started_at: string }>('/shifts/start', {
        method: 'POST',
        body: JSON.stringify({ shift_type })
    }),
    end: (shift_type: string, transaction_count?: number) => fetchAPI<{ message: string; transaction_count: number }>('/shifts/end', {
        method: 'POST',
        body: JSON.stringify({ shift_type, transaction_count })
    }),
};
