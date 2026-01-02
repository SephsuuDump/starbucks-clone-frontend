"use client"

import { useFetchOne } from "@/hooks/use-fetch-one"
import { OrderService } from "@/services/ecommerce/orderService"
import { useParams } from "next/navigation"
import { ProcurementHeader } from "../procurement/components/Header";
import { ArrowLeft } from "lucide-react";
import { formatDateTime, formatToPeso } from "@/lib/formatter";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function ViewOrderPage() {
    const { id } = useParams();

    const { data: order, loading } = useFetchOne(
        OrderService.getOrderById,
        [id],
        [id]
    )

    console.log(order);
    
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

                <h2 className="font-extrabold uppercase text-green-900 mb-2">
                    Order Information
                </h2>

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