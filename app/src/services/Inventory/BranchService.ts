import { BASE_URL } from "@/lib/config";
import { requestData } from "../_main";
import { Branch } from "@/types/Branch";

const url = `${BASE_URL}/branch`


export class BranchService {
    static async create(body : Branch) {
        return await requestData(
            `${url}/create`,
            'POST',
            undefined,
            body
        )
    }

    static async update(updateRequest : Partial<Branch>, id : string) {
        return await requestData(
            `${url}/update?id=${id}`,
            'POST',
            undefined,
            updateRequest
        )
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