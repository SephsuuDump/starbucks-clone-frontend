import { BASE_URL } from "@/lib/config"
import { requestData, requestFormData } from "../_main"

const url = `${BASE_URL}/support-cases`

export class SupportCasesService {
    static async getAllSupportCases() {
        return await requestData(
            `${url}/get-all`,
            'GET',
        );
    }
}