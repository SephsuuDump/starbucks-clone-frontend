export interface Claim {
    id: string;
    email: string;
    branchId?: string | "1";
    warehouseId?: string | "1";
    role: string;
    iat: number;
    exp: number;
}