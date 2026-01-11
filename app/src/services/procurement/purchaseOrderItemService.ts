import { BASE_URL } from "@/lib/config"
import { requestData } from "../_main"

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

    static async receiveOrder(id: string, poi: any) {
        return await requestData(
            `${url}/receive-order?warehouse_id=${id}`,
            'POST',
            undefined,
            poi
        );
    }
}