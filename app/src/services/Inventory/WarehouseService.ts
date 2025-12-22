import { BASE_URL } from "@/lib/config";
import { requestData } from "../_main";

const url = `${BASE_URL}/warehouse`

type Warehouse = {
    name : string, 
    location : string
}


export class WarehouseService {
    static async create(body : Warehouse) {
        return await requestData(
                `${url}/create`,
                'POST',
                undefined,
                body
        )
    }

    static async update(id : string, body : Warehouse) {
        return await requestData(
                `${url}/update?id=${id}`,
                'POST',
                undefined,
                body
        )
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