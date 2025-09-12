import { BASE_URL } from "@/lib/config"
import { requestData } from "./_main"

const url = `${BASE_URL}/purchase-orders`
export class PurchaseOrderService {
    static async getAllPurchaseOrders() {
        return await requestData(
            `${url}`,
            'GET',
        );
    }

    static async getPurchaseOrderByStatus(status: string) {
        return await requestData(
            `${url}?status=${status}`,
            'GET',
        );
    }

    static async updateStatus(updatedStatus: Record<any, any>) {
        return await requestData(
            `${url}/update-status`,
            'PATCH',
            undefined,
            updatedStatus
        );
    }
}