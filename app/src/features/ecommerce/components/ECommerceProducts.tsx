import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProcurementHeader } from "@/features/procurement/components/Header";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { formatToPeso } from "@/lib/formatter";
import { ProductService } from "@/services/ecommerce/productService";
import { ArrowBigRight, ArrowLeft, Minus, Plus, ShoppingBasket, Stethoscope } from "lucide-react";
import Image from "next/image";
import { Dispatch, useMemo, useState } from "react";
import { toast } from "sonner";

export function EcommerceProducts({ tab, handleSelect, id }: {
    tab: string
    handleSelect: (i: any) => void
    id: string
}) {
    const [flipped, setFlipped] = useState<Record<number, boolean>>({});
    const [selected, setSelected] = useState<any>();
    const { data, loading } = useFetchData(ProductService.getByBranch, [], [id]);
    const { setSearch, filteredItems } = useSearchFilter(data, ['name']);

    const filteredProducts = useMemo(() => {
        return filteredItems.filter((item: any) => item.category === tab);
    }, [tab, filteredItems]);

    if (loading) return <div>Loading</div>
    return (
        <ScrollArea className="relative w-full">
            <ProcurementHeader label={ `${tab} Products` } />
            <Input
                placeholder="Search for a product"
                className="w-120 bg-white mt-2"
            />

            {filteredProducts.length === 0 && (
                <div className="flex-center flex-col py-20 text-center">
                    <Image
                        src="/svg/logo2.svg"
                        alt="No products"
                        width={180}
                        height={180}
                        className="mb-4"
                    />
                    <h2 className="text-xl font-semibold text-green-900">
                        No Products Available
                    </h2>
                    <p className="text-gray-600 text-sm mt-1 max-w-xs">
                        This Starbucks branch does not have any products listed under <strong>{tab}</strong> yet.
                    </p>
                </div>
            )}
            
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 mt-2">
                

                {filteredProducts.map((item, i) => (
                    <div
                        key={i}
                        className="mb-4 break-inside-avoid cursor-pointer flip-card border-none rounded-md"
                    >
                        <div className={`flip-inner ${flipped[i] ? "flip-rotate" : ""}`}>
                            <div className="flip-front bg-white shadow-sm rounded-md overflow-hidden">
                                <div 
                                    onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
                                    className="w-full h-auto relative"
                                >
                                    <Image
                                        src={item.image_url ?? "/placeholder.png"}
                                        alt={item.name}
                                        width={400}
                                        height={400}
                                        className="object-cover w-full h-auto"
                                    />
                                </div>
                                <div className="p-3 flex flex-col gap-1">
                                    <h3 className="text-green-900 font-semibold text-sm">{item.name}</h3>
                                    <p className="text-orange-800 font-extrabold text-xl">
                                    {formatToPeso(item.price)}
                                    </p>
                                </div>
                                <button 
                                    onClick={ () => setSelected(item) }
                                    className="w-full text-sm font-bold bg-green-900 text-white py-2 hover:opacity-90 transition tracking-wider"
                                >
                                    ORDER
                                </button>
                            </div>

                            <div 
                                onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
                                className="flip-back absolute inset-0 bg-white shadow-md p-4 text-green-900 flex flex-col"
                            >
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-sm text-gray-700 mt-4">{item.description}</p>
                            </div>

                        </div>
                    </div>
                ))}


                {selected && (
                    <SelectedProduct
                        item={ selected }
                        setSelected={ setSelected }
                        handleSelect={ handleSelect }
                    />
                )}
            </div>
        </ScrollArea>
    )
}

function SelectedProduct({ item, setSelected, handleSelect }: {
    item: any
    setSelected: any
    handleSelect: any
}) {
    const [qty, setQty] = useState(1);
    return (
        <Dialog open onOpenChange={ (open) => {if (!open) setSelected(undefined) }}>
            <DialogContent className="!max-w-200">
                <DialogTitle></DialogTitle>
                <div className="flex">
                    <Image
                        src={ item.image_url }
                        alt={ item.name }
                        width={300}
                        height={300}
                        className="rounded-md"
                    />
                    <div className="flex flex-col gap-2 px-4">
                        <div className="text-3xl font-semibold">{item.name }</div>
                        <div className="text-[14px] text-gray-600">{ item.description }</div>
                        <div className="flex-center-y gap-5">
                            <div className="text-2xl font-extrabold text-orange-900">{ formatToPeso(item.price) }</div>
                            <ArrowBigRight className="w-5 h-5 scale-x-120" fill="#000" />
                            <div className="text-2xl font-extrabold text-green-900">{ formatToPeso(item.price * qty) } <span className="text-sm font-semibold">(for { qty } order/s.)</span></div>
                        </div>
                        <div className="w-64 flex-center gap-5 bg-slate-50 rounded-lg shadow-sm px-5 py-2">
                            <button
                                onClick={ () => {
                                    if (qty === 1) {
                                        return
                                    } else setQty(prev => prev - 1)
                                } }
                                className="bg-red-900 rounded-full p-0.5"
                            >
                                <Minus className="w-4 h-4 text-white" />
                            </button>
                            <div className="font-extrabold text-3xl">{ qty }</div>
                            <button
                                onClick={ () => setQty(prev => prev + 1) }
                                className="bg-green-900 rounded-full p-0.5"
                            >
                                <Plus className="w-4 h-4 text-white" />
                            </button>
                        </div>
                        <div className="flex-center-y gap-2 mt-auto">
                            <Button
                                className="w-32 !bg-orange-900 font-bold tracking-wider"
                            >
                                BUY NOW
                            </Button>
                            <Button
                                onClick={ () => {
                                    handleSelect({
                                        product_id: item.id,
                                        name: item.name,
                                        quantity: qty,
                                        unit_price: item.price,
                                        image_url: item.image_url
                                    });
                                    setSelected(undefined)
                                } }
                                className="w-32 !bg-green-900 font-bold tracking-wider"
                            >
                                ADD TO BAG
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}