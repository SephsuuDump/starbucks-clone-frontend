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

    static async getByBranch(id: string) {
        return await requestData(
            `${url}/get-by-branch?id=${id}`,
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

    static async createProductlink(payload: any) {
        return await requestData(
            `${url}/create-inventory-link`,
            'POST',
            undefined,
            payload
        );
    }

    static async updateProduct(formData: any) {
        return await requestFormData(
            `${url}/update-fd`,
            'PATCH',
            undefined,
            formData
        );
    }

    static async updateBranchProduct(product: any) {
        return await requestFormData(
            `${url}/update-branch-product`,
            'PATCH',
            undefined,
            product
        );
    }

    static async bulkEdit(bulk: any) {
        return await requestFormData(
            `${url}/bulk-edit`,
            'PATCH',
            undefined,
            bulk
        );
    }

    static async bulkStock(bulk: any) {
        return await requestFormData(
            `${url}/bulk-stock`,
            'PATCH',
            undefined,
            bulk
        );
    }

    static async bulkDelete(bulk: any) {
        return await requestFormData(
            `${url}/bulk-delete`,
            'PATCH',
            undefined,
            bulk
        );
    }

    static async deleteProduct(id: string) {
        return await requestData(
            `${url}/delete?id=${id}`,
            'PATCH',
        );
    }
}