export interface ChatMessage {
    id: string;
    sender: 'USER' | 'ADMIN';
    content: string;
    createdAt: string;
    isRead?: boolean;
}

export interface ChatSession {
    id: string;
    userId?: string;
    guestName?: string;
    isActive: boolean;
    messages: ChatMessage[];
}
