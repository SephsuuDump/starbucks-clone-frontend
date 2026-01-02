"use client"

import { EcommerceEmployeePage } from "@/features/ecommerce/employee/EcommerceEmployeePage";
import { EcommerceManagerPage } from "@/features/ecommerce/manager/EcommerceManagerPage";
import { useAuth } from "@/hooks/use-auth";

export function SalesPage() {
    const { claims, loading } = useAuth();
        
    if (loading) return <div>Loading</div>
    // if (claims.role === 'CUSTOMER') return <EcommerceCustomerPage />
    if (claims.role === 'E-COMMERCE MANAGER') return <EcommerceManagerPage />
    if (claims.role === 'E-COMMERCE EMPLOYEE') return <EcommerceEmployeePage />
}