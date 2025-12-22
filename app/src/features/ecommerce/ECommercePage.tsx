"use client"

import { useAuth } from "@/hooks/use-auth";
import { EcommerceCustomerPage } from "./customer/ECommerceCustomerPage";
import { EcommerceManagerPage } from "./manager/EcommerceManagerPage";
import { EcommerceEmployeePage } from "./employee/EcommerceEmployeePage";

export function ECommercePage() {
    const { claims, loading } = useAuth();
        
    if (loading) return <div>Loading</div>
    if (claims.role === 'CUSTOMER') return <EcommerceCustomerPage />
    if (claims.role === 'E-COMMERCE MANAGER') return <EcommerceManagerPage />
    if (claims.role === 'E-COMMERCE EMPLOYEE') return <EcommerceEmployeePage />
}