"use client"

import { useEffect, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  History,
  NotebookPen,
  Truck,
  CalendarDays,
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import { InventoryLogsService } from "@/services/Inventory/InvetoryLogsService"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ProcurementHeader } from "@/features/procurement/components/Header"
import { useAuth } from "@/hooks/use-auth"

type Page = { page: number; limit: number }

type InventoryLog = {
  id: string
  created_at: string
  source: string
  type: string
  changed_quantity: number
  inventory: {
    id: string
    qty: number
    warehouse?: { id: string; name: string; location: string } | null
    branch?: { id: string; name: string; location: string } | null
    inventory_item?: { name: string; unit_measurement: string } | null
  }
  transfer_request?: { id: string; status: string } | null
}

export default function BranchInventoryLogs() {
  const { claims, loading: authLoading } = useAuth()

  const [logs, setLogs] = useState<InventoryLog[]>([])
  const [page, setPage] = useState<Page>({ page: 1, limit: 50 })
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authLoading) return

    const branchId =
      claims?.branchId && !claims?.warehouseId ? claims.branchId : undefined

    const warehouseId =
      claims?.warehouseId && !claims?.branchId ? claims.warehouseId : undefined

    if (!branchId && !warehouseId) return

    async function getLogs() {
      setLoading(true)
      try {
        const data = await InventoryLogsService.getAll(
          page.page,
          page.limit,
          "",
          branchId,
          warehouseId
        )
        setLogs(data.data)
        setTotalPages(data.totalPages)
      } catch (e) {
        toast.error(`Failed to load logs: ${e}`)
      } finally {
        setLoading(false)
      }
    }

    getLogs()
  }, [page.page, authLoading, claims?.branchId, claims?.warehouseId])

  const groupedLogs = groupLogs(logs)

  return (
    <div className="w-full min-h-screen bg-white p-8 flex flex-col gap-6">
      <ProcurementHeader label="Branch Inventory Logs" />

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        {loading ? (
          <div className="flex justify-center items-center text-gray-500 py-8 text-sm">
            Loading logs...
          </div>
        ) : Object.keys(groupedLogs).length === 0 ? (
          <div className="flex items-center justify-center bg-gray-50 p-6 rounded-xl text-gray-500 text-sm font-medium">
            No logs found
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(groupedLogs).map(([date, groups]) => (
              <div
                key={date}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="flex items-center gap-2 px-5 py-4 border-b bg-gray-50 font-semibold">
                  <CalendarDays className="h-5 w-5 text-green-700" />
                  {format(new Date(date), "PPP")}
                </div>

                <div className="p-4 space-y-4">
                  <Accordion type="single" collapsible className="space-y-3">
                    {groups.manual.length > 0 && (
                      <AccordionItem value={`manual-${date}`}>
                        <AccordionTrigger className="px-4 py-3 text-sm">
                          <span className="flex gap-2 items-center">
                            <NotebookPen className="h-4 w-4 text-blue-600" />
                            Manual Input
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <LogTable logs={groups.manual} />
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {groups.transfers.length > 0 && (
                      <AccordionItem value={`transfer-${date}`}>
                        <AccordionTrigger className="px-4 py-3 text-sm">
                          <span className="flex gap-2 items-center">
                            <Truck className="h-4 w-4 text-green-700" />
                            Transfer
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <LogTable logs={groups.transfers} />
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {groups.order.length > 0 && (
                      <AccordionItem value={`order-${date}`}>
                        <AccordionTrigger className="px-4 py-3 text-sm">
                          <span className="flex gap-2 items-center">
                            <NotebookPen className="h-4 w-4 text-purple-600" />
                            Order
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <LogTable logs={groups.order} />
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-8">
          <button
            disabled={page.page === 1}
            onClick={() => setPage((p) => ({ ...p, page: p.page - 1 }))}
            className="p-2 rounded-md border border-gray-300 bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>

          <span className="text-sm text-gray-700 font-medium">
            Page {page.page} of {totalPages}
          </span>

          <button
            disabled={page.page === totalPages}
            onClick={() => setPage((p) => ({ ...p, page: p.page + 1 }))}
            className="p-2 rounded-md border border-gray-300 bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  )
}

function LogTable({ logs }: { logs: InventoryLog[] }) {
  return (
    <>
      <div className="grid grid-cols-6 font-semibold text-xs text-gray-600 border-b px-4 py-2">
        <div>Time</div>
        <div>Source</div>
        <div>Type</div>
        <div>Item</div>
        <div>Qty Change</div>
        <div>Status</div>
      </div>

      {logs.map((log) => (
        <div
          key={log.id}
          className="grid grid-cols-6 text-xs text-gray-700 px-4 py-2 border-b last:border-b-0 hover:bg-gray-50 transition"
        >
          <div>{new Date(log.created_at).toLocaleTimeString()}</div>
          <div className="flex items-center gap-1">
            <History className="w-3 h-3 text-green-700" />
            {log.source}
          </div>
          <div
            className={`font-semibold ${
              log.type === "OUT"
                ? "text-red-600"
                : log.type === "IN"
                ? "text-green-600"
                : "text-gray-700"
            }`}
          >
            {log.type}
          </div>
          <div>
            {log.inventory?.inventory_item?.name} (
            {log.inventory?.inventory_item?.unit_measurement})
          </div>
          <div>{log.changed_quantity}</div>
          <div>{log.transfer_request?.status ?? "N/A"}</div>
        </div>
      ))}
    </>
  )
}

function groupLogs(logs: InventoryLog[]) {
  const grouped: Record<
    string,
    {
      manual: InventoryLog[]
      order: InventoryLog[]
      transfers: InventoryLog[]
    }
  > = {}

  logs.forEach((log) => {
    const dateKey = format(new Date(log.created_at), "yyyy-MM-dd")

    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        manual: [],
        order: [],
        transfers: [],
      }
    }

    if (log.source === "ORDER") {
      grouped[dateKey].order.push(log)
    } else if (log.source === "TRANSFER") {
      grouped[dateKey].transfers.push(log)
    } else {
      grouped[dateKey].manual.push(log)
    }
  })

  return grouped
}
