"use client"

import { Input } from "@/components/ui/input"
import { ProcurementHeader } from "@/features/procurement/components/Header"
import { useFetchData } from "@/hooks/use-fetch-data"
import { ArrowLeft, EllipsisVertical, Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { useSearchFilter } from "@/hooks/use-search-filter"
import { Pagination } from "@/components/custom/Pagination"
import { usePagination } from "@/hooks/use-pagination"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { EmptyState } from "@/components/custom/EmptyState"
import { DiscountService } from "@/services/sales/discountService"
import CreateDiscount from "./components/CreateDiscount"
import { Button } from "@/components/ui/button"

function isWithinDateRange(date: string, range: string) {
    const d = new Date(date)
    const now = new Date()

    switch (range) {
        case "TODAY":
            return d.toDateString() === now.toDateString()

        case "WEEK": {
            const start = new Date(now)
            start.setDate(now.getDate() - now.getDay())
            return d >= start
        }

        case "MONTH":
            return d.getMonth() === now.getMonth() &&
                d.getFullYear() === now.getFullYear()

        case "QUARTER": {
            const quarter = Math.floor(now.getMonth() / 3)
            return Math.floor(d.getMonth() / 3) === quarter &&
                d.getFullYear() === now.getFullYear()
        }

        case "YEAR":
            return d.getFullYear() === now.getFullYear()

        default:
            return true
    }
}

export function DiscountsPage() {
    const [open, setOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [typeFilter, setTypeFilter] =
        useState<"ALL" | "Discount Percentage" | "Fixed Amount">("ALL")
    const [dateFilter, setDateFilter] =
        useState<"ALL" | "TODAY" | "WEEK" | "MONTH" | "QUARTER" | "YEAR">("ALL")

    const { data: discounts = [], loading } = useFetchData(
        DiscountService.getAllDiscounts,
        [reload]
    )

    const { setSearch, filteredItems } = useSearchFilter(
        discounts,
        ["name", "type"]
    )

    const filteredDiscounts = useMemo(() => {
        return filteredItems.filter((d: any) => {
            const typeMatch =
                typeFilter === "ALL" || d.type === typeFilter

            const dateMatch =
                dateFilter === "ALL" ||
                isWithinDateRange(d.created_at, dateFilter)

            return typeMatch && dateMatch && !d.is_deleted
        })
    }, [filteredItems, typeFilter, dateFilter])

    const {
        page,
        size,
        setPage,
        paginated,
    } = usePagination(filteredDiscounts, 10)

    if (loading) return <div>Loading</div>

    return (
        <section className="w-full flex flex-col gap-2">
            <div className="flex-center-y gap-4">
                <ArrowLeft
                    onClick={() => history.back()}
                    className="w-6 h-6 cursor-pointer"
                    strokeWidth={3}
                />
                <ProcurementHeader label="starbucks discounts" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <div className="w-full sm:w-auto flex-1">
                    <Input
                        type="text"
                        placeholder="Search discounts..."
                        className="w-full bg-white"
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <Select
                    value={typeFilter}
                    onValueChange={v => setTypeFilter(v as any)}
                >
                    <SelectTrigger className="w-[200px] bg-white">
                        <SelectValue placeholder="Discount Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Types</SelectItem>
                        <SelectItem value="Discount Percentage">Percentage</SelectItem>
                        <SelectItem value="Fixed Amount">Fixed Amount</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={dateFilter}
                    onValueChange={v => setDateFilter(v as any)}
                >
                    <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Time</SelectItem>
                        <SelectItem value="TODAY">Today</SelectItem>
                        <SelectItem value="WEEK">This Week</SelectItem>
                        <SelectItem value="MONTH">This Month</SelectItem>
                        <SelectItem value="QUARTER">This Quarter</SelectItem>
                        <SelectItem value="YEAR">This Year</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    onClick={ () => setOpen(true) }
                    className="!bg-green-900 hover:opacity-90"
                >
                    <Plus /> Create Discount
                </Button>
            </div>

            <div className="flex items-center thead">
                <div className="thead grid grid-cols-4 w-full">
                    <div className="th">Discount Name</div>
                    <div className="th">Type</div>
                    <div className="th">Value</div>
                    <div className="th">Created</div>
                </div>
                <div className="w-10 th flex-center">
                    <EllipsisVertical className="w-4 h-4" />
                </div>
            </div>

            {paginated.length === 0 && (
                <EmptyState title="No discounts found." />
            )}

            {paginated.map((d: any) => (
                <div key={d.id} className="flex items-center tdata">
                    <div className="grid grid-cols-4 w-full">
                        <div className="td font-medium">
                            {d.name}
                        </div>

                        <div className="td text-xs">
                            {d.type}
                        </div>

                        <div className="td font-semibold">
                            {d.type === "Discount Percentage"
                                ? `${d.value}%`
                                : d.value}
                        </div>

                        <div className="td text-xs">
                            {new Date(d.created_at).toLocaleDateString()}
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="w-10 flex-center">
                            <button>
                                <EllipsisVertical className="w-4 h-4" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem>
                                View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Edit
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ))}

            <Pagination
                totalItems={filteredDiscounts.length}
                itemsPerPage={size}
                currentPage={page}
                onPageChange={setPage}
            />

            {open && (
                <CreateDiscount 
                    setOpen={ setOpen }
                    setReload={ setReload }
                />
            )}
        </section>
    )
}
