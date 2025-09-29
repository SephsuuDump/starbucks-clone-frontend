import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Divide, Funnel, Search, SquarePen, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { ProcurementHeader } from "../procurement/Header"


export function InventoryStorage() {
    return (
        <div className="flex flex-col gap-6">
        <div>
            <ProcurementHeader label="Inventory" />
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 flex justify-between">
            <div className="flex gap-1">
            <Input
                type="text"
                placeholder="Search by Item, Warehouse, or Branch"
                className="w-72"
            />
            </div>

            <div className="flex gap-3">
            <Button className="!bg-green-900 px-4 py-2 rounded-lg text-white shadow hover:opacity-90">
                + Add Inventory
            </Button>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
            <div className="overflow-x-auto">
            <div className="grid grid-cols-6 text-sm font-semibold text-gray-600 border-b pb-3">
                <div>ID</div>
                <div>Quantity</div>
                <div>Item (Name & Unit)</div>
                <div>Warehouse Name</div>
                <div>Warehouse Location</div>
                <div className="text-center">Actions</div>
            </div>

            {/* Table Body (sample row for UI) */}
            <div className="grid grid-cols-6 items-center text-sm py-2 px-1 rounded-lg hover:bg-gray-50">
                <div className="font-bold text-gray-800">INV-001</div>
                <div className="text-gray-700">120</div>
                <div className="text-gray-700">Coffee Beans (kg)</div>
                <div className="text-gray-700">Main Warehouse</div>
                <div className="text-gray-600">Quezon City</div>
                <div className="flex gap-2 justify-center">
                <Button className="!bg-green-600 px-3 py-1 rounded-md flex items-center gap-1 text-white hover:opacity-90">
                    <SquarePen className="w-4 h-4" /> Edit
                </Button>
                <Button className="!bg-red-600 px-3 py-1 rounded-md flex items-center gap-1 text-white hover:opacity-90">
                    <Trash2 className="w-4 h-4" />
                </Button>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center gap-3 pt-5">
                <button className="p-2 rounded-md border border-gray-300 bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40">
                <ChevronLeft className="w-3 h-3 text-gray-700" />
                </button>

                <h1 className="text-sm font-medium text-gray-700">PAGE 1 of 5</h1>

                <button className="p-2 rounded-md border border-gray-300 bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40">
                <ChevronRight className="w-3 h-3 text-black" />
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}
