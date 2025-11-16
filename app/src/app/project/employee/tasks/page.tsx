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

export default function EmployeeTaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectNames, setProjectNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  async function loadData() {
    try {
      setLoading(true);
      const taskRes = await TaskService.getByEmployee(EMPLOYEE_ID);
      const list: Task[] = taskRes || [];
      setTasks(list);

      const projectIds = Array.from(new Set(list.map((t) => t.project_id))).filter(
        Boolean
      );

      if (projectIds.length > 0) {
        const map: Record<string, string> = {};
        await Promise.all(
          projectIds.map(async (pid) => {
            try {
              const proj = await ProjectService.getById(pid);
              if (proj) map[pid] = proj.name || pid;
            } catch {
              map[pid] = pid;
            }
          })
        );
        setProjectNames(map);
      } else {
        setProjectNames({});
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const pending = useMemo(
    () => tasks.filter((t) => t.status === "PENDING"),
    [tasks]
  );
  const active = useMemo(
    () =>
      tasks.filter((t) =>
        ["PENDING_ALLOCATIONS", "IN_PROGRESS"].includes(t.status)
      ),
    [tasks]
  );
  const done = useMemo(
    () => tasks.filter((t) => t.status === "DONE"),
    [tasks]
  );
  const rejected = useMemo(
    () => tasks.filter((t) => t.status === "REJECTED"),
    [tasks]
  );

  function formatDate(date?: string | null) {
    if (!date) return "—";
    const d = date.split("T")[0];
    return d;
  }

  function statusColor(status: string) {
    switch (status) {
      case "PENDING":
        return "border-amber-500 text-amber-600";
      case "PENDING_ALLOCATIONS":
        return "border-blue-500 text-blue-600";
      case "IN_PROGRESS":
        return "border-indigo-500 text-indigo-600";
      case "DONE":
        return "border-green-600 text-green-600";
      case "REJECTED":
        return "border-red-600 text-red-600";
      default:
        return "border-neutral-400 text-neutral-600";
    }
  }

  async function handleRespond(taskId: string, action: "ACCEPT" | "REJECT") {
    try {
      setActionId(taskId);
      await TaskService.respond(taskId, action);
      toast.success(
        action === "ACCEPT" ? "Task accepted." : "Task rejected."
      );
      await loadData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update task.");
    } finally {
      setActionId(null);
    }
  }

  async function handleMarkDone(taskId: string) {
    try {
      setActionId(taskId);
      await TaskService.markDone(taskId);
      toast.success("Task marked as DONE.");
      await loadData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to mark task as done.");
    } finally {
      setActionId(null);
    }
  }

  if (loading && tasks.length === 0) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Project Tasks</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Review assigned tasks, accept or reject them, and mark work as
            completed.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard label="Pending Decisions" value={pending.length} tone="amber" />
          <KpiCard label="Active Tasks" value={active.length} tone="blue" />
          <KpiCard label="Completed" value={done.length} tone="green" />
          <KpiCard label="Rejected" value={rejected.length} tone="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
          <div className="space-y-6">
            <section className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 md:p-5">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">
                  Tasks Awaiting Your Decision
                </h2>
                <span className="text-xs text-neutral-500">
                  Click Accept to start, or Reject to send back.
                </span>
              </div>

              {pending.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  You have no tasks waiting for approval.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-2 pr-2">Task</th>
                        <th className="py-2 pr-2">Project</th>
                        <th className="py-2 pr-2">Expected</th>
                        <th className="py-2 pr-2">Status</th>
                        <th className="py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pending.map((t) => (
                        <tr
                          key={t.id}
                          className="border-b last:border-0 hover:bg-neutral-50"
                        >
                          <td className="py-2 pr-2">
                            <div className="font-medium">{t.name}</div>
                            {t.description && (
                              <div className="text-xs text-neutral-500 line-clamp-1">
                                {t.description}
                              </div>
                            )}
                          </td>
                          <td className="py-2 pr-2 text-sm">
                            {projectNames[t.project_id] || t.project_id}
                          </td>
                          <td className="py-2 pr-2 text-sm">
                            {formatDate(t.expected_date)}
                          </td>
                          <td className="py-2 pr-2">
                            <Badge
                              variant="outline"
                              className={statusColor(t.status)}
                            >
                              {t.status}
                            </Badge>
                          </td>
                          <td className="py-2 pl-2 text-right space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-600 text-white"
                              disabled={actionId === t.id}
                              onClick={() => handleRespond(t.id, "ACCEPT")}
                            >
                              {actionId === t.id ? "Processing..." : "Accept"}
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 text-white"
                              variant="destructive"
                              disabled={actionId === t.id}
                              onClick={() => handleRespond(t.id, "REJECT")}
                            >
                              Reject
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 md:p-5">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Active & In-Progress</h2>
                <span className="text-xs text-neutral-500">
                  Mark tasks as done when you finish them.
                </span>
              </div>

              {active.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  No active tasks right now.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="py-2 pr-2">Task</th>
                        <th className="py-2 pr-2">Project</th>
                        <th className="py-2 pr-2">Expected</th>
                        <th className="py-2 pr-2">Status</th>
                        <th className="py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {active.map((t) => (
                        <tr
                          key={t.id}
                          className="border-b last:border-0 hover:bg-neutral-50"
                        >
                          <td className="py-2 pr-2">
                            <div className="font-medium">{t.name}</div>
                            {t.description && (
                              <div className="text-xs text-neutral-500 line-clamp-1">
                                {t.description}
                              </div>
                            )}
                          </td>
                          <td className="py-2 pr-2 text-sm">
                            {projectNames[t.project_id] || t.project_id}
                          </td>
                          <td className="py-2 pr-2 text-sm">
                            {formatDate(t.expected_date)}
                          </td>
                          <td className="py-2 pr-2">
                            <Badge
                              variant="outline"
                              className={statusColor(t.status)}
                            >
                              {t.status}
                            </Badge>
                          </td>
                          <td className="py-2 pl-2 text-right">
                            {t.status === "PENDING_ALLOCATIONS" ? (
                              <span className="text-xs text-neutral-500">
                                Waiting for resource allocation…
                              </span>
                            ) : (
                              <Button
                                size="sm"
                                className="bg-indigo-600 text-white"
                                disabled={actionId === t.id}
                                onClick={() => handleMarkDone(t.id)}
                              >
                                {actionId === t.id ? "Saving..." : "Mark Done"}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 md:p-5">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Completed Tasks</h2>
                <span className="text-xs text-neutral-500">
                  Tasks you&apos;ve already finished.
                </span>
              </div>

              {done.length === 0 ? (
                <p className="text-sm text-neutral-500">
                  No completed tasks yet.
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {done.map((t) => (
                    <li
                      key={t.id}
                      className="flex justify-between items-center border-b last:border-0 py-2"
                    >
                      <div>
                        <div className="font-medium">{t.name}</div>
                        <div className="text-xs text-neutral-500">
                          {projectNames[t.project_id] || t.project_id}
                        </div>
                      </div>
                      <div className="text-xs text-neutral-500 text-right">
                        <div>Expected: {formatDate(t.expected_date)}</div>
                        <div>Done: {formatDate(t.end_date)}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <aside className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 md:p-5 h-fit">
            <h2 className="text-lg font-semibold mb-3">Rejected Tasks</h2>
            <p className="text-xs text-neutral-500 mb-3">
              You can reconsider and accept a rejected task later if needed.
            </p>

            {rejected.length === 0 ? (
              <p className="text-sm text-neutral-500">
                No rejected tasks at the moment.
              </p>
            ) : (
              <div className="space-y-3 text-sm">
                {rejected.map((t) => (
                  <div
                    key={t.id}
                    className="border border-red-100 rounded-lg p-3 bg-red-50/60"
                  >
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-neutral-600">
                      {projectNames[t.project_id] || t.project_id}
                    </div>
                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className="border-red-500 text-red-600"
                      >
                        REJECTED
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      className="mt-2 bg-green-600 text-white w-full"
                      disabled={actionId === t.id}
                      onClick={() => handleRespond(t.id, "ACCEPT")}
                    >
                      {actionId === t.id
                        ? "Re-accepting..."
                        : "Accept Again"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "amber" | "blue" | "green" | "red";
}) {
  const bgMap: Record<typeof tone, string> = {
    amber: "from-amber-400 to-amber-500",
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
  };

  return (
    <div
      className={`p-4 rounded-xl text-white bg-gradient-to-br ${bgMap[tone]} shadow-sm`}
    >
      <div className="text-xs opacity-80">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
