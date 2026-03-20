import { useEffect } from 'react';
import { useAuthStore } from '@/lib/authStore';

export function useAuth() {
    const { user, loading, initialized, loadUser, fetchFreshUser, logout } = useAuthStore();

    useEffect(() => {
        if (!initialized) {
            loadUser();
            fetchFreshUser();
        }
    }, [initialized, loadUser, fetchFreshUser]);

    return { 
        user, 
        loading, 
        logout, 
        refreshUser: fetchFreshUser 
    };
}
