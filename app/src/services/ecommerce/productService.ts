import { BASE_URL } from "@/lib/config"
import { requestData, requestFormData } from "../_main"

const url = `${BASE_URL}/products`
export class ProductService {
    static async getAllProducts() {
        return await requestData(
            `${url}/get-all`,
            'GET',
        );
    }

    static async createProduct(formData: any) {
        return await requestFormData(
            `${url}/create-fd`,
            'POST',
            undefined,
            formData
        );
    }

    static async deleteProduct(id: string) {
        return await requestData(
            `${url}/delete?id=${id}`,
            'PATCH',
        );
    }
}