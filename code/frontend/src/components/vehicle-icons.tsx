import React, { SVGProps } from 'react';
import { cn } from '@/lib/utils';

// ─── Scooter / Motor Matic ───
export function ScooterIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5" cy="17" r="3" />
            <circle cx="19" cy="17" r="3" />
            <path d="M7.5 14H14l1-4h3l2 7" />
            <path d="M5 14V9h4l2 5" />
            <path d="M9 9l1-4h3" />
        </svg>
    )
}

// ─── Sport Motorcycle ───
export function MotorSportIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5" cy="17" r="3" />
            <circle cx="19" cy="17" r="3" />
            <path d="M5 14l2-6h3l3 3h3l2-4h2" />
            <path d="M19 14l-2-4" />
            <path d="M10 11l-1 3" />
            <path d="M14 8l-1 3" />
        </svg>
    )
}

// ─── Sedan / Car ───
export function SedanIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1-1-1h-1l-1.7-5c-.3-.9-1-1.5-1.9-1.5H7.6c-.9 0-1.6.6-1.9 1.5L4 12H3c-.6 0-1 .4-1 1v3c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
        </svg>
    )
}

// ─── SUV / Large Car ───
export function SUVIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 17h14" />
            <path d="M19 17V9l-2-4H7L5 9v8" />
            <path d="M3 17h2" />
            <path d="M19 17h2" />
            <circle cx="7.5" cy="17" r="2" />
            <circle cx="16.5" cy="17" r="2" />
            <path d="M5 9h14" />
            <path d="M8 5v4" />
            <path d="M16 5v4" />
        </svg>
    )
}

// ─── Pickup Truck ───
export function PickupIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 17h1" />
            <path d="M13 17V6H3v11" />
            <path d="M13 9h4l3 4v4h1" />
            <circle cx="5" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
            <path d="M7 17h8" />
        </svg>
    )
}

// ─── Van / Minivan ───
export function VanIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 17V7a2 2 0 012-2h10l4 4v8" />
            <path d="M1 17h22" />
            <circle cx="6.5" cy="17" r="2.5" />
            <circle cx="17.5" cy="17" r="2.5" />
            <path d="M15 5v4h4" />
            <path d="M9 17h6" />
        </svg>
    )
}

// ─── Box Truck ───
export function BoxTruckIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 18V6a2 2 0 00-2-2H4a2 2 0 00-2 2v11a1 1 0 001 1h2" />
            <path d="M15 18h3a1 1 0 001-1V9l-3-3" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="17" cy="18" r="2" />
        </svg>
    )
}

// ─── Heavy Truck / Fuso ───
export function HeavyTruckIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="13" height="10" rx="1" />
            <path d="M14 8h4l3 3v3h-7" />
            <circle cx="5" cy="17" r="3" />
            <circle cx="18" cy="17" r="3" />
            <path d="M8 17h7" />
            <path d="M1 14h2" />
            <path d="M21 14h1" />
        </svg>
    )
}

// ─── Bus ───
export function BusIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 6v6" /><path d="M15 6v6" />
            <path d="M2 12h20v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5Z" />
            <path d="M2 7a2 2 0 012-2h16a2 2 0 012 2v5H2V7Z" />
            <path d="M6 19v2" /><path d="M18 19v2" />
        </svg>
    )
}

// ─── Minibus ───
export function MinibusIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 17V7a2 2 0 012-2h14a2 2 0 012 2v10" />
            <path d="M1 17h22" />
            <circle cx="6" cy="17" r="2" />
            <circle cx="18" cy="17" r="2" />
            <path d="M8 5v6" />
            <path d="M12 5v6" />
            <path d="M16 5v6" />
            <path d="M8 17h8" />
        </svg>
    )
}

// ─── Taxi ───
export function TaxiIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1-1-1h-1l-1.7-5c-.3-.9-1-1.5-1.9-1.5H7.6c-.9 0-1.6.6-1.9 1.5L4 12H3c-.6 0-1 .4-1 1v3c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
            <path d="M10 2h4v4h-4z" />
        </svg>
    )
}

// ─── Ambulance ───
export function AmbulanceIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 10H6" />
            <path d="M8 8v4" />
            <path d="M15 18h3a1 1 0 001-1V9l-3-3H3v11a1 1 0 001 1h3" />
            <circle cx="9.5" cy="18" r="2" />
            <circle cx="18.5" cy="18" r="2" />
            <path d="M17 6h-3V3" />
        </svg>
    )
}

// ─── Bicycle ───
export function BicycleIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5.5" cy="17.5" r="3.5" />
            <circle cx="18.5" cy="17.5" r="3.5" />
            <circle cx="15" cy="5" r="1" />
            <path d="M12 17.5V14l-3.5-3.5 2-1.5 4 4 2.5-2.5" />
        </svg>
    )
}

// ─── Tractor / Heavy Equipment ───
export function TractorIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 17h1" />
            <path d="M10 17V5h5v4h3l2 4v4" />
            <circle cx="6" cy="17" r="3" />
            <circle cx="17" cy="17" r="3" />
            <path d="M14 17h0" />
            <path d="M9 17h-1" />
        </svg>
    )
}

// ─── Three-Wheeler / Bajaj / Tuk-tuk ───
export function ThreeWheelerIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="17" r="3" />
            <circle cx="18" cy="17" r="2" />
            <path d="M6 14V7a1 1 0 011-1h6l3 4v4" />
            <path d="M9 17h7" />
            <path d="M3 17h0" />
        </svg>
    )
}

// ─── Electric Car / EV ───
export function EVCarIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1-1-1h-1l-1.7-5c-.3-.9-1-1.5-1.9-1.5H7.6c-.9 0-1.6.6-1.9 1.5L4 12H3c-.6 0-1 .4-1 1v3c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
            <path d="M11 1l1 3h-2l1 3" />
        </svg>
    )
}

// ─── Trailer ───
export function TrailerIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="6" width="15" height="10" rx="1" />
            <path d="M16 13h4l2 3v2h-6" />
            <circle cx="5" cy="18" r="2" />
            <circle cx="19" cy="18" r="2" />
            <path d="M7 18h10" />
        </svg>
    )
}

// ============================================================
// Vehicle Icon Registry
// ============================================================
export interface VehicleIconConfig {
    id: string;
    label: string;
    icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
}

export const vehicleIcons: VehicleIconConfig[] = [
    { id: 'scooter', label: 'Motor', icon: ScooterIcon },
    { id: 'motorsport', label: 'Motor Sport', icon: MotorSportIcon },
    { id: 'bicycle', label: 'Sepeda', icon: BicycleIcon },
    { id: 'sedan', label: 'Sedan', icon: SedanIcon },
    { id: 'suv', label: 'SUV', icon: SUVIcon },
    { id: 'taxi', label: 'Taxi', icon: TaxiIcon },
    { id: 'ev', label: 'Mobil Listrik', icon: EVCarIcon },
    { id: 'pickup', label: 'Pickup', icon: PickupIcon },
    { id: 'van', label: 'Van', icon: VanIcon },
    { id: 'minibus', label: 'Minibus', icon: MinibusIcon },
    { id: 'bus', label: 'Bus', icon: BusIcon },
    { id: 'truck', label: 'Truk Box', icon: BoxTruckIcon },
    { id: 'heavytruck', label: 'Truk Berat', icon: HeavyTruckIcon },
    { id: 'trailer', label: 'Trailer', icon: TrailerIcon },
    { id: 'threewheeler', label: 'Bajaj', icon: ThreeWheelerIcon },
    { id: 'tractor', label: 'Traktor', icon: TractorIcon },
    { id: 'ambulance', label: 'Ambulans', icon: AmbulanceIcon },
];

// Helper: resolve icon component by id, with fallback detection from vehicle_type string
export function getVehicleIcon(iconId?: string, vehicleType?: string): (props: SVGProps<SVGSVGElement>) => React.ReactElement {
    // Legacy alias map for backward compatibility with old icon IDs
    const legacyMap: Record<string, string> = {
        'bike': 'scooter',
        'car': 'sedan',
    };
    const resolvedId = iconId ? (legacyMap[iconId] || iconId) : iconId;

    // Direct match by id
    const byId = vehicleIcons.find(v => v.id === resolvedId);
    if (byId) return byId.icon;

    // Fallback: detect from vehicle_type string
    if (vehicleType) {
        const t = vehicleType.toLowerCase();
        if (t.includes('sport')) return MotorSportIcon;
        if (t.includes('motor') || t.includes('matic')) return ScooterIcon;
        if (t.includes('sepeda')) return BicycleIcon;
        if (t.includes('suv') || t.includes('fortuner') || t.includes('pajero')) return SUVIcon;
        if (t.includes('pickup') || t.includes('pick up')) return PickupIcon;
        if (t.includes('taxi')) return TaxiIcon;
        if (t.includes('listrik') || t.includes('ev') || t.includes('electric')) return EVCarIcon;
        if (t.includes('van') || t.includes('hiace') || t.includes('alphard')) return VanIcon;
        if (t.includes('minibus') || t.includes('elf')) return MinibusIcon;
        if (t.includes('bus')) return BusIcon;
        if (t.includes('trailer') || t.includes('tronton')) return TrailerIcon;
        if (t.includes('fuso') || t.includes('truk berat') || t.includes('heavy')) return HeavyTruckIcon;
        if (t.includes('truk') || t.includes('truck')) return BoxTruckIcon;
        if (t.includes('bajaj') || t.includes('tuk')) return ThreeWheelerIcon;
        if (t.includes('traktor') || t.includes('tractor')) return TractorIcon;
        if (t.includes('ambulan')) return AmbulanceIcon;
        if (t.includes('mobil') || t.includes('sedan') || t.includes('car')) return SedanIcon;
    }

    // Default
    return SedanIcon;
}

// Convenience component
export function VehicleIcon({ iconId, vehicleType, className }: { iconId?: string; vehicleType?: string; className?: string }) {
    const Icon = getVehicleIcon(iconId, vehicleType);
    return <Icon className={cn("h-10 w-10 text-slate-600", className)} />;
}
