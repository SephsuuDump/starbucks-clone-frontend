"use client";

import { Badge } from "@/components/ui/badge";

export default function ProjectHeader({ project }: { project: any }) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow border border-neutral-200 dark:border-neutral-700">
      <h1 className="text-3xl font-bold">{project.name}</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mt-1">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-4 items-center">
        <Badge variant="outline" className="text-sm px-3 py-1">
          {project.status}
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
