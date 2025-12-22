'use client'

import { ResourceAllocation } from "@/types/ResourceAllocation";

export default function ResourceAllocationTable({ data }: { data: ResourceAllocation[] }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="grid grid-cols-6 font-semibold text-gray-700 border-b pb-3 text-sm">
        <div>ID</div>
        <div>Task</div>
        <div>Resource</div>
        <div>Qty</div>
        <div>Allocated Cost</div>
        <div>Created</div>
      </div>
      {data.length === 0 ? (
        <div className="text-center text-gray-500 italic p-3">No allocations</div>
      ) : (
        data.map((a, i) => (
          <div
            key={a.id}
            className={`grid grid-cols-6 text-sm items-center py-2 px-1 ${
              i % 2 === 0 ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div className="font-bold">{a.id}</div>
            <div>{a.task_id}</div>
            <div>{a.resource_id}</div>
            <div>{a.quantity}</div>
            <div>{a.allocated_cost}</div>
            <div>{new Date(a.created_at).toLocaleDateString()}</div>
          </div>
        ))
      )}
    </div>
  );
}
