"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ProjectService } from "@/services/project_management/projectService";
import { ResourceService } from "@/services/project_management/ResourceService";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ResourceAllocationService } from "@/services/project_management/ResourceAllocationService";

export default function FinanceResourceManagementPage() {
  const router = useRouter();
  const { id } = useParams();
  const projectId = id as string;

  const [project, setProject] = useState<any>(null);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allocations, setAllocations] = useState<any[]>([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);

  const [editForm, setEditForm] = useState({
    name: "",
    type: "",
    unit: "",
    cost_per_unit: "",
    availability: "",
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<any>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    type: "",
    unit: "",
    cost_per_unit: "",
    availability: "",
  });

  async function loadData() {
    setLoading(true);

    const p = await ProjectService.getById(projectId);
    const r = await ResourceService.getByProject(projectId);
    const alloc = await ResourceAllocationService.getAll(projectId);

    setProject(p || null);
    setResources(r || []);
    setAllocations(alloc?.data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (projectId) loadData();
  }, [projectId]);

  const totalBudget = useMemo(() => Number(project?.budget || 0), [project]);

  const totalResourceCost = useMemo(() => {
    return (resources || []).reduce((sum, r) => {
      const cpu = Number(r?.cost_per_unit || 0);
      const avail = Number(r?.availability || 0);
      return sum + cpu * avail;
    }, 0);
  }, [resources]);

  const totalAllocatedCost = useMemo(() => {
    return (allocations || []).reduce((sum, a) => {
      return sum + Number(a?.allocated_cost || 0);
    }, 0);
  }, [allocations]);

  const remainingBudget = useMemo(() => {
    return totalBudget - totalAllocatedCost;
  }, [totalBudget, totalAllocatedCost]);

  async function handleAdd() {
    try {
      await ResourceService.create({
        ...addForm,
        project_id: projectId,
        cost_per_unit: Number(addForm.cost_per_unit),
        availability: Number(addForm.availability),
      });
      toast.success("Resource added!");
      setAddOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to add resource");
    }
  }

  async function handleApproveAllocation(id: string, approve: boolean) {
    try {
      await ResourceAllocationService.approve(id, approve);
      toast.success(approve ? "Allocation approved!" : "Allocation rejected.");
      loadData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update allocation.");
    }
  }

  function openEdit(resource: any) {
    setEditingResource(resource);
    setEditForm({
      name: resource.name,
      type: resource.type,
      unit: resource.unit,
      cost_per_unit: String(resource.cost_per_unit ?? ""),
      availability: String(resource.availability ?? ""),
    });
    setEditOpen(true);
  }

  async function handleUpdate() {
    try {
      await ResourceService.update(editingResource.id, {
        ...editForm,
        cost_per_unit: Number(editForm.cost_per_unit),
        availability: Number(editForm.availability),
      });
      toast.success("Resource updated!");
      setEditOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update resource");
    }
  }

  async function handleDelete() {
    try {
      await ResourceService.deleteById(resourceToDelete.id);
      toast.success("Resource deleted!");
      setDeleteOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete resource");
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!project) return <p className="p-6 text-red-600">Project not found.</p>;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto space-y-6 mt-0">
        <Button variant="outline" onClick={() => router.push("/finance/project")}>
          ← Back to Finance Dashboard
        </Button>

        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Resources — {project.name}</h1>

          <Button onClick={() => setAddOpen(true)} className="bg-blue-600 text-white">
            + Add Resource
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border p-4 bg-white shadow-sm">
            <p className="text-sm text-neutral-500">Project Budget</p>
            <p className="text-2xl font-bold">₱{totalBudget.toLocaleString()}</p>
          </div>

          <div className="rounded-xl border p-4 bg-white shadow-sm">
            <p className="text-sm text-neutral-500">Total Resource Cost</p>
            <p className="text-2xl font-bold">₱{totalResourceCost.toLocaleString()}</p>
          </div>

          <div className="rounded-xl border p-4 bg-white shadow-sm">
            <p className="text-sm text-neutral-500">Allocated to Tasks</p>
            <p className="text-2xl font-bold">₱{totalAllocatedCost.toLocaleString()}</p>
          </div>

          <div className="rounded-xl border p-4 bg-white shadow-sm">
            <p className="text-sm text-neutral-500">Remaining Budget</p>
            <p
              className={`text-2xl font-bold ${
                remainingBudget < 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              ₱{remainingBudget.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-neutral-50 text-left">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Unit</th>
                <th className="py-3 px-2">Cost/Unit</th>
                <th className="py-3 px-2">Availability</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {resources.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-neutral-500">
                    No resources found.
                  </td>
                </tr>
              )}

              {resources.map((r) => (
                <tr key={r.id} className="border-b hover:bg-neutral-50">
                  <td className="py-3 px-2 font-semibold">{r.name}</td>
                  <td className="py-3 px-2">
                    <Badge variant="outline">{r.type}</Badge>
                  </td>
                  <td className="py-3 px-2">{r.unit}</td>
                  <td className="py-3 px-2">₱{Number(r.cost_per_unit || 0).toLocaleString()}</td>
                  <td className="py-3 px-2">{r.availability}</td>

                  <td className="py-3 px-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => openEdit(r)}
                        size="sm"
                        className="bg-blue-600 text-white"
                      >
                        Edit
                      </Button>

                      <Button
                        onClick={() => {
                          setResourceToDelete(r);
                          setDeleteOpen(true);
                        }}
                        size="sm"
                        className="bg-red-600 text-white"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-4 rounded-xl border shadow-sm mt-8">
          <h2 className="text-xl font-semibold mb-3">Resource Allocations</h2>

          {allocations.length === 0 ? (
            <p className="text-sm text-neutral-500">No resource allocations for this project.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-neutral-50 text-left">
                  <th className="py-3 px-2">Task</th>
                  <th className="py-3 px-2">Resource</th>
                  <th className="py-3 px-2">Quantity</th>
                  <th className="py-3 px-2">Cost</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {allocations.map((a: any) => (
                  <tr key={a.id} className="border-b hover:bg-neutral-50">
                    <td className="py-3 px-2">{a.tasks?.name || "—"}</td>
                    <td className="py-3 px-2">{a.resources?.name || "—"}</td>
                    <td className="py-3 px-2">{a.quantity}</td>
                    <td className="py-3 px-2">₱{Number(a.allocated_cost || 0).toLocaleString()}</td>
                    <td className="py-3 px-2">
                      <Badge
                        variant="outline"
                        className={
                          a.is_approved
                            ? "border-green-600 text-green-600"
                            : "border-amber-600 text-amber-600"
                        }
                      >
                        {a.is_approved ? "APPROVED" : "PENDING"}
                      </Badge>
                    </td>

                    <td className="py-3 px-2 text-right space-x-2">
                      {!a.is_approved && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 text-white"
                            onClick={() => handleApproveAllocation(a.id, true)}
                          >
                            Approve
                          </Button>

                          <Button
                            size="sm"
                            className="bg-red-600 text-white"
                            onClick={() => handleApproveAllocation(a.id, false)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {addOpen && (
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="max-w-lg">
            <DialogTitle>Add Resource</DialogTitle>

            <div className="space-y-3 mt-3">
              <Input
                placeholder="Name"
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              />
              <Input
                placeholder="Type"
                value={addForm.type}
                onChange={(e) => setAddForm({ ...addForm, type: e.target.value })}
              />
              <Input
                placeholder="Unit"
                value={addForm.unit}
                onChange={(e) => setAddForm({ ...addForm, unit: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Cost per Unit"
                value={addForm.cost_per_unit}
                onChange={(e) => setAddForm({ ...addForm, cost_per_unit: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Availability"
                value={addForm.availability}
                onChange={(e) => setAddForm({ ...addForm, availability: e.target.value })}
              />

              <Button className="bg-green-700 text-white" onClick={handleAdd}>
                Save Resource
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {editOpen && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogTitle>Edit Resource</DialogTitle>

            <div className="space-y-3 mt-3">
              <Input
                placeholder="Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <Input
                placeholder="Type"
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
              />
              <Input
                placeholder="Unit"
                value={editForm.unit}
                onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Cost per Unit"
                value={editForm.cost_per_unit}
                onChange={(e) => setEditForm({ ...editForm, cost_per_unit: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Availability"
                value={editForm.availability}
                onChange={(e) => setEditForm({ ...editForm, availability: e.target.value })}
              />

              <Button className="bg-green-700 text-white" onClick={handleUpdate}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {deleteOpen && (
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="max-w-md">
            <DialogTitle>Delete Resource?</DialogTitle>

            <p className="mt-2 text-sm">
              Are you sure you want to delete <b>{resourceToDelete?.name}</b>?
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <Button className="bg-neutral-600 text-white" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>

              <Button className="bg-red-600 text-white" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
