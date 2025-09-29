import { BASE_URL } from "@/lib/config";
import { requestData } from "../_main";
import { InventoryItems } from "@/types/InventoryItem";
import { Inventory } from "@/types/Inventory";

const url = `${BASE_URL}/inventory`

export class InventoryService {
    static async createInventory(body: Inventory ) {
        return await requestData(
            `${url}/create`,
            'POST',
            undefined,
            body,
        )
    }
    static async createInventoryItem(body: InventoryItems ) {
        return await requestData(
            `${url}/update`,
            'POST',
            undefined,
            body,
        )
    }
    static async deleteById(id : string ) {
        return await requestData(
            `${url}/delete?id=${id}`,
            'POST',
            undefined,
            undefined,
        )
    }
    static async processInput(id : string, quantity : number) {
        return await requestData(
            `${url}/process-input?id=${id}&quantity=${quantity}`,
            'POST',
            undefined,
            undefined,
        )
    }
    static async processTransfer(id : string) {
        return await requestData(
            `${url}/process-transfer?id=${id}`,
            'POST',
            undefined,
            undefined,
        )
    }
    static async getInventoryById(id : string ) {
        return await requestData(
            `${url}/get-by-id?id=${id}`,
            'GET',
            undefined,
            undefined,
        )
    }
    static async getByWarehouse(id : string ) {
        return await requestData(
            `${url}/get-by-warehouse?warehouse_id=${id}`,
            'GET',
            undefined,
            undefined,
        )
    }
    static async getByBranch(id : string ) {
        return await requestData(
            `${url}/get-by-branch?branch_id=${id}`,
            'GET',
            undefined,
            undefined,
        )
    }

}