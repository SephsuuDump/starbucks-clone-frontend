"use client"

import { SupplyOrderForm } from "@/features/procurement/employee/components/SupplyOrderForm";
import { SupplyOrderReceipt } from "@/features/procurement/employee/components/SupplyOrderReceipt";
import { SupplierService } from "@/services/procurement/supplierService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SupplyOrder() {
    const { id } = useParams();
    const [tab, setTab] = useState('form');
    const [loading, setLoading] = useState(true);
    const [supplier, setSupplier] = useState<any>([])
    const [selectedItems, setSelectedItems] = useState<any>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await SupplierService.getSupplierById(String(id));
                setSupplier(data);
            } catch (error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        } 
        fetchData();
    }, [id]);    


    if (loading) return <div>Loading</div>
    return(
        <>
            {tab === 'form' && 
                <SupplyOrderForm 
                    supplier={ supplier }
                    selectedItems={ selectedItems }
                    setSelectedItems={ setSelectedItems }
                    setTab={ setTab }
                />
            }
            {tab === 'receipt' && 
                <SupplyOrderReceipt 
                    supplier={ supplier }
                    selectedItems={ selectedItems }
                    setTab={ setTab }
                />
            }
        </>
    );
}