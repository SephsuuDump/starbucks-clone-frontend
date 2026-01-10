import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatToPeso } from "@/lib/formatter";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CreateSupplierItem } from "../supplier/CreateSupplierItem";
import { toast } from "sonner";
import { usePagination } from "@/hooks/use-pagination";
import { EmptyState } from "@/components/custom/EmptyState";
import { Pagination } from "@/components/custom/Pagination";

export function SupplierItem({ supplyItems, open, setOpen, supplierId, supplier }: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    supplierId: string;
    supplyItems: any;
    supplier: any
}) {
    const [search, setSearch] = useState('');
    const [filteredSupplies, setFilteredSupplies] = useState<any>([]);
    useEffect(() => {
        if (search) {
            setFilteredSupplies(supplyItems.filter((s: any) =>
                s.name.toLowerCase().includes(search.toLowerCase())
            ));
        } else  setFilteredSupplies(supplyItems);
    }, [search, supplyItems]);

    function handleOpenAddItem() {
        if (!supplier.is_active) {
            toast.error("Your supplier account is not active. You cannot add items.");
            return;
        }

        setOpen(true);
    }

    const {
        page,
        size,
        setPage,
        paginated,
    } = usePagination(filteredSupplies, 10)

    return(
        <>
            <div className="flex-center-y justify-between">
                <Input
                    onChange={ e => setSearch(e.target.value) }
                    className="bg-slate-50 w-100"
                    placeholder="Find supply item by SKU ID or name"
                />
                <Button
                    onClick={ handleOpenAddItem }
                    className="!bg-green-900 hover:opacity-90"
                    size="sm"
                >
                    <Plus /> Add Item
                </Button>
            </div>

            <div className="grid grid-cols-4 thead">
                <div className="th">SKU ID</div>
                <div className="th">Supply Name</div>
                <div className="th">Unit Measurement</div>
                <div className="th">Unit Cost</div>
            </div>

            {paginated.length === 0 && (
                <EmptyState 
                    title={`No supplier items found.`}
                    message="Try adjusting the search filter"
                />
            )}

            {paginated.map((item: any, _: number) => (
                <div className="tdata grid grid-cols-4" key={_}>
                    <div className="td uppercase">{ item.id }</div>
                    <div className="td">{ item.name }</div>
                    <div className="td">{ item.description }</div>
                    <div className="td">{ formatToPeso(item.unit_cost) }</div>
                </div>
            ))}

            <Pagination
                totalItems={filteredSupplies.length}
                itemsPerPage={size}
                currentPage={page}
                onPageChange={setPage}
            />

            {open &&
                <CreateSupplierItem 
                    id={ supplierId }
                    setOpen={ setOpen }
                />
            }
        </>
    );
}