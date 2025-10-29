"use client"

import { ProcurementHeader } from "@/features/procurement/components/Header";
import { InvoicePreview } from "@/features/procurement/components/InvoicePreview";
import { RecentOrders } from "@/features/procurement/components/RecentOrders";
import { useEffect, useState } from "react";
import { DashboardSummary } from "../components/DashboardSummary";
import { ProcurementSummaryService } from "@/services/procurement/summaryService";
import { useFetchOne } from "@/hooks/use-fetch-one";

export function InventoryManagerPage() {
    const { data, loading } = useFetchOne<any>(ProcurementSummaryService.getSummary);
    const [activeDateFilter, setDateFilter] = useState("This week");
    const [activeInvoice, setInvoice] = useState<Record<any, any>>();

    useEffect(() => {
        if (data?.toReviewOrders && data.toReviewOrders.length > 0) {
            setInvoice(data.toReviewOrders[0]);
        }
    }, [data]);
    
    if (loading) return <div>Loading</div>
    return (
        <section className="w-full flex flex-col gap-2">
            <ProcurementHeader label="procurement" />
            <DashboardSummary 
                summary={ data }
            />
            <div className="grid grid-cols-5 gap-2">
                <RecentOrders
                    activeDateFilter={ activeDateFilter }
                    setDateFilter={ setDateFilter }
                    activeInvoice={ activeInvoice! }
                    setInvoice={ setInvoice }
                    recentOrder={ data.toReviewOrders }
                />
                <InvoicePreview 
                    activeInvoice={ activeInvoice! } 
                />
            </div>
        </section>
    )
}