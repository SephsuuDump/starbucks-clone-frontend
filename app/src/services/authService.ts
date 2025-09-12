import { BASE_URL } from "@/lib/config"
import { AuthCredential } from "@/types/user"
import { requestData } from "./_main"

const url = `${BASE_URL}/auth`
export class AuthService {
    static async signup(credential: AuthCredential) {
        return await requestData(
            `${url}/signup`,
            'POST',
            undefined,
            credential,
        );
    }

    static async login(credential: AuthService) {
        return await requestData(
            `${url}/login`,
            'POST',
            undefined,
            credential,
        );
    }

    static async getCookies() {
        return await requestData(
            '/api/cookies',
            'GET',
            undefined,
        )
    }

    static async setCookies(token: string) {
        return await requestData(
            '/api/cookies',
            'POST',
            undefined,
            { token }
        )
    }
}