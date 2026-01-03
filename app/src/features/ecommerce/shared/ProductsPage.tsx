"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProcurementHeader } from "@/features/procurement/components/Header";
import { useFetchData } from "@/hooks/use-fetch-data";
import { formatToPeso } from "@/lib/formatter";
import { ProductService } from "@/services/ecommerce/productService";
import { ArrowLeft, CheckCheck, EllipsisVertical, SquarePen, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CreateProduct from "../components/CreateProduct";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteProduct } from "../manager/DeleteProduct";
import { useSearchFilter } from "@/hooks/use-search-filter";
import UpdateProduct from "../components/UpdateProduct";
import { useAuth } from "@/hooks/use-auth";
import { EditStock } from "../components/EditStock";
import { Checkbox } from "@/components/ui/checkbox";
import { BulkEdit } from "./components/BulkEdit";
import { BulkDelete } from "./components/BulkDelete";
import { Pagination } from "@/components/custom/Pagination";
import { usePagination } from "@/hooks/use-pagination";
import ViewProduct from "../components/ViewProduct";
import { EditProductRequirement } from "../components/EditProductRequirements";
import { ViewBranchLogs } from "./components/ViewBranchLogs";

const categories = ["ALL PRODUCTS", "BAKED", "DESSERTS", "FRAPUCCINO", "FRUITS", "ICED CHOCOLATE", "ICED COFFEE", "ICED ESPRESSO", "ICED TEA", "PASTA", "REFRESHERS", "SANDWICHES"]

export function ProductsPage() {
    const { claims, loading: authLoading } = useAuth()

    const [reload, setReload] = useState(false)
    const [filter, setFilter] = useState(categories[0])
    const [open, setOpen] = useState(false)
    const [openLogs, setOpenLogs] = useState();
    const [toView, setView] = useState();
    const [toEdit, setEdit] = useState();
    const [toUpdate, setUpdate] = useState<any>()
    const [toBulk, setBulk] = useState<any>([])
    const [toDelete, setDelete] = useState<any>()
    const [editStock, setEditStock] = useState(false)
    const [bulkEdit, setBuldEdit] = useState(false)
    const [bulkDelete, setBuldDelete] = useState(false)

    const isManager = claims?.role === "E-COMMERCE MANAGER"

    const fetchProducts = useFetchData(
        ProductService.getAllProducts,
        [reload, isManager]
    )

    const fetchBranchProducts = useFetchData(
        ProductService.getByBranch,
        [reload, isManager],
        [claims?.branchId]
    )

    const { data: products = [], loading } =
        isManager ? fetchProducts : fetchBranchProducts

    const { setSearch, filteredItems } = useSearchFilter(products, ["name"])

    const filteredProducts = useMemo(() => {
        if (filter === "ALL PRODUCTS") return filteredItems
        return filteredItems.filter(item => item.category === filter)
    }, [filter, filteredItems])

    const { page, size, setPage, paginated } =
        usePagination(filteredProducts, 10)

    if (authLoading || loading) return <div>Loading</div>

    return (
        <section className="w-full flex flex-col gap-2">
            <div className="flex-center-y gap-4">
                <ArrowLeft 
                    onClick={ () => { history.back() } }
                    className="w-6 h-6 cursor-pointer" 
                    strokeWidth={3} 
                />
                <ProcurementHeader label="starbucks products" />
            </div>
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
                {isManager && toBulk.length === 0 && (
                    <Button     
                        onClick={ () => setOpen(true) }
                        className="bg-emerald-800 hover:bg-emerald-900"
                    >
                        Add New
                    </Button>
                )}
                {toBulk.length > 0 && (
                    <Button
                        className="!bg-green-900"
                        onClick={ () => setBuldEdit(true) }
                    >
                        Bulk Update
                    </Button>
                )}
                {toBulk.length > 0 && (
                    <Button
                        className="!bg-red-900"
                        onClick={ () => setBuldDelete(true) }
                    >
                        Bulk Delete
                    </Button>
                )}
            </div>

            <div className="flex items-center thead">
                <div className={`thead grid grid-cols-5 w-full ${!isManager && "grid-cols-6"}`}>
                    <div className="th col-span-2">Product Name</div>
                    {!isManager && <div className="th">Stock</div>}
                    <div className="th">Description</div>
                    <div className="th">Category</div>
                    <div className="th">Unit Price</div>
                </div>
                <button className="w-10 th flex justify-center items-center">
                    <EllipsisVertical className="w-4 h-4" />
                </button>
            </div>

            {paginated.map((item: any, i: number) => (
                <div 
                    key={i}
                    className={`flex items-center tdata`}
                >
                    <div className={`grid grid-cols-5 w-full ${!isManager && "grid-cols-6"}`}>
                        <div className="td flex-center-y gap-2 col-span-2">
                            <img 
                                src={item.image_url} 
                                alt={item.name} 
                                className="w-20 h-20 rounded object-cover"
                            />
                            <div>{ item.name }</div>
                        </div>
                        {!isManager && <div className="td">
                            <X className="w-4 h-4" /> { item.stock }
                            <button onClick={() => setEditStock(item)}>
                                <SquarePen className="text-gray-500 w-4 h-4 ml-4" />
                            </button>
                        </div>}
                        <div className="td">
                            {item.description.length > 100 
                                ? item.description.slice(0, 100) + "..." 
                                : item.description}
                        </div>
                        <div className="td">{ item.category }</div>
                        <div className="td">{ formatToPeso(item.price) }</div>
                    </div>

                    {toBulk.length === 0 ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="w-10 flex-center">
                                <button>
                                    <EllipsisVertical className="w-4 h-4" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem onClick={ () => setView(item) }>
                                    View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setUpdate(item)}>
                                    Update
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setBulk((prev: any) => [...prev, item.id])}
                                >
                                    Select
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setOpenLogs(item)}
                                >
                                    Logs
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    className="text-red-600 focus:text-red-600"
                                    onClick={() => setDelete(item)}
                                >
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="w-10 flex-center">
                            <Checkbox
                                className="border-black"
                                checked={toBulk.includes(item.id)}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        setBulk((prev: any) => [...prev, item.id]);
                                    } else {
                                        setBulk((prev: any) => prev.filter((id: any) => id !== item.id));
                                    }
                                }}
                            />
                        </div>
                    )}
                </div>
            ))}

            <Pagination
                totalItems={ products.length }
                itemsPerPage={ size }
                currentPage={ page }
                onPageChange={ setPage }

            />


            {open && (
                <CreateProduct
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}

            {openLogs && (
                <ViewBranchLogs 
                    toView={ openLogs }
                    setView={ setOpenLogs }
                />
            )}

            {toView && (
                <ViewProduct  
                    toEdit={ toEdit }
                    setEdit={ setEdit }
                    product={ toView }
                    setOpen={ setView }
                />
            )}

            {toEdit && (
                <EditProductRequirement 
                    product={ toEdit }
                    setOpen={ setEdit }
                    setView={ setView }
                    setReload={ setReload }
                />
            )}

            {toUpdate && (
                <UpdateProduct
                    toUpdate={ toUpdate }
                    setUpdate={ setUpdate }
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

            {editStock && (
                <EditStock 
                    open={ editStock }
                    setOpen={ setEditStock }
                    setReload={ setReload }
                />
            )}

            {bulkEdit && (
                <BulkEdit
                    claims={ claims }
                    setOpen={ setBuldEdit }
                    toEdit={ toBulk }
                    setEdit={ setBulk }
                />
            )}

            {bulkDelete && (
                <BulkDelete
                    setOpen={ setBuldDelete }
                    toDelete={ toBulk }
                    setDelete={ setBulk }
                />
            )}
        </section>
    )
}