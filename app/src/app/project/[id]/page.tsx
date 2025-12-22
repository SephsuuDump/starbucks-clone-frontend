"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { ProjectService } from "@/services/project_management/projectService";
import { TaskService } from "@/services/project_management/TaskService";
import { ResourceAllocationService } from "@/services/project_management/ResourceAllocationService";

import ProjectHeader from "@/components/custom/project/ProjectHeader";
import BudgetSection from "@/components/custom/project/BudgetSection";
import TaskList from "@/components/custom/project/TasksList";
import AllocateResourceModal from "@/components/custom/project/dialogs/AllocateResourceModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";


export default function ProjectDetailsPage() {
  const { id } = useParams();
  const projectId = id as string;

   const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [allocationModalTask, setAllocationModalTask] = useState<any | null>(null);

  async function loadData() {
    try {
      setLoading(true);

      const proj = await ProjectService.getById(projectId);
      const taskRes = await TaskService.getAll(projectId);
      const allocRes = await ResourceAllocationService.getAll(projectId);

      setProject(proj || null);
      setTasks(taskRes || []);
      setAllocations(allocRes?.data || []); 
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId]);

  function openAllocationModal(task: any) {
    setAllocationModalTask(task);
  }

  function handleAllocationModalOpenChange(open: boolean) {
    if (!open) {
      setAllocationModalTask(null);
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (!project) return <p className="p-6 text-red-600">Project not found.</p>;

  return (
    <div className="p-6 space-y-6">
        <Button
        variant="outline"
        className="flex items-center gap-2 w-fit mb-3"
        onClick={() => router.push("/project")}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>


      <ProjectHeader project={project} />

      <BudgetSection project={project} allocations={allocations} />

      <TaskList
        tasks={tasks}
        allocations={allocations}
        openAllocationModal={openAllocationModal}
      />

      {allocationModalTask && (
        <AllocateResourceModal
          open={!!allocationModalTask}
          setOpen={handleAllocationModalOpenChange}
          task={allocationModalTask}
          projectId={projectId}
          reload={loadData}
        />
      )}
    </div>
  );
}
