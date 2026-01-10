import { BASE_URL } from "@/lib/config";
import { requestData } from "../_main";

const url = `${BASE_URL}/project-activity`; 

export class ProjectActivityService {
    static async getByProject(projectId: string) {
        return await requestData(
            `${url}/get-by-project?project_id=${projectId}`,
            "GET",
            undefined,
            undefined,
        );
    }
}
