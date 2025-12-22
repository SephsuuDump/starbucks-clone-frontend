'use client'

import { useEffect, useState } from "react";
import { Resource } from "@/types/Resource";
import { ResourceService } from "@/services/project_management/ResourceService";
import { toast } from "sonner";
import { ProcurementHeader } from "@/components/custom/procurement/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ResourceTable from "@/components/custom/project/ResouceTable";
import ResourceForm from "@/components/custom/project/ResourceForm";

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [editing, setEditing] = useState<Resource | undefined>();

  async function load() {
    try {
      const res = await ResourceService.getAll({});
      setResources(res.data || []);
    } catch (e) {
      toast.error(`${e}`);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: number) {
    try {
      await ResourceService.deleteById(id);
      toast.success("Deleted");
      load();
    } catch (e) {
      toast.error(`${e}`);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <ProcurementHeader label="Resources" />
      <div className="flex justify-between">
        <div />
        <Link href="/project/resources/create">
          <Button className="!bg-green-900 text-white">+ Add Resource</Button>
        </Link>
      </div>

      <ResourceTable resources={resources} onEdit={setEditing} onDelete={handleDelete} />

      {editing && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold mb-3">Edit Resource</h3>
          <ResourceForm
            initial={editing}
            onSaved={() => {
              setEditing(undefined);
              load();
            }}
          />
        </div>
      )}
    </div>
  );
}
