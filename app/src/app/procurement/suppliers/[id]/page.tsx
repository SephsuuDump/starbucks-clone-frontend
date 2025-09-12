"use client"

import { SupplierDetailsHeader } from "@/components/custom/procurement/SupplierDetailsHeader";
import { formatToPeso } from "@/lib/formatter";
import { SupplierService } from "@/services/supplierService";
import { Supplier } from "@/types/supplier";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SupplierDetails() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [supplier, setSupplier] = useState<Supplier>()
    
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await SupplierService.getSupplierById(String(id));
                setSupplier(data);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, [])

    if (!supplier || loading) return <div>Loading</div>
    return(
        <section className="flex flex-col gap-2">
            <SupplierDetailsHeader 
                supplier={ supplier }
            />
            <div className="text-lg font-semibold uppercase">SUPPLY ITEMS OF <span className="text-orange-900">{ supplier.name }</span></div>
            <div className="grid grid-cols-4 thead">
                <div className="th">SKU ID</div>
                <div className="th">Supply Name</div>
                <div className="th">Description</div>
                <div className="th">Unit Cost</div>
            </div>
            {supplier.supplier_item?.map((item, _) => (
                <div className="tdata grid grid-cols-4">
                    <div className="td uppercase">{ item.id }</div>
                    <div className="td">{ item.name }</div>
                    <div className="td">{ item.description }</div>
                    <div className="td">{ formatToPeso(item.unit_cost) }</div>
                </div>
            ))}
        </section>
    );
}