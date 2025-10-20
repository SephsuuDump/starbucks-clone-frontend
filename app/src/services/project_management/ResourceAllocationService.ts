import { BASE_URL } from "@/lib/config";
import { ResourceAllocation, ResourceAllocationPayload } from "@/types/ResourceAllocation";
import { requestData } from "../_main";

const url = `${BASE_URL}/resource-allocation`;

export class ResourceAllocationService {
  static async create(payload: ResourceAllocationPayload) {
    return await requestData(`${url}/create`, "POST", undefined, payload);
  }

  static async update(id: number, payload: Partial<ResourceAllocationPayload>) {
    return await requestData(`${url}/update?id=${id}`, "PUT", undefined, payload);
  }

  static async deleteById(id: number) {
    return await requestData(`${url}/delete-by-id?id=${id}`, "DELETE");
  }

  static async getAll(params?: { id?: string; }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return await requestData(`${url}/get-all?${query}`, "GET");
  }

  static async getById(id: number) {
    return await requestData(`${url}/get-by-id?id=${id}`, "GET");
  }
}
