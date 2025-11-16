"use client";

import { useEffect, useState } from "react";
import { ProjectService } from "@/services/project_management/projectService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";

export default function FinanceProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    const res = await ProjectService.getAll();
    setProjects(res || []);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function approveBudget(id: string, approved: boolean) {
    try {
      await ProjectService.approvedBudget(id, approved);
      toast.success(approved ? "Budget Approved!" : "Budget Rejected");
      loadData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update project");
    }
  }

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="bg-white h-full">
        <div className="p-6 space-y-6">

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard title="Total Projects" value={projects.length} color="purple" />
        <KpiCard
          title="Pending Approvals"
          value={projects.filter(p => p.status === "PENDING_BUDGET").length}
          color="blue"
        />
        <KpiCard
          title="Approved Budgets"
          value={projects.filter(p => p.status !== "PENDING_BUDGET").length}
          color="green"
        />
        <KpiCard title="Finance Tasks" value="—" color="orange" />
      </div>

      {/* PROJECT CARDS */}
      <h2 className="text-xl font-semibold mt-6">Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-neutral-900 rounded-xl shadow border p-5 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold">{p.name}</h3>
              <p className="text-sm mt-1 text-neutral-500">{p.description}</p>

              <Badge className="mt-3" variant="outline">
                {p.status}
              </Badge>

              <p className="mt-3 text-sm">
                <span className="font-semibold">Budget:</span> ₱
                {p.budget.toLocaleString()}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {p.status === "PENDING_BUDGET" ? (
                <>
                  <Button
                    className="bg-green-600 text-white"
                    onClick={() => approveBudget(p.id, true)}
                  >
                    Approve Budget
                  </Button>

                  <Button
                    className="bg-red-600 text-white"
                    onClick={() => approveBudget(p.id, false)}
                  >
                    Reject Budget
                  </Button>
                </>
              ) : (
                <p className="text-sm text-green-600 font-medium">
                  Budget Approved
                </p>
              )}

              {/* Manage Resources */}
              <Link href={`/finance/project/${p.id}/resources`}>
                <Button className="bg-blue-600 text-white w-full">
                  Manage Resources
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
    </div>
    
  );
}



function KpiCard({ title, value, color }: any) {
  const colorMap: any = {
    blue: "from-blue-500 to-blue-700",
    green: "from-green-500 to-green-700",
    purple: "from-purple-500 to-purple-700",
    orange: "from-orange-500 to-yellow-600",
  };

  return (
    <div
      className={`p-4 rounded-lg text-white bg-gradient-to-br ${colorMap[color]} shadow`}
    >
      <span className="text-sm opacity-80">{title}</span>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
