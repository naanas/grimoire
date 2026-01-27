import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/user';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = useCallback(() => {
        if (typeof window === 'undefined') return;

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('user');
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    }, []);

    const fetchFreshUser = useCallback(() => {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('token');
        if (token) {
            import('@/lib/api').then((mod) => {
                mod.default.get('/auth/me').then(res => {
                    if (res.data.success) {
                        const newUser = res.data.data;
                        setUser(newUser);
                        localStorage.setItem('user', JSON.stringify(newUser));
                    }
                }).catch(() => {
                    // Start silent failure, maybe token expired, but don't clear explicitly unless 401
                });
            });
        }
    }, []);

    useEffect(() => {
        loadUser();
        fetchFreshUser();

        const handleStorage = () => loadUser();
        const handleFocus = () => fetchFreshUser();
        const handleBalanceUpdate = () => loadUser(); // Listen for custom events

        window.addEventListener('storage', handleStorage);
        window.addEventListener('focus', handleFocus);
        window.addEventListener('balance_updated', handleBalanceUpdate);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('balance_updated', handleBalanceUpdate);
        };
    }, [loadUser, fetchFreshUser]);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    return { user, loading, logout, refreshUser: fetchFreshUser };
}
