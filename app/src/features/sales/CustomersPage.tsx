"use client"

import { Input } from "@/components/ui/input"
import { ProcurementHeader } from "@/features/procurement/components/Header"
import { useFetchData } from "@/hooks/use-fetch-data"
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
import { EmptyState } from "@/components/custom/EmptyState"
import { CustomerService } from "@/services/ecommerce/customerService"
import { formatToPeso } from "@/lib/formatter"
import Link from "next/link"

export function CustomersPage() {
    const { data: customers = [], loading } = useFetchData(
        CustomerService.getAllCustomers
    )

    const { setSearch, filteredItems } = useSearchFilter(
        customers,
        ["first_name", "last_name", "email", "city", "province"]
    )

    const [statusFilter, setStatusFilter] =
        useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL")

    const [typeFilter, setTypeFilter] =
        useState<"ALL" | "NEW" | "RETURNING">("ALL")

    const filteredCustomers = useMemo(() => {
        return filteredItems.filter(c => {
            const statusMatch =
                statusFilter === "ALL" ||
                (statusFilter === "ACTIVE" && c.is_active) ||
                (statusFilter === "INACTIVE" && !c.is_active)

            const typeMatch =
                typeFilter === "ALL" ||
                (typeFilter === "NEW" && c.is_new_customer) ||
                (typeFilter === "RETURNING" && !c.is_new_customer)

            return statusMatch && typeMatch
        })
    }, [filteredItems, statusFilter, typeFilter])

    const {
        page,
        size,
        setPage,
        paginated,
    } = usePagination(filteredCustomers, 10)

    if (loading) return <div>Loading</div>

    return (
        <section className="w-full flex flex-col gap-2">
            <div className="flex-center-y gap-4">
                <ArrowLeft
                    onClick={() => history.back()}
                    className="w-6 h-6 cursor-pointer"
                    strokeWidth={3}
                />
                <ProcurementHeader label="starbucks customers" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <div className="w-full sm:w-auto flex-1">
                    <Input
                        type="text"
                        placeholder="Search customers..."
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
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={typeFilter}
                    onValueChange={v => setTypeFilter(v as any)}
                >
                    <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Customer Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Customers</SelectItem>
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value="RETURNING">Returning</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center thead">
                <div className="thead grid grid-cols-6 w-full">
                    <div className="th">Customer</div>
                    <div className="th">Email</div>
                    <div className="th">Location</div>
                    <div className="th">Orders</div>
                    <div className="th">Total Spent</div>
                    <div className="th">Status</div>
                </div>
                <div className="w-10 th flex-center">
                    <EllipsisVertical className="w-4 h-4" />
                </div>
            </div>

            {paginated.length === 0 && (
                <EmptyState title="No customers found." />
            )}

            {paginated.map((c: any) => (
                <div key={c.id} className="flex items-center tdata">
                    <div className="grid grid-cols-6 w-full">
                        <Link 
                            href={`/sales/customers/${c.id}`}
                            className="td flex-col !items-start hover:underline cursor-pointer"
                        >
                            <div className="font-semibold">
                                {c.last_name || "—"}, {c.first_name || ""}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {c.role}
                            </div>
                        </Link>

                        <div className="td text-xs">
                            {c.email}
                        </div>

                        <div className="td text-xs">
                            {c.city || "—"}, {c.country || "—"}
                        </div>

                        <div className="td font-semibold">
                            {c.total_orders ?? 0}
                        </div>

                        <div className="td font-semibold">
                            {formatToPeso(c.total_spent ?? 0)}
                        </div>

                        <div className="td">
                            <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                    c.is_active
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {c.is_active ? "Active" : "Inactive"}
                            </span>
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
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ))}

            <Pagination
                totalItems={filteredCustomers.length}
                itemsPerPage={size}
                currentPage={page}
                onPageChange={setPage}
            />
        </section>
    )
}
