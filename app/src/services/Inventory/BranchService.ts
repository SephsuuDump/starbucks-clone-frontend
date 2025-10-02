import { BASE_URL } from "@/lib/config";
import { requestData } from "../_main";

const url = `${BASE_URL}/branch`

type Branch =  {
    name : string,
    location : string
}

export class BranchService {
    static async create(body : Branch) {
        await requestData(
            `${url}/create`,
            'POST',
            undefined,
            body
        )
    }

    static async update(updateRequest : Branch, id : string) {
        await requestData(
            `${url}/update?id=${id}`,
            'POST',
            undefined,
            updateRequest
        )
    }

    static async delete(id : string) {
        await requestData(
            `${url}/delete?id=${id}`,
            'POST',
            undefined,
            undefined
        )
    }

    static async getById(id : string) {
        await requestData(
            `${url}/get-by-id?id=${id}`,
            'GET',
            undefined,
            undefined
        )
    }

    static async getByLocation(location : string) {
        await requestData(
            `${url}/get-by-location?location=${location}`,
            'GET',
            undefined,
            undefined
        )
    }

    static async getAll (){
        await requestData(
            `${url}/get-all`,
            'GET',
            undefined,
            undefined
        )
    }
}