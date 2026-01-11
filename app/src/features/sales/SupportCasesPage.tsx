"use client"

import { Input } from "@/components/ui/input"
import { ProcurementHeader } from "@/features/procurement/components/Header"
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
import supabase from "@/lib/supabase"
import { useFetchData } from "@/hooks/use-fetch-data"
import { SupportCasesService } from "@/services/sales/supportCasesService"

type Case = {
    id: string
    case_number: string
    title: string
    description: string
    status: "open" | "resolved"
    customer: string | null
    assigned_to: string | null
}

export function SupportCasesPage() {
    const { data: casesData, loading: loadingCasesData } = useFetchData(
        SupportCasesService.getAllSupportCases
    )

    const { setSearch, filteredItems } = useSearchFilter<Case>(
        casesData,
        ["case_number", "title", "description", "customer", "assigned_to"]
    )

    const [statusFilter, setStatusFilter] =
        useState<"ALL" | "OPEN" | "RESOLVED">("ALL")

    const filteredCases = useMemo(() => {
        return filteredItems.filter(c => {
            if (statusFilter === "ALL") return true
            if (statusFilter === "OPEN") return c.status === "open"
            if (statusFilter === "RESOLVED") return c.status === "resolved"
            return true
        })
    }, [filteredItems, statusFilter])

    const { page, size, setPage, paginated } =
        usePagination(filteredCases, 10)

    if (loadingCasesData) return <div>Loading</div>
    return (
        <section className="w-full flex flex-col gap-2">
            {/* HEADER */}
            <div className="flex-center-y gap-4">
                <ArrowLeft
                    onClick={() => history.back()}
                    className="w-6 h-6 cursor-pointer"
                    strokeWidth={3}
                />
                <ProcurementHeader label="customer support cases" />
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap items-center gap-2">
                <div className="w-full sm:w-auto flex-1">
                    <Input
                        placeholder="Search cases..."
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
                        <SelectItem value="OPEN">Open</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* TABLE HEADER */}
            <div className="flex items-center thead">
                <div className="grid grid-cols-6 w-full">
                    <div className="th">Case #</div>
                    <div className="th">Title</div>
                    <div className="th">Customer</div>
                    <div className="th">Assigned To</div>
                    <div className="th">Status</div>
                    <div className="th">Description</div>
                </div>
                {/* <div className="w-10 th flex-center">
                    <EllipsisVertical className="w-4 h-4" />
                </div> */}
            </div>

            {/* EMPTY */}
            {paginated.length === 0 && (
                <EmptyState title="No cases found." />
            )}

            {/* TABLE BODY */}
            {paginated.map(c => (
                <div key={c.id} className="flex items-center tdata">
                    <div className="grid grid-cols-6 w-full">
                        <div className="td font-semibold">
                            {c.case_number}
                        </div>

                        <div className="td">
                            {c.title}
                        </div>

                        <div className="td text-xs">
                            {c.customer || "—"}
                        </div>

                        <div className="td text-xs">
                            {c.assigned_to || "Unassigned"}
                        </div>

                        <div className="td">
                            <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                    c.status === "resolved"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                                {c.status.toUpperCase()}
                            </span>
                        </div>

                        <div className="td text-xs truncate">
                            {c.description}
                        </div>
                    </div>

                    {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild className="w-10 flex-center">
                            <button>
                                <EllipsisVertical className="w-4 h-4" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem>
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Assign
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}
                </div>
            ))}

            {/* PAGINATION */}
            <Pagination
                totalItems={filteredCases.length}
                itemsPerPage={size}
                currentPage={page}
                onPageChange={setPage}
            />
        </section>
    )
}
