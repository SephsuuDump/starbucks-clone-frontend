"use client"

import { ProcurementHeader } from "@/features/procurement/components/Header";
import { ProcurementInvoiceHeader } from "@/features/procurement/shared/ProcurementInvoiceHeader";
import { useAuth } from "@/hooks/use-auth";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { formatToPeso } from "@/lib/formatter";
import { PurchaseOrderService } from "@/services/procurement/purchaseOrderService";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function PurchaseOrderInvoice() {
    const [reload, setReload] = useState(false);

    const { id } = useParams();
    const { claims, loading: authLoading } = useAuth(); 
    const { data: order, loading } = useFetchOne(
        PurchaseOrderService.getPurchaseOrderById,
        [id, reload], 
        [String(id)]
    );
    
    if (!order || loading || authLoading) return <div>Loading</div>
    return(
        <section className="flex flex-col gap-2">
            <ProcurementHeader label="purchase order invoice" />
            <ProcurementInvoiceHeader 
                role={ claims.role }
                order={ order } 
                setReload={ setReload }
            />

            <div className="grid grid-cols-5 thead">
                <div className="th">Supply Name</div>
                <div className="th">Quantity</div>
                <div className="th">Description</div>
                <div className="th">Unit Cost</div>
                <div className="th">Total Cost</div>
            </div>

            {order.supplies.map((item: any, _: number) => (
                <div className="tdata grid grid-cols-5" key={_}>
                    <div className="td">{ item.name }</div>
                    <div className="td">{ item.quantity}</div>
                    <div className="td">{ item.description }</div>
                    <div className="td">{ formatToPeso(item.unit_cost) }</div>
                    <div className="td">{ formatToPeso(item.unit_cost * item.quantity) }</div>
                </div>
            ))}
            
        </section>
    );
}