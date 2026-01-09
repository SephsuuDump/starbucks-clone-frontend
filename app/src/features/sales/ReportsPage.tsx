"use client"

import { Separator } from "@/components/ui/separator";
import { ProcurementHeader } from "../procurement/components/Header";
import { useState } from "react";
import { SalesPerformanceSection } from "./components/SalesPerformanceSection";
import TopProductsSection from "./components/TopProductsSection";
import { ArrowLeft } from "lucide-react";
import { BranchSalesSection } from "./components/BranchSalesSection";
import { CustomerAnalysisSection } from "./components/CustomerAnalysysSection";

const tabs = ["SALES PERFORMANCE", "TOP PRODUCTS", "BRANCH SALES", "CUSTOMER ANALYSIS"]

export function ReportsPage() {
    const [tab, setTab] = useState(tabs[0])
    return (
        <section className="w-full flex flex-col gap-2">
            <div className="flex-center-y gap-4">
                <ArrowLeft 
                    onClick={ () => { history.back() } }
                    className="w-6 h-6 cursor-pointer" 
                    strokeWidth={3} 
                />
                <ProcurementHeader label="sales report" />
            </div>
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

            {tab === tabs[1] && (
                <TopProductsSection />
            )}

            {tab === tabs[2] && (
                <BranchSalesSection />
            )}

            {tab === tabs[3] && (
                <CustomerAnalysisSection />
            )}
        </section>
    )
}