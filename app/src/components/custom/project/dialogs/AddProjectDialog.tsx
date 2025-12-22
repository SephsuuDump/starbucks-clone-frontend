"use client";

import {
  Dispatch,
  SetStateAction,
  useState,
} from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { ProcurementHeader } from "../../procurement/Header";
import { Input } from "@/components/ui/input";
import { ProjectService } from "@/services/project_management/projectService";
import { TaskService } from "@/services/project_management/TaskService";

const dummyEmployees = [
  { id: "59c9df25-7eb4-4777-b51b-3ad7c52c99e1", name: "John Doe" },
  { id: "20d5fc1e-6402-4fbb-9e58-3dab35d96628", name: "Sarah Cruz" },
  { id: "c3d7538c-bb1c-4346-af22-25759558ce6b", name: "Mark Dela Cruz" },
];

export default function AddProjectDialog({
  setOpenAdd,
  setLoading,
  loading,
  reload,
}: {
  setOpenAdd: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  reload?: () => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);

  const [project, setProject] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    budget: "",
  });

  const [tasks, setTasks] = useState<
    {
      name: string;
      description: string;
      expected_end: string;
      employee_id: string;
      expanded: boolean;
    }[]
  >([]);

  const [onProcess, setProcess] = useState(false);

  function addTask() {
    setTasks([
      ...tasks,
      {
        name: "",
        description: "",
        expected_end: "",
        employee_id: "",
        expanded: true,
      },
    ]);

    setTasks((prev) =>
      prev.map((t, i) => ({
        ...t,
        expanded: i === prev.length ? true : false,
      }))
    );
  }

  function toggleTask(index: number) {
    setTasks(
      tasks.map((t, i) => ({
        ...t,
        expanded: i === index ? !t.expanded : false,
      }))
    );
  }

  function updateTask(index: number, field: string, value: string) {
    const updated = [...tasks];
    updated[index] = { ...updated[index], [field]: value };
    setTasks(updated);
  }

  function removeTask(index: number) {
    setTasks(tasks.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setProcess(true);

    try {
      const created = await ProjectService.create({
        name: project.name,
        description: project.description,
        start_date: project.start_date,
        end_date: project.end_date,
        budget: Number(project.budget || 0),
      });

      const projectId = created?.id;

      for (const t of tasks) {
        await TaskService.create({
          project_id: projectId,
          name: t.name,
          description: t.description,
          expected_date: t.expected_end ? t.expected_end : null,
          employee_id: t.employee_id,
          start_date: null,
          end_date: null,
          status: "PENDING",
        });
      }

      toast.success("Project Created!");
      setLoading(!loading);
      reload?.();
      setOpenAdd(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to create project");
    } finally {
      setProcess(false);
    }
  }

  return (
    <Dialog open onOpenChange={setOpenAdd}>
      <DialogContent className="max-w-3xl">
        <DialogTitle>
          <ProcurementHeader label="Create New Project" />
        </DialogTitle>

        <div className="flex gap-2 mt-2 px-2">
          <button
            onClick={() => setStep(1)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              step === 1
                ? "bg-blue-600 text-white"
                : "bg-neutral-200 dark:bg-neutral-700"
            }`}
          >
            Project Info
          </button>
          <button
            onClick={() => setStep(2)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              step === 2
                ? "bg-blue-600 text-white"
                : "bg-neutral-200 dark:bg-neutral-700"
            }`}
          >
            Tasks
          </button>
        </div>

        {step === 1 && (
          <div className="px-2 py-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Project Name</label>
              <Input
                className="mt-1"
                value={project.name}
                onChange={(e) =>
                  setProject({ ...project, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                className="mt-1"
                value={project.description}
                onChange={(e) =>
                  setProject({ ...project, description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  className="mt-1"
                  value={project.start_date}
                  onChange={(e) =>
                    setProject({ ...project, start_date: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Expected End</label>
                <Input
                  type="date"
                  className="mt-1"
                  value={project.end_date}
                  onChange={(e) =>
                    setProject({ ...project, end_date: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Budget</label>
              <Input
                type="number"
                className="mt-1"
                value={project.budget}
                onChange={(e) =>
                  setProject({ ...project, budget: e.target.value })
                }
              />
            </div>

            <Button
              className="w-full bg-blue-700 text-white mt-4"
              onClick={() => setStep(2)}
            >
              Next
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="px-2 py-4">
            <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2">
              {tasks.map((task, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-3 bg-neutral-50 dark:bg-neutral-800"
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleTask(i)}
                  >
                    <div>
                      <p className="font-semibold text-sm">
                        {task.name || `Task ${i + 1}`}
                      </p>
                      {!task.expanded && (
                        <p className="text-xs text-neutral-500">
                          Ends {task.expected_end || "—"} •{" "}
                          {task.employee_id
                            ? dummyEmployees.find((e) => e.id === task.employee_id)
                                ?.name
                            : "No employee"}
                        </p>
                      )}
                    </div>
                    {task.expanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>

                  {task.expanded && (
                    <div className="mt-3 space-y-3">
                      <Input
                        placeholder="Task Name"
                        value={task.name}
                        onChange={(e) => updateTask(i, "name", e.target.value)}
                      />

                      <Input
                        placeholder="Description"
                        value={task.description}
                        onChange={(e) =>
                          updateTask(i, "description", e.target.value)
                        }
                      />

                      <Input
                        type="date"
                        placeholder="Expected End"
                        value={task.expected_end}
                        onChange={(e) =>
                          updateTask(i, "expected_end", e.target.value)
                        }
                      />

                      <select
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                        value={task.employee_id}
                        onChange={(e) =>
                          updateTask(i, "employee_id", e.target.value)
                        }
                      >
                        <option value="">Assign Employee</option>
                        {dummyEmployees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => removeTask(i)}
                        className="text-red-600 flex items-center text-sm mt-1"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Remove Task
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addTask}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 mt-3"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>

            <Button
              type="submit"
              className="w-full bg-green-700 text-white mt-4"
              disabled={onProcess}
              onClick={handleSubmit}
            >
              {onProcess ? "Creating..." : "Create Project"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
