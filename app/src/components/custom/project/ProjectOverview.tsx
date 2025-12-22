'use client'

import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { Box } from "lucide-react";
import Link from "next/link";


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
    <div className="bg-white rounded-xl shadow-md p-6 space-y-2 ">
      <div className="flex justify-between">
        <div>
            <h2 className="text-xl font-semibold text-gray-800">{project.name}</h2>
            <p className="text-gray-600">{project.description}</p>
        </div>
        <div className="flex items-center">
         <Link href={`/project/${project.id}/resources`}>
            <Button className="bg-green-900 text-white hover:opacity-90 flex items-center gap-2">
              <Box className="w-4 h-4" />
              Manage Resource
            </Button>
          </Link>
        </div>

      </div>
      
      <div className="flex justify-between text-sm text-gray-700 mt-5">
        <span>Start: {formatDate(project.start_date)}</span>
        <span>End: {formatDate(project.end_date)}</span>
        <span>Status:{project.status === "DONE" ? <b>{project.status} ({formatDate(project.actual_end)})</b> : project.status }</span>
      </div>
    </div>
  );
}
