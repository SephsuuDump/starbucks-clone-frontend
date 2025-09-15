"use client"

import { useAuth } from "@/hooks/use-auth";
import SupplierPage from "./dashboard/supplier";
import EmployeePage from "./dashboard/employee";
import LoginSignup from "./auth/page";

export default function Home() {
    const { claims, loading } =  useAuth();

    console.log('Dashboard', claims);
    

    // if (loading) return <div>LoadingHELLO</div>
    if (!claims) return <LoginSignup />
    return (
        <>
            {claims.role === 'SUPPLIER' && <SupplierPage />}
            {claims.role === 'EMPLOYEE' && <EmployeePage />}
         
        </>
    );
}
