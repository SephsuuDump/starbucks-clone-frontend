import { useAuth } from "@/hooks/use-auth"
import { AuthPage } from "../auth/AuthPage";
import { EmployeePage } from "./EmployeePage";
import { ManagerPage } from "./ManagerPage";
import { SupplierPage } from "../procurement/supplier/SuppliersPage";
import { EcommerceCustomerLandingPage } from "../ecommerce/EcommerceCustomerLandingPage";

export function DashboardPage() {
    const { claims, loading } = useAuth();
    if (!claims || loading) return <AuthPage />
    if (claims.role === 'EMPLOYEE') return <EmployeePage />
    if (claims.role === 'INVENTORY MANAGER') return <ManagerPage />
    if (claims.role === 'SUPPLIER') return <SupplierPage />
    if (claims.role === 'CUSTOMER') return <EcommerceCustomerLandingPage />
}