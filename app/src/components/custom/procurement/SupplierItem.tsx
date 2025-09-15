import { AddSupplierItemModal } from "@/components/custom/procurement/AddSupplierItemModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatToPeso } from "@/lib/formatter";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function SupplierItem({ supplyItems, open, setOpen, supplierId }: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    supplierId: string;
    supplyItems: any;
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
    return(
        <>
            <div className="flex-center-y justify-between">
                <Input
                    onChange={ e => setSearch(e.target.value) }
                    className="bg-slate-50 w-100"
                    placeholder="Find supply item by SKU ID or name"
                />
                <Button
                    onClick={ () => setOpen(!open) }
                    className="!bg-green-900 hover:opacity-90"
                    size="sm"
                >
                    <Plus /> Add Item
                </Button>
            </div>

            <div className="grid grid-cols-4 thead">
                <div className="th">SKU ID</div>
                <div className="th">Supply Name</div>
                <div className="th">Description</div>
                <div className="th">Unit Cost</div>
            </div>
            {filteredSupplies.map((item: any, _: number) => (
                <div className="tdata grid grid-cols-4" key={_}>
                    <div className="td uppercase">{ item.id }</div>
                    <div className="td">{ item.name }</div>
                    <div className="td">{ item.description }</div>
                    <div className="td">{ formatToPeso(item.unit_cost) }</div>
                </div>
            ))}

            {open &&
                <AddSupplierItemModal 
                    id={ supplierId }
                    setOpen={ setOpen }
                />
            }
        </>
    );
}