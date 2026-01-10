"use client";

import { useEffect, useMemo, useState } from "react";
import { TaskService } from "@/services/project_management/TaskService";
import { ProjectService } from "@/services/project_management/projectService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const EMPLOYEE_ID = "59c9df25-7eb4-4777-b51b-3ad7c52c99e1";

type Task = {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  start_date?: string | null;
  expected_date?: string | null;
  end_date?: string | null;
  status: string;
};

type Tab = "PENDING" | "ACTIVE" | "DONE";

export default function EmployeeTaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectNames, setProjectNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("PENDING");

  async function loadData() {
    try {
      setLoading(true);
      const taskRes = await TaskService.getByEmployee(EMPLOYEE_ID);
      const list: Task[] = taskRes || [];
      setTasks(list);

      const projectIds = Array.from(new Set(list.map(t => t.project_id)));
      const map: Record<string, string> = {};

      await Promise.all(
        projectIds.map(async (pid) => {
          const proj = await ProjectService.getById(pid);
          if (proj) map[pid] = proj.name;
        })
      );

      setProjectNames(map);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const pending = useMemo(
    () => tasks.filter(t => t.status === "PENDING"),
    [tasks]
  );

  const active = useMemo(
    () =>
      tasks.filter(t =>
        ["PENDING_ALLOCATIONS", "IN_PROGRESS"].includes(t.status)
      ),
    [tasks]
  );

  const done = useMemo(
    () => tasks.filter(t => t.status === "DONE"),
    [tasks]
  );

  function formatDate(date?: string | null) {
    return date ? date.split("T")[0] : "—";
  }

  function statusBadge(status: string) {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-400";
      case "PENDING_ALLOCATIONS":
        return "bg-blue-50 text-blue-700 border-blue-400";
      case "IN_PROGRESS":
        return "bg-indigo-50 text-indigo-700 border-indigo-400";
      case "DONE":
        return "bg-green-50 text-green-700 border-green-500";
      default:
        return "bg-neutral-50 text-neutral-700 border-neutral-400";
    }
  }

  function tabStyle(tab: Tab, active: boolean) {
    if (tab === "PENDING") {
      return active
        ? "bg-amber-500 text-white border-amber-500"
        : "border-amber-400 text-amber-600 hover:bg-amber-50";
    }
    if (tab === "ACTIVE") {
      return active
        ? "bg-blue-600 text-white border-blue-600"
        : "border-blue-400 text-blue-600 hover:bg-blue-50";
    }
    return active
      ? "bg-green-600 text-white border-green-600"
      : "border-green-400 text-green-600 hover:bg-green-50";
  }

  async function acknowledgeTask(taskId: string) {
    try {
      setActionId(taskId);
      await TaskService.respond(taskId, "ACCEPT");
      toast.success("Task acknowledged.");
      loadData();
    } finally {
      setActionId(null);
    }
  }

  async function markDone(taskId: string) {
    try {
      setActionId(taskId);
      await TaskService.markDone(taskId);
      toast.success("Task marked as DONE.");
      loadData();
    } finally {
      setActionId(null);
    }
  }

  const tabData: Record<Tab, Task[]> = {
    PENDING: pending,
    ACTIVE: active,
    DONE: done,
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <div>
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-sm text-neutral-600">
            Acknowledge assigned tasks, track progress, and complete your work.
          </p>
        </div>

        {/* COLORED TABS */}
        <div className="flex gap-2">
          {(["PENDING", "ACTIVE", "DONE"] as Tab[]).map(tab => (
            <Button
              key={tab}
              variant="outline"
              onClick={() => setActiveTab(tab)}
              className={`px-5 font-semibold ${tabStyle(tab, activeTab === tab)}`}
            >
              {tab}
            </Button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left bg-neutral-100">
                <th className="py-3 px-4">Task</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Expected</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {tabData[activeTab].length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-neutral-500">
                    No tasks found.
                  </td>
                </tr>
              )}

              {tabData[activeTab].map(task => (
                <tr key={task.id} className="border-b hover:bg-neutral-50">
                  <td className="py-3 px-4">
                    <div className="font-medium">{task.name}</div>
                    {task.description && (
                      <div className="text-xs text-neutral-500 line-clamp-1">
                        {task.description}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {projectNames[task.project_id]}
                  </td>
                  <td className="py-3 px-4">
                    {formatDate(task.expected_date)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={`font-medium ${statusBadge(task.status)}`}
                    >
                      {task.status.replaceAll("_", " ")}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {task.status === "PENDING" && (
                      <Button
                        size="sm"
                        className="bg-green-600 text-white"
                        disabled={actionId === task.id}
                        onClick={() => acknowledgeTask(task.id)}
                      >
                        Acknowledge
                      </Button>
                    )}

                    {task.status === "IN_PROGRESS" && (
                      <Button
                        size="sm"
                        className="bg-indigo-600 text-white"
                        disabled={actionId === task.id}
                        onClick={() => markDone(task.id)}
                      >
                        Mark Done
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
