import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 seconds timeout
});

// Request Logger & Auth Token
api.interceptors.request.use(request => {
    // Attach Token if exists
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            request.headers.Authorization = `Bearer ${token}`;
        }
    }

    return request;
});

// Response Interceptor
let isHandling401 = false; // module-level flag, resets on page reload — no stuck risk
api.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        // Skip 401 handling for the /auth/me endpoint itself (authStore handles it directly)
        const isAuthMeRequest = error.config?.url?.includes('/auth/me');

        if (error.response?.status === 401 && typeof window !== 'undefined' && !isHandling401 && !isAuthMeRequest) {
            isHandling401 = true;

            // Use authStore logout for consistent handling (shows toast + clears store)
            const { useAuthStore } = await import('./authStore');
            useAuthStore.getState().logout('Sesi Anda telah berakhir. Silakan login kembali.');
        }
        return Promise.reject(error);
    }
);

export default api;
