"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ProcurementHeader } from "@/features/procurement/components/Header";
import { useAuth } from "@/hooks/use-auth";
import { useFetchData } from "@/hooks/use-fetch-data";
import { formatToPeso } from "@/lib/formatter";
import { OrderService } from "@/services/ecommerce/orderService";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const tabs = ['Pending', 'Completed'];

export function OrdersPage() {
    const { claims } = useAuth();
    const [tab, setTab] = useState(tabs[0]);
    const [reload, setReload] = useState(false);
    const isManager = claims.role === 'E-COMMERCE MANAGER';

    const fetchOrders = useFetchData(OrderService.getAllOrders, [reload]);
    const fetchBranchOrders = useFetchData(OrderService.getByBranch, [reload, claims.branchId], [claims.branchId]);

    const { data: orders = [] } = isManager ? fetchOrders : fetchBranchOrders;

    async function handleSubmit(order: any) {
        try {
            const data = await OrderService.processOrder({
                branchId: order.branch.id,
                id: order.id,
                order_items: order.order_items
            });

            if (data) {
                toast.success("Order completed successfully.");
                setReload(!reload);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    }

    return (
        <section className="space-y-2">
            <ProcurementHeader label="Orders" />

            <div className="w-fit bg-white rounded-full">
                {tabs.map((item) => (
                    <Button
                        onClick={() => setTab(item)}
                        className={`w-25 !bg-white text-dark rounded-full hover:opacity-90 ${tab === item && "!bg-green-900 text-white"}`}
                        key={item}
                    >
                        {item}
                    </Button>
                ))}
            </div>

            <Accordion type="multiple" className="">
                {orders
                    .filter((order) => order.status.toUpperCase() === tab.toUpperCase())
                    .map((order) => (
                        <AccordionItem
                            key={order.id}
                            value={order.id}
                            className="border rounded-lg bg-white"
                        >
                            <AccordionTrigger className="p-4 font-medium hover:bg-slate-50">
                                <div className="grid grid-cols-3 w-full justify-between text-left">
                                    <span className="truncate text-sm text-gray-500">
                                        Order ID: <span className="uppercase text-black font-bold">{order.id}</span>
                                    </span>

                                    <p className="text-sm text-gray-500 ml-8">
                                        Status:{" "}
                                        <span
                                            className={`font-bold ${
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

                                    <span className="text-gray-500">
                                        Total Amount:{" "}
                                        <span className="font-bold text-[17px] text-green-900">
                                            {formatToPeso(order.total_amount)}
                                        </span>
                                    </span>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="px-4 pb-4 space-y-2 border-b-green-900 border-b-1">
                                <p className="-text-xs text-muted-foreground">
                                    {new Date(order.created_at).toLocaleString()}
                                </p>

                                {order.customer && (
                                    <div className="rounded-md border bg-white p-4 shadow-sm">
                                        <h3 className="text-sm font-semibold mb-3">Customer Details</h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm">
                                            <div>
                                                <p className="text-muted-foreground text-xs">Name</p>
                                                <p className="font-medium">
                                                    {order.customer.first_name} {order.customer.last_name}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground text-xs">Phone</p>
                                                <p className="font-medium">{order.customer.phone}</p>
                                            </div>

                                            <div>
                                                <p className="text-muted-foreground text-xs">Address</p>
                                                <p className="font-medium">{order.customer.address}</p>
                                                <p className="text-sm">
                                                    {order.customer.city}, {order.customer.province}, {order.customer.country}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-xs">Mode of Payment</p>
                                                <div className="flex-center-y gap-2">
                                                    <img 
                                                        src={ order.payment_mode ? `/svg/${order.payment_mode}.svg` : "/images/no-payment.png"}
                                                        className="w-8 h-8"
                                                    />
                                                    <div className="uppercase font-medium">{ order.payment_mode ?? "NO PAYMENT METHOD" }</div>
                                                </div>                                               
                                            </div>                                    
                                            <div>
                                                <p className="text-muted-foreground text-xs">Starbucks Branch</p>
                                                <p className="font-extrabold">{order.branch.name ?? "Branch not specified"}</p>
                                            </div>
                                            { order.status === 'PENDING' && (
                                                <div>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                className="!bg-green-900 hover:opacity-90"
                                                            >
                                                                Complete Order
                                                            </Button>
                                                        </AlertDialogTrigger>

                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Complete this order?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action will mark the order as completed. Do you want to proceed?
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>

                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleSubmit(order)}
                                                                    className="!bg-green-900 hover:opacity-90"
                                                                >
                                                                    Yes, Complete Order
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="text-lg font-extrabold text-orange-900">ORDERED ITEMS</div>

                                <div className="space-y-1">
                                    {order.order_items.map((item: any) => (
                                        <div
                                            key={item.id}
                                            className="grid grid-cols-3 border rounded-md py-2 px-4"
                                        >
                                            <div className="flex-center-y gap-2">
                                                <img
                                                    src={item.image_url}
                                                    alt={item.name}
                                                    className="h-12 w-12 rounded object-cover"
                                                />
                                                <div>
                                                    <p className="font-bold">{item.name}</p>
                                                </div>
                                            </div>

                                            <div className="flex-center-y gap-2 mx-auto">
                                                <X className="w-4 h-4" /> {item.quantity}
                                            </div>

                                            <p className="font-semibold my-auto ms-auto">
                                                <span className="text-xs text-gray-500">Total Price: </span>
                                                {formatToPeso(item.total_price)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
            </Accordion>
        </section>
    );
}
