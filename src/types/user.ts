export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    balance: number;
    phoneNumber?: string;
    hasPassword?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
