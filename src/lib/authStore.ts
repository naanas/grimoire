import { create } from 'zustand';
import { User } from '@/types/user';
import api from './api';

interface AuthState {
    user: User | null;
    loading: boolean;
    initialized: boolean;
    loadUser: () => void;
    fetchFreshUser: () => Promise<void>;
    setUser: (user: User | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    loading: true,
    initialized: false,
    
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

    fetchFreshUser: async () => {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('token');
        if (!token) {
            set({ loading: false });
            return;
        }

        try {
            const res = await api.get('/auth/me');
            if (res.data.success) {
                const newUser = res.data.data;
                set({ user: newUser, loading: false });
                localStorage.setItem('user', JSON.stringify(newUser));
            }
        } catch (err: any) {
            // 401 logic is handled by api.ts interceptor
            // We just ensure loading is stopped here
            set({ loading: false });
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null });
        window.location.href = '/login';
    }
}));

// Initialize listeners ONCE at module level (client-side only)
if (typeof window !== 'undefined') {
    // Initial sync
    const store = useAuthStore.getState();
    
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
