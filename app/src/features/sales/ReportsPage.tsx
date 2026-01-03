"use client"

import { Separator } from "@/components/ui/separator";
import { ProcurementHeader } from "../procurement/components/Header";
import { useState } from "react";
import { SalesPerformanceSection } from "./components/SalesPerformanceSection";

const tabs = ["SALES PERFORMANCE", "TOP PRODUCTS", "BRANCH SALES", "CUSTOMER ANALYSIS"]

export function ReportsPage() {
    const [tab, setTab] = useState(tabs[0])
    return (
        <section className="w-full flex flex-col gap-2">
            <ProcurementHeader label="Sales report" />
            <div className="flex-center-y gap-6 mt-4">
                {tabs.map((item) => (
                    <button
                        onClick={ () => setTab(item) }
                        key={item}
                        className={`font-extrabold text-gray-500 ${tab === item && "text-green-900"}`}
                    >
                        { item }
                    </button>
                ))}
            </div>
            <Separator className="h-2 bg-gray-300" />

            {tab === tabs[0] && (
                <SalesPerformanceSection />
            )}
        </section>
    )
}