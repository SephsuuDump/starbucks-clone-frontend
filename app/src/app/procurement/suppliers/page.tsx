"use client"

import { SupplierCard } from "@/components/custom/procurement/SupplierCard";
import { Input } from "@/components/ui/input";
import { SupplierService } from "@/services/supplierService";
import { Supplier } from "@/types/supplier";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Suppliers() {
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

    if (loading) return <div>Loading</div>
    return(
        <section className="flex flex-col gap-2">
            <div className="font-extrabold text-xl text-orange-900 uppercase">Suppliers</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map((item, _) => (
                    <SupplierCard 
                        key={_} 
                        supplier={ item }
                    />
                ))}
            </div>
        </section>
    );
}