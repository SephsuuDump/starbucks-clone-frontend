"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ResourceAllocationService } from "@/services/project_management/ResourceAllocationService";
import { ProjectResources } from "@/components/custom/project/ProjectResources";


export default function ProjectResourcesPage() {
  const { id } = useParams();
  const [allocations, setAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadAllocations() {
    try {
      setLoading(true);
      const res = await ResourceAllocationService.getAll({ id: String(id) });
      setAllocations(res.data || []);
    } catch (e) {
      toast.error(`Failed to load resource allocations: ${e}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) loadAllocations();
  }, [id]);

  const totalAllocatedCost = useMemo(() => {
    return allocations.reduce((sum, item) => sum + (item.allocated_cost || 0), 0);
  }, [allocations]);

  return (
    <div className="flex gap-4 p-6">
      <div className="w-[80%] bg-white rounded-xl shadow-md p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Resource Allocations</h2>

        {loading ? (
          <div className="text-center text-gray-500 italic py-3">
            Loading resource allocations...
          </div>
        ) : allocations.length === 0 ? (
          <div className="text-center text-gray-500 italic py-3">
            No resource allocations for this project
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b text-sm text-gray-700 font-semibold">
                    <th className="text-left py-2 px-3">Task Name</th>
                    <th className="text-left py-2 px-3">Resource</th>
                    <th className="text-left py-2 px-3">Unit Price (₱)</th>
                    <th className="text-left py-2 px-3">Quantity</th>
                    <th className="text-left py-2 px-3">Allocated Cost (₱)</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((item, i) => (
                    <tr
                      key={item.id}
                      className={`text-sm ${
                        i % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition`}
                    >
                      <td className="py-2 px-3 font-medium text-gray-800">
                        {item.tasks?.name || "—"}
                      </td>
                      <td className="py-2 px-3">{item.resources?.name || "—"}</td>
                      <td className="py-2 px-3">
                        ₱{item.resources?.cost_per_unit?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-2 px-3">{item.quantity}</td>
                      <td className="py-2 px-3 text-green-700 font-semibold">
                        ₱{item.allocated_cost?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end border-t pt-4 mt-3">
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Allocated Cost:</p>
                <p className="text-lg font-semibold text-green-800">
                  ₱{totalAllocatedCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="w-[40%]">
        <ProjectResources projectId={String(id)} />
      </div>
    </div>
  );
}
