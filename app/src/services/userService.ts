import { requestData } from "./_main";
import { BASE_URL } from "@/lib/config";

const url = `${BASE_URL}/users`

export class UserService {
    static async getUserBySupplier(id: string) {
        return await requestData(
            `${url}/get-by-supplier?id=${id}`,
            'GET',
        );
    }

    static async getUserByEmployee(id: string) {
        return await requestData(
            `${url}/get-by-employee?id=${id}`,
            'GET',
        );
    }
}