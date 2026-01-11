"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { ProjectService } from "@/services/project_management/projectService";
import { TaskService } from "@/services/project_management/TaskService";
import { ResourceAllocationService } from "@/services/project_management/ResourceAllocationService";

import ProjectHeader from "@/components/custom/project/ProjectHeader";
import BudgetSection from "@/components/custom/project/BudgetSection";
import TaskList from "@/components/custom/project/TasksList";
import AllocateResourceModal from "@/components/custom/project/dialogs/AllocateResourceModal";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

const dummyEmployees = [
    { id: "59c9df25-7eb4-4777-b51b-3ad7c52c99e1", name: "John Doe" },
    { id: "20d5fc1e-6402-4fbb-9e58-3dab35d96628", name: "Sarah Cruz" },
    { id: "c3d7538c-bb1c-4346-af22-25759558ce6b", name: "Mark Dela Cruz" },
];

function formatDate(date: Date) {
    return date.toISOString().split("T")[0];
}

const today = new Date();
const oneWeekFromToday = new Date();
oneWeekFromToday.setDate(today.getDate() + 7);
const minExpectedEnd = formatDate(oneWeekFromToday);

export default function ProjectDetailsPage() {
    const { id } = useParams();
    const projectId = id as string;
    const router = useRouter();
    const { claims, loading: authLoading } = useAuth();

    const isProjectManager = claims?.role === "PROJECT MANAGER";

    const [project, setProject] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [allocations, setAllocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [allocationModalTask, setAllocationModalTask] = useState<any | null>(null);
    const [openAddTask, setOpenAddTask] = useState(false);
    const [onProcess, setProcess] = useState(false);

    const [newTasks, setNewTasks] = useState<
        {
            name: string;
            description: string;
            expected_end: string;
            employee_id: string;
            expanded: boolean;
        }[]
    >([]);

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
        if (projectId) loadData();
    }, [projectId]);

    function openAllocationModal(task: any) {
        if (!isProjectManager) return;
        setAllocationModalTask(task);
    }

    function handleAllocationModalOpenChange(open: boolean) {
        if (!open) setAllocationModalTask(null);
    }

    function addTask() {
        setNewTasks([
            ...newTasks,
            {
                name: "",
                description: "",
                expected_end: "",
                employee_id: "",
                expanded: true,
            },
        ]);

        setNewTasks((prev) =>
            prev.map((t, i) => ({
                ...t,
                expanded: i === prev.length ? true : false,
            }))
        );
    }

    function toggleTask(index: number) {
        setNewTasks(
            newTasks.map((t, i) => ({
                ...t,
                expanded: i === index ? !t.expanded : false,
            }))
        );
    }

    function updateTask(index: number, field: string, value: string) {
        const updated = [...newTasks];
        updated[index] = { ...updated[index], [field]: value };
        setNewTasks(updated);
    }

    function removeTask(index: number) {
        setNewTasks(newTasks.filter((_, i) => i !== index));
    }

    async function handleCreateTasks() {
        if (newTasks.length === 0) {
            toast.error("Add at least one task");
            return;
        }

        setProcess(true);

        try {
            for (const t of newTasks) {
                await TaskService.create({
                    project_id: projectId,
                    name: t.name,
                    description: t.description,
                    expected_date: t.expected_end || null,
                    employee_id: t.employee_id,
                    start_date: null,
                    end_date: null,
                    status: "PENDING",
                });
            }

            toast.success("Tasks added to project");
            setNewTasks([]);
            setOpenAddTask(false);
            loadData();
        } catch (e: any) {
            toast.error(e?.message || "Failed to add tasks");
        } finally {
            setProcess(false);
        }
    }

    if (loading || authLoading) return <p className="p-6">Loading...</p>;
    if (!project) return <p className="p-6 text-red-600">Project not found.</p>;

    return (
        <div className="p-6 space-y-6">
            <Button
                variant="outline"
                onClick={() =>
                    router.push(isProjectManager ? "/project" : "/finance/project")
                }
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Button>

            <ProjectHeader project={project} />

            <BudgetSection project={project} allocations={allocations} />

            <TaskList
                tasks={tasks}
                allocations={allocations}
                openAllocationModal={openAllocationModal}
                onAddTask={isProjectManager ? () => setOpenAddTask(true) : undefined}
                hideActions={!isProjectManager}
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

            <Dialog open={openAddTask} onOpenChange={setOpenAddTask}>
                <DialogContent className="max-w-3xl">
                    <DialogTitle>Add Tasks to Project</DialogTitle>

                    <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2">
                        {newTasks.map((task, i) => (
                            <div key={i} className="border rounded-lg p-3 bg-neutral-50">
                                <div
                                    className="flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleTask(i)}
                                >
                                    <p className="font-semibold text-sm">
                                        {task.name || `Task ${i + 1}`}
                                    </p>
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
                                            onChange={(e) =>
                                                updateTask(i, "name", e.target.value)
                                            }
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
                                            min={minExpectedEnd}
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
                                            className="text-red-600 flex items-center text-sm"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            Remove Task
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addTask}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm mt-3"
                    >
                        <Plus className="w-4 h-4" />
                        Add Task
                    </button>

                    <Button
                        className="w-full bg-green-700 text-white mt-4"
                        disabled={onProcess}
                        onClick={handleCreateTasks}
                    >
                        {onProcess ? "Saving..." : "Save Tasks"}
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}
