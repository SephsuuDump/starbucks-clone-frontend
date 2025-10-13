"use client";

import { useEffect, useState } from "react";
import { Resource } from "@/types/Resource";
import { ResourceService } from "@/services/project_management/ResourceService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { AddResourceModal } from "./AddResourceModal";

export function ProjectResources({ projectId }: { projectId: string }) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  async function loadResources() {
    try {
      setLoading(true);
      const res = await ResourceService.getByProject(projectId);
      console.log(res.data);
      setResources(res);
    } catch (e) {
      toast.error(`Failed to load resources: ${e}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteResource(id: number) {
    try {
      await ResourceService.deleteById(id);
      toast.success("Resource deleted successfully!");
      loadResources();
    } catch (err) {
      toast.error(`Failed to delete resource: ${err}`);
    }
  }

  useEffect(() => {
    if (projectId) loadResources();
  }, [projectId]);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
      {openAdd && (
        <AddResourceModal
          open={openAdd}
          setOpen={setOpenAdd}
          projectId={projectId}
          setLoading={setLoading}
        />
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Resources</h2>
        <Button
          className="!bg-green-900 text-white hover:opacity-90 flex items-center gap-2"
          onClick={() => setOpenAdd(true)} 
        >
          <Plus className="w-4 h-4" />
          Add Resource
        </Button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 italic py-3">Loading resources...</div>
      ) : resources.length === 0 ? (
        <div className="text-center text-gray-500 italic py-3">
          No resources for this project
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b text-sm text-gray-700 font-semibold">
                <th className="text-left py-2 px-3">Name</th>
                <th className="text-left py-2 px-3">Type</th>
                <th className="text-left py-2 px-3">Cost / Unit</th>
                <th className="text-left py-2 px-3">Unit</th>
                <th className="text-left py-2 px-3">Availability</th>
                <th className="text-center py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((res, i) => (
                <tr
                  key={res.id}
                  className={`text-sm ${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="py-2 px-3 font-medium text-gray-800">{res.name}</td>
                  <td className="py-2 px-3">{res.type}</td>
                  <td className="py-2 px-3">₱{res.cost_per_unit.toFixed(2)}</td>
                  <td className="py-2 px-3">{res.unit}</td>
                  <td className="py-2 px-3">{res.availability}</td>
                  <td className="py-2 px-3 text-center">
                    <Button
                      className="!bg-red-600 text-white px-3 py-1 hover:opacity-90"
                      onClick={() => handleDeleteResource(res.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
