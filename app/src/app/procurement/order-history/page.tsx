"use client"

import { ProcurementBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatTimestamptzToWords, formatToPeso } from "@/lib/formatter";
import { PurchaseOrderService } from "@/services/purchaseOrderService";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function OrderHistory() {
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [orders, setOrders] = useState<Record<any, any>[]>([]);
    const [activeRequest, setRequest] = useState<any>();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await PurchaseOrderService.getAllPurchaseOrders();
                setOrders(data);
            } catch(error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, [reload]);

    if (loading) return <div>Loading</div>
    return(
        <section className="flex flex-col gap-2">
            <div className="font-extrabold text-xl text-orange-900 uppercase">Purchased orders history</div>
            <Input 
                placeholder="Search for an order request" 
            />

            <div className="grid grid-cols-6 thead">
                <div className="th">Order ID</div>
                <div className="th">Destination</div>
                <div className="th">Supplier Name</div>
                <div className="th">Total Ammount</div>
                <div className="th">Status</div>
                <div className="th">Request Date</div>
            </div>

           {orders.length > 0 && orders.map((item, _) => (
                <div className="tdata grid grid-cols-6" key={_}>
                    <button
                        className="td text-start font-semibold underline uppercase"
                    >
                        { item.id }
                    </button>
                    <div className="td uppercase">{ item.id }</div>
                    <div className="td flex-col !items-start justify-center">
                        <div>{ item.supplier.name }</div>
                        <div className="text=xs text-gray-500">{ item.supplier.contact }</div>
                    </div>
                    <div className="td">{ formatToPeso(item.total_cost) }</div>
                    <div className="td">
                        <ProcurementBadge 
                            label={ item.status } 
                        />
                    </div>
                    <div className="td">{ formatTimestamptzToWords(item.date) }</div>
                </div>
           ))}
        </section>
    );
}