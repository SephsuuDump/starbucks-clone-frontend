'use client'

import { useEffect, useMemo, useState } from "react";
import { ResourceAllocation } from "@/types/ResourceAllocation";
import { ResourceAllocationService } from "@/services/project_management/ResourceAllocationService";
import { Project } from "@/types/project";

export default function BudgetPanel({ project }: { project: Project }) {
  const [allocs, setAllocs] = useState<ResourceAllocation[]>([]);

  useEffect(() => {
    async function load() {
      const res = await ResourceAllocationService.getAll({ project_id: String(project.id) });
      setAllocs(res.data || []);
    }
    load();
  }, [project.id]);

  const totals = useMemo(() => {
    const allocated = allocs.reduce((sum, a) => sum + (a.allocated_cost || 0), 0);
    const remaining = (project.budget || 0) - allocated;
    const usedPct = project.budget ? Math.min(100, Math.round((allocated / project.budget) * 100)) : 0;
    return { allocated, remaining, usedPct };
  }, [allocs, project.budget]);

  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-sm text-gray-600">Approved Budget</h3>
        <div className="text-2xl font-bold text-gray-800 mt-1">₱ {project.budget?.toLocaleString()}</div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-sm text-gray-600">Allocated (to date)</h3>
        <div className="text-2xl font-bold text-gray-800 mt-1">₱ {totals.allocated.toLocaleString()}</div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-5">
        <h3 className="text-sm text-gray-600">Remaining</h3>
        <div className={`text-2xl font-bold mt-1 ${totals.remaining < 0 ? "text-red-600" : "text-gray-800"}`}>
          ₱ {totals.remaining.toLocaleString()}
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded">
          <div className="h-2 bg-green-600 rounded" style={{ width: `${totals.usedPct}%` }} />
        </div>
        <p className="text-xs text-gray-600 mt-1">{totals.usedPct}% used</p>
      </div>
    </div>
  );
}
