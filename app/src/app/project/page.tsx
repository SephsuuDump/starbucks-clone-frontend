'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Project } from "@/types/project";
import { ProjectService } from "@/services/project_management/projectService";
import { toast } from "sonner";
import { Plus, ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from "lucide-react";
import { ProcurementHeader } from "@/components/custom/procurement/Header";
import Link from "next/link";

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState({ page: 1, limit: 8 });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage((p) => ({ ...p, page: 1 }));
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await ProjectService.getAll({
          start :  '09-01-25',
          end : '09-30-25',
          status : 'PENDING'
        });
        setProjects(data);
      } catch (e) {
        toast.error(`${e}`);
      }
    }
    fetchProjects();
  }, [page, debouncedSearch]);

  return (
    <div className="flex flex-col gap-6">
      <ProcurementHeader label="Project Management" />

      <div className="bg-white rounded-xl shadow-md p-5 flex justify-between">
        <Input
          type="text"
          placeholder="Search project by name or status"
          className="w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-3">
          <Link href="/project/create-project">
            <Button className="!bg-green-900 text-white shadow hover:opacity-90">
              + New Project
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="grid grid-cols-6 font-semibold text-gray-700 border-b pb-3 text-sm">
          <div>Project Name</div>
          <div>Description</div>
          <div>Start Date</div>
          <div>End Date</div>
          <div>Status</div>
          <div className="text-center">Actions</div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center p-4 text-gray-500 italic">No projects found</div>
        ) : (
          <>
            {projects.map((proj, i) => (
              <div
                key={i}
                className={`grid grid-cols-6 items-center text-sm py-3 px-1 rounded-md ${
                  i % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div className="font-bold">{proj.name}</div>
                <div className="truncate">{proj.description}</div>
                <div>{proj.start_date}</div>
                <div>{proj.end_date}</div>
                <div className="font-medium">{proj.status}</div>
                <div className="flex justify-center gap-2">
                  <Link href={`/project/${proj.id}`}>
                    <Button className="!bg-blue-600 text-white px-2 py-1 hover:opacity-90">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`/project/edit-project/${proj.id}`}>
                    <Button className="!bg-yellow-500 text-white px-2 py-1 hover:opacity-90">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button className="!bg-red-600 text-white px-2 py-1 hover:opacity-90">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </>
        )}

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
    </div>
  );
}
