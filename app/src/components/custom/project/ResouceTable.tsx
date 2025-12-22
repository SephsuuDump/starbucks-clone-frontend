'use client'

import { Resource } from "@/types/Resource";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export default function ResourceTable({
  resources,
  onEdit,
  onDelete,
}: {
  resources: Resource[];
  onEdit: (r: Resource) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="grid grid-cols-7 font-semibold text-gray-700 border-b pb-3 text-sm">
        <div>Name</div>
        <div>Type</div>
        <div>Unit</div>
        <div>Cost/Unit</div>
        <div>Availability</div>
        <div>Created</div>
        <div className="text-center">Actions</div>
      </div>

      {resources.length === 0 ? (
        <div className="text-center text-gray-500 italic p-3">No resources</div>
      ) : (
        resources.map((r, i) => (
          <div
            key={r.id}
            className={`grid grid-cols-7 text-sm items-center py-2 px-1 ${
              i % 2 === 0 ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div className="font-bold">{r.name}</div>
            <div>{r.type}</div>
            <div>{r.unit}</div>
            <div>{r.cost_per_unit}</div>
            <div>{r.availability}</div>
            <div>{new Date(r.created_at).toLocaleDateString()}</div>
            <div className="flex justify-center gap-2">
              <Button onClick={() => onEdit(r)} className="!bg-yellow-500 text-white px-2 py-1 hover:opacity-90">
                <Pencil className="w-4 h-4" />
              </Button>
              <Button onClick={() => onDelete(r.id)} className="!bg-red-600 text-white px-2 py-1 hover:opacity-90">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
