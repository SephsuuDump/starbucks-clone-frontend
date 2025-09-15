"use client"

import { formatTimestamptzToWords, formatToPeso } from "@/lib/formatter";
import { PurchaseOrderService } from "@/services/purchaseOrderService";
import { ProcurementBadge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const status = ["SENT", "CONFIRMED", "DELIVERED", "CANCELLED"]

export function SupplierPurchasedOrders({ supplierId }: {
    supplierId: string;
}) {
    const [activeStatus, setActiveStatus] = useState('SENT');
    const [orders, setOrders] = useState<any>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await PurchaseOrderService.getBySupplierStatus({ 
                    id: supplierId, 
                    status: activeStatus 
                });
                setOrders(data);
            } catch (error) { toast.error(`${error}`) }
        }
        fetchData();
    }, [activeStatus]);
    
    return(
        <>
            <div>
                {status.map((item: string, _: number) => (
                    <Button
                        key={_}
                        onClick={ () => setActiveStatus(item) }
                        className={`${activeStatus !== item && "opacity-50"} !bg-orange-900 font-semibold rounded-none w-30 mr-[1px]`}
                        size="sm"
                    >
                        { item }
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-4 thead">
                <div className="th">Destination</div>
                <div className="th">Total Ammount</div>
                <div className="th">Status</div>
                <div className="th">Request Date</div>
            </div>

            {orders.length > 0 && orders.map((item: any, _: number) => (
                <div 
                    key={_}
                    className="tdata grid grid-cols-4"
                >
                    <Link
                        href={`/invoice/${item.id}`} 
                        className="td flex gap-2 text-start font-semibold uppercase"
                    >
                        <div className="underline">{ item.id }</div>
                    </Link>
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
        </>
    );
}