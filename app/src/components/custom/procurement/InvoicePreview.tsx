import { Badge, ProcurementBadge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateToWords, formatTimestamptzToWords, formatToPeso } from "@/lib/formatter";
import { Fragment } from "react";

interface Props {
    activeInvoice: Record<any, any>;
}

export function InvoicePreview({ activeInvoice }: Props) {
    return(
        <section className="flex flex-col gap-2 col-span-2 p-3 bg-white rounded-md shadow-sm">
            <div className="text-lg font-bold text-green-900">Order Invoice</div>
            <div className="flex flex-center-y gap-2">
                <Skeleton className="h-12 w-12 rounded-full bg-slate-300" />
                <div>
                    <div className="font-semibold text-orange-900">{ activeInvoice.supplier.name }</div>
                    <div className="text-sm text-gray-500">{ activeInvoice.supplier.contact }</div>
                </div>
            </div>
            <div className="flex justify-between mt-2">
                <div className="text-sm text-gray-500">Supplier Name</div>
                <div className="text-sm">{ activeInvoice.supplier.name }</div>
            </div>
            <Separator />
            <div className="flex justify-between">
                <div className="text-sm text-gray-500">Order Date</div>
                <div className="text-sm">{ formatTimestamptzToWords(activeInvoice.date) }</div>
            </div>
            <Separator />
            <div className="flex justify-between">
                <div className="text-sm text-gray-500">Status</div>
                <ProcurementBadge label={ activeInvoice.status } />
            </div>
            <Separator />
            <div className="flex justify-between">
                <div className="text-sm text-gray-500">Total Amount</div>
                <div className="text-sm font-bold scale-x-120 text-green-600">{ formatToPeso(activeInvoice.total_cost) }</div>
            </div>
            <Separator />
            <div className="flex justify-between">
                <div className="text-sm text-gray-500">Type</div>
                <div className="text-sm">{ activeInvoice.supplier.contact }</div>
            </div>
            <Separator />
            <div className="text-sm text-gray-500">Supplies Ordered</div>
            <div className="grid grid-cols-2">
                <div className="bg-slate-200 p-1 px-2 text-sm border-r-2 border-white">Supply Name</div>
                <div className="bg-slate-200 p-1 px-2 text-sm">Quantity</div>
                {activeInvoice.purchase_order_item.map((item: any, _: number) => (
                    <Fragment key={_}>
                        <div className="border-b-1 text-sm p-1 px-2 border-r-1">{item.supplier_item.name}</div>
                        <div className="border-b-1 text-sm p-1 px-2 border-r-1">{item.quantity}</div>
                    </Fragment>
                ))}
            </div>
        </section>
    );
}