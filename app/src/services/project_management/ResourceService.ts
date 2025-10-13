
import { Resource, ResourcePayload } from "@/types/Resource";
import { requestData } from "../_main";
import { BASE_URL } from "@/lib/config";

const url = `${BASE_URL}/resources`;

export class ResourceService {
  static async create(payload: ResourcePayload) {
    return await requestData(`${url}/create`, "POST", undefined, payload);
  }

  static async update(id: number, payload: Partial<ResourcePayload>) {
    return await requestData(`${url}/update?id=${id}`, "PUT", undefined, payload);
  }

  static async deleteById(id: number) {
    return await requestData(`${url}/delete-by-id?id=${id}`, "POST");
  }

  static async getAll(params?: { type?: string; available_only?: boolean }) {
    const query = new URLSearchParams(
      Object.entries(params || {}).reduce((acc, [key, val]) => {
        acc[key] = String(val);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    return await requestData(`${url}/get-all?${query}`, "GET");
  }

  static async getById(id: number) {
    return await requestData(`${url}/get-by-id?id=${id}`, "GET");
  }

  static async getByProject(id : string) {
    return await requestData(
      `${url}/get-by-project?id=${id}`,
      'GET'
    )
  }
}
