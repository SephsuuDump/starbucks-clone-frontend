"use client"
import { RequestOrderModal } from "@/components/custom/procurement/RequestOrderModal";
import { Input } from "@/components/ui/input";
import { formatTimestamptzToWords, formatToPeso } from "@/lib/formatter";
import { useEffect, useState } from "react";
import { Badge, ProcurementBadge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PurchaseOrderService } from "@/services/purchaseOrderService";
import { ProcurementHeader } from "@/components/custom/procurement/Header";

const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 7);

export default function NewRequests() {
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [orders, setOrders] = useState<Record<any, any>[]>([]);
    const [activeRequest, setRequest] = useState<any>();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await PurchaseOrderService.getPurchaseOrderByStatus('TO%20REVIEW');
                setOrders(data);
            } catch(error) { toast.error(`${error}`) }
            finally { setLoading(false) }
        }
        fetchData();
    }, [reload]);
    
    if (loading) return <div>Loading</div>
    return(
        <section className="flex flex-col gap-2">
            <ProcurementHeader label="new requests" />
            <Input 
                placeholder="Search for an order request" 
            />

            <div className="grid grid-cols-5 thead">
                <div className="th">Destination</div>
                <div className="th">Supplier Name</div>
                <div className="th">Total Ammount</div>
                <div className="th">Status</div>
                <div className="th">Request Date</div>
            </div>

            {orders.length > 0 && orders.map((item, _) => (
                <div 
                    key={_}
                    className="tdata grid grid-cols-5"
                >
                    <button 
                        onClick={ () => setRequest(item) }
                        className="td flex gap-2 text-start font-semibold"
                    >
                        <div className="underline">{ item.id }</div>
                        {new Date(item.date) >= weekAgo && (
                            <Badge className="bg-green-600 py-0.5 px-1 rounded-pill text-[10px]">New</Badge>
                        )}
                    </button>
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
            {orders.length === 0 && (<div className="col-span-5 text-center text-sm">No purchase orders as of now.</div>)}

            {activeRequest && (
                <RequestOrderModal
                    activeRequest={ activeRequest }
                    setRequest={ setRequest }
                    setReload={ setReload }
                />
            )}
        </section>
    );
}