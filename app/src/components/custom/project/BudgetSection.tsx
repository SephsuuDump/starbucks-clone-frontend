"use client";

export default function BudgetSection({
  project,
  allocations
}: {
  project: any;
  allocations: any[];
}) {

  const approvedBudget = project.budget || 0;

  const usedBudget = allocations.reduce(
    (sum, a) => sum + (a.allocated_cost || 0),
    0
  );

  const remaining = approvedBudget - usedBudget;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow border border-neutral-200 dark:border-neutral-700">
      <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow">
          <span className="text-sm opacity-80">Approved Budget</span>
          <p className="text-2xl font-bold mt-1">₱{approvedBudget.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-green-500 to-green-700 text-white shadow">
          <span className="text-sm opacity-80">Used Budget</span>
          <p className="text-2xl font-bold mt-1">₱{usedBudget.toLocaleString()}</p>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-600 text-white shadow">
          <span className="text-sm opacity-80">Remaining Budget</span>
          <p className="text-2xl font-bold mt-1">₱{remaining.toLocaleString()}</p>
        </div>
      </div>

      <p className="mt-4 text-sm">
        Budget Status:{" "}
        {project.budget_approved ? (
          <span className="text-green-600 font-semibold">Approved</span>
        ) : (
          <span className="text-red-600 font-semibold">Pending Finance Approval</span>
        )}
      </p>
    </div>
  );
}
