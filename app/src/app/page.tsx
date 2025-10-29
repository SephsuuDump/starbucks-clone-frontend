"use client"

import { AuthPage } from "@/features/auth/AuthPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage.";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
    const { claims, loading } = useAuth();

    if (loading) return <div>Loading</div>
    if (!claims) return <AuthPage />
    return (
        <DashboardPage />
    );
}
