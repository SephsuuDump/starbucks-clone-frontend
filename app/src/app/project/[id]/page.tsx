'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Project } from "@/types/project";
import { Task } from "@/types/Tasks";
import { ProjectService } from "@/services/project_management/projectService";
import { TaskService } from "@/services/project_management/TaskService";
import { toast } from "sonner";
import { ProcurementHeader } from "@/components/custom/procurement/Header";
import { ProjectOverview } from "@/components/custom/project/ProjectOverview";
import TasksTable from "@/components/custom/project/TaskTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BudgetPanel from "@/components/custom/project/BugdetPanel";
import { ProjectResources } from "@/components/custom/project/ProjectResources";
import { AllocateResourceModal } from "@/components/custom/project/AllocateResourceModal";
import { CreateTaskModal } from "@/components/custom/project/CreateTaskModal";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openAllocate, setOpenAllocate] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  async function load() {
    try {
      const proj = await ProjectService.getById(String(id));
      setProject(proj);
      const taskList = await TaskService.getAll({ 
        project_id: String(id)
        // status : 'PENDING',
        // start : '2025-10-01',
        // end : '2025-11-01'

      });
      setTasks(taskList.data || []);
    } catch (e) {
      toast.error(`${e}`);
    }
  }

  useEffect(() => {
    load();

  }, [id]);

  async function handleDeleteTask(taskId: string) {
    try {
      await TaskService.deleteById(taskId);
      toast.success("Task deleted");
      load();
    } catch (e) {
      toast.error(`${e}`);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <ProcurementHeader label="Project Details" />

      {openAllocate && (
      <AllocateResourceModal
        open={openAllocate}
        setOpen={setOpenAllocate}
        projectId={project?.id!}
        onAllocated={load}
      />
      )}

      {openCreate && (<CreateTaskModal
        open={openCreate}
        setOpen={setOpenCreate}
        projectId={project?.id!}
      />
      )}

      {project && (
        <>
          <div className=""><ProjectOverview project={project}/></div>

            

          <BudgetPanel project={project} />

          <div className="bg-white rounded-xl shadow-md p-5 flex justify-between">
            <div className="font-semibold text-gray-800">Tasks</div>
            <div className="flex gap-2">
              <Button className="!bg-green-900 text-white"
              onClick={() => setOpenCreate(true)}>+ Add Task</Button>
              
              <Button
              className="!bg-blue-700 text-white"
              onClick={() => setOpenAllocate(true)}
            >
              Allocate Resource
            </Button>
            </div>
          </div>

          <TasksTable tasks={tasks} projectId={String(id)} onDelete={handleDeleteTask} />
        </>
      )}
    </div>
  );
}
