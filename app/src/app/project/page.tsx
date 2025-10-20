"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Project } from "@/types/project";
import { ProjectService } from "@/services/project_management/projectService";
import { toast } from "sonner";
import { Plus, ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from "lucide-react";
import { ProcurementHeader } from "@/components/custom/procurement/Header";
import Link from "next/link";
import CreateProjectModal from "@/components/custom/project/CreateProject";
import { formatDate } from "@/components/custom/project/ProjectOverview";
import DeleteProjectModal from "@/components/custom/project/DeleteProjectModal";
import EditProjectModal from "@/components/custom/project/EditProjectModal";

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState({ page: 1, limit: 8 });
  const [totalPages, setTotalPages] = useState(1);
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage((p) => ({ ...p, page: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  async function fetchProjects() {
    try {
      const data = await ProjectService.getAll();
      setProjects(data);
    } catch (e) {
      toast.error(`${e}`);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, [page, debouncedSearch, loading]);

  const activeProjects = projects.filter(
    (p) => p.status?.toUpperCase() !== "DONE"
  );
  const completedProjects = projects.filter(
    (p) => p.status?.toUpperCase() === "DONE"
  );

  return (
    <>
      {openAdd && (
        <CreateProjectModal
          setOpenAdd={setOpenAdd}
          name="Project"
          id="create-project"
          setLoading={setLoading}
          loading={loading}
        />
      )}

      {openDelete && selectedProject && (
        <DeleteProjectModal
          setOpenDelete={setOpenDelete}
          name={selectedProject.name}
          id={selectedProject.id}
          setLoading={setLoading}
          loading={loading}
        />
      )}

      {openEdit && selectedProject && (
        <EditProjectModal
          setOpenEdit={setOpenEdit}
          project={selectedProject}
          setLoading={setLoading}
          loading={loading}
        />
      )}

      <div className="flex flex-col gap-6">
        <ProcurementHeader label="Project Management" />

        <div className="bg-white rounded-xl shadow-md p-5 flex justify-between items-center">
          <Input
            type="text"
            placeholder="Search project by name or status"
            className="w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            className="!bg-green-900 text-white shadow hover:opacity-90"
            onClick={() => setOpenAdd(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> New Project
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Active / Ongoing Projects
          </h2>
          <div className="grid grid-cols-6 font-semibold text-gray-700 border-b pb-3 text-sm">
            <div>Project Name</div>
            <div>Description</div>
            <div>Start Date</div>
            <div>Expected End Date</div>
            <div>Status</div>
            <div className="text-center">Actions</div>
          </div>

          {activeProjects.length === 0 ? (
            <div className="text-center p-4 text-gray-500 italic">
              No active projects found
            </div>
          ) : (
            activeProjects.map((proj, i) => (
              <div
                key={i}
                className={`grid grid-cols-6 items-center text-sm py-3 px-1 rounded-md ${
                  i % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div className="font-bold">{proj.name}</div>
                <div className="truncate">{proj.description}</div>
                <div>{formatDate(proj.start_date)}</div>
                <div>{formatDate(proj.end_date)}</div>
                <div className="font-medium">{proj.status}</div>
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
                      setOpenDelete(true);
                      setSelectedProject(proj);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Completed Projects
          </h2>
          <div className="grid grid-cols-6 font-semibold text-gray-700 border-b pb-3 text-sm">
            <div>Project Name</div>
            <div>Description</div>
            <div>Start Date</div>
            <div>Expected End Date</div>
            <div>Status</div>
            <div className="text-center">Actions</div>
          </div>

          {completedProjects.length === 0 ? (
            <div className="text-center p-4 text-gray-500 italic">
              No completed projects found
            </div>
          ) : (
            completedProjects.map((proj, i) => (
              <div
                key={i}
                className={`grid grid-cols-6 items-center text-sm py-3 px-1 rounded-md ${
                  i % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div className="font-bold text-gray-700">{proj.name}</div>
                <div className="truncate text-gray-600">{proj.description}</div>
                <div>{formatDate(proj.start_date)}</div>
                <div>{formatDate(proj.end_date)}</div>
                <div className="font-medium text-green-700">{proj.status}</div>
                <div className="flex justify-center gap-2">
                  <Link href={`/project/${proj.id}`}>
                    <Button className="!bg-blue-600 text-white px-2 py-1 hover:opacity-90">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-center gap-3 pt-5">
          <button
            disabled={page.page === 1}
            onClick={() => setPage((p) => ({ ...p, page: p.page - 1 }))}
            className="p-2 rounded-md border bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>

          <span className="text-sm text-gray-700">
            PAGE {page.page} of {totalPages}
          </span>

          <button
            disabled={page.page === totalPages}
            onClick={() => setPage((p) => ({ ...p, page: p.page + 1 }))}
            className="p-2 rounded-md border bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </>
  );
}
