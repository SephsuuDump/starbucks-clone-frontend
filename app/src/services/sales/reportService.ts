import { BASE_URL } from "@/lib/config"
import { requestData, requestFormData } from "../_main"

const url = `${BASE_URL}/sales-report`

export class SalesReportService {
    static async getPastMonthSales() {
        return await requestData(
            `${url}/get-previous-sales`,
            'GET',
        );
    }

    static async getProductMonthlySales() {
        return await requestData(
            `${url}/get-product-monthly-sales`,
            'GET',
        );
    }
}