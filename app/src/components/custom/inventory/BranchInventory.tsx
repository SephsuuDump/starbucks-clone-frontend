'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ProcurementHeader } from "../procurement/Header"
import { useEffect, useState } from "react"
import { Inventory } from "@/types/Inventory"
import { InventoryService } from "@/services/Inventory/InventoryService"
import { toast } from "sonner"
import { Page } from "@/types/page"
import DeleteInventoryModal from "./DeleteInventoryModal"
import AddQuantityModal from "./AddQuantity"
import { AddInventoryModal, fetchAllInventory } from "./AddInventoryModal"

export function categorizeInventory(inventory: Inventory[]) {
  const low: Inventory[] = []
  const warn: Inventory[] = []
  const attention: Inventory[] = []
  const unconfigured: Inventory[] = []
  const categories = new Set<string>()

  for (const item of inventory) {
    const required = item.inventory_item.required_stock ?? 0
    const category = item.inventory_item.category?.trim() ?? ""

    if (category) categories.add(category)

    if (required === 0) {
      unconfigured.push(item)
      continue
    }

    if (item.qty < required) {
      low.push(item)
    } else if (item.qty <= required + 5) {
      warn.push(item)
    } else if (item.qty <= required + 10) {
      attention.push(item)
    }
  }

  return { low, warn, attention, categories: Array.from(categories) }
}

export function BranchInventory() {
  const [inventory, setInventory] = useState<Inventory[]>([])
  const [page, setPage] = useState<Page>({ page: 1, limit: 10 })
  const [totalPages, setTotalPages] = useState(0)
  const [openDelete, setOpenDelete] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<Inventory>()
  const [openAddInventory, setOpenAddInventory] = useState(false)
  const [allInventory, setAllInventory] = useState<Inventory[]>([])
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedStock, setSelectedStock] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const { low, warn, attention, categories } = categorizeInventory(allInventory)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage((p) => ({ ...p, page: 1 }))
    }, 500)
    return () => clearTimeout(handler)
  }, [search])

  useEffect(() => {
    async function getInventory(branch_id: string) {
      try {
        const data = await InventoryService.getByBranch(
          branch_id,
          page.page,
          page.limit,
          debouncedSearch
        )
        setInventory(data.data)
        setTotalPages(data.totalPages)

        const all = await fetchAllInventory("branch", branch_id)
        setAllInventory(all)
      } catch (e) {
        toast.error(`${e}`)
      }
    }

    getInventory("7e42ef23-002b-4d39-8d12-9101bbaf2385")
  }, [page, loading, debouncedSearch])

  let filteredInventory = [...inventory]

  if (selectedStock) {
    if (selectedStock === "low") filteredInventory = low
    else if (selectedStock === "warn") filteredInventory = warn
    else if (selectedStock === "attention") filteredInventory = attention
  }

  if (selectedCategory) {
    filteredInventory = filteredInventory.filter(
      (item) =>
        item.inventory_item.category?.trim().toLowerCase() ===
        selectedCategory.toLowerCase()
    )
  }

  return (
    <>
      {openDelete && (
        <DeleteInventoryModal
          setLoading={setLoading}
          loading={loading}
          setOpenDelete={setOpenDelete}
          name={editing!.inventory_item.name}
          id={editing!.id}
        />
      )}
      {openAdd && (
        <AddQuantityModal
          setLoading={setLoading}
          loading={loading}
          setOpenAdd={setOpenAdd}
          name={editing!.inventory_item.name}
          id={editing!.id}
        />
      )}
      {openAddInventory && (
        <AddInventoryModal
          id="7e42ef23-002b-4d39-8d12-9101bbaf2385"
          open={openAddInventory}
          setOpen={setOpenAddInventory}
          currentInventory={inventory}
          setLoading={setLoading}
          type="branch"
        />
      )}
      <div className="flex flex-col gap-6">
        <div>
          <ProcurementHeader label="Branch Inventory" />
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 flex justify-between">
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              placeholder="Search by Inventory Item"
              className="w-60"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
            >
              <option value="">All Stocks</option>
              <option value="low">Low Stock</option>
              <option value="warn">Warning Stock</option>
              <option value="attention">Attention Stock</option>
            </select>

            <select
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <Button
              className="!bg-green-900 px-4 py-2 rounded-lg text-white shadow hover:opacity-90"
              onClick={() => setOpenAddInventory(true)}
            >
              + Add Inventory
            </Button>
            <Button
              className="!bg-green-900 px-4 py-2 rounded-lg text-white shadow hover:opacity-90"
              onClick={() =>
                (window.location.href = "/inventory/transfer-request")
              }
            >
              Request Transfer
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 text-sm font-bold text-gray-600 border-b pb-3">
              <div>ID</div>
              <div className="ms-5">Quantity</div>
              <div>Item (Name & Unit)</div>
              <div>Category</div>
              <div>Branch Name</div>
              <div>Required Stock </div>
              <div className="text-center">Actions</div>
            </div>

            {filteredInventory.length === 0 ? (
              <div className="flex items-center justify-center bg-gray-50 p-4 rounded-lg text-gray-700 font-semibold text-sm">
                No Inventory found
              </div>
            ) : (
              <>
                {filteredInventory.map((item, i) => (
                  <div
                    className={`grid grid-cols-7 items-center text-sm py-2 px-1 rounded-lghover:bg-gray-50 ${
                      i % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                    key={i}
                  >
                    <div className="font-bold text-gray-800">{item.id}</div>
                    <div className="text-gray-700 ms-5">{item.qty}</div>
                    <div className="text-gray-700">
                      {item.inventory_item.name} (
                      {item.inventory_item.unit_measurement})
                    </div>
                    <div className="text-gray-700">
                      {item.inventory_item.category}
                    </div>
                    <div className="text-gray-700">{item.branch?.name}</div>
                    <div className="text-gray-700">
                      {item.inventory_item.required_stock}
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button
                        className="!bg-green-600 px-3 py-1 rounded-md flex items-center gap-1 text-white hover:opacity-90"
                        onClick={() => {
                          setOpenAdd(true)
                          setEditing(item)
                        }}
                      >
                        <Plus className="w-4 h-4" /> Add Quantity
                      </Button>
                      <Button
                        className="!bg-red-600 px-3 py-1 rounded-md flex items-center gap-1 text-white hover:opacity-90"
                        onClick={() => {
                          setEditing(item)
                          setOpenDelete(true)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            )}

            <div className="flex items-center gap-3 pt-5">
              <button
                disabled={page.page === 1}
                onClick={() => setPage((p) => ({ ...p, page: p.page - 1 }))}
                className="p-2 rounded-md border border-gray-300 bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-3 h-3 text-gray-700" />
              </button>

              <h1 className="text-sm font-medium text-gray-700">
                PAGE {page.page} of {totalPages}
              </h1>

              <button
                disabled={page.page === totalPages}
                onClick={() => setPage((p) => ({ ...p, page: p.page + 1 }))}
                className="p-2 rounded-md border border-gray-300 bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40"
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
