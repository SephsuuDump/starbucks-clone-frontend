import { BASE_URL } from "@/lib/config"
import { requestData } from "../_main"

const url = `${BASE_URL}/account-credit`
export class AccountCreditService {
    static async getAccountCreditByUser(id: string) {
        return await requestData(
            `${url}/get-by-user?id=${id}`,
            'GET',
        );
    }

    static async chargeCredit(payload: any) {
        return await requestData(
            `${url}/charge-credit`,
            'POST',
            undefined,
            payload
        );
    }
}