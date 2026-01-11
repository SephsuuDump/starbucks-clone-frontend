'use client'

import { Button } from "@/components/ui/button"
import { TransferService } from "@/services/Inventory/TransferService"
import { TransferResponse } from "@/types/TransferResponse"
import { Truck, PackageCheck, Clock, ScanEye, ClipboardCheck, Building2, Badge, Warehouse } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import { ProcurementHeader } from "@/features/procurement/components/Header"
import { useAuth } from "@/hooks/use-auth"
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
    <div className="flex justify-center items-center gap-4 mt-6 text-sm text-gray-600">
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

export default function Page() {
  const { claims, loading } = useAuth()
  const PAGE_SIZE = 5
  const router = useRouter()

  const destinationId = claims?.branchId ?? claims?.warehouseId

  const [activeStatus, setActiveStatus] = useState<TransferStatus>("PENDING")

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
    if (!destinationId) return

    const page = pageByStatus[status]

    try {
      const res = await TransferService.getByDestination(
        destinationId,
        status,
        page,
        PAGE_SIZE
      )

      setTransfers((prev) => ({
        ...prev,
        [status]: res.data || [],
      }))

      setMetaByStatus((prev) => ({
        ...prev,
        [status]: {
          totalPages: res.meta.totalPages,
          total: res.meta.total,
        },
      }))
    } catch {
      setTransfers((prev) => ({ ...prev, [status]: [] }))
    }
  }

  useEffect(() => {
    if (loading || !destinationId) return

    fetchTransfers("PENDING")
    fetchTransfers("APPROVED")
    fetchTransfers("OUT")
    fetchTransfers("DELIVERED")
  }, [destinationId, loading])

  useEffect(() => {
    if (!destinationId) return
    fetchTransfers(activeStatus)
  }, [activeStatus, pageByStatus[activeStatus], destinationId])

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
      await TransferService.updateStatus(id, "DELIVERED")
      toast.success("Transfer marked as Delivered")

      setPageByStatus((prev) => ({
        ...prev,
        OUT: 1,
        DELIVERED: 1,
      }))

      fetchTransfers("OUT")
      fetchTransfers("DELIVERED")
    } catch (e) {
      toast.error(`${e}`)
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <ProcurementHeader label="My Orders" />

        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => router.push("/inventory")}
        >
          Back to Inventory
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div onClick={() => setActiveStatus("PENDING")} className="cursor-pointer">
          <StatusCard
            color="bg-yellow-50 border-yellow-200"
            icon={<Clock className="w-5 h-5 text-yellow-600" />}
            title="Pending"
            count={metaByStatus.PENDING.total}
          />
        </div>

        <div onClick={() => setActiveStatus("APPROVED")} className="cursor-pointer">
          <StatusCard
            color="bg-teal-50 border-teal-200"
            icon={<ClipboardCheck className="w-5 h-5 text-teal-600" />}
            title="Approved"
            count={metaByStatus.APPROVED.total}
          />
        </div>

        <div onClick={() => setActiveStatus("OUT")} className="cursor-pointer">
          <StatusCard
            color="bg-blue-50 border-blue-200"
            icon={<Truck className="w-5 h-5 text-blue-600" />}
            title="Out for Delivery"
            count={metaByStatus.OUT.total}
          />
        </div>

        <div onClick={() => setActiveStatus("DELIVERED")} className="cursor-pointer">
          <StatusCard
            color="bg-green-50 border-green-200"
            icon={<PackageCheck className="w-5 h-5 text-green-600" />}
            title="Delivered"
            count={metaByStatus.DELIVERED.total}
          />
        </div>
      </div>

      <TransferSection
        title={
          activeStatus === "PENDING"
            ? "Pending Transfers"
            : activeStatus === "APPROVED"
            ? "Approved Transfers"
            : activeStatus === "OUT"
            ? "Out for Delivery"
            : "Delivered Orders"
        }
        color={
          activeStatus === "PENDING"
            ? "text-yellow-700"
            : activeStatus === "APPROVED"
            ? "text-teal-700"
            : activeStatus === "OUT"
            ? "text-blue-700"
            : "text-green-700"
        }
        transfers={transfers[activeStatus]}
        onView={handleViewing}
        onAction={activeStatus === "OUT" ? handleReceived : undefined}
      />

      <Pagination
        page={pageByStatus[activeStatus]}
        totalPages={metaByStatus[activeStatus].totalPages}
        onChange={(p) =>
          setPageByStatus((prev) => ({ ...prev, [activeStatus]: p }))
        }
      />

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
              className="border border-gray-100 rounded-xl bg-white hover:shadow-sm transition-all overflow-hidden"
            >
              <div className="flex items-start justify-between px-4 py-3 bg-green-100">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <span>
                      {request.to_branch?.name ??
                        request.to_warehouse?.name ??
                        "N/A"}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Expected:{" "}
                    {request.expected_arrival
                      ? format(new Date(request.expected_arrival), "PPP")
                      : "N/A"}
                  </p>
                </div>

                <Badge className="bg-green-500/15 text-green-700 text-xs font-medium rounded-md">
                  {request.status}
                </Badge>
              </div>

              <div className="px-4 py-2 flex flex-col gap-1 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-gray-500" />
                  <span>{request.from_warehouse?.name ?? "N/A"}</span>
                </div>
                <div className="text-gray-600 text-xs">
                  Item count: {request.transfer_item?.length ?? 0}
                </div>
              </div>

              <div className="flex justify-end gap-2 px-4 pb-3">
                <Button
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs flex items-center gap-1 rounded-lg px-3 py-1.5"
                  onClick={() => onView(request.id)}
                >
                  <ScanEye className="w-4 h-4" /> View
                </Button>

                {onAction && request.status === "OUT" && (
                  <Button
                    className="bg-green-700 hover:bg-green-800 text-white text-xs flex items-center gap-1 rounded-lg px-3 py-1.5"
                    onClick={() => onAction(request.id)}
                  >
                    <PackageCheck className="w-4 h-4" /> Mark Received
                  </Button>
                )}
              </div>

              <div className="px-4 pb-2 text-right text-[10px] text-gray-400 font-mono">
                Ref: {request.id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

