import { BASE_URL } from "@/lib/config";
import { requestData } from "../_main";
import { ResourceAllocationPayload } from "@/types/ResourceAllocation";


const url = `${BASE_URL}/resource-allocation`;

export class ResourceAllocationService {
  static async create(payload: ResourceAllocationPayload) {
    return await requestData(`${url}/create`, "POST", undefined, payload);
  }

  static async update(id: string, payload: Partial<ResourceAllocationPayload>) {
    return await requestData(`${url}/update?id=${id}`, "PUT", undefined, payload);
  }

  static async deleteById(id: string) {
    return await requestData(`${url}/delete-by-id?id=${id}`, "DELETE");
  }

  static async approve(id: string, is_approved: boolean) {
    return await requestData(`${url}/approve?id=${id}`, "POST", undefined, { is_approved });
  }

  static async getAll(projectId: string, is_approved?: boolean) {
    const q = new URLSearchParams({ id: projectId, ...(is_approved != null && { is_approved: String(is_approved) }) });
    return await requestData(`${url}/get-all?${q.toString()}`, "GET");
  }

  static async getFinance(params?: { project_id?: string; is_approved?: boolean }) {
    const query = new URLSearchParams(params as any).toString();
    return await requestData(`${url}/finance?${query}`, "GET");
  }

  static async getById(id: string) {
    return await requestData(`${url}/get-by-id?id=${id}`, "GET");
  }
}
