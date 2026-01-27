export type Role = "admin" | "petugas" | "owner";

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: Role;
    is_active: boolean | number; // API might return 1/0
    created_at: string;
    updated_at: string;
}

export interface Vehicle {
    id: number;
    license_plate: string;
    vehicle_type: string;
    owner_name?: string;
    owner_phone?: string;
    total_visits: number;
    last_visit: string;
    created_at: string;
    updated_at: string;
}

// Response structure for Parked Vehicle (joined with Transaction)
export interface ParkedVehicle extends Transaction {
    vehicle?: Vehicle;
    area?: ParkingArea;
}

export interface Transaction {
    id: number;
    vehicle_id: number;
    area_id: number;
    rate_id: number;
    officer_id: number;
    ticket_number: string;
    check_in_time: string;
    check_out_time?: string;
    duration_hours?: number;
    total_cost?: number;
    payment_status: "pending" | "paid";
    status: "active" | "completed";
    created_at: string;
    updated_at: string;

    // Relationships
    vehicle?: Vehicle;
    area?: ParkingArea;
    rate?: ParkingRate;
    officer?: User;
}

export interface ParkingRate {
    id: number;
    vehicle_type: string;
    icon?: string;
    hourly_rate: number;
    daily_max_rate: number;
    created_at: string;
    updated_at: string;
}

export interface ParkingArea {
    id: number;
    name: string;
    code: string;
    total_capacity: number;
    occupied_slots: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ActivityLog {
    id: number | string;
    userId: number | string;
    userName?: string;
    user?: User;
    action: string;
    details: string;
    timestamp: string;
    created_at: string; // for compatibility
    type: "info" | "warning" | "error";
    description?: string; // for compatibility
}

// Dashboard Stats Interfaces
export interface AdminStats {
    total_revenue: number;
    total_users: number;
    parked_vehicles: number;
    active_parked_count: number;
}

export interface PetugasStats {
    parked_vehicles: number;
    today_transactions: number;
}

export interface OwnerStats {
    monthly_revenue: number;
    occupancy_rate: number;
    total_transactions: number;
    occupancy_data?: { name: string; value: number }[]; // For charts if needed
    revenue_data?: { name: string; value: number }[];
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface LoginCredentials {
    email?: string;
    password?: string;
}
