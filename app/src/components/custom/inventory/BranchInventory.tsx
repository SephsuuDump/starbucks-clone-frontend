'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Divide, Funnel, Plus, Search, SquarePen, Trash2, TruckIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ProcurementHeader } from "../procurement/Header"
import { useEffect, useState } from "react"
import { Inventory } from "@/types/Inventory"
import { InventoryService } from "@/services/Inventory/InventoryService"
import { toast } from "sonner"
import { Page } from "@/types/page"
import DeleteInventoryModal from "./DeleteInventoryModal"
import AddQuantityModal from "./AddQuantity"
import { AddInventoryModal, fetchAllBranchInventory } from "./AddInventoryModal"



function categorizeInventory(inventory: Inventory[]) {
  const low: Inventory[] = [];
  const warn: Inventory[] = [];
  const attention: Inventory[] = [];
  const unconfigured: Inventory[] = [];

  for (const item of inventory) {
    const required = item.inventory_item.required_stock ?? 0;

    if (required === 0) {
      unconfigured.push(item);
      continue;
    }


    if (item.qty < required) {
      low.push(item);
    } else if (item.qty <= required + 5) {
      warn.push(item);
    } else if (item.qty <= required + 10) {
      attention.push(item);
    }
  }

  return { low, warn, attention };
}

export function BranchInventory() {
    const [inventory, setInventory] = useState<Inventory[]>([]);
    const [page, setPage] = useState<Page>({ page: 1, limit: 10});
    const [totalPages, setTotalPages] = useState(0);
    const [openDelete, setOpenDelete] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState<Inventory>();
    const [openAddInventory, setOpenAddInventory] = useState(false);
    const [allInventory, setAllInventory] = useState<Inventory[]>([]);
    const { low, warn, attention} = categorizeInventory(allInventory)
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
        setDebouncedSearch(search);
        setPage((p) => ({ ...p, page: 1 })); 
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        async function getInventory(branch_id : string) {
            try {
                const data = await InventoryService.getByBranch(
                branch_id,
                page.page,
                page.limit,
                debouncedSearch
                );
                setInventory(data.data);
                setTotalPages(data.totalPages);


                const all = await fetchAllBranchInventory(branch_id);
                setAllInventory(all);
            } catch(e) {
                toast.error(`${e}`)
            }   
        }

        getInventory("7e42ef23-002b-4d39-8d12-9101bbaf2385")
    }, [page, loading, debouncedSearch])


    return (
        <>
        {openDelete && <DeleteInventoryModal setLoading={setLoading} loading={loading} setOpenDelete={setOpenDelete} name={editing!.inventory_item.name} id ={editing!.id} />}
        {openAdd && <AddQuantityModal setLoading={setLoading} loading={loading} setOpenAdd={setOpenAdd} name={editing!.inventory_item.name} id ={editing!.id} />}
        {openAddInventory && (
          <AddInventoryModal
            id="7e42ef23-002b-4d39-8d12-9101bbaf2385" 
            open={openAddInventory} 
            setOpen={setOpenAddInventory} 
            currentInventory={inventory} 
            setLoading={setLoading}
          />
        )}
        <div className="flex flex-col gap-6">
            <div>
                <ProcurementHeader label="Inventory" />
            </div> 

            <div className="bg-white rounded-xl shadow-md p-5 flex justify-between">
                <div className="flex gap-1">
                <Input
                    type="text"
                    placeholder="Search by Inventory Item"
                    className="w-72"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                </div>

                <div className="flex gap-3">
                <Button className="!bg-green-900 px-4 py-2 rounded-lg text-white shadow hover:opacity-90"
                  onClick={() => setOpenAddInventory(true)}>
                    + Add Inventory
                </Button>
                <Button className="!bg-green-900 px-4 py-2 rounded-lg text-white shadow hover:opacity-90">
                    Request Transfer
                </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mt-1">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Inventory Suggestions</h2>
                <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">

                    <div className="border rounded-lg p-4 bg-red-50">
                    <h3 className="font-bold text-red-700 flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span> Low Stock
                    </h3>
                    <ul className="text-sm text-gray-700 list-disc list-inside">
                        {low.length > 0 ? low.map((i) => (
                        <li key={i.id}>
                            {i.inventory_item.name} ({i.qty}/{i.inventory_item.required_stock})
                        </li>
                        )) : <li className="italic text-gray-500">No items</li>}
                    </ul>
                    </div>

                    <div className="border rounded-lg p-4 bg-yellow-50">
                    <h3 className="font-bold text-yellow-700 flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Warning
                    </h3>
                    <ul className="text-sm text-gray-700 list-disc list-inside">
                        {warn.length > 0 ? warn.map((i) => (
                        <li key={i.id}>
                            {i.inventory_item.name} ({i.qty}/{i.inventory_item.required_stock})
                        </li>
                        )) : <li className="italic text-gray-500">No items</li>}
                    </ul>
                    </div>

                    <div className="border rounded-lg p-4 bg-blue-50">
                    <h3 className="font-bold text-blue-700 flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 bg-blue-500 rounded-full"></span> Attention
                    </h3>
                    <ul className="text-sm text-gray-700 list-disc list-inside">
                        {attention.length > 0 ? attention.map((i) => (
                        <li key={i.id}>
                            {i.inventory_item.name} ({i.qty}/{i.inventory_item.required_stock})
                        </li>
                        )) : <li className="italic text-gray-500">No items</li>}
                    </ul>
                    </div>
                </div>
            </div>

           

            <div className="bg-white rounded-xl shadow-md p-8">
                <div className="overflow-x-auto">
                <div className="grid grid-cols-6 text-sm font-bold text-gray-600 border-b pb-3">
                    <div >ID</div>
                    <div className="ms-5">Quantity</div>
                    <div>Item (Name & Unit)</div>
                    <div>Branch Name</div>
                    <div>Required Stock </div>
                    <div className="text-center">Actions</div>
                </div>
                
                {inventory.length === 0 ? (
                    <div className="flex items-center justify-center bg-gray-50 p-4 rounded-lg text-gray-700 font-semibold text-sm">
                        No Inventory found
                    </div>
                ) :
                <>
                  {inventory.map((item, i) => (
                    <div className="grid grid-cols-6 items-center text-sm py-2 px-1 rounded-lghover:bg-gray-50"
                    key={i}> 
                        <div className="font-bold text-gray-800">{item.id}</div>
                        <div className="text-gray-700 ms-5">{item.qty}</div>
                        <div className="text-gray-700">{item.inventory_item.name} ({item.inventory_item.unit_measurement})</div>
                        <div className="text-gray-700">{item.branch?.name}</div>
                        <div className="text-gray-700">{item.inventory_item.required_stock}</div>
                        <div className="flex gap-2 justify-center">
                        <Button className="!bg-green-600 px-3 py-1 rounded-md flex items-center gap-1 text-white hover:opacity-90" 
                        onClick={() => {
                            setOpenAdd(true)
                            setEditing(item)
                        }}>
                            <Plus className="w-4 h-4" /> Add Quantity
                        </Button>
                        <Button className="!bg-red-600 px-3 py-1 rounded-md flex items-center gap-1 text-white hover:opacity-90" 
                        onClick={() => {
                            setEditing(item)
                            setOpenDelete(true)
                            }   
                        }>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        </div>
                    </div>
                ))}
                </>
            }

            <div className="flex items-center gap-3 pt-5">
                    <button
                        disabled={page.page === 1}
                        onClick={() => setPage(p => ({ ...p, page: p.page - 1 }))}
                        className="p-2 rounded-md border border-gray-300 bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40"
                    >
                        <ChevronLeft className="w-3 h-3 text-gray-700" />
                    </button>

                    <h1 className="text-sm font-medium text-gray-700">
                        PAGE {page.page} of {totalPages}
                    </h1>

                    <button
                        disabled={page.page === totalPages}
                        onClick={() => setPage(p => ({ ...p, page: p.page + 1 }))}
                        className="p-2 rounded-md border border-gray-300 bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40"
                    >
                        <ChevronRight className="w-3 h-3 text-black" />
                    </button>
                    </div>
                </div>
            </div>  
        </div>
        </>
    );    
}
