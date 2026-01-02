import { BASE_URL } from "@/lib/config"
import { requestData, requestFormData } from "../_main"

const url = `${BASE_URL}/sales-summary`

export class SalesSummaryService {
    static async getSalesSummary() {
        return await requestData(
            `${url}/get-summary`,
            'GET',
        );
    }
}