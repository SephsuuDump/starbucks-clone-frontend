"use client"

import { useFetchOne } from "@/hooks/use-fetch-one"
import { OrderService } from "@/services/ecommerce/orderService"
import { useParams, usePathname } from "next/navigation"
import { ProcurementHeader } from "../procurement/components/Header";
import { ArrowLeft, File } from "lucide-react";
import { formatDateTime, formatToPeso } from "@/lib/formatter";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { error } from "console";

export function ViewOrderPage() {
    const { id } = useParams();
    const pathname = usePathname();

    const { data: order, loading } = useFetchOne(
        OrderService.getOrderById,
        [id],
        [id]
    )

    async function generateInvoice() {
        try {
            
            const response = await fetch(
                `http://localhost:4000/api/orders/generate-invoice`,
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/pdf",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(order)
                }
            );

            if (!response.ok) {
                const text = await response.text();
                console.error("Invoice error response:", response.status, text);
                throw new Error(`Failed to generate invoice (${response.status})`);
            }


            const blob = await response.blob(); // ✅ IMPORTANT

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `invoice-${order.id}.pdf`; // forces download
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

        } catch (error: any) {
            console.error(error);
            toast.error(error.message ?? "Invoice generation failed");
        }
    }

    if (loading) return <div>Loading</div>
    return (
        <section className="w-full flex flex-col gap-2 pb-8">
            <div className="flex-center-y gap-4">
                <ArrowLeft 
                    onClick={ () => { history.back() } }
                    className="w-6 h-6 cursor-pointer" 
                    strokeWidth={3} 
                />
                <ProcurementHeader label={`Sales Order: ${"OID-" + order.id}`} />
            </div>

            <div className="bg-white rounded-md shadow-xs p-4 shadow-green-800">

                <div className="flex-center-y justify-between pb-2">
                    <h2 className="font-extrabold uppercase text-green-900 mb-2">
                        Order Information
                    </h2>
                    <Button 
                        onClick={generateInvoice}
                        className="!bg-green-900 font-extrabold hover:opacity-90"
                    >
                        <File /> GENERATE INVOICE
                    </Button>
                </div>

                <Separator className="mb-3" />

                <div className="grid grid-cols-2 gap-4">
                    

                    <div>
                        <p className="text-sm text-gray-500 uppercase font-semibold">Order ID</p>
                        <p className="font-extrabold uppercase">OID-{order.id}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 uppercase font-semibold">Status</p>
                        <Badge 
                            className={`font-extrabold text-sm ${order.status === "PENDING" ? "bg-yellow-200 text-yellow-900" : order.status === "COMPLETED" ? "bg-blue-200 text-blue-900" : ""}`}
                        >
                            {order.status}
                        </Badge>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 uppercase font-semibold">Payment Mode</p>
                        {order.payment_mode !== undefined ? (
                            <div className="flex-center-y gap-2">
                                <img
                                    src={`/svg/${order.payment_mode}.svg`}
                                    className="w-10 h-10 rounded-sm" 
                                />
                                <p className="font-extrabold uppercase">{order.payment_mode}</p>
                            </div>
                        ) : (<p className="font-extrabold uppercase text-red-900">PAYMENT MODE UNAVAILABLE</p>)}
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 uppercase font-semibold">Order Date</p>
                        <p className="font-extrabold uppercase">
                            {formatDateTime(order.created_at)}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 uppercase font-semibold">Branch</p>
                        <div className="flex-center-y gap-2">
                            <img
                                src="/svg/logo1.svg"
                                className="w-10 h-10"
                            />
                            <p className="font-extrabold uppercase">{order.branch.name}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 uppercase font-semibold">Total Amount</p>
                        <p className="font-extrabold text-green-900 text-lg">
                            {formatToPeso(order.total_amount)}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 uppercase font-semibold">Discounts</p>
                        {order.discounts ? (
                            order.discounts.map((d: any) => (
                                <p className="font-extrabold text-red-900 uppercase" key={d.id}>
                                    {d.name}
                                    {" "}
                                    (
                                    {d.type === "Discount Percentage"
                                        ? `${d.value}%`
                                        : formatToPeso(d.value)}
                                    )
                                </p>
                            ))
                        ) : (
                            <p className="font-extrabold text-gray-500 uppercase">
                                No Discounts
                            </p>
                        )}
                        
                    </div>
                </div>

            </div>

            <div className="bg-white rounded-md shadow-xs p-4 shadow-green-800 mt-2">
                <h2 className="font-extrabold uppercase text-green-900 mb-2">
                    Customer Information
                </h2>

                <Separator className="mb-3" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-500 font-semibold uppercase">Name</span>
                        <p className="font-extrabold uppercase text-[16px]">
                            {order.customer.first_name}{" "}
                            {order.customer.last_name}
                        </p>
                    </div>

                    <div>
                        <span className="text-gray-500 font-semibold uppercase">Phone</span>
                        <div className="font-extrabold uppercase text-[16px]">
                            {order.customer.phone}
                        </div>
                    </div>

                    <div className="col-span-2">
                        <span className="text-gray-500 font-semibold uppercase">Address</span>
                        <div className="font-extrabold uppercase text-[16px]">
                            {order.customer.address},{" "}
                            {order.customer.city},{" "}
                            {order.customer.province},{" "}
                            {order.customer.country}
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="font-extrabold uppercase text-orange-900 mb-2 mt-4 text-lg">
                Ordered Items
            </h2>

            <div className="bg-slate-50 rounded-md">
                <div className="thead grid grid-cols-6 uppercase">
                    <div className="th col-span-2 !font-extrabold !py-3">Product</div>
                    <div className="th !font-extrabold !py-3">Category</div>
                    <div className="th !font-extrabold !py-3">Quantity</div>
                    <div className="th !font-extrabold !py-3">Unit Price</div>
                    <div className="th !font-extrabold !py-3">Total</div>
                </div>

                <Separator className="h-3 bg-slate-300" />

                {order.order_items.map((item: any, i: number) => (
                    <div
                        key={i}
                        className="tdata grid grid-cols-6"
                    >
                        <div className="td col-span-2 flex-center-y gap-3">
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-16 h-16 rounded object-cover"
                            />
                            <div>{item.name}</div>
                        </div>

                        <div className="td">{item.category}</div>
                        <div className="td">{item.quantity}</div>
                        <div className="td">
                            {formatToPeso(item.unit_price)}
                        </div>
                        <div className="td font-semibold">
                            {formatToPeso(item.total_price)}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}