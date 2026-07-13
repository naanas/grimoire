import { io, type Socket } from 'socket.io-client';

export const getSocketUrl = () =>
    (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/api\/?$/, '');

/** Shared socket.io client options — avoids reconnect storms */
export function createAppSocket(): Socket {
    return io(getSocketUrl(), {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000,
        timeout: 15000,
    });
}
