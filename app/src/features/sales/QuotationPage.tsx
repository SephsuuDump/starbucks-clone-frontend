"use client"

import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { ProcurementHeader } from "../procurement/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCrudState } from "@/hooks/use-crud-state"
import { CreateQuotation } from "./components/CreateQuotation"
import { useState } from "react"
import { OrderService } from "@/services/ecommerce/orderService"
import { useFetchData } from "@/hooks/use-fetch-data"
import { formatDateTime, formatToPeso } from "@/lib/formatter"
import Link from "next/link"


const branches = [
    { id: "032e6326-d605-4e4d-a0de-8c5f62f70774", name: "STARBUCKS HIRAYA" },
    { id: "0b0f48e1-6866-4776-9ce9-31309f5f4dbe", name: "STARBUCKS TRECE" },
]
const tabs = ["ORDERS", "PRODUCTS"]

export function QuotationPage() {
    const { data: quotations, loading: loadingQuotations } = useFetchData(
        OrderService.getQuotations
    )
    const { open, setOpen } = useCrudState();

    if (loadingQuotations) return <div>Loading</div>;
    return (
        <section className="w-full flex flex-col gap-2">
            <div className="flex-center-y gap-4">
                <ArrowLeft 
                    onClick={ () => { history.back() } }
                    className="w-6 h-6 cursor-pointer" 
                    strokeWidth={3} 
                />
                <ProcurementHeader label="quatations" />
            </div>
            <div className="flex-center-y gap-2">
                <Input
                    type="text"
                    placeholder="Search quotation..."
                    className="w-full bg-white"
                    // onChange={ e => setSearch(e.target.value) }
                />
                <Button
                    onClick={ () => setOpen(true) }
                    className="font-extrabold uppercase !bg-green hover:opacity-90"
                >
                    <Plus /> Create Quotation
                </Button>
            </div>
            <div className="flex items-center thead">
                <div className="grid grid-cols-7 w-full">
                    <div className="th">Order ID</div>
                    <div className="th">Customer</div>
                    <div className="th">Branch</div>
                    <div className="th">Discount(s)</div>
                    <div className="th">Status</div>
                    <div className="th !text-right">Total</div>
                    <div className="th">Date</div>
                </div>
            </div>

            {quotations.map((q: any) => (
                <div
                    key={q.id}
                    className="flex items-center tdata"
                >
                    <div className="grid grid-cols-7 w-full">

                        <Link 
                            href={`/sales/orders/${q.id}`}
                            className="td uppercase font-semibold"
                        >
                            OID-{q.id.slice(0, 8)}
                        </Link>

                        <div className="td">
                            {q.customer?.last_name},
                            {" "}
                            {q.customer?.first_name}
                        </div>

                        <div className="td text-sm">
                            {q.branch?.name}
                        </div>

                        <div className="td">
                            {formatDiscounts(q.discounts)}
                        </div>

                        <div className="td">
                            <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                    q.status === "COMPLETED"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                                {q.status}
                            </span>
                        </div>

                        <div className="td font-semibold text-green-900 justify-end">
                            {formatToPeso(q.total_amount)}
                        </div>

                        <div className="td text-xs">
                            {formatDateTime(q.created_at)}
                        </div>

                    </div>
                </div>
            ))}

            {open && (
                <CreateQuotation
                    setOpen={ setOpen }
                />
            )}
        </section>
    )
}

function formatDiscounts(discounts: any[]) {
    if (!discounts || discounts.length === 0) {
        return (
            <span className="italic text-muted-foreground">
                No discount
            </span>
        )
    }

    return (
        <div className="flex flex-col gap-1">
            {discounts.map((d, index) => (
                <div
                    key={index}
                    className="text-xs font-semibold text-red-700"
                >
                    {d.name}
                    {" "}
                    (
                    {d.type === "Discount Percentage"
                        ? `${d.value}%`
                        : formatToPeso(d.value)}
                    )
                </div>
            ))}
        </div>
    )
}
