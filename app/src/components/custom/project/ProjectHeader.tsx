"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { useRouter } from "next/navigation";

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getStatusClasses(status: string) {
  switch (status) {
    case "PENDING":
    case "PENDING_BUDGET":
    case "PENDING_ALLOCATIONS":
    case "PENDING_TASK_ACCEPTANCE":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";

    case "ONGOING":
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700 border-blue-300";

    case "DONE":
      return "bg-green-100 text-green-700 border-green-300";

    case "BUDGET_REJECTED":
    case "REJECTED":
      return "bg-red-100 text-red-700 border-red-300";

    default:
      return "bg-neutral-100 text-neutral-700 border-neutral-300";
  }
}

export default function ProjectHeader({ project }: { project: any }) {
  const router = useRouter();

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow border border-neutral-200 dark:border-neutral-700">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            {project.description}
          </p>
        </div>

        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => router.push(`/project/logs/${project.id}`)}
        >
          <Activity className="w-4 h-4" />
          Activity Log
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 items-center">
        <Badge
          variant="outline"
          className={`text-sm px-3 py-1 font-bold ${getStatusClasses(project.status)}`}
        >
          {formatStatus(project.status)}
        </Badge>

        <div className="text-sm flex flex-col">
          <span className="font-semibold">Start:</span>
          <span>{project.start_date ? project.start_date.split("T")[0] : "—"}</span>
        </div>

        <div className="text-sm flex flex-col">
          <span className="font-semibold">Expected End:</span>
          <span>{project.end_date ? project.end_date.split("T")[0] : "—"}</span>
        </div>

        <div className="text-sm flex flex-col">
          <span className="font-semibold">Actual End:</span>
          <span>{project.actual_end ? project.actual_end.split("T")[0] : "N/A"}</span>
        </div>

        <div className="text-sm flex flex-col">
          <span className="font-semibold">Progress:</span>
          <span>{project.progress}%</span>
        </div>
      </div>
    </div>
  );
}
