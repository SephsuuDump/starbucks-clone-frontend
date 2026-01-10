"use client"

import { Input } from "@/components/ui/input"
import { ProcurementHeader } from "@/features/procurement/components/Header"
import { useFetchData } from "@/hooks/use-fetch-data"
import { formatToPeso } from "@/lib/formatter"
import { ArrowLeft, EllipsisVertical } from "lucide-react"
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
import { OrderService } from "@/services/ecommerce/orderService"
import { EmptyState } from "@/components/custom/EmptyState"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

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

export function OrdersPage() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const date = searchParams.get("date")

    const { data: orders = [], loading } = useFetchData(
        OrderService.getAllOrders
    )

    const { setSearch, filteredItems } = useSearchFilter(
        orders,
        ["id", "status", "customer.first_name", "customer.last_name"]
    )

    const [statusFilter, setStatusFilter] =
        useState<"ALL" | "PENDING" | "COMPLETED" | "PAID">("ALL")

    const [dateFilter, setDateFilter] =
        useState<string>(date || "TODAY")

    const filteredOrders = useMemo(() => {
        return filteredItems.filter((order: any) => {
            const statusMatch =
                statusFilter === "ALL" || order.status === statusFilter

            const dateMatch =
                dateFilter === "ALL" ||
                isWithinDateRange(order.created_at, dateFilter)

            return statusMatch && dateMatch
        })
    }, [filteredItems, statusFilter, dateFilter])

    const {
        page,
        size,
        setPage,
        paginated,
    } = usePagination(filteredOrders, 10)

    if (loading) return <div>Loading</div>

    return (
        <section className="w-full flex flex-col gap-2">
            <div className="flex-center-y gap-4">
                <ArrowLeft
                    onClick={() => history.back()}
                    className="w-6 h-6 cursor-pointer"
                    strokeWidth={3}
                />
                <ProcurementHeader label="starbucks orders" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <div className="w-full sm:w-auto flex-1">
                    <Input
                        type="text"
                        placeholder="Search orders..."
                        className="w-full bg-white"
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <Select
                    value={statusFilter}
                    onValueChange={v => setStatusFilter(v as any)}
                >
                    <SelectTrigger className="w-[160px] bg-white">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
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
            </div>

            <div className="flex items-center thead">
                <div className="thead grid grid-cols-5 w-full">
                    <div className="th">Order ID</div>
                    <div className="th">Customer</div>
                    <div className="th">Branch</div>
                    <div className="th">Status</div>
                    <div className="th">Total</div>
                </div>
                <div className="w-10 th flex-center">
                    <EllipsisVertical className="w-4 h-4" />
                </div>
            </div>

            {paginated.length === 0 && (
                <EmptyState 
                    title={`No orders for ${dateFilter}.`}
                />
            )}

            {paginated.map((order: any) => (
                <div key={order.id} className="flex items-center tdata">
                    <div className="grid grid-cols-5 w-full">
                        <Link
                            href={`/sales/orders/${order.id}`} 
                            className="td font-mono text-xs uppercase font-bold hover:underline"
                        >
                            OID-{order.id.slice(0, 16)}…
                        </Link>

                        <div className="td flex-col !items-start">
                            <div className="font-medium">
                                {order.customer?.first_name} {order.customer?.last_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {order.customer?.city}
                            </div>
                        </div>

                        <div className="td">
                            {order.branch?.name}
                        </div>

                        <div className="td">
                            <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                    order.status === "PAID"
                                        ? "bg-green-100 text-green-700"
                                        : order.status === "COMPLETED"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                                {order.status}
                            </span>
                        </div>

                        <div className="td font-semibold">
                            {formatToPeso(order.total_amount)}
                        </div>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="w-10 flex-center">
                            <button>
                                <EllipsisVertical className="w-4 h-4" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={ () => { router.push(`/sales/orders/${order.id}`) } }>
                                View
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ))}

            <Pagination
                totalItems={filteredOrders.length}
                itemsPerPage={size}
                currentPage={page}
                onPageChange={setPage}
            />
        </section>
    )
}
