export interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
    balance: number;
    createdAt?: string;
    updatedAt?: string;
}
