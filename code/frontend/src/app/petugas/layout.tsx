import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function PetugasLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardLayout role="petugas" userName="Budi Santoso">
            {children}
        </DashboardLayout>
    );
}
