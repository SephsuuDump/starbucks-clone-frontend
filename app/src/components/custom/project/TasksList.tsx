"use client";

import { Badge } from "@/components/ui/badge";
import { PlusCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TaskList({
  tasks,
  allocations,
  openAllocationModal,
  onAddTask,
}: {
  tasks: any[];
  allocations: any[];
  openAllocationModal: (task: any) => void;
  onAddTask?: () => void;
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>

        {onAddTask && (
          <Button
            className="flex items-center gap-2 bg-blue-600 text-white"
            onClick={onAddTask}
          >
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2">Task Name</th>
              <th className="py-2">Assigned To</th>
              <th className="py-2">Expected End</th>
              <th className="py-2">Allocations</th>
              <th className="py-2">Status</th>
              <th className="py-2"></th>
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-neutral-500">
                  No tasks available.
                </td>
              </tr>
            )}

            {tasks.map((task) => {
              const employeeName = task.employee?.user
                ? `${task.employee.user.first_name} ${task.employee.user.last_name}`
                : "Unassigned";

              const taskAlloc = allocations.filter((a) => a.task_id === task.id);
              const approvedCount = taskAlloc.filter((a) => a.is_approved).length;

              let allocStatus = "No Allocation";
              if (taskAlloc.length > 0) {
                allocStatus = `${approvedCount}/${taskAlloc.length} Approved`;
              }

              return (
                <tr
                  key={task.id}
                  className="border-b hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <td className="py-3">{task.name}</td>

                  <td className="py-3">{employeeName}</td>

                  <td className="py-3">{task.expected_date || "—"}</td>

                  <td className="py-3">
                    <Badge variant="outline">{allocStatus}</Badge>
                  </td>

                  <td className="py-3">
                    <Badge variant="outline">{task.status}</Badge>
                  </td>

                  <td className="py-3">
                    <button
                      onClick={() => openAllocationModal(task)}
                      className="flex items-center text-blue-600 hover:text-blue-800 
                                 dark:text-blue-400 dark:hover:text-blue-300 
                                 text-sm font-medium gap-1"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Allocate
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
