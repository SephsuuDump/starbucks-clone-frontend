"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ProjectActivityService } from "@/services/project_management/ProjectActivity";
import { ProjectService } from "@/services/project_management/projectService";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Project = {
  id: string;
  name: string;
};

type ActivityLog = {
  id: string;
  actor_role: string;
  entity_type: string;
  action: string;
  description: string;
  created_at: string;
};

export default function ProjectLogsSidebarPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const list = await ProjectService.getAll();
        setProjects(list);
        if (list.length > 0) {
          setProjectId(list[0].id);
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projectId === "") return;

    async function fetchLogs() {
      setLoading(true);
      try {
        const res = await ProjectActivityService.getByProject(projectId);
        setLogs(res.data || []);
      } catch {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [projectId]);

  const grouped = logs.reduce<Record<string, ActivityLog[]>>((acc, log) => {
    const dateKey = format(new Date(log.created_at), "MMMM dd, yyyy");
    acc[dateKey] = acc[dateKey] || [];
    acc[dateKey].push(log);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-sm text-gray-500">
        Loading activity logs...
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-sm text-gray-500">
        No projects found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        <h3 className="font-bold text-sm">Select project:</h3>
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger className="w-[320px]">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-xl font-semibold text-gray-800 mb-6">
            Project Activity Log
          </h1>

          {logs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 text-sm">
              No activity for this project yet.
            </div>
          )}

          <div className="space-y-10">
            {Object.entries(grouped).map(([date, items]) => (
              <div key={date}>
                <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">
                  {date}
                </h2>

                <div className="relative border-l border-gray-200 pl-6 space-y-6">
                  {items.map((log) => (
                    <div key={log.id} className="relative">
                      <span className="absolute -left-[9px] top-2 w-4 h-4 bg-blue-600 rounded-full" />

                      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start gap-4">
                          <p className="text-sm text-gray-800 leading-relaxed">
                            {log.description}
                          </p>
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {format(new Date(log.created_at), "hh:mm a")}
                          </span>
                        </div>

                        <div className="mt-2 text-xs text-gray-500">
                          {log.actor_role} · {log.entity_type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
