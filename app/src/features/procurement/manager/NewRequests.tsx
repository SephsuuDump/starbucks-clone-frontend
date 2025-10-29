"use client"

import { RequestOrderModal } from "@/features/procurement/components/RequestOrderModal";
import { Input } from "@/components/ui/input";
import { formatTimestamptzToWords, formatToPeso } from "@/lib/formatter";
import { useEffect, useState } from "react";
import { Badge, ProcurementBadge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PurchaseOrderService } from "@/services/procurement/purchaseOrderService";
import { ProcurementHeader } from "@/features/procurement/components/Header";
import { useFetchData } from "@/hooks/use-fetch-data";

const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 7);

export function NewRequestsPage() {
    const [reload, setReload] = useState(false);
    const [activeRequest, setRequest] = useState<any>();

    const { data: orders, loading } = useFetchData(
        PurchaseOrderService.getPurchaseOrderByStatus,
        [],
        ['TO REVIEW']
    );
    
    if (loading) return <div>Loading</div>
    return(
        <section className="flex flex-col gap-2">
            <ProcurementHeader label="new requests" />
            <Input 
                placeholder="Search for an order request" 
            />

            <div className="grid grid-cols-5 thead">
                <div className="th">Order ID</div>
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
                        <div className="underline uppercase">{ item.id }</div>
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