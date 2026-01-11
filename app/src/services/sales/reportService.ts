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

    static async getTopProducts() {
        return await requestData(
            `${url}/top-products`,
            'GET',
        );
    }

    static async getTopProductsByBranch(id: string) {
        return await requestData(
            `${url}/top-products?id=${id}`,
            'GET',
        );
    }

    static async getCustomerProductCount() {
        return await requestData(
            `${url}/get-customer-product-count`,
            'GET',
        );
    }

    static async exportProductSalesReport(payload: any) {
        return await requestData(
            `${url}/export-product-sales-report`,
            'GET',
            undefined,
            payload
        );
    }
    
}