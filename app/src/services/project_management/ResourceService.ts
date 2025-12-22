import { BASE_URL } from "@/lib/config";
import { requestData } from "../_main";
import { ResourcePayload } from "@/types/Resource";


const url = `${BASE_URL}/resources`;

export class ResourceService {
  static async create(payload: ResourcePayload) {
    return await requestData(`${url}/create`, "POST", undefined, payload);
  }

  static async update(id: string, payload: Partial<ResourcePayload>) {
    return await requestData(`${url}/update?id=${id}`, "PUT", undefined, payload);
  }

  static async deleteById(id: string) {
    return await requestData(`${url}/delete-by-id?id=${id}`, "DELETE");
  }

  static async getAll(params?: { type?: string; available_only?: boolean }) {
    const query = new URLSearchParams(params as any).toString();
    return await requestData(`${url}/get-all?${query}`, "GET");
  }

  static async getById(id: string) {
    return await requestData(`${url}/get-by-id?id=${id}`, "GET");
  }

  static async getByProject(projectId: string) {
    return await requestData(`${url}/get-by-project?id=${projectId}`, "GET");
  }
}
