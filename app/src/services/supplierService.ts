import { BASE_URL } from "@/lib/config"
import { requestData } from "./_main"

const url = `${BASE_URL}/suppliers`
export class SupplierService {
    static async getAllSuppliers() {
        return await requestData(
            `${url}`,
            'GET',
        );
    }

    static async getSupplierById(id: string) {
        return await requestData(
            `${url}/${id}`,
            'GET',
        );
    }
}