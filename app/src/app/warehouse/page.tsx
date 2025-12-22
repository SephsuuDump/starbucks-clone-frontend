"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { ProcurementHeader } from "@/components/custom/procurement/Header";
import { LocationCard } from "@/components/custom/inventory/Card";
import { WarehouseService } from "@/services/Inventory/WarehouseService";
import AddLocationModal from "@/components/custom/inventory/branch/AddLocationModal";
import { Warehouse } from "@/types/Warehouse";


export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Warehouse[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [loading, setLoading] = useState(false);


  async function fetchWarehouses() {
    try {
      setLoading(true);
      const res = await WarehouseService.getAll();
      if (Array.isArray(res)) {
        setWarehouses(res);
        setFiltered(res);
      } else {
        toast.error("Unexpected response format");
      }
    } catch (err) {
      toast.error("Failed to fetch warehouses");
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchWarehouses();
  }, []);


  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      warehouses.filter(
        (w) =>
          w.name.toLowerCase().includes(term) ||
          w.location.toLowerCase().includes(term)
      )
    );
  }, [search, warehouses]);

  return (
    <>
      {openAdd && (
        <AddLocationModal
          setOpenAdd={setOpenAdd}
          reload={fetchWarehouses}
          type="warehouse"
        />
      )}

      <div className="flex flex-col gap-6">
        <ProcurementHeader label="Warehouse Management" />

        <div className="flex justify-between items-center bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Search className="text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search warehouses..."
              className="w-64 border-gray-200 focus:border-green-700 focus:ring-green-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button
            onClick={() => setOpenAdd(true)}
            className="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Warehouse
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
            Warehouse Locations
          </h2>

          {loading ? (
            <div className="flex justify-center items-center text-gray-500 py-10">
              Loading warehouses...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex justify-center items-center text-gray-500 py-10">
              No warehouses found.
            </div>
          ) : (
            <div
              className="
                grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
                gap-5 place-items-center
              "
            >
              {filtered.map((warehouse) => (
                <LocationCard
                  key={warehouse.id}
                  id={warehouse.id}
                  name={warehouse.name}
                  location={warehouse.location}
                  imageUrl={warehouse.image_url}
                  type="warehouse"
                  reload={fetchWarehouses}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
