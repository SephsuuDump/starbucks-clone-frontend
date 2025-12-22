import { BASE_URL } from "@/lib/config";
import { requestData } from "../_main";
import { InventoryItems } from "@/types/InventoryItem";
import { Inventory } from "@/types/Inventory";

const url = `${BASE_URL}/inventory-logs`


export class InventoryLogsService {
    static async getAll(
    page: number = 1,
    limit: number = 10,
    search: string = "",
    branch_id?: string,
    warehouse_id?: string
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    });

    if (branch_id) params.append("branch_id", branch_id);
    if (warehouse_id) params.append("warehouse_id", warehouse_id);

    return await requestData(
      `${url}/get-all?${params.toString()}`,
      "GET"
    );
  }
}
