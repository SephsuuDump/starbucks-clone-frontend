"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { Branch } from "@/types/Branch";
import { ProcurementHeader } from "@/components/custom/procurement/Header";
import { LocationCard } from "@/components/custom/inventory/Card";
import { BranchService } from "@/services/Inventory/BranchService";
import AddLocationModal from "@/components/custom/inventory/branch/AddLocationModal";

export default function BranchPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Branch[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchBranches() {
    try {
      setLoading(true);
      const res = await BranchService.getAll();
      if (Array.isArray(res)) {
        setBranches(res);
        setFiltered(res);
      } else {
        toast.error("Unexpected response format");
      }
    } catch {
      toast.error("Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      branches.filter(
        (b) =>
          b.name.toLowerCase().includes(term) ||
          b.location.toLowerCase().includes(term)
      )
    );
  }, [search, branches]);

  return (
    <>
      {openAdd && (
        <AddLocationModal setOpenAdd={setOpenAdd} reload={fetchBranches} type="branch" />
      )}

      <div className="flex flex-col gap-6">
        <ProcurementHeader label="Branch Management" />


        <div className="flex justify-between items-center bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Search className="text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search branches..."
              className="w-64 border-gray-200 focus:border-green-700 focus:ring-green-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button
            onClick={() => setOpenAdd(true)}
            className="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Branch
          </Button>
        </div>


        <div
        className="
            bg-white rounded-2xl shadow-md p-6 
            flex flex-col gap-6 transition-all duration-200
            flex-1 h-full min-h-[calc(100vh-160px)]
        "
        >
          <h2 className="text-lg font-semibold text-gray-800">
            Branch Locations
          </h2>

          {loading ? (
            <div className="flex justify-center items-center text-gray-500 py-10">
              Loading branches...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex justify-center items-center text-gray-500 py-10">
              No branches found.
            </div>
          ) : (
            <div
              className="
                grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
                gap-5 place-items-center
              "
            >
                {filtered.map((branch) => (
                <LocationCard
                    key={branch.id}
                    id={branch.id}
                    name={branch.name}
                    location={branch.location}
                    imageUrl={branch.image_url}
                    type="branch"
                    reload={fetchBranches} 
                />
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
