import { BASE_URL } from "@/lib/config";
import { requestData } from "../_main";
import { Transfer } from "@/types/Transfer";

const url = `${BASE_URL}/transfer`

export class TransferService {
    static async create( body : Transfer) {
        return await requestData(
            `${url}/create`,
            'POST',
            undefined,
            body
        )
    }

    static async updateStatus(id : string, status : string) {
         return await requestData(
            `${url}/update-status?id=${id}&status=${status}`,
            'POST',
            undefined,
            undefined
        )
    }

    static async getByDesination(destination : string) {
         return await requestData(
            `${url}/get-by-destination?destination=${destination}`,
            'GET',
            undefined,
            undefined
        )
    }

    static async getBySource(source: string) {
         return await requestData(
            `${url}/get-by-source?source=${source}`,
            'GET',
            undefined,
            undefined
        )
    }

    static async getById(id: string) {
         return await requestData(
            `${url}/get-by-id?id=${id}`,
            'GET',
            undefined,
            undefined
        )
    }
}