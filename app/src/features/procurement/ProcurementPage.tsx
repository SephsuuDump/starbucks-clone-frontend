"use client"

import { useAuth } from "@/hooks/use-auth"
import { InventoryEmployeePage } from "./employee/InventoryEmployeePage";
import { InventoryManagerPage } from "./manager/InventoryManagerPage";

export function ProcurementPage() {
    const { claims, loading } = useAuth();
    
    if (loading) return <div>Loading</div>
    if (claims.role === 'EMPLOYEE') return <InventoryEmployeePage />
    if (claims.role === 'INVENTORY MANAGER') return <InventoryManagerPage />
}