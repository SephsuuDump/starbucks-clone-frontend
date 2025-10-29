"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProcurementHeader } from "@/features/procurement/components/Header";
import { useFetchData } from "@/hooks/use-fetch-data";
import { formatToPeso } from "@/lib/formatter";
import { ProductService } from "@/services/ecommerce/productService";
import { EllipsisVertical } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CreateProduct from "../components/CreateProduct";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteProduct } from "./DeleteProduct";
import { useSearchFilter } from "@/hooks/use-search-filter";

const categories = ["ALL PRODUCTS", "BAKED", "DESSERTS", "FRAPUCCINO", "FRUITS", "ICED CHOCOLATE", "ICED COFFEE", "ICED ESPRESSO", "ICED TEA", "PASTA", "REFRESHERS", "SANDWICHES"]

export function ProductsPage() {
    const [reload, setReload] = useState(false);
    const [filter, setFilter] = useState(categories[0]);
    const { data: products, loading } = useFetchData(ProductService.getAllProducts, [reload]);
    const { setSearch, filteredItems } = useSearchFilter(products, ['name']);

    const filteredProducts = useMemo(() => {
        if (filter === "ALL PRODUCTS") return filteredItems;
        return filteredItems.filter(item => item.category === filter);
    }, [filter, filteredItems]);

    const [open, setOpen] = useState(false);
    const [toDelete, setDelete] = useState<any>();

    if (loading) return <div>Loading</div>
    return (
        <section className="w-full flex flex-col gap-2">
            <ProcurementHeader label="starbucks products" />
            <div className="flex flex-wrap items-center gap-2">
                <div className="w-full sm:w-auto flex-1">
                    <Input
                        type="text"
                        placeholder="Search products..."
                        className="w-full bg-white"
                        onChange={ e => setSearch(e.target.value) }
                    />
                </div>
                <Select
                    value={ filter }
                    onValueChange={ (value) => setFilter(value) }
                >
                    <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((item, i) => (
                            <SelectItem value={ item } key={i}>{ item }</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button     
                    onClick={ () => setOpen(true) }
                    className="bg-emerald-800 hover:bg-emerald-900"
                >
                    Add New
                </Button>
            </div>

            <div className="flex items-center thead">
                <div className="thead grid grid-cols-4 w-full">
                    <div className="th">Product Name</div>
                    <div className="th">Description</div>
                    <div className="th">Category</div>
                    <div className="th">Unit Price</div>
                </div>
                <button className="w-10 th flex justify-center items-center">
                    <EllipsisVertical className="w-4 h-4" />
                </button>
            </div>

            {filteredProducts.map((item: any, i: number) => (
                <div 
                    key={i}
                    className="flex items-center tdata"
                >
                    <div className="grid grid-cols-4 w-full">
                        <div className="td">{ item.name }</div>
                        <div className="td">
                            {item.description.length > 100 
                                ? item.description.slice(0, 100) + "..." 
                                : item.description}
                        </div>
                        <div className="td">{ item.category }</div>
                        <div className="td">{ formatToPeso(item.price) }</div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="w-10 flex-center">
                            <button
                            
                            >
                            <EllipsisVertical className="w-4 h-4" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => console.log("Edit")}>
                                View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => console.log("Duplicate")}>
                                Update
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={ () => setDelete(item) }
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )) }

            {open && (
                <CreateProduct
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}

            {toDelete && (
                <DeleteProduct
                    toDelete={ toDelete }
                    setDelete={ setDelete }
                    setReload={ setReload }
                />
            )}

        </section>
    )
}