import { BASE_URL } from "@/lib/config"
import { requestData } from "./_main"

const url = `${BASE_URL}/purchase-order-items`
export class PurchaseOrderItemService {
    static async createPurchaseOrderItem(poi: any) {
        return await requestData(
            `${url}`,
            'POST',
            undefined,
            poi
        );
    }
}