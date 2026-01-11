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

type Tab = "PENDING" | "ONGOING" | "DONE";

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function statusBg(status: string) {
  if (status === "ONGOING") return "bg-blue-100 text-blue-700";
  if (status === "DONE") return "bg-green-100 text-green-700";
  if (status === "BUDGET_REJECTED") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
}

export default function ProjectManagementAdmin() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("PENDING");

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

  const rejectedProjects = projects.filter(
    p => p.status === "BUDGET_REJECTED"
  );

  const filteredProjects = projects.filter(p => {
    if (activeTab === "ONGOING") return p.status === "ONGOING";
    if (activeTab === "DONE") return p.status === "DONE";
    return [
      "PENDING_BUDGET",
      "PENDING_TASK_ACCEPTANCE",
      "PENDING_ALLOCATIONS",
    ].includes(p.status);
  });

  const total = projects.length;
  const running = projects.filter(p => p.status === "ONGOING").length;
  const pending = projects.filter(p =>
    [
      "PENDING_BUDGET",
      "PENDING_TASK_ACCEPTANCE",
      "PENDING_ALLOCATIONS",
    ].includes(p.status)
  ).length;
  const done = projects.filter(p => p.status === "DONE").length;

  const tabStyles = {
    PENDING: {
      active: "bg-yellow-500 text-white",
      inactive: "border-yellow-500 text-yellow-600 hover:bg-yellow-50",
    },
    ONGOING: {
      active: "bg-blue-600 text-white",
      inactive: "border-blue-600 text-blue-600 hover:bg-blue-50",
    },
    DONE: {
      active: "bg-green-600 text-white",
      inactive: "border-green-600 text-green-600 hover:bg-green-50",
    },
  };

  return (
    <div className="min-h-screen w-full bg-slate p-8">
      <div className="max-w-[1200px] mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold">Project Management</h1>
            <p className="text-sm text-neutral-500">
              Manage all system-wide projects and track progress
            </p>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-500 text-white" onClick={() => setOpenAdd(true)}>
            + Add Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard title="Total Projects" value={total} color="blue" />
          <MetricCard title="Running" value={running} color="indigo" />
          <MetricCard title="Pending" value={pending} color="yellow" />
          <MetricCard title="Completed" value={done} color="green" />
        </div>

        {rejectedProjects.length > 0 && (
          <div className="border border-red-300 bg-red-50 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="font-semibold text-red-700">
                ⚠ Budget Rejected Projects Require Action
              </h3>
              <p className="text-sm text-red-600">
                Please review and update the budget or remove the project.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-red-200 overflow-hidden">
              <div className="grid grid-cols-4 px-4 py-2 text-xs font-semibold text-red-700 bg-red-100">
                <span>Project</span>
                <span>Status</span>
                <span>Progress</span>
                <span className="text-center">Action</span>
              </div>

              {rejectedProjects.map(proj => (
                <div
                  key={proj.id}
                  className="grid grid-cols-4 items-center px-4 py-3 border-t text-sm"
                >
                  <span className="font-medium">{proj.name}</span>
                  <div className={`px-2 py-1 rounded-md w-fit text-xs font-semibold ${statusBg(proj.status)}`}>
                    {formatStatus(proj.status)}
                  </div>
                  <span>{proj.progress}%</span>

                  <div className="flex justify-center gap-2">
                    <Button
                      className="bg-yellow-500 text-white px-2 py-1"
                      onClick={() => {
                        setSelectedProject(proj);
                        setOpenEdit(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    <Button
                      className="bg-red-600 text-white px-2 py-1"
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
          </div>
        )}

        <div className="flex gap-2">
          {(["PENDING", "ONGOING", "DONE"] as Tab[]).map(tab => {
            const isActive = activeTab === tab;
            const styles = tabStyles[tab];

            return (
              <Button
                key={tab}
                variant="outline"
                onClick={() => setActiveTab(tab)}
                className={`px-4 ${
                  isActive ? styles.active : styles.inactive
                }`}
              >
                {tab}
              </Button>
            );
          })}
        </div>

        <div className="rounded-xl bg-white shadow-lg p-6 border border-neutral-200">
          <ProjectTable
            data={filteredProjects}
            loading={loading}
            setSelectedProject={setSelectedProject}
            setOpenEdit={setOpenEdit}
            setOpenDelete={setOpenDelete}
          />
        </div>

        {openAdd && (
          <AddProjectDialog
            setOpenAdd={setOpenAdd}
            loading={loading}
            setLoading={setLoading}
            reload={loadProjects}
          />
        )}

        {openEdit && selectedProject && (
          <EditProjectDialog
            setOpenEdit={setOpenEdit}
            project={selectedProject}
            loading={loading}
            setLoading={setLoading}
            reload={loadProjects}
          />
        )}

        {openDelete && selectedProject && (
          <DeleteProjectDialog
            setOpenDelete={setOpenDelete}
            project={selectedProject}
            loading={loading}
            setLoading={setLoading}
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
      <div className="h-40 flex items-center justify-center text-neutral-500">
        Loading projects...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="h-40 flex items-center justify-center text-neutral-500">
        No projects found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map(proj => (
        <div
          key={proj.id}
          className="grid grid-cols-4 items-center px-4 py-3 border rounded-lg bg-neutral-50"
        >
          <div className="font-semibold">{proj.name}</div>

          <div className={`px-2 py-1 rounded-md w-fit text-xs font-semibold ${statusBg(proj.status)}`}>
            {formatStatus(proj.status)}
          </div>

          <div className="font-semibold">{proj.progress}%</div>

          <div className="flex justify-center gap-2">
            <Link href={`/project/${proj.id}`}>
              <Button className="bg-blue-600 text-white px-2 py-1">
                <Eye className="w-4 h-4" />
              </Button>
            </Link>

            {proj.status !== "DONE" && (
              <Button
                className="bg-yellow-500 text-white px-2 py-1"
                onClick={() => {
                  setSelectedProject(proj);
                  setOpenEdit(true);
                }}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            )}

            <Button
              className="bg-red-600 text-white px-2 py-1"
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
