"use client"

import { ProcurementHeader } from "@/components/custom/procurement/Header";
import { ProcurementInvoiceHeader } from "@/components/custom/procurement/ProcurementInvoiceHeader";
import { formatToPeso } from "@/lib/formatter";
import { PurchaseOrderService } from "@/services/purchaseOrderService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PurchaseOrderInvoice() {
    const { id } = useParams();
    const [order, setOrder] = useState<any>();
    const [reload, setReload] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await PurchaseOrderService.getPurchaseOrderById(String(id));
                setOrder(data);
            } catch (error) { toast.error(`${error}`) }
        } fetchData();
    }, [id, reload])

    if (!order) return <div>Loading</div>
    return(
        <section className="flex flex-col gap-2">
            <ProcurementHeader label="purchase order invoice" />
            <ProcurementInvoiceHeader 
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