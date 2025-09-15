"use client"

import { ProcurementHeader } from "@/components/custom/procurement/Header";
import { SupplierCard } from "@/components/custom/procurement/SupplierCard";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { SupplierService } from "@/services/supplierService";
import { Claim } from "@/types/claim";
import { Supplier } from "@/types/supplier";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Suppliers() {
    const { claims, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await SupplierService.getAllSuppliers();
                setSuppliers(data);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, [])

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