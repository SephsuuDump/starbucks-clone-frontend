"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ProcurementHeader } from "@/features/procurement/components/Header";
import { useAuth } from "@/hooks/use-auth";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { CustomerService } from "@/services/ecommerce/customerService";
import { OrderService } from "@/services/ecommerce/orderService";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UpdateAccount from "../components/UpdateAccount";
import { formatToPeso } from "@/lib/formatter";
import { AccountCreditService } from "@/services/procurement/accountCreditService";
import { EmptyState } from "@/components/custom/EmptyState";
import { useSearchParams } from "next/navigation";

export function CustomerAccount() {
    const activeTabCss = '!bg-green-900 !text-white';
    const searchParam = useSearchParams();
    const { claims, loading: authLoading } = useAuth();
    const [reload, setReload] = useState(false)
    
    const userId = claims?.id || null;
    const { data, loading } = useFetchOne(
        CustomerService.getCustomerById,
        [userId, reload],
        [userId]
    );
    const { data: orders, loading: ordersLoading } = useFetchData(
        OrderService.getByCustomer,
        [userId],
        [userId]
    );
    const { data: credit, loading: creditsLoading } = useFetchOne(
        AccountCreditService.getAccountCreditByUser,
        [claims.id],
        [claims.id]
    );

    const [filteredOrders, setFilteredOrders] = useState<any>([]);
    const [tab, setTab] = useState('Pending');
    const [toUpdate, setUpdate] = useState<any>();

    useEffect(() => {
        if (!orders) return;
        let next = orders;
        if (tab === 'Pending') next = orders.filter((i: any) => i.status === 'PENDING');
        if (tab === 'Completed') next = orders.filter((i: any) => i.status === 'COMPLETED');
        setFilteredOrders((prev: any) => {
            const prevJson = JSON.stringify(prev);
            const nextJson = JSON.stringify(next);
            return prevJson === nextJson ? prev : next;
        });
    }, [orders, tab]);

    if (loading || authLoading || !data || ordersLoading || creditsLoading) return <div>Loading</div>
    return (
        <section className="flex flex-col gap-2 p-4">
            {/* HEADER */}
            <div className="flex-center-y gap-8">
                <Link href={'/'}><ArrowLeft className="w-6 h-6" strokeWidth={3} /></Link>
                <ProcurementHeader label="My Profile" />
                <div className="ms-auto flex-center-y gap-16 shadow-xs px-4 py-2 rounded-xl bg-slate-50">
                    <div className="font-extrabold text-[16px]">ACCOUNT CREDIT:</div>
                    <div className="flex-center gap-2">
                        <img 
                            src="/svg/gcash.svg"
                            className="w-8 h-8 rounded-lg"
                        />
                        <div className="font-extrabold">{ formatToPeso(credit.gcash) }</div>
                    </div>
                    <div className="flex-center gap-2">
                        <img 
                            src="/svg/visa.svg"
                            className="w-11 h-11 rounded-lg"
                        />
                        <div className="font-extrabold">{ formatToPeso(credit.gcash) }</div>
                    </div>
                    <div className="flex-center gap-2">
                        <img 
                            src="/svg/mastercard.svg"
                            className="w-11 h-11 rounded-lg"
                        />
                        <div className="font-extrabold">{ formatToPeso(credit.mastercard) }</div>
                    </div>
                </div>
            </div>

            {/* ACCOUNT INFORMATION */}
            <div className="flex gap-2 mx-auto">
                <Image
                    src="/images/ecommerce.png"
                    alt="Starbucks"
                    width={400}
                    height={400}
                />
                <div className="-mt-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <img src='/svg/logo2.svg' className="w-30 h-30"/>
                            <div className="text-xl font-extrabold text-green-950 -mt-10">MY STARBUCKS PROFILE</div>
                        </div>
                        <div className="flex-center-y gap-2">
                            <Button
                                onClick={ () => setUpdate(data) }
                                className="bg-green-900! font-extrabold mt-4 h-8 hover:opacity-90"
                                size="sm"
                            >
                                EDIT
                            </Button>
                            <Link href='http://localhost:3104'>
                                <Button
                                    className="bg-red-900! font-extrabold mt-4 h-8 hover:opacity-90"
                                    size="sm"
                                >
                                    REPORT
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="text-lg font-bold text-gray-600 mt-4">E-MAIL ADDRESS</div>
                    <div className="text-lg font-bold tracking-wider">{ data.email }</div>
                    <div className="text-lg font-bold text-gray-600 mt-4">PHONE NUMBER</div>
                    <div className="text-lg font-bold tracking-wider">{ data.phone ?? 'N/A' }</div>
                    <div className="text-lg font-bold text-gray-600 mt-4">FULL NAME</div>
                    {
                        (data.first_name || data.middle_name || data.last_name)
                            ? (
                                <div className="text-lg font-bold tracking-wider">
                                {data.first_name ?? "-"} {data.middle_name ?? "-"} {data.last_name ?? "-"}
                                </div>
                            )
                            : <div className="text-lg font-bold tracking-wider">N/A</div>
                    }
                    <div className="text-lg font-bold text-gray-600 mt-4">FULL ADDRESS</div>
                    {
                        (data.address || data.city || data.province || data.country || data.zip_code)
                            ? (
                                <div className="text-lg font-bold tracking-wider">
                                {data.address ?? "-"}, {data.city ?? "-"}, {data.province ?? "-"}, {data.country ?? "-"}, {data.zip_code ?? "-"}
                                </div>
                            )
                            : <div className="text-lg font-bold tracking-wider">N/A</div>
                    }

                </div>
            </div>

            {/* TABS */}
            <div className="relative flex mt-10">
                <button 
                    onClick={ () => setTab('Total') }
                    className={`w-50 h-50 absolute flex-center flex-col -top-16 left-1/2 -translate-x-1/2 rounded-full border bg-slate-50 shadow-xl ${tab === 'Total' && activeTabCss}`}
                >
                    <div className="text-7xl font-extrabold scale-x-110">
                        { orders.length }
                    </div>
                    <div className={`text-lg font-extrabold text-green-950 ${tab === 'Total' && "text-white"}`}>TOTAL ORDERS</div>
                </button>
                <button 
                    onClick={ () => setTab('Pending') }
                    className={`flex-1 flex-center flex-col border bg-slate-50 p-4 rounded-l-xl ${tab === 'Pending' && activeTabCss}`}
                >
                    <div className="text-6xl font-extrabold scale-x-110">
                        { orders.filter((i : any) => i.status === 'PENDING').length }
                    </div>
                    <div className={`text-2xl font-extrabold text-green-950 ${tab === 'Pending' && "text-white"}`}>PENDING ORDERS</div>
                </button>
                <button 
                    onClick={ () => setTab('Completed') }
                    className={`flex-1 flex-center flex-col border bg-slate-50 p-4 rounded-r-xl ${tab === 'Completed' && activeTabCss}`}
                >
                    <div className="text-6xl font-extrabold scale-x-110">
                        { orders.filter((i: any) => i.status === 'COMPLETED').length }
                    </div>
                    <div className={`text-2xl font-extrabold text-green-950 ${tab === 'Completed' && "text-white"}`}>COMPLETED ORDERS</div>
                </button>
            </div>

            {filteredOrders.length === 0 && (
                <EmptyState
                    title="No Orders Yet"
                    message="Orders will appear here once a customer checks out."
                />
            )}

            <div className="-mt-2">
                <Accordion type="single" collapsible className="space-y-3">
                    {filteredOrders.map((order: any) => (
                        <AccordionItem
                            key={order.id}
                            value={order.id}
                            className="border border-gray-200 rounded-lg bg-white shadow-sm"
                        >
                            <AccordionTrigger 
                                iconClassName="mx-auto my-auto h-5 w-5"
                                className="px-4 py-3 grid grid-cols-4"
                            >
                                <div className="text-left my-auto">
                                    <div className="font-semibold text-sm uppercase">Order #{order.id.slice(0, 8)}...</div>
                                    <p className="text-sm text-gray-500">
                                        Status:{" "}
                                        <span
                                            className={`font-medium ${
                                                order.status === "PENDING"
                                                ? "text-yellow-600"
                                                : order.status === "COMPLETED"
                                                ? "text-green-600"
                                                : "text-gray-600"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <span className="text-lg font-bold my-auto">
                                    { formatToPeso(order.total_amount) }
                                </span>
                                <div className="flex-center-y my-auto gap-2">
                                    <div className="text-sm font-semibold uppercase">Payment Method:</div>
                                    <img 
                                        src={`/svg/${order.payment_mode}.svg`}
                                        className="w-8 h-8"
                                    />
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="px-4 pb-4 pt-2 space-y-2">
                                {order.order_items.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 border rounded-md p-3"
                                    >
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-16 h-16 rounded object-cover"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium">{item.name}</h4>
                                            <p className="text-sm text-gray-500">{item.category}</p>
                                            <p className="text-xs text-gray-400 line-clamp-1">
                                                {item.description}
                                            </p>
                                        </div>
                                        <div className="text-right text-sm">
                                            <p>Qty: <span className="font-medium">{item.quantity}</span></p>
                                            <p><span className="text-gray-500 text-xs">Unit Price:</span> {formatToPeso(item.unit_price)}</p>
                                            <p className="font-semibold">
                                                {formatToPeso(item.total_price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </AccordionContent>
                            <div className="px-4">
                                Ordered from:
                                <span className="text-sm font-extrabold ml-1">{ order.branch.name ?? 'N/A' }</span>
                            </div>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
            
            {toUpdate && (
                <UpdateAccount
                    toUpdate={ toUpdate }
                    setUpdate={ setUpdate }
                    setReload={ setReload }
                />
            )}
        </section>
    )
}