import { BASE_URL } from "@/lib/config"
import { requestData } from "../_main"

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

    static async updateSupplier(supplier: any, id: string) {
        return await requestData(
            `${url}/update?id=${id}`,
            'PUT',
            undefined,
            supplier
        );
    }

    static async updateActiveState(is_active:boolean, id: string) {
        return await requestData(
            `${url}/active?id=${id}`,
            'PUT',
            undefined,
            { is_active: is_active }
        );
    }

}