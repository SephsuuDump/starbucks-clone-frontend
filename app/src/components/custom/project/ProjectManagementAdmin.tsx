"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { ProjectResponse } from "@/types/project";
import { ProjectService } from "@/services/project_management/projectService";
import AddProjectDialog from "./dialogs/AddProjectDialog";
import EditProjectDialog from "./dialogs/EditProjectDialog";
import DeleteProjectDialog from "./dialogs/DeleteProjectDialog";

export default function ProjectManagementAdmin() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    const res = await ProjectService.getAll();
    setProjects(res || []);
    setLoading(false);
  };


  useEffect(() => {
    loadProjects();
  }, []);

  const total = projects.length;

  const running = projects.filter(
    (p) => p.status === "ONGOING"
  ).length;

  const pending = projects.filter((p) =>
    [
      "PENDING_BUDGET",
      "PENDING_TASK_ACCEPTANCE",
      "PENDING_ALLOCATIONS"
    ].includes(p.status)
  ).length;

  const done = projects.filter(
    (p) => p.status === "DONE"
  ).length;


  return (
    <div className="min-h-screen w-full bg-white p-8">
      <div className="max-w-[1200px] mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold">Project Management</h1>
            <p className="text-sm text-neutral-500">Manage all system-wide projects and track progress</p>
          </div>

          <Button className="bg-blue-600 text-white" onClick={() => setOpenAdd(true)}>
            + Add Project
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard title="Total Projects" value={total} color="blue" />
          <MetricCard title="Running" value={running} color="indigo" />
          <MetricCard title="Pending" value={pending} color="yellow" />
          <MetricCard title="Completed" value={done} color="green" />
        </div>

        <div className="rounded-xl bg-white shadow-lg p-6 border border-neutral-200">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>

          <ProjectTable
            data={projects}
            loading={loading}
            setSelectedProject={setSelectedProject}
            setOpenEdit={setOpenEdit}
            setOpenDelete={setOpenDelete}
          />
        </div>

        {openAdd && (
          <AddProjectDialog
            setOpenAdd={setOpenAdd}
            setLoading={setLoading}
            loading={loading}
            reload={loadProjects}
          />
        )}

        {openEdit && selectedProject && (
          <EditProjectDialog
            setOpenEdit={setOpenEdit}
            project={selectedProject}
            setLoading={setLoading}
            loading={loading}
            reload={loadProjects}
          />
        )}

        {openDelete && selectedProject && (
          <DeleteProjectDialog
            setOpenDelete={setOpenDelete}
            project={selectedProject}
            setLoading={setLoading}
            loading={loading}
            reload={loadProjects}
          />
        )}
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  color,
}: {
  title: string;
  value: any;
  color: "blue" | "indigo" | "yellow" | "green";
}) {
  const colorMap: any = {
    blue: "from-blue-500 to-blue-700",
    indigo: "from-indigo-500 to-indigo-700",
    yellow: "from-yellow-400 to-yellow-600",
    green: "from-green-500 to-green-700",
  };

  return (
    <Card className={`rounded-xl bg-gradient-to-br ${colorMap[color]} text-white p-6 shadow-md`}>
      <span className="text-sm opacity-80">{title}</span>
      <span className="text-3xl font-bold mt-1">{value}</span>
    </Card>
  );
}


function ProjectTable({
  data,
  loading,
  setSelectedProject,
  setOpenEdit,
  setOpenDelete,
}: {
  data: ProjectResponse[];
  loading: boolean;
  setSelectedProject: (p: ProjectResponse) => void;
  setOpenEdit: (v: boolean) => void;
  setOpenDelete: (v: boolean) => void;
}) {
  if (loading) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-neutral-500">
        Loading projects...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-neutral-500 text-lg">
        No projects found
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {data.map((proj) => (
        <div
          key={proj.id}
          className="grid grid-cols-4 items-center px-4 py-3 border rounded-lg
          bg-neutral-50 hover:bg-neutral-100 transition shadow-sm"
        >
          <div className="font-semibold">{proj.name}</div>

          <div>
            <span
              className={`px-2 py-1 rounded-md text-xs font-semibold ${
                proj.status === "DONE"
                  ? "bg-green-100 text-green-700"
                  : proj.status === "ONGOING"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {proj.status}
            </span>
          </div>

          <div className="font-semibold">{proj.progress}%</div>

          <div className="flex justify-center gap-2">
            <Link href={`/project/${proj.id}`}>
              <Button className="!bg-blue-600 text-white px-2 py-1 hover:opacity-90">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>

            <Button
              className="!bg-yellow-500 text-white px-2 py-1 hover:opacity-90"
              onClick={() => {
                setSelectedProject(proj);
                setOpenEdit(true);
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>

            <Button
              className="!bg-red-600 text-white px-2 py-1 hover:opacity-90"
              onClick={() => {
                setSelectedProject(proj);
                setOpenDelete(true);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

