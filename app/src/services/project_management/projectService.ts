import { BASE_URL } from "@/lib/config";
import { requestData } from "../_main";
import { ProjectPayload } from "@/types/project";

const url = `${BASE_URL}/projects`;

export class ProjectService {
  static async create(payload: ProjectPayload) {
    return await requestData(`${url}/create`, "POST", undefined, payload);
  }

  static async update(id: string, payload: Partial<ProjectPayload>) {
    return await requestData(`${url}/update?id=${id}`, "POST", undefined, payload);
  }

  static async deleteById(id: string) {
    return await requestData(`${url}/delete-by-id?id=${id}`, "POST");
  }

  static async getAll() {
    return await requestData(`${url}/get-all`, "GET");
  }

  static async getById(id: string) {
    return await requestData(`${url}/get-by-id?id=${id}`, "GET");
  }
}
