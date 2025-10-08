'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ResourceAllocation } from "@/types/ResourceAllocation";
import { ResourceAllocationService } from "@/services/project_management/ResourceAllocationService";
import { toast } from "sonner";
import { ProcurementHeader } from "@/components/custom/procurement/Header";
import ResourceAllocationForm from "@/components/custom/project/ResourceAllocationForm";
import ResourceAllocationTable from "@/components/custom/project/ResourceAllocationTable";

export default function AllocatePage() {
  const { id } = useParams();
  const [allocs, setAllocs] = useState<ResourceAllocation[]>([]);

  async function load() {
    try {
      const res = await ResourceAllocationService.getAll({ project_id: String(id) });
      setAllocs(res.data || []);
    } catch (e) {
      toast.error(`${e}`);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  return (
    <div className="flex flex-col gap-6">
      <ProcurementHeader label="Resource Allocation" />
      <ResourceAllocationForm projectId={String(id)} onAdded={load} />
      <ResourceAllocationTable data={allocs} />
    </div>
  );
}
