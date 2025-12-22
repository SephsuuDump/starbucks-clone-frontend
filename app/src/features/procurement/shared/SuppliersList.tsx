"use client"

import { ProcurementHeader } from "@/features/procurement/components/Header";
import { SupplierCard } from "@/features/procurement/shared/SupplierCard";
import { useAuth } from "@/hooks/use-auth";
import { useFetchData } from "@/hooks/use-fetch-data";
import { SupplierService } from "@/services/procurement/supplierService";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SupplierList() {
    const { claims, loading: authLoading } = useAuth();
    const { data: suppliers = [], loading } = useFetchData(SupplierService.getAllSuppliers);

    const [tab, setTab] = useState<"VERIFIED" | "UNVERIFIED">("VERIFIED");

    if (loading || authLoading) return <div>Loading</div>;

    const filteredSuppliers =
        tab === "VERIFIED"
            ? suppliers.filter((s: any) => s.is_active === true)
            : suppliers.filter((s: any) => s.is_active === false);

    return (
        <section className="flex flex-col gap-2">
            <ProcurementHeader label="Suppliers" />

            {/* Tabs */}
            <div className="flex gap-2 mb-2">
                <Button
                    onClick={() => setTab("VERIFIED")}
                    className={`${tab === "VERIFIED" ? "!bg-green-900 text-white" : "!bg-white text-dark"} rounded-full`}
                >
                    Verified
                </Button>

                <Button
                    onClick={() => setTab("UNVERIFIED")}
                    className={`${tab === "UNVERIFIED" ? "!bg-orange-900 text-white" : "!bg-white text-dark"} rounded-full`}
                >
                    Unverified
                </Button>
            </div>

            {/* List */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                {filteredSuppliers.map((item: any, index: number) => (
                    <SupplierCard 
                        key={index} 
                        supplier={item}
                        role={claims.role}
                    />
                ))}
            </div>
        </section>
    );
}
