"use client"

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProcurementHeader } from "@/features/procurement/components/Header";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useSearchFilter } from "@/hooks/use-search-filter";
import { formatToPeso } from "@/lib/formatter";
import { ProductService } from "@/services/ecommerce/productService";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

const categories = ["BAKED", "DESSERTS", "FRAPUCCINO", "FRUITS", "ICED CHOCOLATE", "ICED COFFEE", "ICED ESPRESSO", "ICED TEA", "PASTA", "REFRESHERS", "SANDWICHES"]

export function EcommerceCustomerPage() {
    const [tab, setTab] = useState(categories[0]);
    const [flipped, setFlipped] = useState<Record<number, boolean>>({});

    const { data, loading } = useFetchData(ProductService.getAllProducts);
    const { setSearch, filteredItems } = useSearchFilter(data, ['name']);

    const filteredProducts = useMemo(() => {
        return filteredItems.filter(item => item.category === tab);
    }, [tab, filteredItems]);

    if (loading) return <div>Loading</div>
    return (
        <section className="flex gap-4 h-screen">
            <div className="p-4 w-75 h-[95vh] bg-green-900 shadow-sm rounded-md sticky top-0">
                <div>
                    <Image
                        src='/svg/logo2.svg'
                        alt="Starbucks"
                        width={150}
                        height={150}
                        className="drop-shadow-[0_4px_8px_rgba(255,255,255,0.25)]"
                    />
                </div>
                <div className="flex flex-col mt-4">
                    {categories.map((item, i) => (
                        <button 
                            key={i}
                            onClick={ () => setTab(item) }
                            className={`py-2 rounded-sm text-white font-semibold tracking-wider hover:bg-green-800 ${tab === item && "!bg-white !text-orange-900 !font-extrabold"}`}
                        >
                            { item }
                        </button>
                    ))}
                </div>
            </div>
            <ScrollArea className="w-full">
                <ProcurementHeader label={ `${tab} Products` } />
                <Input
                    placeholder="Search for a product"
                    className="w-120 bg-white mt-2"
                />
                <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 mt-2">
                    {filteredProducts.map((item, i) => (
                        <div
                            key={i}
                            className="mb-4 break-inside-avoid cursor-pointer flip-card"
                            onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
                        >
                            <div className={`flip-inner ${flipped[i] ? "flip-rotate" : ""}`}>
                                <div className="flip-front bg-white shadow-md overflow-hidden">
                                    <div className="w-full h-auto relative">
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
                                    <div className="flex">
                                        <button className="flex-1 text-sm font-bold bg-green-900 text-white py-2 hover:opacity-90 transition">
                                        Order
                                        </button>
                                        <button className="flex-1 text-sm font-bold bg-[#6b4423] text-white py-2 hover:opacity-90 transition">
                                        Add to Cart
                                        </button>
                                    </div>
                                </div>

                                <div className="flip-back absolute inset-0 bg-white shadow-md p-4 text-green-900 flex flex-col">
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <p className="text-sm text-gray-700 mt-4">{item.description}</p>
                                </div>

                            </div>
                        </div>
                    ))}
                    </div>


            </ScrollArea>
        </section>
    )
}