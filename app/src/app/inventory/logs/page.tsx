"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, History } from "lucide-react";
import { toast } from "sonner";
import { ProcurementHeader } from "@/components/custom/procurement/Header";
import { InventoryLogsService } from "@/services/Inventory/InvetoryLogsService";

type Page = { page: number; limit: number };

type InventoryLog = {
  id: string;
  created_at: string;
  source: string;
  type: string;
  changed_quantity: number;
  inventory: {
    id: string;
    qty: number;
    warehouse?: { id: string; name: string; location: string } | null;
    branch?: { id: string; name: string; location: string } | null;
    inventory_item?: { name: string; unit_measurement: string } | null;
  };
  transfer_request?: { id: string; status: string } | null;
};

export default function BranchInventoryLogs() {

  const branch_id = "7e42ef23-002b-4d39-8d12-9101bbaf2385";
  const warehouse_id = "235cc413-4694-4d77-a2a0-474431d847c2";

  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [page, setPage] = useState<Page>({ page: 1, limit: 10 });
  const [totalPages, setTotalPages] = useState(0);
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
    async function getLogs() {
      try {
        const data = await InventoryLogsService.getAll(
          page.page,
          10,
          debouncedSearch,
          branch_id,
          undefined

        );
        setLogs(data.data);
        setTotalPages(data.totalPages);
      } catch (e) {
        toast.error(`Failed to load logs: ${e}`);
      }
    }
    getLogs();
  }, [page, debouncedSearch]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <ProcurementHeader label="Branch Inventory Logs" />
      </div>

      <div className="bg-white rounded-xl shadow-md p-5 flex justify-between">
        <div className="flex gap-1">
          <Input
            type="text"
            placeholder="Search by Item Name or Source"
            className="w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 text-sm font-bold text-gray-600 border-b pb-3">
            <div>Date</div>
            <div>Source</div>
            <div>Type</div>
            <div>Item</div>
            <div>Change Qty</div>
            <div>Branch/Warehouse</div>
            <div>Status</div>
          </div>

          {logs.length === 0 ? (
            <div className="flex items-center justify-center bg-gray-50 p-4 rounded-lg text-gray-700 font-semibold text-sm">
              No logs found
            </div>
          ) : (
            logs.map((log, i) => (
              <div
                key={log.id}
                className={`grid grid-cols-7 items-center text-sm py-2 px-1 rounded-lg ${
                  i % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <div className="text-gray-700">
                  {new Date(log.created_at).toLocaleString()}
                </div>
                <div className="text-gray-800 font-medium flex items-center gap-1">
                  <History className="w-4 h-4 text-green-700" />
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
                <div className="text-gray-700">
                  {log.inventory?.inventory_item?.name} (
                  {log.inventory?.inventory_item?.unit_measurement})
                </div>
                <div className="text-gray-700">{log.changed_quantity}</div>
                <div className="text-gray-700">
                  {log.inventory?.branch
                    ? log.inventory.branch.name
                    : log.inventory?.warehouse
                    ? log.inventory.warehouse.name
                    : "—"}
                </div>
                <div className="text-gray-700">
                  {log.transfer_request?.status ?? "N/A"}
                </div>
              </div>
            ))
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
  );
}
