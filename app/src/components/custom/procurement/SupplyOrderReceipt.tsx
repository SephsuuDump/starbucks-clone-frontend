"use client"

import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatTimestamptzToWords, formatToPeso } from "@/lib/formatter";
import { PurchaseOrderItemService } from "@/services/purchaseOrderItemService";
import { PurchaseOrderService } from "@/services/purchaseOrderService";
import { CircleCheckBig, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { ProcurementHeader } from "./Header";

export function SupplyOrderReceipt({ selectedItems, supplier, setTab }: {
    selectedItems: any;
    supplier: any;
    setTab: any;
}) {
    const [open, setOpen] = useState(false); 
    const [po, setPo] = useState();

    const dateToday = new Date().toString();
    const totalCost = selectedItems.reduce((sum: number, item: any) => {
        return sum + (item.quantity * item.unit_cost);
    }, 0);
    console.log({ supplier_id: supplier.id, total_cost: totalCost });
    

    async function handlePurchase() {
        try {
            const po = await PurchaseOrderService.createPurchaseOrder({ supplier_id: supplier.id, total_cost: totalCost });
            if (po) {
                const formattedItems = selectedItems.map((item: any, _: number) => ({
                    po_id: po.id,
                    item_id: item.id,
                    quantity: item.quantity,
                    total_cost: item.quantity * item.unit_cost
                }));                
                await PurchaseOrderItemService.createPurchaseOrderItem(formattedItems);
                setOpen(true);
            }
        } catch (error) { toast.error(`${error}`) }
    }

    return(
        <section className="flex flex-col gap-2">
            <ProcurementHeader label="purchase order receipt" />
            <div className="bg-white p-4 clip-zigzag border-1 border-gray-200">
                <div className="flex justify-between">
                    <div className="uppercase font-semibold text-sm">ORDER ID: <span className="text-gray-500">no id yet</span></div>
                    <div>
                        <Image 
                            className="drop-shadow-lg drop-shadow-gray-500 mx-auto aspect-[16/9]"
                            src={ supplier.logo_url }
                            alt={ supplier.name }
                            width={200}
                            height={200}
                        />
                        <div className="text-xs text-gray-500 uppercase font-semibold text-center my-2">supplier</div>
                        <div className="text-xl font-extrabold text-orange-900 uppercase">please review <span className="text-green-900">your receipt</span></div>
                    </div>
                    <div className="uppercase font-semibold text-sm">Purchase Date: <span className="text-gray-500">{ formatTimestamptzToWords(dateToday) }</span></div>
                </div>
                <div className="text-lg uppercase font-semibold my-4">supplies to purchase</div>
                <div className="thead grid grid-cols-5">
                    <div className="th">Supply Name</div>
                    <div className="th">Quantity</div>
                    <div className="th">Description</div>
                    <div className="th">Unit Cost</div>
                    <div className="th">Total Cost</div>
                </div>
                {selectedItems.map((item: any, _: number ) => (
                    <div className="tdata !mt-0 grid grid-cols-5" key={_}>
                        <div className="td">{ item.name }</div>
                        <div className="td">{ item.quantity }</div>
                        <div className="td">{ item.description }</div>
                        <div className="td">{ formatToPeso(item.unit_cost) }</div>
                        <div className="td">{ formatToPeso(item.unit_cost * item.quantity) }</div>
                    </div>
                ))}
                <Separator />
                <div className="grid grid-cols-5 font-semibold my-2">
                    <div className="col-span-3"></div>
                    <div className="p-2">Total:</div>
                    <div className="p-2">{ formatToPeso(totalCost) }</div>
                </div>
                <div className="flex gap-2 mt-6">
                    <Button
                        onClick={ () => setTab('form') }
                        className="!bg-red-900 font-semibold hover:opacity-90"
                    >
                        RETURN
                    </Button>
                    <Button
                        onClick={ handlePurchase }
                        className="!bg-green-900 font-semibold hover:opacity-90"
                    >
                        PROCEED
                    </Button>
                </div>
            </div>

            <AlertDialog open={ open }>
                <AlertDialogContent className="flex-center flex-col w-fit">
                    <AlertDialogTitle className="font-extrabold text-green-900 text-lg">PURCHASE ORDER SUCCESS</AlertDialogTitle>
                    <CircleCheckBig className="w-25 h-25 text-green-900" strokeWidth={2.5}/>
                    <div className="text-[16px] font-extrabold">YOU CAN RATE <span className="text-orange-900">{ supplier.name }</span></div>
                    <div className="flex -mt-2 gap-2">
                        <Star className="w-6 h-6 text-orange-900" />
                        <Star className="w-6 h-6 text-orange-900" />
                        <Star className="w-6 h-6 text-orange-900" />
                        <Star className="w-6 h-6 text-orange-900" />
                        <Star className="w-6 h-6 text-orange-900" />
                    </div>
                    <Button 
                        onClick={ () => { window.location.href = '/' } }
                        className="!bg-green-900 hover:opacity-90 font-semibold"
                    >
                        RETURN HOME
                    </Button>
                </AlertDialogContent>
            </AlertDialog>
        </section>
    );
}