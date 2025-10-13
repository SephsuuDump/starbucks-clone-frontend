'use client'

import { Project } from "@/types/project";
export function formatDate(dateString?: string) {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
   }

export function ProjectOverview({ project }: { project: Project }) {

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-2">
      <h2 className="text-xl font-semibold text-gray-800">{project.name}</h2>
      <p className="text-gray-600">{project.description}</p>
      <div className="flex justify-between text-sm text-gray-700 mt-2">
        <span>Start: {formatDate(project.start_date)}</span>
        <span>End: {formatDate(project.end_date)}</span>
        <span>Status: <b>{project.status}</b></span>
      </div>
    </div>
  );
}
