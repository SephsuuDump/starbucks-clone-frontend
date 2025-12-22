import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { ProcurementHeader } from "@/features/procurement/components/Header";
import { formatToPeso } from "@/lib/formatter";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import Image from "next/image";

export function OrderDrawer({ open, setOpen, selectedItems, setSelectedItems, setInvoice }: {
    open: any
    setOpen: any;
    selectedItems: any
    setSelectedItems: any
    setInvoice: any
}) {
    const totalAmount = selectedItems.reduce((acc: any, i: any) => acc + (i.unit_price * i.quantity), 0);

    return (
        <Drawer open={ open } onOpenChange={ setOpen }>
            <DrawerContent className="fixed mx-auto left-0 top-0 h-full w-[var(--products-width)] !max-w-none border-l rounded-none p-4">
                <DrawerTitle className="flex-center-y justify-between">
                    <ProcurementHeader label="Products Added on cart" />
                    <div className="font-extrabold text-xl"><span className="text-lg text-gray-600">TOTAL:</span> { formatToPeso(totalAmount) }</div>
                </DrawerTitle>
                <div className="mt-4 bg-slate-50 rounded-lg overflow-y-auto">
                    {selectedItems.length > 0 ? (
                        selectedItems.map((item: any, i: number) => (
                            <div className="flex-center-y" key={i}>
                                <div className="w-full grid grid-cols-5 border-b py-2">
                                    <div className="td col-span-2 flex items-center gap-2">
                                        <Image
                                            src={ item.image_url }
                                            alt={item.name}
                                            width={75}
                                            height={75}
                                            className="object-cover rounded"
                                        />
                                        <span className="!text-[16px] font-semibold">{item.name}</span>
                                    </div>
                                    <div className="td  p-4 !text-[16px]">
                                        { formatToPeso(item.unit_price) }
                                    </div>
                                    <div className="td p-4 !text-[16px] flex-center-y gap-4">
                                        <button
                                            onClick={() =>
                                                setSelectedItems((prev: any) =>
                                                    prev.map((it: any) =>
                                                    it.product_id === item.product_id && it.quantity > 1
                                                        ? { ...it, quantity: it.quantity - 1 }
                                                        : it
                                                    )
                                                )
                                            }
                                        >
                                            <Minus className="text-red-900" />
                                        </button>
                                        <div className="flex-center-y">
                                            <X className="w-4 h-4" />
                                            <div className="font-bold text-xl">{item.quantity}</div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                setSelectedItems((prev: any) =>
                                                    prev.map((it: any) =>
                                                    it.product_id === item.product_id ? { ...it, quantity: it.quantity + 1 } : it
                                                    )
                                                )
                                            }
                                        >
                                            <Plus className="text-green-900" />
                                        </button>
                                    </div>
                                    <div className="td p-4 !text-[16px] font-semibold">
                                        { formatToPeso(item.quantity * item.unit_price) }
                                    </div>
                                </div>
                                <button 
                                    onClick={() =>
                                        setSelectedItems((prev: any) => prev.filter((it: any) => it.id !== item.product_id))
                                    }
                                    className="td"
                                >
                                    <X className="text-red-900 w-6 h-6" />
                                </button>
                            </div>
                        ))
                    
                        ) : (
                        <div className="flex-center flex-col text-gray-500 py-10">
                            <ShoppingCart className="w-30 h-30" />
                            <div className="text-gray-600">YOU HAVE NO ITEMS ON YOUR BAG.</div>
                        </div>
                        )}

                </div>
                <Button 
                    onClick={ () => {
                        setInvoice((prev: any) => !prev)
                        setOpen((prev: any) => !prev)
                    }}
                    disabled={ selectedItems.length === 0 }
                    className="absolute font-semibold tracking-wider bottom-0 left-1/2 -translate-x-1/2 !bg-green-900 text-lg"
                >
                    CHECKOUT ORDER
                </Button>
            </DrawerContent>
        </Drawer>
    )
}