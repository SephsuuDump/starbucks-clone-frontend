'use client'

import { useEffect, useState } from "react"
import { ProcurementHeader } from "@/components/custom/procurement/Header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { TransferResponse } from "@/types/TransferResponse"
import { TransferService } from "@/services/Inventory/TransferService"
import { toast } from "sonner"
import { format } from "date-fns"
import { CheckCircle, ScanEye, Warehouse, Building2 } from "lucide-react"

type TransferStatus = "PENDING" | "APPROVED" | "OUT" | "DELIVERED"

export default function ListTransfer() {
  const [transfers, setTransfers] = useState<Record<TransferStatus, TransferResponse[]>>({
    PENDING: [],
    APPROVED: [],
    OUT: [],
    DELIVERED: [],
  })
  const [reviewOpen, setReviewOpen] = useState(false)
  const [viewing, setViewing] = useState<TransferResponse | null>(null)
  const warehouse_id = "ba16a8b1-6693-45f0-8406-6488a97c5725"

  async function fetchTransfers(status: TransferStatus) {
    try {
      const res = await TransferService.getBySource(warehouse_id, status)
      setTransfers((prev) => ({ ...prev, [status]: res || [] }))
    } catch {
      setTransfers((prev) => ({ ...prev, [status]: [] }))
    }
  }

  useEffect(() => {
    fetchTransfers("PENDING")
    fetchTransfers("APPROVED")
    fetchTransfers("OUT")
    fetchTransfers("DELIVERED")
  }, [])

  async function handleViewing(id: string) {
    if (!id) return toast.error("ID is required")
    try {
      const data = await TransferService.getById(id)
      const valid = Array.isArray(data) ? data[0] : data
      if (!valid) return toast.error("No data found")
      setViewing(valid)
      setReviewOpen(true)
    } catch (e) {
      toast.error(`${e}`)
    }
  }

  async function handleStatusChange(id: string, newStatus: TransferStatus) {
    if (!id) return toast.error("ID is required")
    try {
      const data = await TransferService.updateStatus(id, newStatus)
      if (data) toast.success(`Transfer updated to ${newStatus}`)
      fetchTransfers(newStatus)
    } catch (e) {
      toast.error(`${e}`)
    }
  }

  const tabs: { label: string; key: TransferStatus; color: string }[] = [
    { label: "Pending", key: "PENDING", color: "bg-amber-500/15 text-amber-700" },
    { label: "Approved", key: "APPROVED", color: "bg-blue-500/15 text-blue-700" },
    { label: "Out", key: "OUT", color: "bg-indigo-500/15 text-indigo-700" },
    { label: "Delivered", key: "DELIVERED", color: "bg-green-500/15 text-green-700" },
  ]

  return (
    <div className="w-full min-h-screen bg-white p-8 flex flex-col gap-8">
      <ProcurementHeader label="Warehouse Transfers" />

      <Tabs defaultValue="PENDING" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6 w-full max-w-2xl bg-gray-100 p-1 rounded-xl mx-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-sm font-medium"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="mt-2">
            {transfers[tab.key]?.length === 0 ? (
              <div className="text-gray-500 text-center py-12 border rounded-xl bg-gray-50 italic">
                No {tab.label.toLowerCase()} transfers found.
              </div>
            ) : (
              <div className="grid gap-4">
                {transfers[tab.key].map((t) => (
                  <div
                    key={t.id}
                    className="border border-gray-100 rounded-2xl shadow-sm p-5 bg-white hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                          Transfer ID:{" "}
                          <span className="font-mono text-gray-600 text-xs">
                            {t.id.slice(0, 10)}...
                          </span>
                        </h3>
                        <p className="text-xs text-gray-500">
                          Expected:{" "}
                          {t.expected_arrival
                            ? format(new Date(t.expected_arrival), "PP")
                            : "N/A"}
                        </p>
                      </div>
                      <Badge className={`${tab.color} font-medium rounded-lg`}>
                        {t.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 text-sm text-gray-700 gap-y-2">
                      <div className="flex items-center gap-2">
                        <Warehouse className="w-4 h-4 text-gray-500" />
                        <span>{t.from_warehouse?.name ?? "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span>{t.to_branch?.name ?? t.to_warehouse?.name ?? "N/A"}</span>
                      </div>
                      <div className="hidden sm:flex items-center justify-end text-gray-600">
                        {t.transfer_item?.length ?? 0} items
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs flex items-center gap-1"
                        onClick={() => handleViewing(t.id)}
                      >
                        <ScanEye className="w-4 h-4" /> View Details
                      </Button>
                      {tab.key === "PENDING" && (
                        <Button
                          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-xs flex items-center gap-1"
                          onClick={() => handleStatusChange(t.id, "APPROVED")}
                        >
                          <CheckCircle className="w-4 h-4" /> Approve
                        </Button>
                      )}
                      {tab.key === "APPROVED" && (
                        <Button
                          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-xs flex items-center gap-1"
                          onClick={() => handleStatusChange(t.id, "OUT")}
                        >
                          <CheckCircle className="w-4 h-4" /> Mark as Out
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-lg rounded-2xl shadow-xl">
          <DialogTitle>
            <ProcurementHeader label="Transfer Receipt" />
          </DialogTitle>

          <div className="mt-4 text-sm space-y-4 text-gray-700">
            <div className="border-b pb-2">
              <p>
                <strong>From Warehouse:</strong> {viewing?.from_warehouse?.name ?? "N/A"}
              </p>
              <p>
                <strong>To:</strong>{" "}
                {viewing?.to_branch?.name ?? viewing?.to_warehouse?.name ?? "N/A"}
              </p>
              <p>
                <strong>Expected Arrival:</strong>{" "}
                {viewing?.expected_arrival
                  ? format(new Date(viewing.expected_arrival), "PPP")
                  : "N/A"}
              </p>
              {viewing?.actual_arrival ? 
              <p>
                <strong>Actual Arrival:</strong>{" "}
                {viewing?.actual_arrival
                  ? format(new Date(viewing.actual_arrival), "PPP")
                  : "N/A"}
              </p> : <div></div>
            }
            </div>

            <div>
              <h3 className="font-semibold mb-2">Requested Items</h3>
              <div className="border rounded-xl overflow-hidden">
                <div className="grid grid-cols-3 bg-gray-100 px-3 py-2 font-semibold text-gray-700 text-xs">
                  <div>SKUID</div>
                  <div>Item Name</div>
                  <div className="text-right">Qty</div>
                </div>
                {(viewing?.transfer_item || []).map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 px-3 py-2 border-t text-gray-700 text-xs"
                  >
                    <div>{item?.inventory_item?.skuid ?? "N/A"}</div>
                    <div>{item?.inventory_item?.name ?? "Unknown"}</div>
                    <div className="text-right">{item?.quantity ?? 0}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-600 rounded-xl px-4"
              onClick={() => setReviewOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
