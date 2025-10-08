'use client'

import { Task } from "@/types/Tasks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function TasksTable({
  tasks,
  projectId,
  onDelete,
}: {
  tasks: Task[];
  projectId: number | string;
  onDelete: (taskId: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="grid grid-cols-7 font-semibold text-gray-700 border-b pb-3 text-sm">
        <div>Name</div>
        <div>Description</div>
        <div>Start</div>
        <div>Expected</div>
        <div>Status</div>
        <div>Progress</div>
        <div className="text-center">Actions</div>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center text-gray-500 italic p-3">No tasks yet</div>
      ) : (
        tasks.map((t, i) => (
          <div
            key={t.id}
            className={`grid grid-cols-7 text-sm items-center py-2 px-1 ${
              i % 2 === 0 ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div className="font-bold">{t.name}</div>
            <div className="truncate">{t.description}</div>
            <div>{t.start_date}</div>
            <div>{t.expected_date}</div>
            <div>{t.status}</div>
            <div>{t.progress}%</div>
            <div className="flex justify-center gap-2">
              <Link href={`/project/${projectId}`}>
                <Button className="!bg-blue-600 text-white px-2 py-1 hover:opacity-90">
                  <Eye className="w-4 h-4" />
                </Button>
              </Link>
              <Link href={`/project/${projectId}/tasks/${t.id}/edit`}>
                <Button className="!bg-yellow-500 text-white px-2 py-1 hover:opacity-90">
                  <Pencil className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                onClick={() => onDelete(t.id)}
                className="!bg-red-600 text-white px-2 py-1 hover:opacity-90"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
