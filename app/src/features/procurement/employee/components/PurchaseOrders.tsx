import { EmptyState } from "@/components/custom/EmptyState";
import { Pagination } from "@/components/custom/Pagination";
import { ProcurementBadge } from "@/components/ui/badge";
import { usePagination } from "@/hooks/use-pagination";
import { formatTimestamptzToWords, formatToPeso } from "@/lib/formatter";
import Link from "next/link";

export function PurchaseOrders({ orders }: {
    orders: any[];
}) {
    const {
        page,
        size,
        setPage,
        paginated,
    } = usePagination(orders, 10)

    return (
        <section className="flex flex-col gap-2">
            <div className="grid grid-cols-5 thead">
                <div className="th">Order ID</div>
                <div className="th">Supplier Name</div>
                <div className="th">Total Ammount</div>
                <div className="th">Status</div>
                <div className="th">Request Date</div>
            </div>

            {paginated.length === 0 && (
                <EmptyState 
                    title={`No purchase orders.`}
                    message="Try adjusting the filters/selected status."
                />
            )}

            {paginated.length > 0 && paginated.map((item, _) => (
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
            
            <div className="relative z-50">
                <Pagination
                    totalItems={orders.length}
                    itemsPerPage={size}
                    currentPage={page}
                    onPageChange={setPage}
                />
            </div>
        </section>
    )
}