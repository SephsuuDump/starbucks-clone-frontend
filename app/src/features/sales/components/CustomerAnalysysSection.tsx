"use client"

import { EmptyState } from "@/components/custom/EmptyState"
import { Pagination } from "@/components/custom/Pagination"
import { useFetchData } from "@/hooks/use-fetch-data"
import { usePagination } from "@/hooks/use-pagination"
import { SalesReportService } from "@/services/sales/reportService"
import { X } from "lucide-react"
import { useMemo } from "react"

export function CustomerAnalysisSection() {
    const { data = [], loading } = useFetchData(
        SalesReportService.getCustomerProductCount
    )

    const groupedByCustomer = useMemo(() => {
        const map = new Map<string, any>()

        data.forEach((row: any) => {
            const key = row.customer_id

            if (!map.has(key)) {
                map.set(key, {
                    customer_id: row.customer_id,
                    user_id: row.user_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    products: [],
                })
            }

            map.get(key).products.push({
                product_id: row.product_id,
                product_name: row.product_name,
                total_items_ordered: row.total_items_ordered,
            })
        })

        return Array.from(map.values())
    }, [data])

    const {
        page,
        size,
        setPage,
        paginated,
    } = usePagination(groupedByCustomer, 10)

    if (loading) return <div>Loading</div>

    return (
        <section className="w-full flex flex-col gap-2">

            <div className="text-orange-900 text-xl font-extrabold">
                CUSTOMER PRODUCT PURCHASES
            </div>

            <div className="flex items-center thead">
                <div className="grid grid-cols-2 w-full">
                    <div className="th">Customer</div>
                    <div className="th">Products Ordered</div>
                </div>
            </div>

            {paginated.length === 0 && (
                <EmptyState title="No customer product data found." />
            )}

            {paginated.map((c: any) => (
                <div
                    key={c.customer_id}
                    className="flex items-center tdata"
                >
                    <div className="grid grid-cols-2 w-full">

                        {/* CUSTOMER */}
                        <div className="td flex-col !justify-center !items-start">
                            <div className="font-semibold">
                                {c.last_name}, {c.first_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                ID: {c.user_id}
                            </div>
                        </div>

                        {/* PRODUCTS */}
                        <div className="td flex-col !items-start gap-2">
                            {c.products.map((p: any) => (
                                <div
                                    key={p.product_id}
                                    className="flex justify-between w-full text-sm"
                                >
                                    <span>{p.product_name}</span>
                                    <span className="flex-center-y font-semibold">
                                        <X className="w-3 h-3" />
                                        {p.total_items_ordered}
                                    </span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            ))}

            <Pagination
                totalItems={groupedByCustomer.length}
                itemsPerPage={size}
                currentPage={page}
                onPageChange={setPage}
            />
        </section>
    )
}
