'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { TransferResponse } from "@/types/TransferResponse"
import { TransferService } from "@/services/Inventory/TransferService"
import { toast } from "sonner"
import { format } from "date-fns"
import { CheckCircle, ScanEye, Warehouse, Building2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { ProcurementHeader } from "@/features/procurement/components/Header"
import { useRouter } from "next/navigation"

type TransferStatus = "PENDING" | "APPROVED" | "OUT" | "DELIVERED"

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (p: number) => void
}) {
  const isFirst = page <= 1
  const isLast = page >= totalPages

  return (
    <div className="flex justify-center items-center gap-4 mt-10 text-sm text-gray-600">
      <button
        disabled={isFirst}
        onClick={() => onChange(page - 1)}
        className={`px-2 ${
          isFirst ? "text-gray-300 cursor-not-allowed" : "hover:text-black"
        }`}
      >
        ‹
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button
        disabled={isLast}
        onClick={() => onChange(page + 1)}
        className={`px-2 ${
          isLast ? "text-gray-300 cursor-not-allowed" : "hover:text-black"
        }`}
      >
        ›
      </button>
    </div>
  )
}

export default function ListTransfer() {
  const { claims } = useAuth()
  const PAGE_SIZE = 5
  const router = useRouter()
  const [transfers, setTransfers] = useState<Record<TransferStatus, TransferResponse[]>>({
    PENDING: [],
    APPROVED: [],
    OUT: [],
    DELIVERED: [],
  })

  const [pageByStatus, setPageByStatus] = useState<Record<TransferStatus, number>>({
    PENDING: 1,
    APPROVED: 1,
    OUT: 1,
    DELIVERED: 1,
  })

  const [metaByStatus, setMetaByStatus] = useState<Record<
    TransferStatus,
    { totalPages: number; total: number }
  >>({
    PENDING: { totalPages: 1, total: 0 },
    APPROVED: { totalPages: 1, total: 0 },
    OUT: { totalPages: 1, total: 0 },
    DELIVERED: { totalPages: 1, total: 0 },
  })

  const [reviewOpen, setReviewOpen] = useState(false)
  const [viewing, setViewing] = useState<TransferResponse | null>(null)

  async function fetchTransfers(status: TransferStatus) {
    const page = pageByStatus[status]

    const res = await TransferService.getBySource(
      claims.warehouseId!,
      status,
      page,
      PAGE_SIZE
    )

    setTransfers((prev) => ({ ...prev, [status]: res.data || [] }))
    setMetaByStatus((prev) => ({
      ...prev,
      [status]: {
        totalPages: Math.max(1, res.meta.totalPages),
        total: res.meta.total,
      },
    }))
  }

  useEffect(() => {
    if (!claims?.warehouseId) return
    fetchTransfers("PENDING")
    fetchTransfers("APPROVED")
    fetchTransfers("OUT")
    fetchTransfers("DELIVERED")
  }, [claims?.warehouseId])

  useEffect(() => {
    if (!claims?.warehouseId) return
    fetchTransfers("PENDING")
    fetchTransfers("APPROVED")
    fetchTransfers("OUT")
    fetchTransfers("DELIVERED")
  }, [pageByStatus])

  async function handleViewing(id: string) {
    const data = await TransferService.getById(id)
    const valid = Array.isArray(data) ? data[0] : data
    if (!valid) return
    setViewing(valid)
    setReviewOpen(true)
  }

  async function handleStatusChange(id: string, newStatus: TransferStatus) {
    try {
      await TransferService.updateStatus(id, newStatus)
      toast.success(`Transfer updated to ${newStatus}`)
      setPageByStatus({ PENDING: 1, APPROVED: 1, OUT: 1, DELIVERED: 1 })
      fetchTransfers("PENDING")
      fetchTransfers("APPROVED")
      fetchTransfers("OUT")
      fetchTransfers("DELIVERED")
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong"

      toast.error(message)
    }
  }

  const tabs = [
    { label: "Pending", key: "PENDING", color: "bg-amber-500/15 text-amber-700" },
    { label: "Approved", key: "APPROVED", color: "bg-blue-500/15 text-blue-700" },
    { label: "Out", key: "OUT", color: "bg-indigo-500/15 text-indigo-700" },
    { label: "Delivered", key: "DELIVERED", color: "bg-green-500/15 text-green-700" },
  ] as const

  return (
    <div className="w-full min-h-screen bg-slate p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <ProcurementHeader label="Supply Request" />

        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => router.push("/inventory")}
        >
          Back to Inventory
        </Button>
      </div>

      <Tabs defaultValue="PENDING" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6 w-full max-w-2xl bg-gray-100 p-1 rounded-xl mx-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg text-sm font-medium"
            >
              {tab.label} ({metaByStatus[tab.key].total})
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="mt-2">
            {transfers[tab.key].length === 0 ? (
              <div className="text-gray-500 text-center py-12 border rounded-xl bg-gray-50 italic">
                No {tab.label.toLowerCase()} transfers found.
              </div>
            ) : (
              <>
                <div className="grid gap-4">
                  {transfers[tab.key].map((t) => (
                    <div
                      key={t.id}
                      className="border border-gray-100 rounded-2xl shadow-sm bg-white hover:shadow-md transition-all overflow-hidden"
                    >
                      <div className="flex items-start justify-between px-5 py-4 bg-green-100">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-gray-600" />
                            <span>{t.to_branch?.name ?? t.to_warehouse?.name ?? "N/A"}</span>
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
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

                      <div className="px-5 py-3 flex flex-col text-sm text-gray-700 gap-1">
                        <div className="flex items-center gap-2">
                          From : <Warehouse className="w-4 h-4 text-gray-500" />
                          <span>{t.from_warehouse?.name ?? "N/A"}</span>
                        </div>
                        <div className="text-gray-600">
                          Item count: {t.transfer_item?.length ?? 0}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 px-5 pb-4">
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

                      <div className="px-5 pb-3 text-right text-[10px] text-gray-400 font-mono">
                        Ref: {t.id}
                      </div>
                    </div>
                  ))}
                </div>

                <Pagination
                  page={pageByStatus[tab.key]}
                  totalPages={metaByStatus[tab.key].totalPages}
                  onChange={(p) =>
                    setPageByStatus((prev) => ({ ...prev, [tab.key]: p }))
                  }
                />
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-lg rounded-2xl shadow-xl">
          <DialogTitle>
            <ProcurementHeader label="Transfer Details" />
          </DialogTitle>

          <div className="mt-4 text-sm text-gray-700 space-y-4">
            {/* Transfer Meta */}
            <div className="border-b pb-3 space-y-1">
              <p>
                <strong>From Warehouse:</strong>{" "}
                {viewing?.from_warehouse?.name ?? "N/A"}
              </p>

              {viewing?.to_branch ? (
                <p>
                  <strong>To Branch:</strong> {viewing.to_branch.name}
                </p>
              ) : (
                <p>
                  <strong>To Warehouse:</strong>{" "}
                  {viewing?.to_warehouse?.name ?? "N/A"}
                </p>
              )}

              <p>
                <strong>Expected Arrival:</strong>{" "}
                {viewing?.expected_arrival
                  ? format(new Date(viewing.expected_arrival), "PPP")
                  : "N/A"}
              </p>

              {viewing?.actual_arrival && (
                <p>
                  <strong>Actual Arrival:</strong>{" "}
                  {format(new Date(viewing.actual_arrival), "PPP")}
                </p>
              )}

              <p>
                <strong>Status:</strong>{" "}
                <span className="font-semibold text-green-700">
                  {viewing?.status}
                </span>
              </p>
            </div>

            {/* Requested Items */}
            <div>
              <h3 className="font-semibold mb-2">Requested Items</h3>

              <div className="border rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-3 bg-gray-100 px-3 py-2 font-semibold text-gray-700">
                  <div>SKUID</div>
                  <div>Item</div>
                  <div className="text-right">Qty</div>
                </div>

                {(viewing?.transfer_item || []).map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-3 px-3 py-2 border-t text-gray-700"
                  >
                    <div>{item?.inventory_item?.skuid ?? "N/A"}</div>
                    <div>{item?.inventory_item?.name ?? "Unknown"}</div>
                    <div className="text-right">{item?.quantity ?? 0}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
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
