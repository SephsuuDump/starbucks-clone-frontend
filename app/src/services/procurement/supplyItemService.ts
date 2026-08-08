import { requestData } from "../_main";
import { BASE_URL } from "@/lib/config";

const url = `${BASE_URL}/supplier-items`

export class SupplyItemService {
    static async createSupplyItem(supply: any) {
        return await requestData(
            `${url}`,
            'POST',
            undefined,
            supply
        );
    }

    static async updateSupplyItem(supply: any) {
        return await requestData(
            `${url}/update?id=${supply.id}`,
            'POST',
            undefined,
            supply
        );
    }

    static async deleteSupplyItem(id: string) {
        return await requestData(
            `${url}/delete?id=${id}`,
            'POST',
        );
    }
}