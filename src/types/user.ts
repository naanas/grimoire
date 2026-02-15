export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    balance: number;
    phoneNumber?: string;
    createdAt?: string;
    updatedAt?: string;
}
