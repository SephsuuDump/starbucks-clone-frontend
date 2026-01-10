"use client"

import { EmptyState } from "@/components/custom/EmptyState";
import { Pagination } from "@/components/custom/Pagination";
import { SupplierDetailsHeader } from "@/features/procurement/components/SupplierDetailsHeader";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { usePagination } from "@/hooks/use-pagination";
import { formatToPeso } from "@/lib/formatter";
import { SupplierService } from "@/services/procurement/supplierService";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function SupplierDetailsPage() {
    const { id } = useParams();

    const { data: supplier, loading } = useFetchOne(
        SupplierService.getSupplierById,
        [id],
        [id]
    );

    const items = supplier?.supplier_item ?? [];

    const {
        page,
        size,
        setPage,
        paginated,
    } = usePagination(items, 10)

    if (!supplier || loading) return <div>Loading</div>
    return(
        <section className="flex flex-col gap-2">
            <SupplierDetailsHeader 
                supplier={ supplier }
            />
            <div className="text-lg font-semibold uppercase">SUPPLY ITEMS OF <span className="text-orange-900">{ supplier.name }</span></div>
            <div className="grid grid-cols-4 thead">
                <div className="th">SKU ID</div>
                <div className="th">Supply Name</div>
                <div className="th">Description</div>
                <div className="th">Unit Cost</div>
            </div>

            {paginated.length === 0 && (
                <EmptyState 
                    title={`No supplier items found.`}
                    message="Try adjusting the search filter"
                />
            )}

            {paginated?.map((item: any, _: number) => (
                <div className="tdata grid grid-cols-4" key={_}>
                    <div className="td uppercase">{ item.id }</div>
                    <div className="td">{ item.name }</div>
                    <div className="td">{ item.description }</div>
                    <div className="td">{ formatToPeso(item.unit_cost) }</div>
                </div>
            ))}

            <Pagination
                totalItems={supplier.supplier_item.length}
                itemsPerPage={size}
                currentPage={page}
                onPageChange={setPage}
            />
        </section>
    );
}