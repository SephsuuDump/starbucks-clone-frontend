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

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  async function load() {
    try {
      const proj = await ProjectService.getById(String(id));
      setProject(proj);
      const taskList = await TaskService.getAll({ 
        project_id: String(id), 
        status : 'PENDING',
        start : '2025-10-01',
        end : '2025-11-01'

      });
      setTasks(taskList.data || []);
    } catch (e) {
      toast.error(`${e}`);
    }
  }

  useEffect(() => {
    load();
    console.log(project)
    console.log(tasks)
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

      {project && (
        <>
          <div className="flex w-full gap-4">
            <div className="w-[60%]"><ProjectOverview project={project}/></div>
            <div className="w-[40%]"><ProjectResources projectId={project.id} /></div>
            
          </div>

          <BudgetPanel project={project} />

          <div className="bg-white rounded-xl shadow-md p-5 flex justify-between">
            <div className="font-semibold text-gray-800">Tasks</div>
            <div className="flex gap-2">
              <Link href={`/project/${id}/create-task`}>
                <Button className="!bg-green-900 text-white">+ Add Task</Button>
              </Link>
              <Link href={`/project/${id}/allocate`}>
                <Button className="!bg-blue-700 text-white">Manage Allocations</Button>
              </Link>
            </div>
          </div>

          <TasksTable tasks={tasks} projectId={String(id)} onDelete={handleDeleteTask} />
        </>
      )}
    </div>
  );
}
