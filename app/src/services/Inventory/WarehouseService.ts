import { BASE_URL } from "@/lib/config";
import { requestData } from "../_main";
import { Warehouse } from "@/types/Warehouse";

const url = `${BASE_URL}/warehouse`

export class WarehouseService {
    static async create(formData: FormData) {
        const res = await fetch(`${url}/create`, {
        method: "POST",
        body: formData,
        });

        if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to create warehouse");
        }

        return await res.json();
    }

    static async update(id: string, formData: FormData) {
        const res = await fetch(`${url}/update?id=${id}`, {
        method: "POST",
        body: formData,
        });

        if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update warehouse");
        }

        return await res.json();
    }


    static async updateStatus(id : string, status :string) {
        return await requestData(
                `${url}/update-status?id=${id}&status=${status}`,
                'POST',
                undefined,
                undefined
        )
    }

    static async getById(id : string){
        return await requestData(
                `${url}/get-by-id?id=${id}`,
                'GET',
                undefined,
                undefined
        )
    }

    static async getAll(){
        return await requestData(
                `${url}/get-all`,
                'GET',
                undefined,
                undefined
        )
    }

    static async getByLocation(location : string){
        return await requestData(
                `${url}/get-by-location?location=${location}`,
                'GET',
                undefined,
                undefined
        )
    }
}