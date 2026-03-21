'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

export default function IdleLogout() {
    const { user, logout } = useAuth();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimer = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (user) {
            timeoutRef.current = setTimeout(() => {
                logout('Anda telah tidak aktif selama 5 menit. Silakan login kembali.');
            }, IDLE_TIMEOUT);
        }
    }, [user, logout]);

    useEffect(() => {
        // Only run if user is logged in
        if (!user) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            return;
        }

        const events = [
            'mousedown',
            'mousemove',
            'keypress',
            'scroll',
            'touchstart',
        ];

        // Set initial timer
        resetTimer();

        // Add event listeners for all activity events
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [user, logout, resetTimer]);

    return null; // This component doesn't render anything
}
