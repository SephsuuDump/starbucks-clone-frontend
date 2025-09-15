"use client"

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ProcurementBadge } from "@/components/ui/badge";
import { Button, ModalButton } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDateTime, formatToPeso } from "@/lib/formatter";
import { ArrowBigRight, CircleCheckBig, CircleFadingArrowUp, PackageCheck, Plus, Send, ShoppingCart, ThumbsUp, Truck } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { ProcurementHeader } from "./Header";
import { toast } from "sonner";
import { PurchaseOrderService } from "@/services/purchaseOrderService";

export function ProcurementInvoiceHeader({ order, setReload }: {
    order: any;
    setReload: Dispatch<SetStateAction<boolean>>;
}) {
    const timelineReached = 'bg-green-900'; const timelineUnreached = 'bg-slate-300';
    const shortDate = (dateStr: any) => dateStr.split(" ")[0].slice(0,3) + " " + dateStr.split(" ")[1].slice(0, 2);
    const [onProcess, setProcess] = useState(false);
    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);

    async function updateStatus() {
        try {
            setProcess(true);
            const status = order.status === 'SENT' ? 'CONFIRMED' : 'DELIVERED';
            const data = await PurchaseOrderService.updateStatus({ id: order.id, status: status });
            if (data) {
                setOpen(!open);
                setSuccess(!success);
                setProcess(false);
            }
        } catch (error) { toast.error(`${error}`) }
        finally {
            setReload(prev => !prev);
        }
    }

    return(
        <>
            <div className="flex gap-2">
                <div className="flex-1 bg-slate-50 p-4 rounded-md shadow-sm">
                    <div className="text-gray-500 text-sm font-bold">SOURCE</div>
                    <Separator className="my-1" />
                    <div className="text-sm text-gray-500 uppercase font-semibold mb-1">po id: <span className="text-black font-extrabold">{ order.id }</span></div>
                    <div className="text-sm text-green-900 uppercase font-semibold">supplier: <span className="text-orange-900 font-extrabold">{ order.supplier.name }</span></div>
                </div>
                <div className="flex-1 bg-slate-50 p-4 rounded-md shadow-sm">
                    <div className="text-gray-500 text-sm font-bold">DESTINATION</div>
                    <Separator className="my-1" />
                    <div className="text-sm text-green-900 uppercase font-semibold mb-1">branch: <span className="text-orange-900 font-extrabold">{ "[Branch Name]" }</span></div>
                    <div className="text-sm text-gray-500 uppercase font-semibold">order date: <span className="text-black font-extrabold">{ formatDateTime(order.date) }</span></div>
                </div>
                <div className="flex-1 bg-slate-50 p-4 rounded-md shadow-sm">
                    <div className="text-gray-500 text-sm font-bold">TOTAL AMOUNT</div>
                    <Separator className="my-1" />
                    <div className="text-xl font-extrabold">{ formatToPeso(order.total_cost) }</div>
                    <div className="flex-center-y gap-2 text-sm text-gray-500 uppercase font-semibold my-2">
                        <div>status: </div>
                        <ProcurementBadge label={ order.status } className="!text-sm" />
                        <button
                            onClick={ () => setOpen(!open) }
                            className="ms-auto"
                        >
                            <CircleFadingArrowUp className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-center my-8 drop-shadow-sm">
                <div className="relative">
                    <div className="absolute -top-7.5 text-center left-1/2 -translate-x-1/2 text-2xs font-bold">ORDER PLACED</div>
                    <div className="absolute -bottom-5 text-2xs text-center left-1/2 -translate-x-1/2 w-10 font-bold uppercase">{ shortDate(formatDateTime(order.date)) }</div>
                    <div className={`${timelineReached} flex-center rounded-full w-8 h-8 border-1 border-white`}>
                        <ShoppingCart className="w-4 h-4 text-white" />
                    </div>
                </div>
                <Separator className={`${order.sent_date ? timelineReached : timelineUnreached} py-1 !w-18`} />
                <div className="relative">
                    <ProcurementBadge label="SENT" className={`absolute -top-5 text-center left-1/2 -translate-x-1/2 text-2xs ${!order.sent_date && "grayscale"}`} />
                    <div className="absolute -bottom-5 text-2xs text-center left-1/2 -translate-x-1/2 w-10 font-bold uppercase">{ order.sent_date && shortDate(formatDateTime(order.sent_date)) }</div>
                    <div className={`${order.sent_date ? timelineReached : timelineUnreached} flex-center rounded-full w-8 h-8 border-1 border-white`}>
                        <Send className="w-4 h-4 text-white" />
                    </div>
                </div>
                <Separator className={`${order.confirmed_date ? timelineReached : timelineUnreached} py-1 !w-18`} />
                <div className="relative">
                    <ProcurementBadge label="CONFIRMED" className={`absolute -top-5 text-center left-1/2 -translate-x-1/2 text-2xs ${!order.confirmed_date && "grayscale"}`} />
                    <div className="absolute -bottom-5 text-2xs text-center left-1/2 -translate-x-1/2 w-10 font-bold uppercase">{ order.confirmed_date && shortDate(formatDateTime(order.confirmed_date)) }</div>
                    <div className={`${order.confirmed_date ? timelineReached : timelineUnreached} flex-center rounded-full w-8 h-8 border-1 border-white`}>
                        <CircleCheckBig className="w-4 h-4 text-white" />
                    </div>
                </div>
                <Separator className={`${order.delivered_date ? timelineReached : timelineUnreached} py-1 !w-18`} />
                <div className="relative">
                    <ProcurementBadge label="DELIVERED" className={`absolute -top-5 text-center left-1/2 -translate-x-1/2 text-2xs ${!order.delivered_date && "grayscale"}`} />
                    <div className="absolute -bottom-5 text-2xs text-center left-1/2 -translate-x-1/2 w-10 font-bold uppercase">{ order.delivered_date && shortDate(formatDateTime(order.delivered_date)) }</div>
                    <div className={`${order.delivered_date ? timelineReached : timelineUnreached} flex-center rounded-full w-8 h-8 border-1 border-white`}>
                        <Truck className="w-4 h-4 text-white" />
                    </div>
                </div>
                <Separator className={`${timelineUnreached} py-1 !w-18`} />
                <div className="relative">
                    <ProcurementBadge label="RECEIVED" className="absolute -top-5 text-center left-1/2 -translate-x-1/2 text-2xs grayscale" />
                    <div className="absolute -bottom-5 text-2xs text-center left-1/2 -translate-x-1/2 w-10 font-bold"></div>
                    <div className={`${timelineUnreached} flex-center rounded-full w-8 h-8 border-1 border-white`}>
                        <PackageCheck className="w-4 h-4 text-white" />
                    </div>
                </div>
            </div>

            <AlertDialog open={ open } onOpenChange={ setOpen }>
                <AlertDialogContent className="w-fit flex flex-col gap-6">
                    <AlertDialogTitle><ProcurementHeader label="update order status?" /></AlertDialogTitle>
                    <div className="flex-center gap-2">
                        <ProcurementBadge className="!text-sm" label={ order.status } />
                        <ArrowBigRight className="text-orange-900 scale-x-150 w-4 h-4" fill="#7e2a0c" />
                        <ProcurementBadge 
                            className="!text-sm"
                            label={ order.status === 'SENT' ? 'CONFIRMED' : 'DELIVERED' }
                        />
                    </div>
                    <div className="text-center font-semibold uppercase text-gray-500 text-sm"><span className="text-black">WARNING:</span> this action is irreversible.</div>
                    <div className="flex-center gap-2">
                        <Button 
                            onClick={ () => setOpen(!open) }
                            className="!bg-red-900 font-bold hover:opacity-90"
                            size="sm"
                        >
                            CANCEL
                        </Button>
                        <Button 
                            onClick={ updateStatus }
                            className="!bg-green-900 font-bold hover:opacity-90"
                            size="sm"
                            disabled={ onProcess }
                        >
                            CONFIRM
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={ success } onOpenChange={ setSuccess }>
                <AlertDialogContent className="w-fit flex flex-col gap-2">
                    <AlertDialogTitle><ProcurementHeader label="status updated!" /></AlertDialogTitle>
                    <div className="text-sm text-center font-bold">ORDER STATUS IS NOW</div>
                    <ProcurementBadge className="text-[16px] mx-auto" label={ order.status } />
                    <div className="flex-center gap-2 mt-4">
                        <Button 
                            onClick={ () => setSuccess(!success) }
                            variant="outline"
                            className="font-bold"
                            size="sm"
                        >
                            CLOSE
                        </Button>
                        <Button 
                            onClick={ () => { window.location.href = '/?activeTab=ORDERS' } }
                            className="!bg-green-900 font-bold hover:opacity-90"
                            size="sm"
                            disabled={ onProcess }
                        >
                            BACK TO ORDERS
                        </Button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}