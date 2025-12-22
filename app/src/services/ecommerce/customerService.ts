import { BASE_URL } from "@/lib/config"
import { requestData, requestFormData } from "../_main"

const url = `${BASE_URL}/customers`

export class CustomerService {
    static async getAllCustomers() {
        return await requestData(
            `${url}/get-all`,
            'GET',
        );
    }

    static async getCustomerById(id: number) {
        return await requestData(
            `${url}/get-by-id?id=${id}`,
            'GET',
        );
    }

    static async createCustomer(customer: any) {
        return await requestFormData(
            `${url}/create`,
            'POST',
            undefined,
            customer
        );
    }

    static async updateCustomer(customer: any) {
        return await requestFormData(
            `${url}/update`,
            'PATCH',
            undefined,
            customer
        );
    }
}

