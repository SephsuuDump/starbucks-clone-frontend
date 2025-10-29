import { BASE_URL } from "@/lib/config"
import { requestData } from "../_main"

const url = `${BASE_URL}/procurement-summary`
export class ProcurementSummaryService {
    static async getSummary() {
        return await requestData(
            `${url}/get-summary`,
            'GET',
        );
    }
}