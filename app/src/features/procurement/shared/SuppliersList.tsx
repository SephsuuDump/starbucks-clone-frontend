"use client"

import { ProcurementHeader } from "@/features/procurement/components/Header";
import { SupplierCard } from "@/features/procurement/shared/SupplierCard";
import { useAuth } from "@/hooks/use-auth";
import { useFetchData } from "@/hooks/use-fetch-data";
import { SupplierService } from "@/services/procurement/supplierService";

export function SupplierList() {
    const { claims, loading: authLoading } = useAuth();
    const { data: suppliers, loading } = useFetchData(SupplierService.getAllSuppliers);
    
    if (loading || authLoading) return <div>Loading</div>
    return(
        <section className="flex flex-col gap-2">
            <ProcurementHeader label="suppliers" />
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                {suppliers.map((item, _) => (
                    <SupplierCard 
                        key={_} 
                        supplier={ item }
                        role={ claims.role }
                    />
                ))}
            </div>
        </section>
    );
}