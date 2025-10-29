export interface User {
    first_name: string,
    last_name: string;
    email: string;
    password: string;

    branch?: {
        id: string,
        name: string,
    }
}

export interface AuthCredential {
    email: string;
    password: string;
}