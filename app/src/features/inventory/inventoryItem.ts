import { BASE_URL } from "@/lib/config"
import { requestData } from "@/services/_main";

const url = `${BASE_URL}/inventory-item`

export class InventoryItemService {
    static async getAllInventoryItem() {
        return await requestData(
            `${url}/get-all`,
            'GET',
        );
    }
}