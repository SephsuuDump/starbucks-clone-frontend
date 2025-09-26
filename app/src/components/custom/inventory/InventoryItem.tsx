'use client'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search, SquarePen, Trash2 } from "lucide-react"
import { ProcurementHeader } from "../procurement/Header"
import { useEffect, useState } from "react"
import { InventoryItemService } from "@/services/Inventory/InventoryItemService"
import { Input } from "@/components/ui/input"
import { AddInventory } from "./AddInventoryItem"
import { InventoryItems } from "@/types/InventoryItem"
import { EditInventory } from "./EditInventoryItem"



type Page = {
    page : number, 
    limit : number
}

export function InventoryItem() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openEdit, setOpenEdit] = useState(false); 
    const [editingSkuid, setEditingSkuid] = useState<string>(); 
    const [items, setItems] = useState<InventoryItems[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState<Page>({
        page : 1,
        limit : 10
    })

    useEffect(() => {
        async function getItems() {
            try {
                const data = await InventoryItemService.getInventoryItems(page.page, page.limit);
                setItems(data.data)
                setTotalPages(data.totalPages)  
            } catch(e) {
                console.log(e);
            }         
        } 
        getItems();
    },[page, loading] )

    return(
        <>
        {open && <AddInventory setOpen={setOpen} />}
        {openEdit && <EditInventory setOpenEdit={setOpenEdit} skuid={editingSkuid!} setLoading={setLoading} />}
        <div className="flex flex-col gap-6">
            
            <div>
                <ProcurementHeader label="Inventory Item" />
            </div>
            <div className="bg-white rounded-xl shadow-md p-5 flex justify-between">
                <div className="flex gap-1">
                    <Input type="text" placeholder="Search" className="w-60"/>
                    <Button className="bg-white shadow-md hover:bg-green-200">
                    <Search className="text-black" />
                    </Button>
                </div>
               
                <Button className="!bg-green-900 px-4 py-2 rounded-lg text-white shadow hover:opacity-90"
                onClick={() => setOpen(!open)}>
                    + Add Item
                </Button>
            </div>

            
            <div className="bg-white rounded-xl shadow-md p-8">
                <div className="overflow-x-auto">
                    <div className="grid grid-cols-7 text-sm font-semibold text-gray-600 border-b pb-3">
                        <div>SKUID</div>
                        <div>Name</div>
                        <div>Category</div>
                        <div>Unit</div>
                        <div>Cost</div>
                        <div>Description</div>
                        <div className="text-center">Actions</div>
                    </div>

                    {items.map((item, index) => (
                        <div
                        key={index}
                        className={`grid grid-cols-7 overflow-y-hidden items-center text-sm py-2 px-1 rounded-lg transition ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-100`}
                        >
                        <div className="font-bold text-gray-800">{item.skuid}</div>
                        <div className="text-gray-700">{item.name}</div>
                        <div className="text-gray-700">{item.category}</div>
                        <div className="text-gray-700">{item.unit_measurement}</div>
                        <div className="text-gray-700">{item.cost}</div>
                        <div className="text-gray-600 truncate">{item.description}</div>
                        <div className="flex gap-2 justify-center">
                            <Button className="!bg-green-600 px-3 py-1 rounded-md flex items-center gap-1 text-white hover:opacity-90"
                            onClick={() => {
                                setEditingSkuid(item.skuid)
                                setOpenEdit(true);
                            }}>
                            <SquarePen className="w-4 h-4" /> Edit
                            </Button>
                            <Button className="!bg-red-600 px-3 py-1 rounded-md flex items-center gap-1 text-white hover:opacity-90">
                            <Trash2 className="w-4 h-4" /> 
                            </Button>
                        </div>
                        </div>
                    ))}
                <div className="flex items-center gap-3 pt-5">
                    <button
                        disabled={page.page === 1}
                        onClick={() => setPage(p => ({ ...p, page: p.page - 1 }))}
                        className="p-2 rounded-md border border-gray-300 bg-white shadow-sm hover:bg-gray-100 hover:opacity-90 disabled:opacity-40"
                    >
                        <ChevronLeft className="w-3 h-3 text-gray-700" />
                    </button>

                    <h1 className="text-sm font-medium text-gray-700">
                        PAGE {page.page} of {totalPages}
                    </h1>

                    <button
                        disabled={page.page === totalPages}
                        onClick={() => setPage(p => ({ ...p, page: p.page + 1 }))}
                        className="p-2 rounded-md border border-gray-300 bg-white shadow-sm hover:bg-gray-100 hover:opacity-90 disabled:opacity-40"
                    >
                        <ChevronRight className="w-3 h-3 text-black" />
                    </button>
                </div>
                </div>
            </div>
        </div>
      </>
    )
}