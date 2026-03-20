import { create } from 'zustand';
import { User } from '@/types/user';
import api from './api';

interface AuthState {
    user: User | null;
    loading: boolean;
    initialized: boolean;
    isFetching: boolean;
    lastFetch: number;
    loadUser: () => void;
    fetchFreshUser: (force?: boolean) => Promise<void>;
    setUser: (user: User | null) => void;
    logout: () => void;
}

let isInitialFetching = false;

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    loading: true,
    initialized: false,
    isFetching: false,
    lastFetch: 0,
    
    setUser: (user) => set({ user, loading: false }),

    loadUser: () => {
        if (typeof window === 'undefined') return;

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                set({ user: JSON.parse(storedUser), loading: false, initialized: true });
            } catch (e) {
                localStorage.removeItem('user');
                set({ user: null, loading: false, initialized: true });
            }
        } else {
            set({ user: null, loading: false, initialized: true });
        }
    },

    fetchFreshUser: async (force = false) => {
        if (typeof window === 'undefined') return;

        // Ultimate lock: prevent duplicate concurrent requests even in concurrent renders
        if (isInitialFetching && !force) return;
        if (get().isFetching && !force) return;

        // Rate limit: don't fetch more than once every 10 seconds unless forced
        const now = Date.now();
        if (!force && now - get().lastFetch < 10000 && get().initialized) {
            set({ loading: false });
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            set({ loading: false, initialized: true, isFetching: false });
            return;
        }

        isInitialFetching = true;
        set({ isFetching: true, initialized: true });
        try {
            const res = await api.get('/auth/me');
            if (res.data.success) {
                const newUser = res.data.data;
                set({ 
                    user: newUser, 
                    loading: false, 
                    lastFetch: now 
                });
                localStorage.setItem('user', JSON.stringify(newUser));
            }
        } catch (err: any) {
            set({ loading: false, initialized: true });
        } finally {
            set({ isFetching: false });
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null });
        window.location.href = '/login';
    }
}));

// Initialize listeners and fetch user ONCE at module level (client-side only)
if (typeof window !== 'undefined') {
    const store = useAuthStore.getState();
    
    // Initial fetch
    store.loadUser();
    store.fetchFreshUser();
    
    // Sync across tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'user' || e.key === 'token') {
            useAuthStore.getState().loadUser();
        }
    });

    // Refresh on focus
    window.addEventListener('focus', () => {
        useAuthStore.getState().fetchFreshUser();
    });

    // Internal auth changes (e.g. from api interceptor)
    window.addEventListener('auth-change', () => {
        useAuthStore.getState().loadUser();
    });
    
    window.addEventListener('balance_updated', () => {
        useAuthStore.getState().loadUser();
    });
}
