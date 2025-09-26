import { BASE_URL } from "@/lib/config";
import { requestData } from "../_main";
import { InventoryItems } from "@/components/custom/inventory/InventoryItem";

const url = `${BASE_URL}/inventory-item`

export class InventoryItemService {
    static async createInventoryItem(body: InventoryItems ) {
        return await requestData(
             `${url}/create`,
            'POST',
            undefined,
            body,
        )
    }
    static async updateInventory(skuid : string, body : InventoryItems) {
        return await requestData(
             `${url}/update?skuid=${skuid}`,
            'POST',
            undefined,
            body,
        )
    }

    static async getInventoryItems(page : number, limit : number) {
    return await requestData(
                `${url}/get-all?page=${page}&limit=${limit}`,
                'GET',
                undefined,
                undefined,
            );
    }

    static async findBySkuid(skuid : string) {
        return await requestData(
             `${url}/find-by-skuid?skuid=${skuid}`,
            'GET',
            undefined,
            undefined,
        )
    }
}