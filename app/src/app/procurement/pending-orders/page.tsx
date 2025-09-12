"use client"

import { Input } from "@/components/ui/input";
import { pendingOrders } from "../../../../public/mock";
import { formatDateToWords, formatTimestamptzToWords, formatToPeso } from "@/lib/formatter";
import { ProcurementBadge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { PurchaseOrderService } from "@/services/purchaseOrderService";
import { toast } from "sonner";

export default function PendingOrders() {
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [orders, setOrders] = useState<Record<any, any>[]>([]);
    const [activeRequest, setRequest] = useState<any>();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await PurchaseOrderService.getPurchaseOrderByStatus('PENDING');
                setOrders(data);
            } catch(error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, [reload]);

    if (loading) return <div>Loading</div>
    return(
        <section className="flex flex-col gap-2">
            <div>
                <div className="font-extrabold text-xl text-orange-900 uppercase">Pending Orders</div>
                <div className="text-xs mt-0.5 text-gray-500 uppercase">This is a read only page showing list of orders sent to suppliers.</div>
            </div>
            <Input 
                placeholder="Search for an order request" 
            />

            <div className="grid grid-cols-6 thead">
                <div className="th">Order ID</div>
                <div className="th">Destination</div>
                <div className="th">Supplier Name</div>
                <div className="th">Total Ammount</div>
                <div className="th">Status</div>
                <div className="th">Order Date</div>
            </div>

            {orders.length > 0 && orders.map((item, _) => (
                <div
                    key={_}
                    className="grid grid-cols-6 border-b-1 -mt-2"
                >
                    <button
                        className="td font-semibold underline text-start"
                    >
                        { item.id }
                    </button>
                    <div className="td">{ item.id }</div>
                    <div className="td flex-col !items-start">
                        <div>{ item.supplier.name }</div>
                        <div className="text-xs text-gray-500">{ item.supplier.contact }</div>
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