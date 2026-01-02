import { BASE_URL } from "@/lib/config"
import { requestData, requestFormData } from "../_main"

const orderUrl = `${BASE_URL}/orders`
const orderItemUrl = `${BASE_URL}/order-items`

export class OrderService {
    static async getAllOrders() {
        return await requestData(
            `${orderUrl}/get-all`,
            'GET',
        );
    }

    static async getOrderById(id: number) {
        return await requestData(
            `${orderUrl}/get-by-id?id=${id}`,
            'GET',
        );
    }

    static async getByCustomer(id: string) {
        return await requestData(
            `${orderUrl}/get-by-customer?id=${id}`,
            'GET',
        );
    }

    static async getByBranch(id: string) {
        return await requestData(
            `${orderUrl}/get-by-branch?id=${id}`,
            'GET',
        );
    }

    static async createOrder(order: any) {
        return await requestFormData(
            `${orderUrl}/create`,
            'POST',
            undefined,
            order
        );
    }

    static async processOrder(order: any) {
        return await requestData(
            `${orderUrl}/complete-order`,
            'POST',
            undefined,
            order
        );
    }
}

export class OrderItemService {
    static async getAllOrderItems() {
        return await requestData(
            `${orderItemUrl}/get-all`,
            'GET',
        );
    }

    static async createOrderItem(orderItems: any) {
        return await requestFormData(
            `${orderItemUrl}/create`,
            'POST',
            undefined,
            orderItems
        );
    }
}