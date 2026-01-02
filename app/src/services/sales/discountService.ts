import { BASE_URL } from "@/lib/config"
import { requestData, requestFormData } from "../_main"

const url = `${BASE_URL}/discounts`

export class DiscountService {
    static async getAllDiscounts() {
        return await requestData(
            `${url}/get-all`,
            'GET',
        );
    }

    static async createDiscount(payload: any) {
        return await requestData(
            `${url}/create`,
            'POST',
            undefined,
            payload
        );
    }
}