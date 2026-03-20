import { useEffect } from 'react';
import { useAuthStore } from '@/lib/authStore';

export function useAuth() {
    const { user, loading, logout, fetchFreshUser } = useAuthStore();

    return { 
        user, 
        loading, 
        logout, 
        refreshUser: fetchFreshUser 
    };
}
