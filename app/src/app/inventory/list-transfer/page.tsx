'use client'

import { ProcurementHeader } from "@/components/custom/procurement/Header"
import { Button } from "@/components/ui/button"
import { TransferService } from "@/services/Inventory/TransferService"
import { TransferResponse } from "@/types/TransferResponse"
import { Truck, PackageCheck, Clock, ScanEye, ClipboardCheck, Divide } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { format } from "date-fns"

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
  const [refresh, setRefresh] = useState(false)
  const branchId = "7e42ef23-002b-4d39-8d12-9101bbaf2385"

  async function fetchTransfers(status: TransferStatus) {
    try {
      const res = await TransferService.getByDestination(branchId, status)
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
  }, [refresh])

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

  async function handleReceived(id: string) {
    if (!id) return toast.error("ID is required")
    try {
      const data = await TransferService.updateStatus(id, "DELIVERED")
      if (data) toast.success(`Transfer ${id} marked as Delivered`)
      setRefresh((prev) => !prev)
    } catch (e) {
      toast.error(`${e}`)
    }
  }

  return (
    <div className="w-full min-h-screen bg-white p-8 flex flex-col gap-8">
      <ProcurementHeader label="My Supply Transfers" />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <StatusCard
          color="bg-yellow-50 border-yellow-200"
          icon={<Clock className="w-5 h-5 text-yellow-600" />}
          title="Pending"
          count={transfers.PENDING.length}
        />
        <StatusCard
          color="bg-teal-50 border-teal-200"
          icon={<ClipboardCheck className="w-5 h-5 text-teal-600" />}
          title="Approved"
          count={transfers.APPROVED.length}
        />
        <StatusCard
          color="bg-blue-50 border-blue-200"
          icon={<Truck className="w-5 h-5 text-blue-600" />}
          title="Out for Delivery"
          count={transfers.OUT.length}
        />
        <StatusCard
          color="bg-green-50 border-green-200"
          icon={<PackageCheck className="w-5 h-5 text-green-600" />}
          title="Delivered"
          count={transfers.DELIVERED.length}
        />
      </div>

      {/* Sectioned Lists */}
      <TransferSection
        title="Pending Transfers"
        color="text-yellow-700"
        transfers={transfers.PENDING}
        onView={handleViewing}
      />

      <TransferSection
        title="Approved Transfers"
        color="text-teal-700"
        transfers={transfers.APPROVED}
        onView={handleViewing}
      />

      <TransferSection
        title="Out for Delivery"
        color="text-blue-700"
        transfers={transfers.OUT}
        onView={handleViewing}
        onAction={handleReceived}
      />

      <TransferSection
        title="Delivered Orders"
        color="text-green-700"
        transfers={transfers.DELIVERED}
        onView={handleViewing}
      />

      {/* Receipt Modal */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogTitle>
            <ProcurementHeader label="Transfer Details" />
          </DialogTitle>

          <div className="mt-4 text-sm text-gray-700 space-y-4">
            <div className="border-b pb-2">
              <p>
                <strong>From Warehouse:</strong>{" "}
                {viewing?.from_warehouse?.name ?? "N/A"}
              </p>
              <p>
                <strong>To Branch:</strong>{" "}
                {viewing?.to_branch?.name ?? "N/A"}
              </p>
              <p>
                <strong>Expected Arrival:</strong>{" "}
                {viewing?.expected_arrival
                  ? format(new Date(viewing.expected_arrival), "PPP")
                  : "N/A"}
              </p>
              {viewing?.actual_arrival != null ? 
               <p>
                <strong>Actual Arrival:</strong>{" "}
                {viewing?.actual_arrival
                  ? format(new Date(viewing.actual_arrival), "PPP")
                  : "N/A"}
              </p> : <></>}
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize font-medium text-green-700">
                  {viewing?.status}
                </span>
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Requested Items</h3>
              <div className="border rounded-xl overflow-hidden">
                <div className="grid grid-cols-3 bg-gray-100 px-3 py-2 font-semibold text-gray-700 text-xs">
                  <div>SKUID</div>
                  <div>Item</div>
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

function StatusCard({
  color,
  icon,
  title,
  count,
}: {
  color: string
  icon: React.ReactNode
  title: string
  count: number
}) {
  return (
    <div
      className={`border rounded-2xl p-5 flex justify-between items-center ${color} hover:shadow-md transition-all`}
    >
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="text-xs text-gray-500">Transfers</span>
      </div>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-2xl font-bold">{count}</span>
      </div>
    </div>
  )
}

function TransferSection({
  title,
  color,
  transfers,
  onView,
  onAction,
}: {
  title: string
  color: string
  transfers: TransferResponse[]
  onView: (id: string) => void
  onAction?: (id: string) => void
}) {
  return (
    <div className="flex flex-col mt-4">
      <h2 className={`text-lg font-semibold mb-4 ${color}`}>{title}</h2>

      {transfers.length === 0 ? (
        <div className="flex items-center justify-center py-8 bg-gray-50 rounded-xl border text-gray-500 text-sm italic">
          No {title.toLowerCase()} found.
        </div>
      ) : (
        <div className="grid gap-3">
          {transfers.map((request) => (
            <div
              key={request.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all"
            >
              <div className="flex flex-col gap-1 text-sm text-gray-700">
                <span className="font-semibold">
                  {request.id.slice(0, 8)}...
                </span>
                <span>
                  <strong>From:</strong> {request.from_warehouse?.name ?? "N/A"}
                </span>
                <span>
                  <strong>Expected:</strong>{" "}
                  {request.expected_arrival
                    ? format(new Date(request.expected_arrival), "PPP")
                    : "N/A"}
                </span>
                <span>
                  <strong>Status:</strong>{" "}
                  <span className="capitalize text-green-700 font-medium">
                    {request.status}
                  </span>
                </span>
              </div>

              <div className="flex gap-2 mt-3 sm:mt-0">
                <Button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs flex items-center gap-1 rounded-lg px-3 py-2"
                  onClick={() => onView(request.id)}
                >
                  <ScanEye className="w-4 h-4" /> View
                </Button>
                {onAction && request.status === "OUT" && (
                  <Button
                    className="bg-green-700 hover:bg-green-800 text-white text-xs flex items-center gap-1 rounded-lg px-3 py-2"
                    onClick={() => onAction(request.id)}
                  >
                    <PackageCheck className="w-4 h-4" /> Mark Received
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
