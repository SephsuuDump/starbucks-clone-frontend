import { ProcurementBadge } from "@/components/ui/badge";
import { formatTimestamptzToWords, formatToPeso } from "@/lib/formatter";
import Link from "next/link";

export function PurchaseOrders({ orders }: {
    orders: any[];
}) {
    return (
        <section className="flex flex-col gap-2">
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
                    <Link 
                        href={`/procurement/invoice/${item.id}`}
                        className="td font-semibold"
                    >
                        <div className="underline uppercase">{ item.id }</div>
                    </Link>
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
        </section>
    )
}