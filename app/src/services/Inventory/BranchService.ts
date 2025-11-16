import { BASE_URL } from "@/lib/config";
import { requestData } from "../_main";
import { Branch } from "@/types/Branch";

const url = `${BASE_URL}/branch`


export class BranchService {
    static async create(formdata : FormData) {
        const res = await fetch(`${url}/create`, {
        method: "POST",
        body: formdata,
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Failed to create warehouse");
        }

        return await res.json();
    }

    static async update(id : string, formdata : FormData) {
       const res = await fetch(`${url}/update?id=${id}`, {
        method: "POST",
        body: formdata,
        });

        if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update warehouse");
        }

        return await res.json();
    }

    static async delete(id : string) {
        return await requestData(
            `${url}/delete?id=${id}`,
            'POST',
            undefined,
            undefined
        )
    }

    static async getById(id : string) {
        return await requestData(
            `${url}/get-by-id?id=${id}`,
            'GET',
            undefined,
            undefined
        )
    }

    static async getByLocation(location : string) {
        return await requestData(
            `${url}/get-by-location?location=${location}`,
            'GET',
            undefined,
            undefined
        )
    }

    static async getAll (){
        return await requestData(
            `${url}/get-all`,
            'GET',
            undefined,
            undefined
        )
    }
}