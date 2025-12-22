'use client'
import { LocationCard } from "@/components/custom/inventory/Card";
import { ProcurementHeader } from "@/components/custom/procurement/Header";
import { BranchService } from "@/services/Inventory/BranchService";
import { Branch } from "@/types/Branch";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function BranchPage()  {
    const [branches, setBranches] = useState<Branch[]>([]);

    useEffect(() => {
        async function getBranches() {
            try {
                const data = await BranchService.getAll();
                setBranches(data);
            }catch(e : any) {
                toast.error(e.message);
            }
        }

        getBranches();
    }, [branches]);
    return (
        <div className="h-full">
            <ProcurementHeader label="Branches"/>

            <div className="bg-white min-h-[80vh] rounded-xl shadow-md p-5 flex flex-wrap gap-5 mt-6 mb-10">
                {branches.map(branch => (
                    <LocationCard key={branch.id} name={branch.name} location={branch.location} id={branch.id}
                    type="branch"/>
                ))}
            </div>
        </div>
    ); 
}