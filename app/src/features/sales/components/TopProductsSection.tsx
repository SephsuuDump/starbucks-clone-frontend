"use client"

import { Input } from "@/components/ui/input"
import { ProcurementHeader } from "@/features/procurement/components/Header"
import { useFetchData } from "@/hooks/use-fetch-data"
import { useSearchFilter } from "@/hooks/use-search-filter"
import { usePagination } from "@/hooks/use-pagination"
import { Pagination } from "@/components/custom/Pagination"
import { EmptyState } from "@/components/custom/EmptyState"
import { SalesReportService } from "@/services/sales/reportService"
import { formatToPeso } from "@/lib/formatter"
import { EllipsisVertical } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Fragment, useMemo } from "react"

export default function TopProductsSection() {
    const { data: topProducts = [], loading } =
        useFetchData(SalesReportService.getTopProducts)

    const { setSearch, filteredItems } = useSearchFilter(topProducts, ["product_name"])

    const {
        page,
        size,
        setPage,
        paginated,
    } = usePagination(filteredItems, 10)

    if (loading) return <div>Loading</div>

    return (
        <section className="w-full flex flex-col gap-2 my-4">

            <div className="flex-center-y gap-4">
                <div className="text-orange-900 font-extrabold text-xl">PRODUCT SALES RANKING</div>
            </div>

            {/* <div className="flex flex-wrap items-center gap-2">
                <div className="w-full sm:w-auto flex-1">
                    <Input
                        type="text"
                        placeholder="Search product..."
                        className="w-full bg-white"
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div> */}

            <div className="flex items-center thead">
                <div className="flex-center w-20 th">#</div>
                <div className="grid grid-cols-3 w-full">
                    <div className="th">Product</div>
                    <div className="th">Units Sold</div>
                    <div className="th text-right">Revenue</div>
                </div>
            </div>

            {paginated.length === 0 && (
                <EmptyState title="No product sales found." />
            )}

            
            {paginated.map((p: any, i) => (

                <div className="flex items-center tdata" key={i}>
                    <div className="td flex-center w-20 font-semibold !text-lg">
                        {(page - 1) * size + i + 1}
                    </div>
                    <div className="grid grid-cols-3 w-full">
                        <div className="td gap-2">
                            <img 
                                className="w-15 h-15 rounded-md"
                                src={p.image_url}
                            />
                            <div>{p.product_name}</div>
                        </div>

                        <div className="td">
                            {p.total_quantity_sold}
                        </div>

                        <div className="td justify-end text-green-900">
                            {formatToPeso(p.total_revenue)}
                        </div>
                    </div>
                </div>
            ))}
    

            <Pagination
                totalItems={filteredItems.length}
                itemsPerPage={size}
                currentPage={page}
                onPageChange={setPage}
            />
        </section>
    )
}
