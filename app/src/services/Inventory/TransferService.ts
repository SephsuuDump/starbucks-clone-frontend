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

    static async getByDestination(destination : string, status : string) {
         return await requestData(
            `${url}/get-by-destination?destination=${destination}&status=${status}`,
            'GET',
            undefined,
            undefined
        )
    }

    static async getBySource(source: string, status : string) {
         return await requestData(
            `${url}/get-by-source?source=${source}&status=${status}`,
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