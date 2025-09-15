"use client"

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatToPeso } from "@/lib/formatter";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export function SupplyOrderForm({ supplier, selectedItems, handleQuantityChange, handleSelect, handleRemove, setTab } : {
    supplier: any;
    selectedItems: any;
    handleQuantityChange: any;
    handleSelect: any;
    handleRemove: any;
    setTab: any;
}) {
    const navigateToReceipt = () => {
        if (selectedItems.length === 0) {
            return toast.error('PLEASE SELECT AN ITEM TO PROCEES');
        }
        setTab('receipt');
    }

    return(
        <section className="flex flex-col gap-2">
            <div className="flex-center gap-2">
                <div className="aspect-[16/9] overflow-hidden">
                    <Image 
                        src={ supplier.logo_url }
                        alt=""
                        width={100}
                        height={100}
                    />
                </div>
                <div className="font-extrabold text-xl uppercase">Ordering supply from <span className="text-orange-900">{ supplier.name }</span></div>            
            </div>

            <div className="thead grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]">
                <div className="th">Supply Name</div>
                <div className="th">Quantity</div>
                <div className="th">Description</div>
                <div className="th">Unit Cost</div>
                <div className="th">Total Cost</div>
                <div className="th"><button className="my-auto"><Trash2 className="w-4 h-4" /></button></div>
            </div>

            {selectedItems.map((item: any, _: number) => (
                <div className="tdata grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto]" key={_}>
                    <div className="td">{ item.name }</div>
                    <div className="td">
                        <input 
                            min="1"
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id!, Number(e.target.value))}
                            className="text-[16px] font-semibold w-18 border-1 rounded-sm bg-slate-100 pl-2"
                        />
                    </div>
                    <div className="td">{ item.description }</div>
                    <div className="td">{ formatToPeso(item.unit_cost) }</div>
                    <div className="td">{ formatToPeso(item.quantity * item.unit_cost) }</div>
                    <div className="td">
                        <button onClick={ () => handleRemove(item.id) }>
                            <Trash2 className="w-4 h-4 text-orange-900" />
                        </button>
                    </div>
                </div>
            ))}

            <div className="grid grid-cols-6 tdata">
                <Select onValueChange={ handleSelect }>
                    <SelectTrigger className="p-0 pl-2 m-0 border-0 shadow-none mx-auto w-fit">
                        <SelectValue placeholder="Select Item">Select Item</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>{ supplier.name } Supplies</SelectLabel>
                            {supplier.supplier_item.map((item: any) => (
                                <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <Button 
                onClick={ () => navigateToReceipt() }
                className="!bg-green-900 font-semibold w-fit uppercase hover:opacity-90 mt-4"
            >
                Purchase Order
            </Button>
        </section>
    );
}