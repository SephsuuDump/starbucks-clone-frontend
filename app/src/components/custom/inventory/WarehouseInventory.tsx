'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Trash2, Filter } from "lucide-react"
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

export function WarehouseInventory() {
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
      async function getInventory(warehouse_id: string) {
        try {
          const data = await InventoryService.getByWarehouse(
            warehouse_id,
            page.page,
            page.limit,
            debouncedSearch
          )
          setInventory(data.data)
          setTotalPages(data.totalPages)
          const all = await fetchAllInventory("warehouse", warehouse_id)
          setAllInventory(all)
        } catch (e) {
          toast.error(`${e}`)
        }
      }
      getInventory("ba16a8b1-6693-45f0-8406-6488a97c5725")
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
            id="ba16a8b1-6693-45f0-8406-6488a97c5725"
            open={openAddInventory}
            setOpen={setOpenAddInventory}
            currentInventory={inventory}
            setLoading={setLoading}
            type="warehouse"
          />
        )}
        <div className="flex flex-col gap-8">
          <ProcurementHeader label="Warehouse Inventory" />

          <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search inventory..."
                    className="pl-9 w-64 rounded-xl border-gray-300 focus:ring-2 focus:ring-green-600"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Filter className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                </div>

                <select
                  className="rounded-xl border border-gray-300 px-3 py-2 text-sm bg-white hover:border-gray-400 transition"
                  value={selectedStock}
                  onChange={(e) => setSelectedStock(e.target.value)}
                >
                  <option value="">All Stocks</option>
                  <option value="low">Low Stock</option>
                  <option value="warn">Warning</option>
                  <option value="attention">Attention</option>
                </select>

                <select
                  className="rounded-xl border border-gray-300 px-3 py-2 text-sm bg-white hover:border-gray-400 transition"
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
                  className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl shadow-sm font-medium"
                  onClick={() => setOpenAddInventory(true)}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Inventory
                </Button>
                <Button
                  className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl shadow-sm font-medium"
                  onClick={() =>
                    (window.location.href = "/inventory/transfer-request")
                  }
                >
                  Request Transfer
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="text-gray-600 border-b">
                    <th className="text-left py-3 px-4 font-semibold">ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Quantity</th>
                    <th className="text-left py-3 px-4 font-semibold">Item</th>
                    <th className="text-left py-3 px-4 font-semibold">Category</th>
                    <th className="text-left py-3 px-4 font-semibold">Warehouse</th>
                    <th className="text-left py-3 px-4 font-semibold">Required</th>
                    <th className="text-center py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-500">
                        No inventory found
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map((item, i) => (
                      <tr
                        key={i}
                        className={`border-b last:border-0 hover:bg-gray-50 transition ${
                          i % 2 === 0 ? "bg-gray-50/60" : "bg-white"
                        }`}
                      >
                        <td className="py-3 px-4 font-medium text-gray-800">
                          {item.id}
                        </td>
                        <td className="py-3 px-4 text-gray-700">{item.qty}</td>
                        <td className="py-3 px-4 text-gray-700">
                          {item.inventory_item.name} (
                          {item.inventory_item.unit_measurement})
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {item.inventory_item.category}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {item.warehouse?.name}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {item.inventory_item.required_stock}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
                              onClick={() => {
                                setOpenAdd(true)
                                setEditing(item)
                              }}
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Qty
                            </Button>
                            <Button
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
                              onClick={() => {
                                setEditing(item)
                                setOpenDelete(true)
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  disabled={page.page === 1}
                  onClick={() => setPage((p) => ({ ...p, page: p.page - 1 }))}
                  className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Page {page.page} of {totalPages}
                </span>
                <button
                  disabled={page.page === totalPages}
                  onClick={() => setPage((p) => ({ ...p, page: p.page + 1 }))}
                  className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
}
